"""
Данный скрипт принимает на вход два параметра:
:param model_name: Имя модели, должно совпадать с именем функции пакета models.py
:param data: Входные данные о проектах, учениках и т.д.

Запускается модель по указанному неймингу, результат возвращается клиенту
"""


from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict
import models

app = FastAPI()


# Входные данные
class ModelRequest(BaseModel):
    model_name: str  
    data: Dict


@app.get("/healthcheck")
async def healthcheck():
    return {"status": "ok"}


@app.post("/run_model/")
async def run_model(request: ModelRequest):
    model_name = request.model_name
    input_data = request.data
    print(model_name)

    try:
        ml_method = getattr(models, model_name, None)
        return ml_method(input_data)
    except Exception as e:
        raise e
        return {"Error": f"An error occurred while executing '{model_name}': {e}"}