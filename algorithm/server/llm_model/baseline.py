import random
import re
import copy
from collections import Counter, defaultdict
from typing import Any, Generator

from config.config import CONFIG
import pandas as pd
from pandas.core.series import Series


roles_maxes = defaultdict(float)
role_score = defaultdict(float)


def _gen_id() -> Generator[int, None, None]:
    curr_id = 1
    while True:
        yield curr_id
        curr_id += 1


def sort_curr_team_distribution(current_teams_distribution) -> dict:
    return {k: v for k, v in sorted(current_teams_distribution.items(), key=lambda item: item[1]["score"])}


def remove_leading_number_and_dot(s):
    # Если строка начинается с цифры, за которой следует точка, удалить их
    return re.sub(r"^\d+\. ", "", s)


def get_mean_score(current_teams_distribution: dict) -> float:
    """Функция для подсчета среднего скора по командам"""
    mean_score = 0
    for project in current_teams_distribution:
        mean_score += current_teams_distribution[project]["score"]
    mean_score /= len(current_teams_distribution)
    print(f"{mean_score=}")
    return mean_score


def distribution_error(current_teams_distribution: dict) -> float:
    """Функция для подсчета метрики - ошибки распределения"""
    mean_score = get_mean_score(current_teams_distribution)
    error = 0
    for project in current_teams_distribution:
        error += (current_teams_distribution[project]["score"] - mean_score) ** 2
    error /= len(current_teams_distribution)
    error = error ** (1 / 2)
    return error


def extract_project_by_name(projects_df: pd.DataFrame, project_name: str) -> dict[str, Any]:
    """Извлекает информацию о проекте из датафрейма"""
    row = projects_df[projects_df["Название"] == remove_leading_number_and_dot(project_name)].squeeze()
    if not row.empty:
        return row.to_dict()

    return {}


def delete_student_from_dataframe(students_df: pd.DataFrame, student_name: str) -> None:
    """Удаляет студента из исходного датафрейма после его распределения в одну из команд"""
    student_index = students_df[students_df["Фамилия Имя Отчество"] == student_name].index
    students_df.drop(index=student_index, inplace=True)


def gen_project_name(n_student_per_project: int, current_teams_distribution: dict) -> ...:
    """Генератор"""
    counter = 0
    while counter < n_student_per_project:
        for project in current_teams_distribution:
            yield project
        counter += 1

    while True:
        sorted_current_teams_distribution = sort_curr_team_distribution(current_teams_distribution)
        for project in sorted_current_teams_distribution:
            yield project


# Общая функция распределения студентов по командам
def get_team_distribution(
    n_students_per_project: int,  # Количество студентов на один проект
    original_students_df: pd.DataFrame,  # Набор студентов с числовыми нормализованными фичами
    projects_df: pd.DataFrame,  # Набор проектов с "категориальными" фичами
    weights: dict[str, dict[str, Any]],  # Информация обо всех весах, используемых при подсчете скора
    projects_order_list: list[str],
    # Глобальный порядок обхода проектов при заполнении (в порядке убывания приоритетности)
    roles_order_list: list[str],  # Глобальный порядок заполнения ролей в проектах (В порядке убывания важности)
    competence_skill_role_map: dict[str, list[str]],  # Сопоставление технических компетенций опроса техническим ролям
    competence_preference_role_map: dict[str, list[str]],  # Сопоставление предпочтений опроса техническим ролям
    competence_skill_project_group_map: dict[str, list[str]],
    competence_preference_project_group_map: dict[str, list[str]],
    # Сопоставление технических компетенций опроса техническим ролям
    common_competences_preference_list: list[str],
    common_competences_skill_list: list[str],
    tool_role_map: dict[str, list[str]],  # Сопоставление инструмента технической роли в проекте
) -> dict[str, Any]:
    # Считаем для каждого студента PM score
    students_df = original_students_df.copy()
    students_df = calculate_pm_score_for_all_students(students_df=students_df, pm_columns_weights=weights["pm_weights"])
    students_roles_scores = calculate_role_score_for_all_students(
    students_df,
    roles_order_list,
    competence_skill_role_map,
    competence_preference_role_map,
    common_competences_preference_list,
    common_competences_skill_list,
    tool_role_map,
    weights)

    # Инициализируем структуру с распределением команд по проектам
    current_teams_distribution = prepare_init_teams_distribution(
        projects_order_list=projects_order_list,
        n_students_per_project=n_students_per_project,
        num_of_students=len(students_df),
    )

    # Заполнение n-го студента проекта
    # Итерируемся по каждому проекту в рамках заполнения n-го студента проекта
    # Написать генератор _gen_project_name, который сначала возвращает проекты по
    # приоритетам а потом возвращает с наименьшим скором
    for project in gen_project_name(n_students_per_project, current_teams_distribution):
        if students_df.empty:
            break

        # Преобразуем данные по проекту к необходимому виду
        project_data_dict = extract_project_by_name(projects_df=projects_df, project_name=project)
        # Получаем следующую для заполнения роль в рамках проекта
        current_project_role = get_next_role_for_project(
            project_name=project,
            project_data=project_data_dict,
            roles_order=roles_order_list,
            curr_teams_distribution=current_teams_distribution,
        )
        # Находим студента, имеющего максимальный скор для данной роли текущего проекта
        top_k_results = get_max_score_for_role_in_project(
            project_data_dict=project_data_dict,
            students_df=students_df,
            role=current_project_role,
            competence_skill_role_map=competence_skill_role_map,
            competence_preference_role_map=competence_preference_role_map,
            competence_skill_project_group_map=competence_skill_project_group_map,
            competence_preference_project_group_map=competence_preference_project_group_map,
            common_competences_preference_list=common_competences_preference_list,
            common_competences_skill_list=common_competences_skill_list,
            tool_role_map=tool_role_map,
            weights=weights,
        )
        student_name, student_role_project_score = get_best_student(top_k_results)

        # Добавляем студента в общее распределение команд проекта
        current_teams_distribution[project]["team"].append(
            {
                "name": student_name,
                "role": current_project_role,
                "role_project_score": student_role_project_score,
                "pm_score": students_df[students_df["Фамилия Имя Отчество"] == student_name]["pm_score"].values[0],
                "student_role_score": students_roles_scores[student_name]
            },
        )
        delete_student_from_dataframe(students_df, student_name)

        current_teams_distribution[project]["score"] += student_role_project_score

    rebalance_team_distribution(current_teams_distribution, CONFIG["weights"]["eps"], projects_df, original_students_df)

    current_teams_distribution = normalize_by_role(current_teams_distribution, CONFIG["roles_list"])
    
    score = get_mean_score(current_teams_distribution)
    error = distribution_error(current_teams_distribution)
    
    current_teams_distribution['mean_score'] = score
    current_teams_distribution['distribution_error'] = error
    return current_teams_distribution


def get_best_student(top_k_results: list[list[float | str]]) -> list[float | str]:
    """Выбор одного студента из top_k лучших"""
    k_val = len(top_k_results)
    weights = [(k_val - i) for i in range(k_val)]

    # Select a random element based on weights
    total_weight = sum(weights)
    rand_val = random.uniform(0, total_weight)

    for i, weight in enumerate(weights):
        rand_val -= weight
        if rand_val <= 0:
            return top_k_results[i]

    return top_k_results[-1]


def get_max_score_for_role_in_project(
    project_data_dict: dict[str, Any],
    students_df: pd.DataFrame,
    role: str,
    competence_skill_role_map: dict[str, list[str]],
    competence_preference_role_map: dict[str, list[str]],
    competence_skill_project_group_map: dict[str, list[str]],
    competence_preference_project_group_map: dict[str, list[str]],
    common_competences_preference_list: list[str],
    common_competences_skill_list: list[str],
    tool_role_map: dict[str, list[str]],
    weights: dict,
    top_k: int = 1,
) -> list[list[float | str]]:
    """
    Подсчет оценок hard-skills для исполнителей по текущему проекту 'project_row' и текущей роли 'role',
    их ранжирование и выбор top_k с наибольшей оценкой
    """
    list_of_users = []
    for i in range(len(students_df)):
        student_row = students_df.iloc[i]
        curr_score = calculate_project_role_score_for_student(
            project_data_dict,
            student_row,
            role,
            competence_skill_role_map,
            competence_preference_role_map,
            competence_skill_project_group_map,
            competence_preference_project_group_map,
            common_competences_preference_list,
            common_competences_skill_list,
            tool_role_map,
            weights,
        )
        list_of_users.append([student_row["Фамилия Имя Отчество"], curr_score])

    list_of_users.sort(reverse=True, key=lambda x: x[1])

    return list_of_users[:top_k]


def calculate_project_role_score_for_student(
    project_data_dict: dict[str, Any],
    student_row: pd.Series,
    role: str,
    competence_skill_role_map: dict[str, list[str]],
    competence_preference_role_map: dict[str, list[str]],
    competence_skill_project_group_map,
    competence_preference_project_group_map,
    common_competences_preference_list: list[str],
    common_competences_skill_list: list[str],
    tool_role_map: dict[str, list[str]],
    weights: dict,
) -> float:
    """
    Подсчет оценки hard-skills по компетенциям в ролях и в проектах, по общим компетенциям,
    по инструментам, необходимых для конкретного проекта и инструментам, для данного типа проекта
    """


    # Score по компетенциям, соответсвующим роли
    competence_role_score = 0

    for competence in competence_skill_role_map:
        for competence_role in competence_skill_role_map[competence]:
            if competence_role == role:
                try:
                    competence_role_score += (1 - CONFIG["weights"]["ksi"]) * (
                        student_row[competence] * weights["role_weights"]["competence_role_weights"][competence]
                    )
                except IndexError as exc:
                    raise

    for competence in competence_preference_role_map:
        for competence_role in competence_preference_role_map[competence]:
            if competence_role == role:
                try:
                    competence_role_score += CONFIG["weights"]["ksi"] * (
                        student_row[competence] * weights["role_weights"]["competence_role_weights"][competence]
                    )
                except IndexError as exc:
                    raise

    # Score по компетенциям, соответсвующим тематике проекта
    competence_project_score = 0

    for competence in competence_skill_project_group_map:
        for competence_project_theme in competence_skill_project_group_map[competence]:
            if competence_project_theme == project_data_dict["Тема проекта"]:
                try:
                    competence_project_score += (1 - CONFIG["weights"]["ksi"]) * (
                        student_row[competence]
                        * weights["role_weights"]["competence_project_group_weights"][competence]
                    )
                except KeyError:
                    pass

    for competence in competence_preference_project_group_map:
        for competence_project_theme in competence_preference_project_group_map[competence]:
            if competence_project_theme == project_data_dict["Тема проекта"]:
                try:
                    competence_project_score += CONFIG["weights"]["ksi"] * (
                        student_row[competence]
                        * weights["role_weights"]["competence_project_group_weights"][competence]
                    )
                except KeyError:
                    pass

    # Score общих компетенций
    common_competences_score = 0

    for competence in common_competences_preference_list:
        try:
            common_competences_score += (
                CONFIG["weights"]["ksi"]
                * student_row[competence]
                * weights["role_weights"]["common_competence_weights"][competence]
            )
        except Exception as exc:
            raise

    for competence in common_competences_skill_list:
        try:
            common_competences_score += (
                (1 - CONFIG["weights"]["ksi"])
                * student_row[competence]
                * weights["role_weights"]["common_competence_weights"][competence]
            )
        except Exception as exc:
            raise

    # Score по инструментам, подходящим к проекту
    tool_project_score = 0
    if student_row["tools"]:
        for tool in project_data_dict["hard skills"]:
            tool = tool.lower()
            if tool in student_row["tools"]:
                tool_project_score += student_row["tools"][tool] * weights["role_weights"]["tool_project_weights"][tool]

    # Score по инструментам, подходящим по роли
    tool_role_score = 0

    if student_row["tools"]:
        for tool in student_row["tools"][0]:
            tool_ = tool
            if tool_role_map.get(tool_) == role:
                tool_role_score += student_row["tools"][tool_] * weights["role_weights"]["tool_role_weights"][tool_]

    # print(tool_role_score, ' - tool_role_score')
    score = 0

    score += weights["role_weights_rate"]["competence_role_weights"] * competence_role_score
    score += weights["role_weights_rate"]["competence_project_group_weights"] * competence_project_score
    score += weights["role_weights_rate"]["common_competence_weights"] * common_competences_score
    score += weights["role_weights_rate"]["tool_project_weights"] * tool_project_score
    score += weights["role_weights_rate"]["tool_role_weights"] * tool_role_score

    return score

def calculate_role_score_for_all_students(
    students_df: pd.DataFrame,
    role_order_list: list,
    competence_skill_role_map: dict[str, list[str]],
    competence_preference_role_map: dict[str, list[str]],
    common_competences_preference_list: list[str],
    common_competences_skill_list: list[str],
    tool_role_map: dict[str, list[str]],
    weights: dict,
)-> dict[dict]:
    '''Считаем скор технической роли для всех студентов'''
    curr_roles_maxes = {role: 0 for role in role_order_list}

    def _calculate_role_score_for_student(student_row: Series) -> dict:
        student_roles_score = {}

        for role in role_order_list:
            if role == 'Без роли':
                continue
            competence_role_score = 0
            for competence in competence_skill_role_map:
                for competence_role in competence_skill_role_map[competence]:
                    if competence_role == role:
                        try:
                            competence_role_score += (1 - CONFIG["weights"]["ksi"]) * (
                                student_row[competence] * weights["role_weights"]["competence_role_weights"][competence]
                            )
                        except IndexError as exc:
                            raise

            for competence in competence_preference_role_map:
                for competence_role in competence_preference_role_map[competence]:
                    if competence_role == role:
                        try:
                            competence_role_score += CONFIG["weights"]["ksi"] * (
                                student_row[competence] * weights["role_weights"]["competence_role_weights"][competence]
                            )
                        except IndexError as exc:
                            raise
            
            common_competences_score = 0

            for competence in common_competences_preference_list:
                try:
                    common_competences_score += (
                        CONFIG["weights"]["ksi"]
                        * student_row[competence]
                        * weights["role_weights"]["common_competence_weights"][competence]
                    )
                except Exception as exc:
                    raise

            for competence in common_competences_skill_list:
                try:
                    common_competences_score += (
                        (1 - CONFIG["weights"]["ksi"])
                        * student_row[competence]
                        * weights["role_weights"]["common_competence_weights"][competence]
                    )
                except Exception as exc:
                    raise
            
            tool_role_score = 0

            if student_row["tools"]:
                for tool in student_row["tools"][0]:
                    tool_ = tool
                    if tool_role_map.get(tool_) == role:
                        tool_role_score += student_row["tools"][tool_] * weights["role_weights"]["tool_role_weights"][tool_]

            student_roles_score[role] = (weights["role_weights_rate"]["competence_role_weights"] * competence_role_score + weights["role_weights_rate"]["common_competence_weights"] * common_competences_score + weights["role_weights_rate"]["tool_role_weights"] * tool_role_score)
            if student_roles_score[role] > curr_roles_maxes[role]:
                curr_roles_maxes[role] = student_roles_score[role]
        return student_roles_score

    students_roles_score = {}
    for index, row in students_df.iterrows(): 
          students_roles_score[row['Фамилия Имя Отчество']] = _calculate_role_score_for_student(row)
    for student in students_roles_score:
        for role in students_roles_score[student]:
            students_roles_score[student][role] /= curr_roles_maxes[role]
    return students_roles_score

def calculate_pm_score_for_all_students(
    students_df: pd.DataFrame,
    pm_columns_weights: dict[str, float],
) -> pd.DataFrame:
    """Добавляет в Dataframe колонку "pm_score" со оценкой каждого студента как project-менеджера"""

    def _calculate_pm_score_for_student(student_row: Series) -> float:
        student_pm_score = 0
        for col_name in CONFIG["pm_competences_skill_list"]:
            student_pm_score += (1 - CONFIG["weights"]["ksi"]) * student_row[col_name] * pm_columns_weights[col_name]
        for col_name in CONFIG["pm_competences_preference_list"]:
            student_pm_score += CONFIG["weights"]["ksi"] * student_row[col_name] * pm_columns_weights[col_name]
        return student_pm_score

    students_df["pm_score"] = students_df.apply(_calculate_pm_score_for_student, axis=1)
    return students_df


def get_next_role_for_project(
    project_name: str,
    project_data: dict[str, Any],
    roles_order: list[str],
    curr_teams_distribution: dict[str, Any],
) -> str | None:
    """Возвращает следующую по приоритету роль на проекте"""
    projects_roles: list[str] = project_data["Роли исполнителей"]
    target_projects_roles_cnt = Counter(projects_roles)
    curr_projects_roles_cnt = Counter(
        team_member["role"] for team_member in curr_teams_distribution[project_name]["team"]
    )
    for role, curr_cnt_value in curr_projects_roles_cnt.items():
        target_projects_roles_cnt[role] -= curr_cnt_value

    for role in roles_order:
        if target_projects_roles_cnt[role] > 0:
            return role

    return "Без роли"


def prepare_init_teams_distribution(
    projects_order_list: list,
    n_students_per_project: int,
    num_of_students: int,
) -> dict[str, dict[str, Any]]:
    """
    Функция для инициализии структуры с начальными данными в формате

    {
        "project_1": {
            "score": 0.0,
            "team": [],
        },  # для каждого проекта
    }
    """
    num_of_projects = len(projects_order_list)
    z = num_of_students - n_students_per_project * num_of_projects
    Iter = num_of_students // ((num_of_projects + 1) * n_students_per_project) + 1

    if Iter <= 1:
        return {project: {"score": 0.0, "team": []} for project in projects_order_list}

    resulting_dict = {}
    num_of_remaining_students = num_of_students - (n_students_per_project * num_of_projects) * (
        Iter - 1
    )  # Число студентов, оставшихся на последней итерации
    for i in range(Iter):
        if i == Iter - 1:
            j = 0
            while num_of_remaining_students >= n_students_per_project:
                resulting_dict[f"{i+1}. {projects_order_list[j]}"] = {"score": 0.0, "team": []}
                num_of_remaining_students -= n_students_per_project
                j += 1
        else:
            for project in projects_order_list:
                resulting_dict[f"{i+1}. {project}"] = {"score": 0.0, "team": []}
    return resulting_dict

    # projects_num = len(projects_order_list)  # Число проектов
    # per_iter_students = projects_num * n_students_per_project  # Число студентов для обработки в одной итерации

    # resulting_dict = dict()
    # for i in range(0, num_of_students, n_students_per_project):
    #     curr_iter = i // (projects_num * n_students_per_project)
    #     curr_proj_ind = (i % per_iter_students) // n_students_per_project
    #     curr_proj_name = projects_order_list[curr_proj_ind]
    #     resulting_dict[f"{curr_iter+1}. {curr_proj_name}"] = {"score": 0.0, "team": []}
    # return resulting_dict


def normalize_by_role(
    current_teams_distribution: dict[str, dict],
    roles_order_list: list[str],
    role: None | str = None,
    new_max: None | float = None,
) -> dict[str, dict]:
    """Функция для нормализации скоров по ролям"""
    # dict из максимальных значений role_project_score студентов по ролям
    global roles_maxes
    # нормализация при перебалансировке, если максимум поменялся
    if role:
        for project in current_teams_distribution:
            for student in current_teams_distribution[project]["team"]:
                if student["role"] == role:
                    student["role_project_score"] *= roles_maxes[role]
                    student["role_project_score"] /= new_max
        roles_maxes[role] = new_max
    else:
        # Считаем максимумы по ролям
        curr_roles_maxes = {role : 0 for role in roles_order_list}

        for project in current_teams_distribution:
            current_teams_distribution[project]["score"] = 0
            for student in current_teams_distribution[project]["team"]:
                if student["role_project_score"] > curr_roles_maxes[student["role"]]:
                    curr_roles_maxes[student["role"]] = student["role_project_score"]

        roles_maxes = curr_roles_maxes
        # Стандартизация score по роли
        for project in current_teams_distribution:
            for student in current_teams_distribution[project]["team"]:
                student["role_project_score"] /= roles_maxes[student["role"]]
                if student["role"] == "Без роли":
                    student["role_project_score"] *= CONFIG["weights"]["no_role_coef"]
                current_teams_distribution[project]["score"] += student["role_project_score"]

    return current_teams_distribution


def rebalance_iteration(
    min_team_project: str,
    max_team_project: str,
    curr_team_dist: dict[str, dict[str, Any]],
    projects_df: pd.DataFrame,
    student_df: pd.DataFrame,
) -> bool:
    normalized_curr_team_dist = copy.deepcopy(curr_team_dist)
    normalize_by_role(normalized_curr_team_dist, CONFIG["roles_list"])
    min_team = sorted(normalized_curr_team_dist[min_team_project]["team"], key=lambda x: ["score"])
    max_team = sorted(normalized_curr_team_dist[max_team_project]["team"], key=lambda x: ["score"], reverse=True)

    def get_student_for_role_gen(role: str, team: list[dict]) -> ...:
        """генератор студента по роли в команде"""
        for student in team:
            if student["role"] == role:
                yield student

    def gen_student_pairs(role_: str, min_team_: list[dict], max_team_: list[dict]) -> ...:
        min_team_gen = get_student_for_role_gen(role_, min_team_)
        max_team_gen = get_student_for_role_gen(role_, max_team_)
        init_min_student, init_max_student = next(min_team_gen), next(max_team_gen)
        min_flag, max_flag = False, False
        yield init_min_student, init_max_student
        while True:
            try:
                init_max_student = next(max_team_gen)
                yield init_min_student, init_max_student
            except StopIteration:
                max_flag = True
            try:
                init_min_student = next(min_team_gen)
                yield init_min_student, init_max_student
            except StopIteration:
                min_flag = True

            if max_flag and min_flag:
                break

    def get_mean_score_for_role_in_team(team: list[dict]) -> ...:
        roles_freq = Counter(student["role"] for student in team)
        role_mean_map = defaultdict(float)
        for student in team:
            role_mean_map[student["role"]] += student["role_project_score"]
        for role_, freq in roles_freq.items():
            role_mean_map[role_] = role_mean_map[role_] / freq
        return role_mean_map

    def _calculate_new_score(project_data_dict: dict, student_row: pd.Series, role_: str) -> float:
        return calculate_project_role_score_for_student(
            project_data_dict,
            student_row,
            role_,
            competence_skill_role_map=CONFIG["competence_skill_role_map"],
            competence_preference_role_map=CONFIG["competence_preference_role_map"],
            competence_skill_project_group_map=CONFIG["competence_skill_project_group_map"],
            competence_preference_project_group_map=CONFIG["competence_preference_project_group_map"],
            common_competences_preference_list=CONFIG["common_competences_preference_list"],
            common_competences_skill_list=CONFIG["common_competences_skill_list"],
            tool_role_map=CONFIG["tool_role_map"],
            weights=CONFIG["weights"],
        )

    def swap_students(
        curr_team_dist,
        min_team_project,
        max_team_project,
        student_in_min_team,
        student_in_max_team,
        max_team_student_new_score,
        min_team_student_new_score,
    ):
        # Удалили студента из min команды
        for i in range(len(curr_team_dist[min_team_project]["team"])):
            if curr_team_dist[min_team_project]["team"][i]["name"] == student_in_min_team["name"]:
                prev_min_score = curr_team_dist[min_team_project]["team"].pop(i)["role_project_score"]
                break

        # Добавили студента в min команду
        student_in_max_team["role_project_score"] = max_team_student_new_score
        curr_team_dist[min_team_project]["team"].append(student_in_max_team)
        curr_team_dist[min_team_project]["score"] += max_team_student_new_score - prev_min_score

        # Удалили студента из max команды
        for i in range(len(curr_team_dist[max_team_project]["team"])):
            if curr_team_dist[max_team_project]["team"][i]["name"] == student_in_max_team["name"]:
                prev_max_score = curr_team_dist[max_team_project]["team"].pop(i)["role_project_score"]
                break

        # Добавили студента в max команду
        student_in_min_team["role_project_score"] = min_team_student_new_score
        curr_team_dist[max_team_project]["team"].append(student_in_min_team)
        curr_team_dist[max_team_project]["score"] += min_team_student_new_score - prev_max_score

        return curr_team_dist

    min_team_mean_scores = get_mean_score_for_role_in_team(min_team)
    max_team_mean_scores = get_mean_score_for_role_in_team(max_team)

    roles_score_diffs = {}
    for role in set(min_team_mean_scores) & set(max_team_mean_scores):
        if max_team_mean_scores[role] < min_team_mean_scores[role]:
            continue
        roles_score_diffs[role] = max_team_mean_scores[role] - min_team_mean_scores[role]

    roles_score_diffs = {k: v for k, v in sorted(roles_score_diffs.items(), key=lambda item: item[1], reverse=True)}

    was_swapped = False
    for role in roles_score_diffs:
        if was_swapped:
            break

        for student_in_min_team, student_in_max_team in gen_student_pairs(role, min_team, max_team):
            curr_team_dist_before_norm = copy.deepcopy(curr_team_dist)
            min_project_data_dict = extract_project_by_name(projects_df=projects_df, project_name=min_team_project)
            max_team_student_new_score = _calculate_new_score(
                project_data_dict=min_project_data_dict,
                student_row=student_df[student_df["Фамилия Имя Отчество"] == student_in_max_team["name"]].iloc[0],
                role_=role,
            )

            max_project_data_dict = extract_project_by_name(projects_df=projects_df, project_name=max_team_project)
            min_team_student_new_score = _calculate_new_score(
                project_data_dict=max_project_data_dict,
                student_row=student_df[student_df["Фамилия Имя Отчество"] == student_in_min_team["name"]].iloc[0],
                role_=role,
            )

            swap_students(
                curr_team_dist_before_norm,
                min_team_project,
                max_team_project,
                student_in_min_team,
                student_in_max_team,
                min_team_student_new_score,
                max_team_student_new_score,
            )

            normalize_by_role(curr_team_dist_before_norm, CONFIG["roles_list"])

            max_team_score = curr_team_dist_before_norm[max_team_project]["score"]
            min_team_score = curr_team_dist_before_norm[min_team_project]["score"]

            D = (
                min_team_score - normalized_curr_team_dist[min_team_project]["score"]
            )  # увеличение скора минимальной команды
            max_team_score_diff = (
                normalized_curr_team_dist[max_team_project]["score"] - max_team_score
            )  # уменьшение скора максимальной команды

            # Проверка условий для свопа студентов
            if (
                (D > 0)
                and (max_team_score_diff <= CONFIG["weights"]["c"] * D)
                and (-1 * max_team_score_diff <= CONFIG["weights"]["g"] * D)
            ):
                was_swapped = True
                swap_students(
                    curr_team_dist,
                    min_team_project,
                    max_team_project,
                    student_in_min_team,
                    student_in_max_team,
                    max_team_student_new_score,
                    min_team_student_new_score,
                )
                break

    return was_swapped


def rebalance_team_distribution(
    current_teams_distribution: dict,
    eps: float,
    projects_df: pd.DataFrame,
    student_df: pd.DataFrame,
) -> dict:
    """Функция для дополнительной балансировки команд по скору"""
    err_diff = float("inf")

    def gen_left_right(left: int, right: int):
        while True:
            right -= 1
            yield left, right
            left += 1
            yield left, right

    while err_diff > eps:
        current_teams_distribution_projects = list(sort_curr_team_distribution(current_teams_distribution))
        left, right = 0, len(current_teams_distribution_projects) - 1
        lr_gen = gen_left_right(left, right)
        curr_distribution_err = distribution_error(current_teams_distribution)
        new_distribution_err = curr_distribution_err
        while left < right:
            min_score_project = current_teams_distribution_projects[left]
            max_score_project = current_teams_distribution_projects[right]
            if was_not_swapped := not rebalance_iteration(
                min_score_project,
                max_score_project,
                current_teams_distribution,
                projects_df,
                student_df,
            ):
                left, right = next(lr_gen)
                continue
            print(was_not_swapped)
            new_distribution_err = distribution_error(current_teams_distribution)
            break

        err_diff = curr_distribution_err - new_distribution_err
        # err_diff = new_distribution_err
        print(curr_distribution_err, new_distribution_err, err_diff)

    return current_teams_distribution

class ConfigUpdateError(Exception):
    pass

class RolesListError(ConfigUpdateError):
    pass

class ProjectOrderListError(ConfigUpdateError):
    pass

class WeightsRoleWeightsRateError(ConfigUpdateError):
    pass

class WeightsPMWeightsError(ConfigUpdateError):
    pass

class RoleWeightsError(ConfigUpdateError):
    pass

def update_config(new_config: dict,
                old_config: dict,
                tool_role_map: dict[str, list[str]],
                projects_list: list[str],
                projects_df: pd.DataFrame) -> dict:
    '''Обновление конфига'''
    #Склеить в список названия всех проектов
    if 'roles_list' in new_config:
        new_roles_set = set(new_config['roles_list'])
        new_roles_set.add("Без роли")
        if new_roles_set == set(old_config['roles_list']):
            old_config['roles_list'] = new_config['roles_list'] + ['Без роли']
        else:
            raise RolesListError

    if 'projects_order_list' in new_config:
        if set(projects_list) == set(new_config['projects_order_list']):
            old_config['projects_order_list'] = new_config['projects_order_list']
        else:
            raise ProjectOrderListError
    else:
        old_config['projects_order_list'] = projects_df['Название'].to_list()

    old_config['tool_role_map'] = tool_role_map
    old_config['tool_role_weights'] = {key: 1 for key in tool_role_map}
    old_config['tool_project_weights'] = {key: 1 for key in tool_role_map}

    for param_key in new_config["weights"].keys():
        if param_key == 'role_weights_rate':
            for key in new_config["weights"]['role_weights_rate']:
                if key in old_config["weights"]['role_weights_rate']:
                    old_config["weights"]['role_weights_rate'][key] = new_config["weights"]['role_weights_rate'][key]
                else:
                    raise WeightsRoleWeightsRateError

        if param_key == "pm_weights":
            for key in new_config["weights"]["pm_weights"]:
                if key in old_config["weights"]["pm_weights"]:
                    old_config["weights"]["pm_weights"][key] = new_config["weights"]["pm_weights"][key]
                else:
                    raise WeightsPMWeightsError
               
        if param_key == "role_weights":
            for key in new_config['weights']['role_weights']:
                if key not in old_config['weights']['role_weights']:
                    raise RoleWeightsError
                for column in new_config['weights']['role_weights'][key]:
                    if key not in ['tool_role_weights', 'tool_project_weights']:
                        if column not in old_config['weights']['role_weights'][key]:
                            raise RoleWeightsError
                    old_config['weights']['role_weights'][key][column] = new_config['weights']['role_weights'][key][column]
        
    tool_role_weights = {tool: 1 for tool in tool_role_map}
    old_config['weights']['role_weights']['tool_role_weights'] = tool_role_weights

    return old_config


def preprocess_result(result: dict[str, Any]) -> dict[str, Any]:
    processed_result = defaultdict(list)
    for project_name, project_result in result.items():
        pure_project_name = remove_leading_number_and_dot(project_name)
        processed_result[pure_project_name].append(project_result)
    return processed_result


def _get_team_general_string(
    project_name: str,
    project_team: list[dict[str, Any]],
) -> str:
    name_part = ', '.join([member['name'] for member in project_team])
    return f"{name_part} - {project_name}"


def _get_name_to_user_id_map(users: list[dict[str, Any]]) -> dict[str, int]:
    def _extract_name_from_questions(user_form: list[dict[str, Any]]) -> str | None:
        for question in user_form:
            if question['question'] == 'Фамилия Имя Отчество':
                return question['answer']
        return None

    name_to_user_id_map = {}
    for user in users:
        if (name := _extract_name_from_questions(user['form']['data'])) is None:
            print(f"WARNING: There is no name for user with id {user['id']}")
            continue
        name_to_user_id_map[name] = user['id']

    return name_to_user_id_map


def transform_to_response_schema(
    result: dict[str, Any],
    request_data: dict[str, Any],
) -> dict[str, Any]:
    processed_result = preprocess_result(result)
    name_to_user_id_map = _get_name_to_user_id_map(request_data['users'])
    id_to_name_map = {value: key for key, value in name_to_user_id_map.items()}
    if len(name_to_user_id_map) != len(id_to_name_map):
        print(f"WARNING: invalid name to id mapping!!!")

    team_id_gen = _gen_id()
    member_id_gen = _gen_id()
    simple_result = []
    for project_request_data in request_data['projects']:
        project_info = project_request_data['project']
        project_name = project_info['name']

        project_result = processed_result.get(project_name)
        if project_result is None:
            pass
            print(f"There is no project with name {project_name} in model result")

        project_request_data['teams'] = []
        project_info['teams'] = []

        for team_result in project_result:
            # get members mapping
            name_to_member_id_map = {
                member['name']: next(member_id_gen) for member in team_result['team']
            }

            # get roles mapping
            name_to_role_map = {
                member['name']: member['role'] for member in team_result['team']
            }

            team_id = next(team_id_gen)

            # add team id
            project_info['teams'].append(team_id)

            # fill general team information
            project_request_data['teams'].append(
                {
                    "id": team_id,
                    "name": _get_team_general_string(project_name, team_result['team']),
                    "members": list(name_to_member_id_map.values()),
                    "project": project_info['id'],
                    "administrators": [],
                    "documents": [],
                }
            )
            simple_result.append({'students': [name_to_user_id_map[person['name']] for person in team_result['team']],
                                  'project': project_info['id']})
            # fill users and members fields
            for team_member in team_result['team']:
                member_name = team_member['name']
                member_id = name_to_member_id_map[member_name]
                role = name_to_role_map[member_name]

                if (user_id := name_to_user_id_map.get(member_name, None)) is None:
                    print(f"WARNING: user id for name {member_name} not found!!!")
                    continue
                project_request_data['users'].append(
                    {
                        "id": user_id,
                        "name": member_name,
                    },
                )
                project_request_data['members'].append(
                    {
                        "id": member_id,
                        "roles": [role],
                        "name": member_name,
                        "isAdministrator": False,
                        "user": user_id,
                        "team": team_id,
                    },
                )

    request_data.pop('users')
    request_data.pop('llm_params')
    request_data.pop('projects')
    request_data['model_result'] = result
    request_data['result'] = simple_result
    return request_data
