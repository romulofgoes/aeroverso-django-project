from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Article, ArticleUpdate


@receiver(post_save, sender=Article)
def create_article_update_record(sender, instance, created, **kwargs):
    """Auto-create ArticleUpdate record when article is modified (not on creation)."""
    if not created:
        ArticleUpdate.objects.create(artigo=instance)
