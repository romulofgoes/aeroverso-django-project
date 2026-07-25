from rest_framework import viewsets, permissions
from .models import Article, Category, Author
from .serializers import *

class PublicReadViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        if(self.action in ['list', 'retrieve']):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
class ArticleViewSet(PublicReadViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


