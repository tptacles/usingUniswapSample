# Sample Hardhat Project working with Uniswap

This project demonstrates a basic Hardhat use case that forks to a mainnet and impersonates an account. Working with Uniswap to exchange tokens. It comes with test cases

## Installation:

Needs to have [NodeJS](https://nodejs.org/en) installed:

Uses yarn rather than npx. [yarn](https://yarnpkg.com/getting-started/install) comes with Nodejs to enable:

Clone this depo and run
yarn

```shell
yarn hardhat help
yarn hardhat test
yarn hardhat test --network localhost
REPORT_GAS=true yarn hardhat test
yarn hardhat node
yarn hardhat run scripts/deploy.js
```

## Forking mainnet

To fork mainnet and create a localnode run

```shell
yarn fork_mainnet
```
