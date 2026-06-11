
""" Пока не нужна """


def get_json_from_text(text):
    """Принимает текст и парсит его в json"""

    lines = text.splitlines()
    print(lines)
    # Результирующий JSON
    result = {}
    current_section = None  # Для обработки секций, если они есть

    # Обрабатываем построчно
    for line in lines:
        line = line.strip()  # Убираем лишние пробелы
        if not line:  # Пропускаем пустые строки
            continue
        if ":" in line and not line.endswith(":"):  # Проверяем, есть ли двоеточие (но не конец строки)
            key, value = map(str.strip, line.split(":", 1))  # Делим строку на ключ и значение
            if current_section:
                result[current_section][key] = value
            else:
                result[key] = value
        else:
            # Если строка без значения после двоеточия, считаем её новой секцией
            current_section = line.rstrip(":")  # Убираем двоеточие в конце секции
            result[current_section] = {}
    
    return result