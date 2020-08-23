FROM nginx:1.14.2-alpine as base
FROM node:12 as dep
WORKDIR /website-client
COPY ./package.json /website-client
RUN npm install --unsafe-perm
RUN npm dedupe

COPY . /website-client
RUN npm run build:prod

FROM base
COPY --from=dep /dist/ /dist/
COPY ./docker/site.conf /etc/nginx/conf.d/default.conf
CMD nginx -g 'daemon off;'
