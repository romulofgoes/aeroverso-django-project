import base64
import datetime
import time_machine
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from articles.models import Article, Author, Category
class ArticleAPITests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        username='testuser'
        password='senha123'
        cls.user = User.objects.create_user(username='testuser', password='senha123')
        credentials_str = f"{username}:{password}"
        
        # 2. Encode the string to base64 bytes, then decode to a string
        cls.encoded_credentials = base64.b64encode(credentials_str.encode()).decode()
        cls.token = RefreshToken.for_user(cls.user)
        cls.autor = Author.objects.create(
            nome='Beltrano de Tal',
            profissao='Piloto Comercial',
        )
        cls.categoria = Category.objects.create(
            tipo='Fatos Curiosos',
            descricao_meta='Fatos interessantes sobre aviação',
        )

        # Um segundo autor/categoria, úteis para testar os filtros ?autor= e ?categoria=
        cls.outro_autor = Author.objects.create(
            nome='Ciclana da Silva',
            profissao='Comissária de Bordo',
        )
        cls.outra_categoria = Category.objects.create(
            tipo='Carreira',
            descricao_meta='Dicas para quem quer trabalhar com aviação',
        )
            # Dois artigos com datas diferentes — úteis para testar o ordering = ['-data']
        cls.article_antigo = Article.objects.create(
            autor=cls.autor,
            titulo='Artigo mais antigo',
            subtitulo='Subtítulo do artigo mais antigo',
            descricao_meta='Descrição meta do artigo mais antigo',
            conteudo='Conteúdo de teste do artigo mais antigo.',
            data=datetime.datetime(2026, 1, 1, 10, 0),
            categoria=cls.categoria,
        )
        cls.article_recente = Article.objects.create(
            autor=cls.outro_autor,
            titulo='Artigo mais recente',
            subtitulo='Subtítulo do artigo mais recente',
            descricao_meta='Descrição meta do artigo mais recente',
            conteudo='Conteúdo de teste do artigo mais recente.',
            data=datetime.datetime(2026, 6, 1, 10, 0),
            categoria=cls.outra_categoria,
        )
        cls.article_mais_recente = Article.objects.create(
            autor=cls.outro_autor,
            titulo='Artigo mais recente ainda',
            subtitulo='Subtítulo do artigo mais recente ainda',
            descricao_meta='Descrição meta do artigo mais recente ainda',
            conteudo='Conteúdo de teste do artigo mais recente ainda.',
            data=datetime.datetime.now(),
            categoria=cls.categoria,
        )
        
    def setUp(self):
        # Roda antes de CADA teste — prepara dado de teste limpo
        self.category = Category.objects.create(tipo='Curiosidades', descricao_meta='...')
        self.author = Author.objects.create(nome='Fulano de Tal', profissao='Comissario')
        self.article = Article.objects.create(
            titulo='Artigo teste', subtitulo='...', descricao_meta='...',
            conteudo='...', data='2026-01-01T10:00:00Z',
            categoria=self.category, autor=self.author,
        )

    def test_list_articles_is_public(self):
        # Ninguém autenticado consegue LISTAR artigos (leitura é pública)
        response = self.client.get('/api/articles')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 4)

    def test_list_filter_articles_by_author(self):
        response = self.client.get(f'/api/articles?autor={self.outro_autor.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2) 
        for article in response.data['results']:
            self.assertEqual(article['autor']['id'], self.outro_autor.id)       

    def test_list_filter_articles_by_category(self):
        response = self.client.get(f'/api/articles?categoria={self.categoria.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2) 
        for article in response.data['results']:
            self.assertEqual(article['categoria']['id'], self.categoria.id) 

    def test_list_filter_articles_by_category_by_author(self):
        response = self.client.get(f'/api/articles?categoria={self.categoria.id}&autor={self.outro_autor.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1) 
        for article in response.data['results']:
            self.assertEqual(article['categoria']['id'], self.categoria.id) 
            self.assertEqual(article['autor']['id'], self.outro_autor.id)

    def test_create_article_requires_auth(self):
        # Tentar criar SEM token deve ser bloqueado
        response = self.client.post('/api/articles', {
            'titulo': 'Novo artigo', 'categoria': self.category.id, 'autor': self.author.id,
            # ... outros campos
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_article_with_auth_succeeds(self):
        # Login e pega o token
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/articles', {
            'titulo': 'Novo artigo', 'subtitulo': '...', 'descricao_meta': '...',
            'conteudo': '...', 'data': '2026-01-01T10:00:00Z',
            'categoria': self.category.id, 'autor': self.author.id,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_patch_article_with_auth_succeeds(self):
        titulo_novo = 'novíssimo título'
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f'/api/articles/{self.article_antigo.id}', {
            'titulo':titulo_novo
        },
        format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        #recarrega do banco o arquivo enviado
        self.article_antigo.refresh_from_db()
        self.assertEqual(self.article_antigo.titulo, titulo_novo)

        # e verifica-se também, por averiguação de um outro elemento, que o restante do artigo está intacto
        self.assertEqual(self.article_antigo.subtitulo, 'Subtítulo do artigo mais antigo')

    def test_patch_article_requires_auth(self):
        titulo_novo = 'novíssimo título'
        response = self.client.patch(f'/api/articles/{self.article_antigo.id}', {
            'titulo':titulo_novo
        },
        format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

      
    # OS TESTE SEGUINTES SÂO PARA TOKEN SIMPLE JWT:
    def test_create_article_with_jwt_access_token(self):
        token = self.token.access_token
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer  {token}")
        response = self.client.post('/api/articles', {
            'titulo': 'Novo artigo', 'subtitulo': '...', 'descricao_meta': '...',
            'conteudo': '...', 'data': '2026-01-01T10:00:00Z',
            'categoria': self.category.id, 'autor': self.author.id,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    def test_create_article_with_jwt_expired_access_token(self):
        future_date = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=16)
        token = self.token.access_token
        with time_machine.travel(future_date):
            self.client.credentials(HTTP_AUTHORIZATION=f"Bearer  {token}")
            response = self.client.post('/api/articles', {
                'titulo': 'Novo artigo', 'subtitulo': '...', 'descricao_meta': '...',
                'conteudo': '...', 'data': '2026-01-01T10:00:00Z',
                'categoria': self.category.id, 'autor': self.author.id,
            })
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_article_with_jwt_refreshed_access_token(self):
        future_date = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15)
        with time_machine.travel(future_date):
            self.client.credentials(HTTP_AUTHORIZATION=f"Basic {self.encoded_credentials}")
            response = self.client.post('/api/token/refresh/', {
                'refresh':str(self.token)
            })
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            refreshed_token = response.data['access']
            self.client.credentials(HTTP_AUTHORIZATION=f"Bearer  {refreshed_token}")
            response = self.client.post('/api/articles', {
                'titulo': 'Novo artigo', 'subtitulo': '...', 'descricao_meta': '...',
                'conteudo': '...', 'data': '2026-01-01T10:00:00Z',
                'categoria': self.category.id, 'autor': self.author.id,
            })
            self.assertEqual(response.status_code, status.HTTP_201_CREATED) 

    def test_create_article_with_jwt_expired_refresh_token(self):
        future_date = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=8)
        with time_machine.travel(future_date):
            response = self.client.post('/api/token/refresh/', {
                'refresh':str(self.token)
            })
            self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        