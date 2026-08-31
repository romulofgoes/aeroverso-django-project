from django.db import models
from django_quill.fields import QuillField

class Category(models.Model):
    tipo = models.CharField(max_length=50)
    descricao_meta = models.CharField(max_length=200)
    def __str__(self):
        return self.tipo


class Author(models.Model):
    nome = models.CharField(max_length=70) #https://webarchive.nationalarchives.gov.uk/ukgwa/+/http://www.cabinetoffice.gov.uk/media/254290/GDS%20Catalogue%20Vol%202.pdf
    profissao = models.CharField(max_length=50)

    def __str__(self):
        return self.nome

class Article(models.Model):
    class Meta:
        ordering = ['-data']  # artigos mais recentes primeiro, sempre
    autor = models.ForeignKey(Author, on_delete=models.PROTECT)
    titulo = models.CharField(max_length=60) # length definition based on: https://zyppy.com/title-tags/meta-title-tag-length/
    subtitulo = models.CharField(max_length=120) # also useful source for subheading and overall structure: https://espirian.co.uk/headline-subheading-meta/
    descricao_meta = models.CharField(max_length=160)
    conteudo = QuillField(default='')
    data = models.DateTimeField("date published")
    imagem_capa = models.ImageField(blank=True, null=True, upload_to='images/')
    categoria = models.ForeignKey(Category, on_delete=models.PROTECT)

    def __str__(self):
            return self.titulo

class ArticleImage(models.Model):
    artigo = models.ForeignKey(Article, on_delete=models.CASCADE)
    imagem = models.ImageField(upload_to='media/galeria/')