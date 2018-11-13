FROM ubuntu:xenial
RUN apt-get update \
&& apt-get install -y software-properties-common \
&& add-apt-repository -y ppa:ethereum/ethereum \
&& apt-get update \
&& apt-get --assume-yes install ethereum-unstable
CMD exec geth --networkid 15 --verbosity=4 --bootnodes "enode://`cat ./shared/bootnode_address.txt`@`echo $bootnodeIP`:30301" --rpc --rpcapi "eth,web3,net" --rpcaddr "`echo $myIP`"