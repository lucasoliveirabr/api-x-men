## <a name="running-the-project">Running the project</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)

**Cloning the repository**

```bash
git clone https://github.com/lucasoliveirabr/api-x-men.git
cd api-x-men
```

**Download and install dependencies locally**

```bash
npm install
```

**Set up environment variables**

Change `.env.template` to `.env`

**Running the project**

Development mode:
```bash
npm run dev
```

Production mode:
- In `.env` set `NODE_ENV` to `"production"`, then:
```bash
npm run build && npm run start
```

Testing:
```bash
npm run test
```

- The API will be available for access at http://localhost:8080.
- See the API documentation at http://localhost:8080.