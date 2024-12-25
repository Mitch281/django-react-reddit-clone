FROM node:22-alpine AS build

WORKDIR /app
COPY frontend/package*.json ./

RUN npm install

COPY ./frontend ./

RUN npm run build

FROM nginx:alpine

COPY frontend/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /app/dist /usr/share/nginx/html

COPY ./frontend/Docker/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT [ "entrypoint.sh" ]