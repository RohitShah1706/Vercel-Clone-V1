# ! first stage
FROM node:20.11.1-bullseye-slim as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# ! second stage
FROM node:20.11.1-alpine3.19

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD [ "npm", "start" ]