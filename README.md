# Hackers, The Unofficial Movie API

An API based on the 1995 movie Hackers. Get information on characters, organizations, hacks, quotes, and more. Inspired by the continued maintenance of [Cyberdelia NYC](https://www.cyberdelianyc.com/) by fellow fans. **Hack the planet!**

![Image from Hackers movie](./server/public/assets/hackers.jpg)

## Table of Contents

- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installing)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18+)
- npm

### Installing

1. Clone the repository:

```sh
git clone https://github.com/internetdrew/hackers-the-api.git
```

2. Navigate to the directory:

```sh
cd hackers-the-api/
```

3. Create client and server .env files:

```sh
cp client/.env.example client/.env && cp server/.env.example server/.env
```

4. Add environmental variables (what you need is in their respective .env.example files)

5. Run the containerized app:

```sh
docker compose up
```

### Testing the API

- Navigate to the server directory and run testing (containers must be running for testing):

```sh
cd server/ && npm run test
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
