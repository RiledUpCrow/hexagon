FROM node:10.15 as dev
WORKDIR /var/hexagon
ENV CI=true

# install git lfs
RUN curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash && \
  apt-get install -y git-lfs && \
  git lfs install

# installing dependencies
COPY package.json package-lock.json tsconfig.json .eslintrc.json .prettierrc.json ./
RUN npm ci

# source code
COPY .git .git/
COPY public public/
COPY src src/

# pull correct lfs files
RUN git lfs pull

# building production static files
FROM dev as build
WORKDIR /var/hexagon

RUN npm run build

# nginx server
FROM nginx:1.15 as prod
WORKDIR /usr/share/nginx/html

COPY --from=build /var/hexagon/build ./