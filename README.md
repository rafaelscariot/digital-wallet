## Digital Wallet Microservice

> A backend for a digital wallet where you can deposit and withdraw amounts, make and cancel purchases and receive chargebacks.

## Architecture

<img src="https://github.com/rafaelscariot/digital-wallet/blob/dev/docs/digital-wallet-architecture.png" />

## Installation

```bash
# project dependencies
$ yarn install

# containers
$ docker-compose up -d

# create database
$ yarn db:create
```

## Running the app

```bash
$ yarn start:dev
```

## Tests

```bash
$ yarn test

# to see more details
$ yarn test:cov
```

## Stay in touch

- Author - [Rafael Scariot](https://www.linkedin.com/in/rafaelscariot/)
