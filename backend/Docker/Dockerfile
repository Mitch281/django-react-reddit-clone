FROM python:3.10-slim

# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE=1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED=1

WORKDIR /usr/src/app

# Generate requirements.txt
RUN pip install pipenv
COPY ./backend/Pipfile ./backend/Pipfile.lock ./
RUN pipenv requirements > requirements.txt

# For psycopg2
RUN apt-get update \
    && apt-get -y install libpq-dev gcc \
    && pip install psycopg2

RUN pip install -r ./requirements.txt

# Separate installation of python-dotenv required for an unknown reason.
RUN pip install -U python-dotenv

COPY ./backend/.env ./

COPY ./backend/authentication ./authentication
COPY ./backend/backend ./backend
COPY ./backend/comments ./comments
COPY ./backend/core ./core
COPY ./backend/seeding ./seeding
COPY ./backend/posts ./posts

COPY ./backend/manage.py ./

COPY ./backend/Docker/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT [ "entrypoint.sh" ]
