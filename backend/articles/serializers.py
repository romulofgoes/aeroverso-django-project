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
    # FIX: categoria/autor were read_only nested serializers, so POST/PUT could
    # never write them (frontend sends just the id). Now writable via PK...
    categoria = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    autor = serializers.PrimaryKeyRelatedField(queryset=Author.objects.all())
    imagem_capa = serializers.ImageField(required=False)
    imagens = ArticleImageSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = "__all__"

    # FIX: ...while GET responses still return the full nested Category/Author
    # objects, since ArticleCard/CategoryLink/article detail page expect that shape.
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['categoria'] = CategorySerializer(instance.categoria).data
        representation['autor'] = AuthorSerializer(instance.autor).data
        return representation