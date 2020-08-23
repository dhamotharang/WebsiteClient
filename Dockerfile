FROM nginx:1.14.2-alpine as base
LABEL name="docker.debugger.vn/WebsiteClient"

FROM node:12 as dep
WORKDIR //WebsiteClient
COPY ./package.json /WebsiteClient
RUN npm install --unsafe-perm
RUN npm dedupe

COPY . /WebsiteClient
RUN npm run build -- --prod="true" --output-path /dist

FROM base
COPY --from=dep /dist /dist
COPY ./docker/site.conf /etc/nginx/conf.d/default.conf
CMD nginx -g 'daemon off;'
