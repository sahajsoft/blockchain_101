FROM ubuntu:xenial
RUN apt-get update \
&& apt-get install --assume-yes nodejs npm git \
&& ln -s /usr/bin/nodejs /usr/bin/node \
&& git clone https://github.com/cubedro/eth-net-intelligence-api
WORKDIR "/eth-net-intelligence-api"
COPY ./app.json ./app.json
RUN npm install \
&& npm install -g pm2
CMD exec pm2 start app.json --no-daemon