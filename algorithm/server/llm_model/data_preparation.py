import re
from typing import List

import pandas as pd
from langchain.chat_models.gigachat import GigaChat
from config.config import CONFIG


def llm_get_project_feature(
    llm: GigaChat,
    message: str,
    project_info: str,
    project_req: str,
    project_req_workers: str,
) -> str:
    """Функция обработки текстовых данных по проектам"""
    final_message = message + "\n" + "Описание проекта: " + project_info
    if project_req:
        final_message += "\n" + "Требования к проекту: " + str(project_req)
    if project_req_workers:
        final_message += "\n" + "Требования к исполнителям: " + str(project_req_workers)
    answer = llm.invoke(final_message).content
    return answer


def preprocess_project_data_with_llm(auth_token: str, data: pd.DataFrame, llm:str) -> pd.DataFrame:
    """Функция добавления новых фичей в набор данных по проектам"""
    proj_themes = []
    roles = []
    hard_skills = []
    roles_scoring = []

    for i in range(len(data)):
        project_info = data["Описание"][i]
        project_req = data["Требования проекта"][i]
        project_req_workers = data["Требования к исполнителям"][i]
        # Плохо классифицирует не прошкой
        message = "Тебе на вход передается описание it проекта, требования к этому проекту и требования к исполнителям этого проекта. Классифицируй данный проект в одно из следующих направлений: 1. Разработка веб-сервисов, 2. Анализ текстов и поисковые движки, 3. Анализ изображений / видео, 4.Анализ временных рядов, 5. Анализ табличных данных, 6. Робототехника, 7. Gamedev. В ответе выведи только название подходящего направления, и больше ничего лишнего!"
        proj_theme = llm_get_project_feature(llm, message, project_info, project_req, project_req_workers)
        proj_themes.append(proj_theme)

        message = "По данным описанию проекта, требованиям к проекту и требованиям к исполнителям определи, какие разработчики на данный проект нужны. Ты должен вывести 5 ролей, при этом роли могут повторятся. Имеется большое число Data Scinitst-ов, поэтому на проекты, связанные с анализом данных можно назначать несколько таких разработчиков. Возможные роли разрабочиков: 1. Data Science, 2. Дизайн UX / UI и проектирование интерфейсов, 3. Backend - разработка, 4. Frontend - разработка, 5. Тестировщик, 6. devOps. Твой ответ должен состоять только из списка 5 необходимых ролей, не добавляй ничего лишнего!"
        proj_roles = llm_get_project_feature(llm, message, project_info, project_req, project_req_workers)
        roles.append(proj_roles)

        message = "По данным описанию проекта, требованиям к проекту и требованиям к исполнителям определи какие hard-skills необходимо иметь разработчикам, для решения поставленной задачи. В ответе перечисли через запятую названия необходимых инструментов разработки. Ответ обязан быть в виде списка названий через запятую! Пример твоего ответа: java, css, nlp. Не добавляй ничего лишнего!"
        proj_hard_skills = llm_get_project_feature(llm, message, project_info, project_req, project_req_workers)
        hard_skills.append(proj_hard_skills)

        message = "По данным описанию проекта, требованиям к проекту и требованиям к исполнителям оцени по шкале от 1 до 5 насколько важен разработчик данной роли для проекта. Роли разрабочиков: 1. Data Science, 2. Дизайн UX / UI и проектирование интерфейсов, 3. Backend - разработка, 4. Frontend - разработка, 5. Тестировщик, 6. devOps. Ответ должен быть представлен в виде списка: роль - цифра, оценка по пяти-бальной шкале, больше ничего лишнего. Ты обязан оценить каждую из представленных ролей."
        proj_roles_scoring = llm_get_project_feature(llm, message, project_info, project_req, project_req_workers)
        roles_scoring.append(proj_roles_scoring)

    data["Тема проекта"] = proj_themes
    data["Роли исполнителей"] = roles
    data["hard skills"] = hard_skills
    data["Важность ролей"] = roles_scoring

    return data


def preprocess_roles(roles: str) -> List[str]:
    """Предобработка строки с ролями - получаем список необходимых ролей"""
    roles_list = []
    for role in CONFIG["roles_list"]:
        count = roles.count(role)
        for i in range(count):
            roles_list.append(role)
    return roles_list


def preprocess_hard_skills(hard_skils: str) -> List[str]:
    """Предобработка строки с hard-skills, получаем список hard-skills"""

    hard_skills = re.split(", |/", hard_skils)
    return hard_skills


def check_valid_tool(instruments: dict[str, int], tool_role_map: dict[str, int]) -> dict[str, int]:
    """
    Функция, проверки, насколько адекватно написаны названия инструментов
    """
    ans = dict()
    for tool in instruments:
        lower_tool = tool.lower()
        if lower_tool in tool_role_map:
            ans[lower_tool] = instruments[tool]
    return ans


def merge_dicts(tool_dicts: List[dict[str:int]]) -> dict[str, int]:
    """Сливаем все словари с оценками владения инструментами в один словарь"""

    ans = dict()
    for tool_dict in tool_dicts:
        ans.update(tool_dict)

    return ans


def preprocess_scoring(roles_scoring: str) -> dict[str, int]:
    """Функция, формирующая из строки с оценками ролей словарь оценок"""
    pattern = r'.+? - \d+'  # TODO: переписать паттерн чтобы охватывать больше кейсов
    roles_dict = {}
    for roles in re.findall(pattern, roles_scoring):
        try:
            roles_splitted = roles.split(' - ')
            if len(roles_splitted) > 2:
                role = roles_splitted[0] + " - " + roles_splitted[1]
                score = roles_splitted[2]
            else:
                role, score = roles_splitted[0], roles_splitted[1]
            role = re.sub(r"\d. ", "", role)
            score = int(score)
            roles_dict[role] = score
        except IndexError:
            pass

    return roles_dict


def preprocess_project_data(projects_df: pd.DataFrame) -> pd.DataFrame:
    """Функция предобработки подгруженных данных по проектам"""
    projects_df["Роли исполнителей"] = projects_df["Роли исполнителей"].apply(preprocess_roles)
    projects_df["Роли исполнителей"] = projects_df["Роли исполнителей"].apply(fix_testing)
    projects_df["hard skills"] = projects_df["hard skills"].apply(preprocess_hard_skills)
    # projects_df['Важность ролей'] = projects_df['Важность ролей'].apply(preprocess_scoring)
    return projects_df


def fix_testing(roles: list[str]) -> list[str]:
    """Заменяем testing на Тестировщик"""
    for i in range(len(roles)):
        if roles[i] == "Testing":
            roles[i] = "Тестировщик"
    return roles


def preprocess_students_data(students_df: pd.DataFrame) -> pd.DataFrame:
    """Предобработка подгруженных данных о студентах"""

    tools_Series = pd.Series([[0] for i in range(len(students_df))])
    for i in range(len(students_df)):
        tools = []
        for tool in CONFIG["tools_list"]:
            try:
                tools.append(preprocess_scoring(students_df[tool][i]))
            except Exception:
                continue
        if not tools:
            tools_Series[i] = None
        else:
            tools_dict = merge_dicts(tools)
            #tools_dict = check_valid_tool(tools_dict, CONFIG["tool_role_map"])
            tools_Series[i] = [tools_dict]

    students_df["tools"] = tools_Series
    students_df = students_df.drop_duplicates(subset="Фамилия Имя Отчество", keep="last")

    return students_df
