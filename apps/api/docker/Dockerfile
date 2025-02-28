FROM node:22 AS base
# Install turbo-cli / prisma
RUN npm install turbo prisma --global
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies only when needed
FROM base AS deps
#? Copy the necessary files to install dependencies
COPY package.json ./
COPY package-lock.json ./
COPY turbo.json ./

COPY apps/api/package.json ./apps/api/package.json
COPY packages/database/main packages/database/main
COPY packages/api-routes packages/api-routes

# Install dependencies
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder

# Copy all files
COPY --from=deps /usr/src/app .
COPY apps/api apps/api

# Set Turbo build arguments if provided
ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM

ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

ARG TURBO_API
ENV TURBO_API=$TURBO_API

# Build the project
RUN turbo run build --filter=@cathub/api

# Production image, copy all the files and run the server
FROM base AS runner
ENV NODE_ENV=production

# Copy the necessary files to run the server
COPY --from=builder /usr/src/app .

# Set the working directory to the API app
WORKDIR /usr/src/app/apps/api

# Run database migrations and start the server
CMD prisma migrate deploy && npm run seed && npm start
