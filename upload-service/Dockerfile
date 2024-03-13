# ! first stage
FROM node:20.11.1-bullseye-slim as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npm run generate

COPY . .

RUN npm run build

# ! second stage
FROM node:20.11.1-alpine3.19

WORKDIR /app

# Install Git
RUN apk add --no-cache git

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /app/dist ./dist

COPY prisma ./prisma

RUN npm run generate

EXPOSE 5000

CMD [ "npm", "start" ]