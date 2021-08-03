FROM node:14-buster
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g @angular/cli --unsafe-perm=true
RUN npm install
COPY . .
CMD [ "node", "dist/market/server/main.js" ]
