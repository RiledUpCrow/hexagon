FROM node:10.15 as dev
WORKDIR /var/hexagon

COPY package.json package-lock.json tsconfig.json .eslintrc.json .prettierrc.json ./
RUN npm ci

COPY public public/
COPY src src/

FROM dev as build
WORKDIR /var/hexagon

RUN npm run build

FROM nginx:1.15 as prod
WORKDIR /usr/share/nginx/html

COPY --from=build /var/hexagon/build ./