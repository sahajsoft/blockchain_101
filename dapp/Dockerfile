FROM node:8-alpine
RUN apk add --update python python-dev py-pip build-base git
RUN npm install -g truffle
COPY . ./src
WORKDIR /src
RUN npm install
CMD truffle migrate --network development && exec node app.js