# Base: python:3.13-slim ao invés de python:3.13.13 completo
# (imagem menor, sem pacotes desnecessários pra rodar Django)
FROM python:3.13-slim

# WORKDIR movido para o topo — no protótipo original estava no final do
# arquivo, o que fazia os comandos anteriores rodarem no diretório errado
WORKDIR /backend/

# Copia só o requirements.txt primeiro (separado do resto do código),
# para aproveitar cache de camada do Docker em rebuilds futuros:
# se só o código mudar, essa camada de instalação não precisa refazer
COPY requirements.txt .

# Adicionado: no protótipo original, requirements.txt era copiado mas
# nunca instalado — nada do projeto (Django, DRF, etc.) existiria na imagem
RUN pip install --no-cache-dir -r requirements.txt

# Adicionado: copia o restante do código do projeto — ausente no original
COPY . .

# Porta ajustada para 8000 (padrão Django/Gunicorn), não 8080 como no
# protótipo original, evitando confusão na configuração do Nginx depois
EXPOSE 8000

# Troca de "python manage.py runserver" por Gunicorn:
# 1) runserver é servidor de desenvolvimento, não deve rodar em produção
# 2) a sintaxe original CMD ["python manage.py runserver"] estava incorreta
#    de qualquer forma — em modo "exec", cada argumento precisa ser um
#    item separado da lista, não uma