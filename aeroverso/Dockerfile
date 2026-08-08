# ===== ETAPA 1: build =====
# Instala dependências e gera o build de produção
FROM node:24-slim AS builder

WORKDIR /aeroverso/

# Copia só os manifestos de dependência primeiro, aproveitando
# cache de camada do Docker em rebuilds futuros
COPY package.json package-lock.json ./
RUN npm ci

# Agora copia o restante do código e builda de verdade
COPY . .
RUN npm run build

# ===== ETAPA 2: imagem final, enxuta =====
# Só carrega o necessário pra RODAR, não as ferramentas de build
FROM node:24-slim AS runner

WORKDIR /aeroverso/
ENV NODE_ENV=production

# Copia apenas o output "standalone" do Next.js (não o projeto inteiro) —
# requer output: 'standalone' configurado no next.config.js
COPY --from=builder /aeroverso/.next/standalone ./
COPY --from=builder /aeroverso/.next/static ./.next/static
COPY --from=builder /aeroverso/public ./public

EXPOSE 3000

CMD ["node", "server.js"]