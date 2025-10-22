FROM node:alpine AS build-stage

WORKDIR /app

COPY . .

WORKDIR /app/example

RUN npm install

RUN npm run build

FROM nginx:latest AS production-stage

COPY --from=build-stage /app/example/dist /usr/share/nginx/html

COPY --from=build-stage /app/example/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
