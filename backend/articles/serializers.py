from rest_framework import serializers
from .models import Category, Author, Article, ArticleImage

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"

class ArticleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleImage
        fields = '__all__'

class ArticleSerializer(serializers.ModelSerializer):
    categoria = CategorySerializer(read_only=True)
    autor = AuthorSerializer(read_only=True)
    imagens = ArticleImageSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = "__all__"