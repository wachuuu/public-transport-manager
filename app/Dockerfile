ARG NODE_VERSION=16-alpine
ARG NGINX_VERSION=1.21-alpine

FROM node:${NODE_VERSION} AS build
WORKDIR /app
COPY ./ ./
RUN npm install
RUN npm run build -- -c development

FROM nginx:${NGINX_VERSION} AS runtime
COPY --from=build /app/dist/publictransportmanagerapp /usr/share/nginx/html

EXPOSE 80
