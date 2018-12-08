# blockchain_101
Beginner level course for blockchain

### Prerequisites

Install docker on your machine

### Run

To build and run the private blockchain network:

```
cd network
docker-compose up
``` 

To deploy the dapp and run the api server:

```
cd dapp
docker build -t dapp
docker run --network="network_privatechainnet" -p 3001:3001 dapp
``` 

To access the network monitor:

```
http://localhost:3000/
```