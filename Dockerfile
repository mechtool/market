FROM node:14-buster
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN apt-get update && \
    DEBIAN_FRONTEND="nointeractive" \
    apt-get install -y --no-install-recommends \
    chromium \
    libgconf-2-4 \
    openjdk-11-jre-headless \
    && rm -rf /var/lib/apt/lists/*
COPY . .
RUN npm install -g @angular/cli --unsafe-perm=true
RUN npm install
