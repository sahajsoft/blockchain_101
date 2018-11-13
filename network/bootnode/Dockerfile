FROM ubuntu:xenial
RUN apt-get update \
&& apt-get install -y software-properties-common \
&& add-apt-repository -y ppa:ethereum/ethereum \
&& apt-get update \
&& apt-get --assume-yes install ethereum-unstable
RUN bootnode -genkey bootnode.key
CMD bootnode -nodekey bootnode.key -writeaddress > ./shared/bootnode_address.txt \
&& exec bootnode -nodekey bootnode.key