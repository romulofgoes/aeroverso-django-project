from django.shortcuts import get_object_or_404
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

    # Aceita tanto o slug (links públicos, ex: /articles/como-pousar-um-aviao) quanto o
    # id numérico (links/integrações antigas, ex: /articles/42) na mesma rota.
    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup = self.kwargs[self.lookup_url_kwarg or self.lookup_field]
        if lookup.isdigit():
            obj = get_object_or_404(queryset, pk=lookup)
        else:
            obj = get_object_or_404(queryset, slug=lookup)
        self.check_object_permissions(self.request, obj)
        return obj

class CategoryViewSet(PublicReadViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class AuthorViewSet(PublicReadViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


