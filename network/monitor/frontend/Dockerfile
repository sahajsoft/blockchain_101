FROM ubuntu:xenial
RUN apt-get update \
&& apt-get install --assume-yes nodejs npm git \
&& ln -s /usr/bin/nodejs /usr/bin/node \
&& git clone https://github.com/cubedro/eth-netstats.git
WORKDIR "/eth-netstats"
RUN npm install \
&& npm install -g grunt-cli \
&& grunt
CMD WS_SECRET=test npm start