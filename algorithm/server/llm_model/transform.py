import json
import re

import numpy as np
import pandas as pd
from llm_model.data_preparation import preprocess_project_data_with_llm


def transform_json_to_csv_student(json_data: dict) -> pd.DataFrame:
    """Трансформация из json в csv по студентам"""
    result_df_rows = []
    for user in json_data["users"]:
        user_dict = dict()
        for question in user["form"]["data"]:
            if question["type"] == "GRID":
                for answer, row in zip(question["answers"], question["rows"]):
                    user_dict[f"{question['question']}[{row}]"] = answer
            else:
                user_dict[question["question"]] = question.get("answer")
        result_df_rows.append(user_dict)
    result_df = pd.DataFrame.from_dict(result_df_rows, orient="columns")
    # соответствующий мэппинг колонок

    roles = [
        "Выберете интересующие Вас роли, в  IT [Бизнес и системный анализ]",
        "Выберете интересующие Вас роли, в  IT [Дизайн UX / UI и проектирование интерфейсов]",
        "Выберете интересующие Вас роли, в  IT [Анализ и инженерия данных]",
        "Выберете интересующие Вас роли, в  IT [Backend - разработка]",
        "Выберете интересующие Вас роли, в  IT [Frontend - разработка]",
        "Выберете интересующие Вас роли, в  IT [Тестирование и обеспечение качества]",
        "Выберете интересующие Вас роли, в  IT [Развертывание и внедрение]",
        "Выберете интересующие Вас роли, в  IT [Управление командой / проектом]",
    ]

    themes = [
        "Выберете интересные для вас направление проекта (в направлении проекта могут быть все роли, указанные выше) [Разработка веб-сервисов (сайты, сервисы)]",
        "Выберете интересные для вас направление проекта (в направлении проекта могут быть все роли, указанные выше) [Анализ текстов и поисковые движки]",
        "Выберете интересные для вас направление проекта (в направлении проекта могут быть все роли, указанные выше) [Анализ изображений / видео]",
        "Выберете интересные для вас направление проекта (в направлении проекта могут быть все роли, указанные выше) [Анализ временных рядов]",
        "Выберете интересные для вас направление проекта (в направлении проекта могут быть все роли, указанные выше) [Анализ табличных данных]",
        "Выберете интересные для вас направление проекта (в направлении проекта могут быть все роли, указанные выше) [Робототехника (оборудование, теория управления, техническое зрение, интерфейсы)]",
        "Выберете интересные для вас направление проекта (в направлении проекта могут быть все роли, указанные выше) [Gamedev]",
    ]

    knowledge = [
        "Оцените Ваши знания в области IT [Парадигмы программирования (ООП, функциональное, аспектно-ориентированное, и др.)]",
        "Оцените Ваши знания в области IT [Архитектура ПО]",
        "Оцените Ваши знания в области IT [Паттерны проектирования]",
        "Оцените Ваши знания в области IT [Протоколы коммуникаций (REST, gRPC, и др.)]",
        "Оцените Ваши знания в области IT [Алгоритмы и структуры данных]",
        "Оцените Ваши знания в области IT [Потоки и параллельность]",
        "Оцените Ваши знания в области IT [Linux in dev and administration]",
        "Оцените Ваши знания в области IT [Windows in dev and administration]",
        "Оцените Ваши знания в области IT [Проектирование и оптимизация баз данных]",
        "Оцените Ваши знания в области IT [Data Science and Machine Learning]",
    ]

    analitical = [
        "Аналитические навыки [Поиск информации (научные статьи, документация)]",
        "Аналитические навыки [Сбор и анализ требований к ПО]",
        "Аналитические навыки [Декомпозиция задач]",
        "Аналитические навыки [Планирование своей и чужой деятельности]",
        "Аналитические навыки [Тестирование]",
        "Аналитические навыки [Ведение документации]",
    ]

    soft_skills = [
        "SoftSkills [Self management]",
        "SoftSkills [Коммуникации]",
        "SoftSkills [Работа в команде]",
        "SoftSkills [Наставничество]",
        "SoftSkills [Управление людьми]",
    ]

    motivation = [
        "Оцените Ваш уровень мотивации [К работе над интересными проектами]",
        "Оцените Ваш уровень мотивации [Определить свой путь дальнейшего развития и развиваться в IT]",
        "Оцените Ваш уровень мотивации [Устроиться на интересную для себя работу]",
    ]
    # roles mapping
    mapping_roles = {
        "Не интересно": 0,
        "Интересно, можно попробовать": 1 / 2,
        "Хочу поучаствовать в проекте в этой роли и развиваться дальше в эту область": 2 / 2,
        np.nan: 0,
    }

    # themes mapping
    mapping_themes = {
        "Интересно, можно попробовать": 1 / 2,
        "Хочу поучаствовать в проекте по данной области в роли, выбранной ранее": 2 / 2,
        "Не интересно": 0,
        np.nan: 0,
    }

    # analitical mapping
    mapping_analitical = {
        "4 - Постоянно применяю в работе и хорошо знаю теорию": 4 / 5,
        "3 - Искал доп информацию и пытался прокачаться": 3 / 5,
        "5 - Могу обучать других и давать советы": 5 / 5,
        "2 - Пробовал, и частично овладел": 2 / 5,
        "1 - Слышал, но не применял": 1 / 5,
        "0 - Не знаю": 0,
        np.nan: 0,
    }

    # softskills mapping
    mapping_softskills = {
        "Хорошо": 3 / 4,
        "Нормально": 2 / 4,
        "Отлично": 4 / 4,
        "Ниже среднего": 1 / 4,
        "Плохо": 0,
        np.nan: 0,
    }

    # motivation mapping
    mapping_motivation = {
        "4 - Готов выполнять задания на благо команды": 4 / 5,
        "5 - Готов сам стать мотиватором для других": 5 / 5,
        "3 - Готов выполнять задания, но если в них вижу личную выгоду/интерес": 3 / 5,
        "0 - Не хочу": 0,
        "2 - Хочу что-то делать, но не знаю что и как": 2 / 5,
        "1 - Вроде хочу что-то делать, но лень": 1 / 5,
        np.nan: 0,
    }

    # knowledge mapping

    mapping_knowledge = {
        "4 - Применял в проекте в команде": 4 / 5,
        "3 - Пробовал на практике в простых задачах": 3 / 5,
        "1 - Что-то слышал или читал, но не овладел": 1 / 5,
        "2 - Изучал информацию и частично разобрался": 2 / 5,
        "0 - Не знаю": 0,
        "5 - Могу давать советы и решать проблемы и понимаю тенденции развития областей": 5 / 5,
        np.nan: 0,
    }
    for column in roles:
        result_df[column] = result_df[column].map(mapping_roles)

    for column in motivation:
        result_df[column] = result_df[column].map(mapping_motivation)

    for column in themes:
        result_df[column] = result_df[column].map(mapping_themes)

    for column in knowledge:
        result_df[column] = result_df[column].map(mapping_knowledge)

    for column in analitical:
        result_df[column] = result_df[column].map(mapping_analitical)

    for column in soft_skills:
        result_df[column] = result_df[column].map(mapping_softskills)

    return result_df


def transform_json_to_csv_project(json_data: dict, auth_token: str, llm) -> pd.DataFrame:
    """Трансформация из json в csv по проектам"""
    result_df_rows = []
    column_mapping = {
        "name": "Название",
        "description": "Описание",
        "developerRequirements": "Требования к исполнителям",
        "projectRequirements": "Требования проекта",
        "client": "Заказчик",
        "curator": "Куратор проекта",
        "clientContact": "Контактная информация Заказчика",
    }
    for project in json_data["projects"]:
        project_dict = dict()
        for column in column_mapping:
            project_dict[column_mapping[column]] = project["project"][column]
        result_df_rows.append(project_dict)
    result_df = pd.DataFrame.from_dict(result_df_rows, orient="columns")
    result_df = preprocess_project_data_with_llm(auth_token, result_df, llm)
    return result_df


def prepare_tool_role_map(data: dict, tools_list: list[str], llm) -> dict:
    """Мэтчим инструменты разработки и подходящие роли разработчиков"""
    result_dict = {}
    roles_list = data["config"]["roles_list"].copy()
    if "Без роли" in roles_list:
        roles_list.remove("Без роли")
    roles_list = str(roles_list)
    message = f"Тебе на вход передается список инструментов и список ролей разработчиков. Каждому инструменту сопоставь одну или несколько ролей из списка (Только из этого списка), в формате 'инструмент': [список подходящих ролей]. Ответ выведи в формате Словаря Python. Список инструментов: {tools_list}, Список ролей: {roles_list}"
    answer = llm.invoke(message).content
    matches = re.findall(r"\{[^}]*\}", answer)[0]
    matches = matches.replace("'", '"')
    result_dict = json.loads(matches)
    # pattern = r"'\w+': \['[^']+'\]"
    # matches = re.findall(pattern, matches)
    # result_dict = {k: v for k, v in matches}
    return result_dict


def prepare_tools_list(students_df: pd.DataFrame, llm) -> list["str"]:
    """Подготавливаем список инструментов по студентам, убираем дубликаты с помощью llm"""
    tools_list = []
    for index, student_row in students_df.iterrows():
        try:
            tools_list.extend(list(student_row["tools"][0].keys()))
        except TypeError:
            pass

    message = f"Тебе на вход передается список инструментов разработки. В этом списке некоторые инструменты могут повторятся. Сформируй список уникальных инструментов разработки и выведи в качестве ответа. Исходный список: {str(tools_list)}"
    answer = llm.invoke(message).content
    pattern = r"\d+\.\s\w+"
    matches = re.findall(pattern, answer)
    matches = list(map(lambda x: x.split(" ")[1], matches))
    result_list = matches
    return result_list
