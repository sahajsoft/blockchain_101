FROM ubuntu:xenial
RUN apt-get update \
&& apt-get install -y software-properties-common \
&& add-apt-repository -y ppa:ethereum/ethereum \
&& apt-get update \
&& apt-get --assume-yes install ethereum-unstable
COPY ./password.txt ./password.txt
COPY ./genesis.json ./genesis.json
RUN geth init genesis.json
RUN geth --password password.txt account new | grep -oP "\{(.*?)\}" | cut -b 2-41 > acccount.txt
CMD exec geth --networkid 15 --verbosity=4 --bootnodes "enode://`cat ./shared/bootnode_address.txt`@`echo $bootnodeIP`:30301" --rpc --rpcapi "eth,web3,net" --rpcaddr "`echo $myIP`"