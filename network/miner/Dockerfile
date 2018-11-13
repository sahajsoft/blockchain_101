FROM ubuntu:xenial
RUN apt-get update \
&& apt-get install -y software-properties-common \
&& add-apt-repository -y ppa:ethereum/ethereum \
&& apt-get update \
&& apt-get --assume-yes install ethereum-unstable
CMD exec geth --networkid 15 --verbosity=4 --bootnodes "enode://`cat ./shared/bootnode_address.txt`@`echo $bootnodeIP`:30301" --rpc --rpcaddr "`echo $myIP`" --mine --minerthreads=1 --etherbase=0x7df9a875a174b3bc565e6424a0050ebc1b2d1d82