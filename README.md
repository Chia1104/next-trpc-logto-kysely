# NextJS T3

This is a template for a NextJS project with Typescript, TailwindCSS and tRPC.

> **Note**
>
> The template still in development, some features may not work as expected.

## ✨ Features

- 📦 Build with [NextJS](https://nextjs.org/) app router
- 🛂 Authentication with [Logto](https://logto.io/)
- 🌐 Using [tRPC](https://trpc.io/) for E2E type-safe communication between client and server
- 🗃️ Using [Kysely](https://kysely.dev/) for type-safe database queries
- 🎨 Using [NextUI](https://nextui.org/) for UI components and built on top of Tailwind CSS

## 🚀 Getting Started

### 1. Logto

First you need to create a Logto service and set the environment variables in `.env` file.

And create a database, Logto will store user identity data in a PostgreSQL database.

In order for the Logto service to run properly, we need to create a database named `logto` in the PostgreSQL database first.

You can follow the documentation [here](https://zeabur.com/docs/marketplace/logto).

| Variable              | Description                      |
| --------------------- | -------------------------------- |
| `LOGTO_ENDPOINT`      | The domain of your logto service |
| `LOGTO_APP_ID`        | Logto client ID                  |
| `LOGTO_APP_SECRET`    | Logto app secret                 |
| `LOGTO_COOKIE_SECRET` | Logto cookie secret              |

### 2. Database

Use the `DATABASE_URL` environment variable to connect to the database.

### 3. Start the project

```bash
pnpm install
pnpm dev
```

## 🌐 Deploy

### 1. Zeabur

You can deploy the project to [Zeabur](https://zeabur.com/) with one click.

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates/TCH9AR?referralCode=Chia1104)