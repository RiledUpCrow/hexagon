FROM node:10.15
WORKDIR /var/hexagon
ENV PORT=80 DANGEROUSLY_DISABLE_HOST_CHECK=true

# installing dependencies
COPY package.json package-lock.json ./
RUN npm ci

# copy confing files
COPY tsconfig.json .eslintrc.json .prettierrc.json ./

CMD [ "npm", "start" ]
