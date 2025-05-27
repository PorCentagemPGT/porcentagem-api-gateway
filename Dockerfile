# Etapa 1: Build da aplicação
FROM node:18-alpine AS builder

WORKDIR /app

# Copia apenas os arquivos necessários para instalar as dependências e gerar o Prisma Client
COPY package*.json ./

RUN npm ci


# Copia o restante do código e compila a aplicação
COPY . .

RUN npm run build

# Etapa 2: Container final de produção
FROM node:18-alpine

WORKDIR /app

# Copia os artefatos da build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Prisma Client gerado e dependências já estão prontos
# (não precisa rodar npm install novamente)

EXPOSE 8080

CMD ["node", "dist/main"]
