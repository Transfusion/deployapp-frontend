FROM node:18-buster as build
RUN mkdir /app
COPY . /app
WORKDIR /app
RUN npm ci \
    && npm run build:prod \
    && ls -l

FROM nginx:1.23.2-alpine as final
COPY --from=build /app/build/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf