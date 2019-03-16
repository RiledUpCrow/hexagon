FROM node:10.15 as dev
WORKDIR /var/hexagon
ENV CI=true

# installing dependencies
COPY package.json package-lock.json tsconfig.json .eslintrc.json .prettierrc.json ./
RUN npm ci

# source code
COPY public public/
COPY src src/

# building production static files
FROM dev as build
WORKDIR /var/hexagon

RUN npm run build

# nginx server
FROM nginx:1.15 as prod
WORKDIR /usr/share/nginx/html

COPY --from=build /var/hexagon/build ./