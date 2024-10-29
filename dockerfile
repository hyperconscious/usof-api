FROM node:18-alpine
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm i
COPY . .
RUN npm run build
CMD ["sh", "-c",  "npm run db:migrate && npm run start"]