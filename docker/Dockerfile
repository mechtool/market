FROM node:10-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . .
RUN npm install -g @angular/cli --unsafe-perm=true
RUN npm install
