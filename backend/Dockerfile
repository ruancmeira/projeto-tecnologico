FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npx prisma generate

EXPOSE 3333

ENV DATABASE_URL="mysql://user_projeto_tcc:user123@mysql:3306/projeto_tcc"
ENV JWT_SECRET="FEmtDK8X15_p6IQP6GJA"
ENV JWT_EXPIRES_IN="30d"
ENV PORT=3333
ENV NODE_ENV="production"

CMD ["sh", "-c", "npm run db:setup && npm run start:dev"] 