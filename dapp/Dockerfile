FROM node:8 AS build
COPY . /src
WORKDIR /src
RUN npm install
RUN npm install -g truffle
RUN truffle migrate --network development
RUN truffle test