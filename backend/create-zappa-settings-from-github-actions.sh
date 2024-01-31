#!/bin/bash
# This script sets up the zappa_settings.json file from Github Actions.

echo '{
    "dev": {
        "aws_region": "ap-southeast-2",
        "django_settings": "backend.settings",
        "project_name": "backend",
        "runtime": "python3.10",
        "s3_bucket": "django-react-reddit-clone-bucket",
        "timeout_seconds": 900,
        "manage_roles": false,
        "role_name": "ZappaDjangoRole",
        "role_arn": "arn:aws:iam::826868394390:role/ZappaDjangoRole",
        "cors": true,
        "environment_variables": {
            "SECRET_KEY": "'$SECRET_KEY'",
            "DB_USER": "'$DB_USER'",
            "DB_NAME": "'$DB_NAME'",
            "DB_HOST": "'$DB_HOST'",
            "DB_PASSWORD": "'$DB_PASSWORD'",
            "DB_PORT": "'$DB_PORT'"
        },
        "include": [
            "pyscopg2-binary"
        ],
    }}
}' >zappa_settings.json

cat zappa_settings.json
