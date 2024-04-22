FROM python:3.11-slim

RUN pip install poetry
RUN apt-get update && apt-get install ffmpeg libglib2.0-0 libsm6 libxrender1 libxext6 -y  
WORKDIR /app

COPY pyproject.toml poetry.lock* /app/

RUN poetry config virtualenvs.create false
RUN poetry install --no-dev --no-interaction --no-ansi

COPY . /app

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 5100

ENTRYPOINT ["entrypoint.sh"]

CMD ["python", "run.py"]

