FROM python:3.11-slim

WORKDIR /app

COPY requirement.txt .
RUN pip install -r requirement.txt

COPY . .

RUN python preload_models.py

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]