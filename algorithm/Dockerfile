FROM python:3.12-slim
WORKDIR /server/app
ENV PYTHONPATH="/server:${PYTHONPATH}"
COPY ./server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ./server /server

EXPOSE 8005

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8005"]