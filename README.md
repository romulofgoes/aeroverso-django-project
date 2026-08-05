# Aeroverso

**Portal de notícias, curiosidades e carreira no mundo da aviação.**

Um projeto fullstack construído do zero para explorar arquitetura de API REST, autenticação JWT, e integração entre backend e frontend desacoplados — com foco no público de aviação da América Latina.

> 🚧 Projeto em desenvolvimento ativo. Deploy em produção ainda não realizado (ver [Roadmap](#-roadmap--próximos-passos)).

---

## Sobre o projeto

O Aeroverso nasceu como um projeto de portfólio, mas foi construído com a seriedade de uma aplicação real: banco de dados PostgreSQL administrado manualmente (sem serviços gerenciados), autenticação JWT completa com renovação automática de token, testes automatizados e uma API REST desacoplada de um frontend em Next.js.

A proposta editorial é misturar três frentes: **notícias** do setor aéreo, **curiosidades** para o público geral apaixonado por aviação, e **conteúdo de carreira** para quem trabalha ou quer trabalhar na área.

---

## Funcionalidades

- Listagem de artigos com paginação e artigo em destaque na home
- Filtro de artigos por categoria e por autor
- Páginas de detalhe: artigo, categoria e autor, todas interligadas por navegação
- Autenticação via JWT (login, e renovação automática de token expirado, sem o usuário perceber)
- Área autenticada para criação e edição de artigos
- API REST com permissões diferenciadas (leitura pública, escrita autenticada)
- Suíte de testes automatizados cobrindo autenticação, permissões, filtros e CRUD

---

## Stack

**Backend**
| Tecnologia | Uso |
|---|---|
| Python + Django 6 | Framework principal |
| Django REST Framework | Construção da API |
| PostgreSQL | Banco de dados (administrado manualmente) |
| `djangorestframework-simplejwt` | Autenticação via JWT |
| `django-cors-headers` | Liberação de acesso ao frontend |
| `python-decouple` | Variáveis de ambiente |
| `APITestCase` + `time-machine` | Testes automatizados, incluindo simulação de expiração de token |

**Frontend**
| Tecnologia | Uso |
|---|---|
| Next.js (App Router) | Framework React com SSR |
| TypeScript | Tipagem estática |
| Tailwind CSS v4 | Estilização |

---

## Arquitetura

- **Backend e frontend desacoplados**, comunicando-se via API REST — permite hospedar, escalar e testar cada camada de forma independente.
- **Padrão de permissão pública/privada**: um `PublicReadViewSet` customizado libera leitura (`list`/`retrieve`) sem autenticação, mas exige JWT para escrita — com uma proteção global (`IsAuthenticated`) como rede de segurança contra endpoints futuros criados sem permissão explícita.
- **Camada de serviço no frontend** (`services/`) isolada de UI — cada entidade (artigo, autor, categoria, token) tem seu próprio service, sem misturar lógica de HTTP com componentes.
- **`apiClient` central**: toda chamada autenticada passa por um client HTTP único, responsável por detectar token expirado (401), renovar automaticamente via refresh token, e repetir a requisição original — de forma transparente para o resto da aplicação.

---

## Como rodar localmente

### Pré-requisitos
- Python 3.13+
- Node.js 20+
- PostgreSQL instalado e rodando localmente

### Backend

```bash
git clone https://github.com/romulofgoes/aeroverso-django-project.git
cd aeroverso-django-project/backend

python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

pip install -r requirements.txt

cp .env.example .env             # preencha com suas credenciais do Postgres
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd ../aeroverso   # ou o nome da pasta do frontend

npm install
cp .env.local.example .env.local   # preencha com a URL da API
npm run dev
```

O site fica disponível em `http://localhost:3000`, consumindo a API em `http://localhost:8000`.

---

## Rodando os testes

```bash
cd backend
python manage.py test
```

A suíte cobre: listagem pública, criação/edição autenticada e não-autenticada, filtros por categoria/autor, ordenação por data, e o ciclo completo de autenticação JWT (login, token expirado, renovação, refresh expirado).

---

## Variáveis de ambiente

**Backend** (`.env`)
```
SECRET_KEY=
DEBUG=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
```

**Frontend** (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Uso de IA no desenvolvimento

Este projeto foi desenvolvido com apoio ativo do Claude (Anthropic) ao longo de todo o processo — não só para gerar código, mas principalmente como ferramenta de aprendizado: explicação de conceitos de Django/DRF/Next.js, revisão de código e testes, debug de erros de integração (CORS, configuração de JWT, paths de mídia, tipagem TypeScript), e discussões de decisões de arquitetura.

Todas as decisões finais de arquitetura, modelagem de dados e lógica de negócio foram tomadas e revisadas por mim. Uma documentação mais granular do uso de IA (o que foi gerado vs. escrito manualmente, commit a commit) não foi mantida desde o início do projeto — é uma prática que pretendo adotar de forma mais estruturada em projetos futuros.

---

## Roadmap / Próximos passos

- [ ] Deploy em produção (Google Compute Engine, Docker, Nginx, HTTPS via Certbot)
- [ ] Domínio próprio (`aeroverso.com.br`)
- [ ] Screenshots e demo pública neste README
- [ ] Menu mobile (navbar responsiva)
- [ ] Slugs amigáveis para categorias e autores (atualmente roteados por ID)
- [ ] Cobertura de testes no frontend

---

## Licença

Distribuído sob a licença [MIT](https://opensource.org/license/mit/).

---

## Autor

**Rômulo Goes** — [@romulofgoes](https://github.com/romulofgoes)

*Projeto construído como parte de um processo de aprendizado fullstack, documentado também em uma [série de artigos no Medium.](https://medium.com/@romulo.fg99)*