# Generated customized migration to preserve article dates

from django.db import migrations, models
import django.db.models.deletion
import django_quill.fields


def copy_data_to_data_publicacao(apps, schema_editor):
    """Copy existing 'data' values to 'data_publicacao' before dropping 'data'."""
    Article = apps.get_model('articles', 'Article')
    for article in Article.objects.all():
        if hasattr(article, 'data') and article.data:
            article.data_publicacao = article.data
            article.save(update_fields=['data_publicacao'])


def reverse_copy(apps, schema_editor):
    """Reverse: nothing to do, data_publicacao stays as is."""
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0014_article_conteudo'),
    ]

    operations = [
        # Add data_publicacao without auto_now_add first
        migrations.AddField(
            model_name='article',
            name='data_publicacao',
            field=models.DateTimeField(default='2020-01-01 00:00:00', verbose_name='data de primeira publicação'),
            preserve_default=False,
        ),
        # Copy data from old 'data' field to 'data_publicacao'
        migrations.RunPython(copy_data_to_data_publicacao, reverse_copy),
        # Remove old 'data' field
        migrations.RemoveField(
            model_name='article',
            name='data',
        ),
        # Create ArticleUpdate model
        migrations.CreateModel(
            name='ArticleUpdate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.DateTimeField(auto_now_add=True, verbose_name='data e hora da atualização')),
                ('artigo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='atualizacoes', to='articles.article')),
            ],
            options={
                'ordering': ['-data'],
            },
        ),
        # Update Article Meta options (ordering)
        migrations.AlterModelOptions(
            name='article',
            options={'ordering': ['-data_publicacao']},
        ),
    ]
