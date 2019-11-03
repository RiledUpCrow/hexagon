FROM node:10.15 as build
WORKDIR /var/hexagon
ENV PORT=80

# installing dependencies
COPY package.json package-lock.json ./
RUN npm ci

# copy files
COPY tsconfig.json ./
COPY public public/
COPY src src/

# build the static files
RUN npm run build

# nginx server
FROM nginx:1.15 as prod
WORKDIR /usr/share/nginx/html

COPY --from=build /var/hexagon/build ./
