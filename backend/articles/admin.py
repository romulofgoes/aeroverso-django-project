from django.contrib import admin
from django.utils.html import format_html
from .models import *

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('tipo', 'descricao_meta')
    search_fields = ('tipo',)

@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'profissao')
    search_fields = ('nome',)

class ArticleUpdateInline(admin.TabularInline):
    model = ArticleUpdate
    extra = 0
    readonly_fields = ('data',)
    can_delete = False
    fields = ('data',)

@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    inlines = [ArticleUpdateInline]
    list_display = ('titulo', 'autor', 'categoria', 'data_publicacao_fmt', 'ultima_atualizacao_fmt')
    readonly_fields = ('data_publicacao', 'ultima_atualizacao_fmt')
    list_filter = ('categoria', 'data_publicacao', 'autor')
    search_fields = ('titulo', 'subtitulo')
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('titulo', 'subtitulo', 'autor', 'categoria')
        }),
        ('SEO', {
            'fields': ('descricao_meta',)
        }),
        ('Conteúdo', {
            'fields': ('conteudo', 'imagem_capa')
        }),
        ('Publicação', {
            'fields': ('data_publicacao', 'ultima_atualizacao_fmt'),
            'description': 'Data de primeira publicação é imutável e preenchida automaticamente. As atualizações são registradas automaticamente no histórico abaixo.'
        }),
    )

    def data_publicacao_fmt(self, obj):
        return obj.data_publicacao.strftime('%d/%m/%Y %H:%M')
    data_publicacao_fmt.short_description = 'Data de Publicação'

    def ultima_atualizacao_fmt(self, obj):
        return obj.ultima_atualizacao.strftime('%d/%m/%Y %H:%M')
    ultima_atualizacao_fmt.short_description = 'Última Atualização'

@admin.register(ArticleImage)
class ArticleImageAdmin(admin.ModelAdmin):
    list_display = ('artigo', 'imagem')
    list_filter = ('artigo',)
    search_fields = ('artigo__titulo',)

@admin.register(ArticleUpdate)
class ArticleUpdateAdmin(admin.ModelAdmin):
    list_display = ('artigo', 'data')
    readonly_fields = ('artigo', 'data')
    list_filter = ('artigo', 'data')
    can_delete = False

    def has_add_permission(self, request):
        return False