from rest_framework import viewsets, permissions
from .models import Article, Category, Author
from .serializers import *

class PublicReadViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if(self.action in ['list', 'retrieve']):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
class ArticleViewSet(PublicReadViewSet):
    serializer_class = ArticleSerializer
    def get_queryset(self):
        queryset = Article.objects.all()
        categoria_id = self.request.query_params.get('categoria')
        autor_id = self.request.query_params.get('autor')
        if categoria_id:
            queryset = queryset.filter(categoria_id=categoria_id)
        if autor_id:
            queryset = queryset.filter(autor_id=autor_id)
        return queryset

class CategoryViewSet(PublicReadViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class AuthorViewSet(PublicReadViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


