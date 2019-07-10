FROM alpine

RUN apk add --update --no-cache \
    nodejs \
    npm \
    git

COPY main.js .
COPY logger.js .
COPY package.json .
RUN npm install

ENTRYPOINT ["/usr/bin/node", "./main.js"]

EXPOSE 8080
