FROM node:10.15 as dev
WORKDIR /var/hexagon
ENV PORT=80 DANGEROUSLY_DISABLE_HOST_CHECK=true

# install git lfs
RUN curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash && \
  apt-get install -y git-lfs && \
  git lfs install

# installing dependencies
COPY package.json package-lock.json ./
RUN npm ci

# copy confing files
COPY tsconfig.json .eslintrc.json .prettierrc.json ./

CMD [ "npm", "start" ]

FROM dev as build
ENV CI=true

# copy source code
COPY .git .git/
COPY public public/
COPY src src/

# pull correct lfs files
RUN git lfs pull

# build the static files
RUN npm run build

# nginx server
FROM nginx:1.15 as prod
WORKDIR /usr/share/nginx/html

COPY --from=build /var/hexagon/build ./