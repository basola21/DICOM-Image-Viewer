FROM python:3.11-slim

RUN pip install poetry

WORKDIR /app

COPY pyproject.toml poetry.lock* /app/

RUN poetry config virtualenvs.create false
RUN poetry install --no-dev --no-interaction --no-ansi

COPY . /app

EXPOSE 5100

CMD ["flask", "run", "--host=0.0.0.0", "--port=5100"]

