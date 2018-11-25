FROM ubuntu:xenial
RUN apt-get update \
&& apt-get install -y software-properties-common \
&& add-apt-repository -y ppa:ethereum/ethereum \
&& apt-get update \
&& apt-get --assume-yes install ethereum-unstable
COPY ./genesis.json ./genesis.json
COPY ./password.txt ./password.txt
RUN geth init genesis.json
RUN geth account new --password password.txt | grep -oP "\{(.*?)\}" | cut -b 2-41 > account.txt
CMD exec geth --networkid 15 --verbosity=4 --bootnodes "enode://`cat ./shared/bootnode_address.txt`@`echo $bootnodeIP`:30301" --rpc --rpcapi "eth,web3,personal,net" --rpcaddr "`echo $myIP`" --mine --minerthreads=1 --unlock "`cat account.txt`" --password "password.txt"