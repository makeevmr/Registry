"""
Пакет, где содержатся модели:
    1) sota_recsys_1 
    2) sota_recsys_2 (не оптимизирована под сервер)

Каждая модель принимает данные (словарь `data_dict`), которые ей передаёт FastAPI 
Должна возвращать словарь с итоговой информацией о распределении  
"""

import json
import numpy as np
import pandas as pd
from sklearn.decomposition import NMF
from sklearn.cluster import KMeans, AgglomerativeClustering
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict
from sklearn.preprocessing import MultiLabelBinarizer, MinMaxScaler, StandardScaler
import warnings
import os
from config.config import CONFIG
from langchain_community.chat_models.gigachat import GigaChat
from llm_model.baseline import get_team_distribution, update_config, transform_to_response_schema
from llm_model.transform import (
    transform_json_to_csv_student,
    transform_json_to_csv_project,
    prepare_tools_list,
    prepare_tool_role_map,
)
from llm_model.data_preparation import preprocess_project_data, preprocess_students_data
from collections import defaultdict
import pulp
import warnings
import time

from sklearn.preprocessing import MultiLabelBinarizer, StandardScaler
from sklearn.cluster import KMeans
from scipy.optimize import linear_sum_assignment

OUTPUT_PATH = 'clustering_results.json'

def main_llm(data: dict):
    global CONFIG

    auth_token = data.get('llm_params', {})['auth_token']
    model_version = data.get('llm_params', {}).get('model_name', 'GigaChat')

    llm = GigaChat(
        credentials=auth_token,
        scope="GIGACHAT_API_PERS",
        model=model_version,
        verify_ssl_certs=False,
        streaming=False,
        temperature=0.05,
    )

    students_df = transform_json_to_csv_student(data)
    projects_df = transform_json_to_csv_project(data, auth_token=auth_token, llm=llm)

    students_df = preprocess_students_data(students_df)
    projects_df = preprocess_project_data(projects_df)

    llm = GigaChat(
        credentials=auth_token,
        scope="GIGACHAT_API_PERS",
        model=model_version,
        verify_ssl_certs=False,
        streaming=False,
        temperature=0.05,
    )

    tools_list = prepare_tools_list(students_df, llm)
    tool_role_map = prepare_tool_role_map(data, tools_list, llm)
    projects_list = []
    for project in projects_df["Название"]:
        projects_list.append(project)

    new_config = update_config(data["config"], CONFIG, tool_role_map, projects_list, projects_df)
    CONFIG = new_config
    with open("config.json", "w", encoding="utf-8") as file:
        json.dump(new_config, file, ensure_ascii=False, indent=4)

    ans = get_team_distribution(
        n_students_per_project=5,
        original_students_df=students_df,
        projects_df=projects_df,
        weights=new_config["weights"],
        projects_order_list=new_config["projects_order_list"],
        roles_order_list=new_config["roles_list"],
        competence_skill_role_map=new_config["competence_skill_role_map"],
        competence_preference_role_map=new_config["competence_preference_role_map"],
        competence_skill_project_group_map=new_config["competence_skill_project_group_map"],
        competence_preference_project_group_map=new_config["competence_preference_project_group_map"],
        common_competences_preference_list=new_config["common_competences_preference_list"],
        common_competences_skill_list=new_config["common_competences_skill_list"],
        tool_role_map=new_config["tool_role_map"],
    )
    return transform_to_response_schema(ans, data)

def ohe_ilp(data: dict):
    """
    Выполняет кластеризацию (KMeans) и формирует команды (ILP),
    распределяя их по проектам. Возвращает словарь с результатами.
    """

    def load_and_preprocess_data(data):
        users = data.get('users', [])
        projects = data.get('projects', [])
    
        users_data = []
        for user in users:
            user_info = {'id': user.get('id'), 'answers': {}}
            form_data = user.get('form', {}).get('data', [])
            for entry in form_data:
                question = entry.get('question', '')
                question_type = entry.get('type', '')
                answer = entry.get('answer')
                answers = entry.get('answers')
    
                if question_type == 'GRID':
                    rows = entry.get('rows', [])
                    if answers and rows:
                        grid_answers = dict(zip(rows, answers))
                        for row_q, row_ans in grid_answers.items():
                            full_q = f"{question} - {row_q}"
                            user_info['answers'][full_q] = row_ans
                    else:
                        user_info['answers'][question] = answers
                else:
                    if answer:
                        user_info['answers'][question] = answer
                    elif answers:
                        user_info['answers'][question] = answers
    
            users_data.append(user_info)
    
        return users_data, projects
    
    def extract_user_tools(user):
        """
        Извлекает инструменты вида "Python - 3.0\nDjango - 2.0"
        Возвращает {"Python": 3.0, "Django": 2.0, ...}
        """
        tools = {}
        tool_questions = [k for k in user['answers'].keys() if k.startswith('Инструменты')]
        for q in tool_questions:
            ans = user['answers'][q]
            if isinstance(ans, str):
                for line in ans.split('\n'):
                    skill, _, lvl = line.partition(' - ')
                    skill = skill.strip()
                    if skill:
                        try:
                            tools[skill] = float(lvl.strip())
                        except ValueError:
                            # Если уровень не разобрать — ставим 1.0
                            tools[skill] = 1.0
        return tools
    
    def extract_user_roles(user):
        """
        Извлекает все роли, которые пользователь отметил "Хочу поучаствовать" или "Интересно".
        """
        roles = []
        role_questions = [k for k in user['answers'].keys() if 'Выберете интересующие Вас роли, в  IT  - ' in k]
        for q in role_questions:
            role_name = q.split(' - ')[-1]
            val = user['answers'][q]
            if isinstance(val, str) and ('Хочу поучаствовать' in val or 'Интересно' in val):
                roles.append(role_name)
        return roles
    
    def extract_skill_level(user):
        """
        Возвращает средний уровень навыков (по всем инструментам).
        Если инструментов нет, возвращает 0.
        """
        tools = extract_user_tools(user)
        if tools:
            return np.mean(list(tools.values()))
        else:
            return 0.0
    
    def build_preference_matrix(users_data):
        from sklearn.preprocessing import MultiLabelBinarizer
    
        user_ids = []
        roles_list = []
        projects_list = []
        tools_data = []
    
        for user in users_data:
            user_id = user['id']
            user_ids.append(user_id)
            ans = user['answers']
    
            # Роли (High/Medium/Low)
            role_questions = [k for k in ans.keys() if 'Выберете интересующие Вас роли, в  IT  - ' in k]
            tmp_roles = []
            for q in role_questions:
                role_name = q.split(' - ')[-1]
                val = ans[q]
                if isinstance(val, str):
                    if 'Хочу поучаствовать' in val:
                        tmp_roles.append(f'Role_{role_name}_High')
                    elif 'Интересно' in val:
                        tmp_roles.append(f'Role_{role_name}_Medium')
                    else:
                        tmp_roles.append(f'Role_{role_name}_Low')
            roles_list.append(tmp_roles)
    
            # Направления проектов (High/Medium/Low)
            project_questions = [k for k in ans.keys() if 'Выберете интересные для вас направление проекта - ' in k]
            tmp_projects = []
            for q in project_questions:
                direction = q.split(' - ')[-1]
                val = ans[q]
                if isinstance(val, str):
                    if 'Хочу поучаствовать' in val:
                        tmp_projects.append(f'Project_{direction}_High')
                    elif 'Интересно' in val:
                        tmp_projects.append(f'Project_{direction}_Medium')
                    else:
                        tmp_projects.append(f'Project_{direction}_Low')
            projects_list.append(tmp_projects)
    
            # Инструменты
            user_tools = extract_user_tools(user)
            tools_data.append(user_tools)
    
        # Бинаризация (One-Hot) для ролей
        mlb_roles = MultiLabelBinarizer()
        roles_encoded = mlb_roles.fit_transform(roles_list)
        roles_encoded_df = pd.DataFrame(
            roles_encoded,
            columns=[f'Role_{c}' for c in mlb_roles.classes_]
        )
    
        # Бинаризация (One-Hot) для направлений
        mlb_projects = MultiLabelBinarizer()
        projects_encoded = mlb_projects.fit_transform(projects_list)
        projects_encoded_df = pd.DataFrame(
            projects_encoded,
            columns=[f'Project_{c}' for c in mlb_projects.classes_]
        )
    
        # Инструменты -> DataFrame
        tools_df = pd.DataFrame(tools_data).fillna(0)
    
        # Объединим
        df_encoded = pd.concat([roles_encoded_df, projects_encoded_df, tools_df], axis=1)
        df_encoded['User_ID'] = user_ids
        df_encoded.set_index('User_ID', inplace=True)
    
        # Нормируем только инструменты (числовые столбцы)
        tool_cols = tools_df.columns.tolist()
        if tool_cols:
            scaler = StandardScaler()
            df_encoded[tool_cols] = scaler.fit_transform(df_encoded[tool_cols])
    
        return df_encoded, user_ids
    
    def compute_similar_pairs(df_prefs, threshold=0.6):
        """
        Возвращает список пар (i, j) (i < j),
        у которых косинусное сходство >= threshold.
        i, j - это индексы (по порядку в df_prefs).
        """
        user_ids = df_prefs.index.tolist()
        N = len(user_ids)
        df_values = df_prefs.values
    
        similar_pairs = []
    
        for idx_i in range(N):
            for idx_j in range(idx_i + 1, N):
                vec_i = df_values[idx_i]
                vec_j = df_values[idx_j]
    
                norm_i = np.linalg.norm(vec_i)
                norm_j = np.linalg.norm(vec_j)
    
                if norm_i > 0 and norm_j > 0:
                    cos_sim = np.dot(vec_i, vec_j) / (norm_i * norm_j)
                else:
                    cos_sim = 0.0
    
                if cos_sim >= threshold:
                    similar_pairs.append((idx_i, idx_j))
    
        return similar_pairs
    
    def form_teams_with_ilp(user_ids, min_team_size, max_team_size, similar_pairs=None):
        """
        Сформируем команды с помощью ILP, чтобы:
          - не было меньше min_team_size
          - не было больше max_team_size
          - каждый пользователь ровно в 1 команде
          - (опционально) если (i, j) "слишком похожи", они не могут быть в одной команде
        Минимизируем кол-во команд (y_t).
        """
        N = len(user_ids)
        max_num_teams = (N + min_team_size - 1) // min_team_size  # верхняя оценка
    
        model = pulp.LpProblem("FormTeams", sense=pulp.LpMinimize)
    
        # x_{i, t} = 1, если пользователь i в команде t; 0 иначе
        x = {}
        for i in range(N):
            for t in range(max_num_teams):
                x[(i,t)] = pulp.LpVariable(f"x_{i}_{t}", cat=pulp.LpBinary)
    
        # y_{t} = 1, если команда t задействована, 0 если нет
        y = {}
        for t in range(max_num_teams):
            y[t] = pulp.LpVariable(f"y_{t}", cat=pulp.LpBinary)
    
        # (1) Каждый пользователь в ровно одной команде
        for i in range(N):
            model += pulp.lpSum([x[(i,t)] for t in range(max_num_teams)]) == 1
    
        # (2) min_team_size * y_t <= size_t <= max_team_size * y_t
        for t in range(max_num_teams):
            size_t = pulp.lpSum([x[(i,t)] for i in range(N)])
            model += size_t >= min_team_size * y[t]
            model += size_t <= max_team_size * y[t]
    
        # (3) Запрет "слишком похожих" в одной команде (опционально)
        if similar_pairs is not None:
            for (i, j) in similar_pairs:
                for t in range(max_num_teams):
                    model += x[(i, t)] + x[(j, t)] <= 1
    
        # Цель: минимизировать sum(y_t)
        model.setObjective(pulp.lpSum([y[t] for t in range(max_num_teams)]))
    
        model.solve(pulp.PULP_CBC_CMD(msg=0))
    
        # Сбор результата
        teams = []
        for t in range(max_num_teams):
            if pulp.value(y[t]) > 0.5:
                members = []
                for i in range(N):
                    if pulp.value(x[(i,t)]) > 0.5:
                        members.append(user_ids[i])
                teams.append(members)
    
        return teams
    
    def compute_team_project_score(team, project, users_data):
        """
        Пример: суммируем навыки, смотрим "developerRequirements", "tags" и т.д.
        """
        dev_req = project.get('developerRequirements', [])
        project_tags = project.get('tags', [])
    
        # Суммируем навыки в команде
        team_skillset = defaultdict(float)
        for uid in team:
            user = next((u for u in users_data if u['id'] == uid), None)
            if user:
                tools = extract_user_tools(user)
                for t, lvl in tools.items():
                    team_skillset[t] += lvl
    
        score = 0.0
        # Совпадение dev_req
        for req in dev_req:
            req_str = str(req).lower()
            for skill, lvl in team_skillset.items():
                if skill.lower() in req_str:
                    # +2 * уровень, если инструмент совпадает с req
                    score += 2 * lvl
    
        # Совпадение тегов
        for tg in project_tags:
            if isinstance(tg, dict):
                tag_name = str(tg.get('name', '')).lower()
            else:
                tag_name = str(tg).lower()
    
            for skill, lvl in team_skillset.items():
                if tag_name in skill.lower():
                    # +1 * уровень, если инструмент совпадает с тегом
                    score += lvl
    
        return score
    
    def build_team_project_matrix(teams, projects, users_data):
        n_teams = len(teams)
        m_proj = len(projects)
        matrix = np.zeros((n_teams, m_proj), dtype=float)
    
        for i, team in enumerate(teams):
            for j, proj_item in enumerate(projects):
                proj_data = proj_item.get('project', {})
                sc = compute_team_project_score(team, proj_data, users_data)
                matrix[i, j] = sc
    
        return matrix
    
    def assign_teams_to_projects_optimal(teams, projects, users_data):
        """
        Строим матрицу score (team x project),
        переводим в cost = -score,
        запускаем венгерский алгоритм -> {team_index: project_index}.
        """
        score_matrix = build_team_project_matrix(teams, projects, users_data)
        cost_matrix = -score_matrix
    
        row_ind, col_ind = linear_sum_assignment(cost_matrix)
    
        assignment = {}
        for r, c in zip(row_ind, col_ind):
            if r < len(teams) and c < len(projects):
                assignment[r] = c
    
        return assignment, score_matrix
    
    def assign_user_roles_in_team(team_user_ids, project_data, users_data):
        """
        Назначаем уникальные роли внутри команды:
          1) Если role входит в requiredRoles проекта и есть у пользователя, даём её
          2) Иначе любую роль из user_roles
          3) Иначе "Участник"
        """
        assigned_roles = set()
        required_roles = project_data.get('requiredRoles', [])
    
        result = []
        for uid in team_user_ids:
            user = next((u for u in users_data if u['id'] == uid), None)
            if not user:
                continue
    
            user_id = user['id']
            user_name = user['answers'].get("Фамилия Имя Отчество", "Неизвестный пользователь")
            user_roles = extract_user_roles(user)
    
            assigned_role = None
    
            # (A) Попробуем дать роль из requiredRoles, если она есть у пользователя
            intersection = list(set(user_roles) & set(required_roles))
            for r in intersection:
                if r not in assigned_roles:
                    assigned_role = r
                    assigned_roles.add(r)
                    break
    
            # (B) Если не нашли, пробуем любую роль из user_roles
            if assigned_role is None:
                for r in user_roles:
                    if r not in assigned_roles:
                        assigned_role = r
                        assigned_roles.add(r)
                        break
    
            # (C) Если вообще нет ролей, даём "Участник"
            if assigned_role is None:
                assigned_role = "Участник"
    
            result.append({
                "id": user_id,
                "name": user_name,
                "role": assigned_role
            })
    
        return result
    
    def build_final_allocation(teams, assignment, projects, users_data, score_matrix):
        """
        Формирует СЛОЖНУЮ структуру (model_result) И упрощённую (simple_result).
        id проекта берём из field 'project.id' во входных данных, если есть.
        """
        model_result = []
        simple_result = []
    
        for i, team in enumerate(teams):
            if i in assignment:
                proj_index = assignment[i]
                proj_item = projects[proj_index]
    
                project_data = proj_item.get('project', {})
                project_name = project_data.get('name', 'Без проекта')
                project_id = project_data.get('id', None)  # берем из JSON или None
    
                sc = score_matrix[i, proj_index]
                team_allocation = assign_user_roles_in_team(team, project_data, users_data)
    
                model_result.append({
                    "project": project_name,
                    "team_members": team_allocation,
                    "score": sc
                })
                simple_result.append({
                    "project_id": project_id,
                    "team_members_ids": [mem['id'] for mem in team_allocation]
                })
            else:
                # Команда без проекта
                team_allocation = assign_user_roles_in_team(team, {}, users_data)
    
                model_result.append({
                    "project": "Без проекта",
                    "team_members": team_allocation,
                    "score": 0.0
                })
                simple_result.append({
                    "project_id": None,
                    "team_members_ids": [mem['id'] for mem in team_allocation]
                })
    
        return model_result, simple_result
    
    def evaluate_teams(teams, users_data, desired_team_size):
        """
        Считает СРЕДНИЕ метрики по всем командам (агрегированные).
        - Team Size Deviation
        - Roles Count
        - Skill Variance
        - Skill Deviation
        - Tools Count
        - Tools Variance
        """
        user_dict = {user['id']: user for user in users_data}
    
        size_deviations = []
        roles_counts = []
        skill_variances = []
        skill_deviations = []
        tools_counts = []
        tools_variances = []
    
        # Средний скилл по всем пользователям
        all_skills = [extract_skill_level(u) for u in users_data]
        average_skill_all = np.mean(all_skills) if all_skills else 0.0
    
        for team in teams:
            team_skills = []
            team_roles = set()
            team_tools = {}
    
            for user_id in team:
                user = user_dict[user_id]
                skill_level = extract_skill_level(user)
                team_skills.append(skill_level)
    
                roles = extract_user_roles(user)
                team_roles.update(roles)
    
                tools = extract_user_tools(user)
                for tool, level in tools.items():
                    team_tools.setdefault(tool, []).append(level)
    
            # Метрики для одной команды
            size_deviation = abs(len(team) - desired_team_size)
            roles_count = len(team_roles)
            skill_variance = np.std(team_skills) if team_skills else 0.0
            average_skill_team = np.mean(team_skills) if team_skills else 0.0
            skill_deviation = abs(average_skill_team - average_skill_all)
            tools_count = len(team_tools)
            tool_variances = [np.std(levels) for levels in team_tools.values()]
            tools_variance = np.mean(tool_variances) if tool_variances else 0.0
    
            size_deviations.append(size_deviation)
            roles_counts.append(roles_count)
            skill_variances.append(skill_variance)
            skill_deviations.append(skill_deviation)
            tools_counts.append(tools_count)
            tools_variances.append(tools_variance)
    
        team_metrics = {
            'Average Team Size Deviation': np.mean(size_deviations) if size_deviations else 0.0,
            'Average Roles per Team': np.mean(roles_counts) if roles_counts else 0.0,
            'Average Skill Variance': np.mean(skill_variances) if skill_variances else 0.0,
            'Average Skill Deviation': np.mean(skill_deviations) if skill_deviations else 0.0,
            'Average Tools per Team': np.mean(tools_counts) if tools_counts else 0.0,
            'Average Tools Variance per Team': np.mean(tool_variances) if tool_variances else 0.0
        }
    
        return team_metrics
    
    def evaluate_single_team(team, users_data, desired_team_size, average_skill_all):
        """
        Метрики для ОДНОЙ команды.
        """
        user_dict = {user['id']: user for user in users_data}
    
        team_skills = []
        team_roles = set()
        team_tools = {}
    
        for user_id in team:
            user = user_dict[user_id]
            skill_level = extract_skill_level(user)
            team_skills.append(skill_level)
    
            roles = extract_user_roles(user)
            team_roles.update(roles)
    
            tools = extract_user_tools(user)
            for tool, level in tools.items():
                team_tools.setdefault(tool, []).append(level)
    
        size_deviation = abs(len(team) - desired_team_size)
        roles_count = len(team_roles)
        skill_variance = np.std(team_skills) if team_skills else 0.0
        average_skill_team = np.mean(team_skills) if team_skills else 0.0
        skill_deviation = abs(average_skill_team - average_skill_all)
        tools_count = len(team_tools)
        tool_variances = [np.std(levels) for levels in team_tools.values()]
        tools_variance = np.mean(tool_variances) if tool_variances else 0.0
    
        return {
            'Team Size Deviation': size_deviation,
            'Roles Count': roles_count,
            'Skill Variance': skill_variance,
            'Skill Deviation': skill_deviation,
            'Tools Count': tools_count,
            'Tools Variance': tools_variance
        }

    # 1) Загрузка
    users_data, projects = load_and_preprocess_data(data)

    # 2) One-Hot + инструменты
    df_prefs, user_ids = build_preference_matrix(users_data)
    N = len(user_ids)

    # Параметры
    min_team_size = 4
    max_team_size = 5
    desired_team_size = 5

    # (опционально) ищем пары со схожестью >= 0.6
    threshold = 0.6
    similar_pairs = compute_similar_pairs(df_prefs, threshold=threshold)
    print(f"Найдено {len(similar_pairs)} пар пользователей со сходством >= {threshold}")

    # 4) ILP: формируем команды
    teams = form_teams_with_ilp(
        user_ids, 
        min_team_size, 
        max_team_size, 
        similar_pairs=similar_pairs
    )

    # 5) Оптимальное распределение команд по проектам
    assignment, score_matrix = assign_teams_to_projects_optimal(teams, projects, users_data)

    # 6) Построение финальной (детальной) и упрощённой структуры
    model_result, simple_result = build_final_allocation(teams, assignment, projects, users_data, score_matrix)

    # Подсчёт метрик для каждой команды (персонально)
    all_skills = [extract_skill_level(u) for u in users_data]
    average_skill_all = np.mean(all_skills) if all_skills else 0.0

    # Пройдёмся по model_result, добавим туда "team_metrics"
    for i, team_info in enumerate(model_result):
        team = teams[i]  # список user_ids
        single_metrics = evaluate_single_team(team, users_data, desired_team_size, average_skill_all)
        team_info["team_metrics"] = single_metrics

    # Теперь считаем СРЕДНИЕ метрики по всем командам
    team_metrics = evaluate_teams(teams, users_data, desired_team_size)

    # 7) Сохраняем результат в JSON:
    #    - "result": только id проектов и участников
    #    - "model_result": со всей подробной инфой (роли, метрики, имена, score)
    result_json = {
        "result": simple_result,
        "model_result": model_result,
        "average_team_metrics": team_metrics
    }
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(result_json, f, ensure_ascii=False, indent=4)

    return {
        "result": simple_result,
        "model_result": model_result,
        "average_team_metrics": team_metrics
    }

