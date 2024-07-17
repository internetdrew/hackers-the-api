# Hackers, The Unofficial Movie API

An API based on the 1995 movie Hackers. Get information on characters, organizations, hacks, quotes, and more. Inspired by the continued maintenance of [Cyberdelia NYC](https://www.cyberdelianyc.com/) and [Hackers Curator](https://hackerscurator.com/) by fellow fans. **Hack the planet!**

![Image from Hackers movie](./server/public/assets/hackers.jpg)

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Installation](#installing)
- [How to Run API Route Tests](#how-to-run-api-route-tests)

## Introduction

Welcome to the unofficial API for the movie "Hackers". This project was created for the love of a fantastic movie. With that, I wanted to create something that reminded me of the internet in the 90s. I create this to contribute to the fandom around Hackers but also to learn some new skills like containerization and get better at testing software. I hope you enjoy taking a look around.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing

1. Create your directory, navigate to it, and clone the repo:

```sh
git clone https://github.com/internetdrew/hackers-the-api.git .
```

2. Create client and server .env files and fill in the credentials:

```sh
cp client/.env.example client/.env && cp server/.env.example server/.env
```

3. Spin up the client, server, and testing database:

```sh
docker compose up
```

### How to Run API Route Tests

- Navigate to the server directory and run testing (containers must be running for testing):

```sh
cd server && npm run test
```

Built with:

- [Astro](https://astro.build/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Prisma](https://www.prisma.io/)

Monitored with:

- [Morgan](https://github.com/expressjs/morgan)

Measured with:

- [Prometheus](https://www.npmjs.com/package/prom-client/v/11.5.3)

Tested with:

- [SuperTest](https://www.npmjs.com/package/supertest)
- [Vitest](https://vitest.dev/)
