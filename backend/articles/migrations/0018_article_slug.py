from django.db import migrations, models
from django.utils.text import slugify


def populate_slugs(apps, schema_editor):
    Article = apps.get_model('articles', 'Article')
    for article in Article.objects.all().order_by('pk'):
        base_slug = slugify(article.titulo)[:80]
        slug = base_slug
        suffix = 1
        while Article.objects.filter(slug=slug).exclude(pk=article.pk).exists():
            suffix += 1
            slug = f"{base_slug}-{suffix}"
        article.slug = slug
        article.save(update_fields=['slug'])


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0017_article_data_publicacao_auto_now_add'),
    ]

    operations = [
        migrations.AddField(
            model_name='article',
            name='slug',
            field=models.SlugField(blank=True, db_index=False, default='', max_length=90),
        ),
        migrations.RunPython(populate_slugs, noop),
        migrations.AlterField(
            model_name='article',
            name='slug',
            field=models.SlugField(blank=True, default='', max_length=90, unique=True),
        ),
    ]
