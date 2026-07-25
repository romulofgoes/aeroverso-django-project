from rest_framework.routers import DefaultRouter
from django.urls import path, include
from articles.views import *

app_name = "articles"

router = DefaultRouter(trailing_slash=False)
router.register(r"articles", ArticleViewSet)
router.register(r"categories", CategoryViewSet)
router.register(r"authors", AuthorViewSet)

urlpatterns = [
    path("", include(router.urls)),
]