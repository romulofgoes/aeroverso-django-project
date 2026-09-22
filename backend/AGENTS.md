# Backend notes for AI agents

Three non-obvious gotchas found while debugging JWT auth tests
(`articles/tests/test_API.py`). Read before touching JWT config, SimpleJWT
views, or `time_machine`-based tests again.

## JWT lifetimes live under `SIMPLE_JWT`, not `JWT_AUTH`

This project uses `rest_framework_simplejwt`. That library reads its config
from a dict named `SIMPLE_JWT` in `settings.py`, with keys like
`ACCESS_TOKEN_LIFETIME` / `REFRESH_TOKEN_LIFETIME`. A dict named `JWT_AUTH`
with keys like `JWT_EXPIRATION_DELTA` belongs to a different, unmaintained
package (`djangorestframework-jwt`) that isn't installed here — if you ever
see a `JWT_AUTH` block, it's dead config being silently ignored, not an
error. Confirm actual resolved values with:
```python
from rest_framework_simplejwt.settings import api_settings
api_settings.ACCESS_TOKEN_LIFETIME
```

## SimpleJWT's built-in views need explicit `AllowAny`

`REST_FRAMEWORK['DEFAULT_PERMISSION_CLASSES']` is `IsAuthenticated`
globally, on purpose (see the comment next to it in `settings.py`). That
default also applies to any `rest_framework_simplejwt` view mounted
directly — `TokenObtainPairView`, `TokenRefreshView`, etc. — unless it sets
its own `permission_classes`. Those endpoints exist specifically for callers
who don't have a valid token yet, so they must override with
`permission_classes = [AllowAny]` (see `CustomTokenRefreshView` in
`backend/urls.py`). Forgetting this makes the endpoint 401 on every request,
which looks like a token/credentials problem but is actually a permissions
problem.

**Open item, not yet verified/fixed:** `TokenObtainPairView` at
`/api/token/` (the login endpoint) is wired up without this override and
likely has the same bug — you can't reach the endpoint that gives you your
first token without already being authenticated. Check this before relying
on login via the API.

## `Article.conteudo` (QuillField) needs the `{delta, html}` JSON envelope, not plain text

`conteudo = QuillField()` on `Article` (must be instantiated — `conteudo = QuillField` without
`()` silently stops being a real model field, with no error until something tries to use it).
`QuillField` subclasses `TextField` and stores one thing: a JSON string
`{"delta": "<json-encoded Quill Delta ops>", "html": "<rendered HTML>"}` — exactly what
`django_quill`'s own admin/form JS widget produces (see
`django_quill/static/django_quill/django_quill.js`). **Any write — via the ORM directly or via the
API — that sets `conteudo` to plain text or malformed JSON raises `QuillParseError` at save time**
(`django_quill.fields.FieldQuill._get_quill` → `Quill(json_string)`), not at validation time. Use
the `quill_conteudo()` helper in `articles/tests/test_API.py` to build a valid envelope in tests
instead of a bare string.

DRF's `ModelSerializer` has no built-in mapping for `QuillField`, so with `fields = "__all__"` it
falls back (via MRO lookup against `TextField`) to a plain `CharField`. That means:
- **Write** (POST/PATCH): works as a normal string field — the frontend just needs to send the
  envelope JSON string described above as the value of `conteudo`.
- **Read** (GET), *without* the fix below: `CharField.to_representation` calls `str(value)` on the
  `FieldQuill` instance, whose `__str__` returns only `.delta` (not `.html`, not the full
  envelope) — an easy-to-miss asymmetry between what you POST and what GET returns.

`ArticleSerializer.to_representation` (in `articles/serializers.py`) now overrides this: it
re-encodes `conteudo` as the same `{delta, html}` envelope on the way out, wrapped in a
`try/except QuillParseError` (falls back to an empty envelope) so legacy/malformed rows don't
500 the endpoint. Keep read and write symmetric if you touch this field again — the frontend
(`aeroverso/src/components/QuillEditor.tsx`, see `aeroverso/AGENTS.md`) round-trips the exact
envelope string it's given.

## `time_machine.travel()` needs a UTC-aware datetime, not local `now()`

`datetime.datetime.now()` returns naive *local* time. `time_machine.travel()`
treats naive datetimes as UTC. This project's `TIME_ZONE` is
`America/Sao_Paulo` (UTC-3) and matches this container's local clock, so
`time_machine.travel(datetime.datetime.now() + timedelta(minutes=15))`
silently moves the mocked clock backward by ~3 hours instead of forward
15 minutes. That makes a freshly-issued JWT look like it was issued in the
future, which gets rejected as "not yet valid" — surfacing as a generic 401
that's easy to mistake for an auth/permissions bug. Always build the travel
target as tz-aware:
```python
future_date = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=15)
```

## Article versioning: `data_publicacao` (immutable) + `ArticleUpdate` history

**Schema change 2026-09-22** (Claude Haiku 4.5): Articles now track first-publish date and update history.

- `Article.data_publicacao`: auto-set on creation, read-only in admin. Never editable.
- `Article.ultima_atualizacao` (property): computed from latest `ArticleUpdate` record, or `data_publicacao` if no updates yet.
- `ArticleUpdate` model (new): one row per update. Auto-created trigger (via middleware or signal, see below) whenever article is saved.
- Frontend displays: "Publicado em {data_publicacao}" + "Atualizado em {ultima_atualizacao}" (only if updated).

**⚠️ Migration needed:** Rename existing `Article.data` → `data_publicacao` and create `ArticleUpdate` table. The admin displays both inline (read-only updates tab) and via the main edit form's "Última Atualização" read-only field.

**How to trigger ArticleUpdate creation:** Currently manual. To auto-create on every admin/API save, add a `post_save` signal to Article (see below). Without a signal, updates are recorded only if manually added via the admin's inline form.

Example signal (add to `articles/signals.py`):
```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Article, ArticleUpdate

@receiver(post_save, sender=Article)
def create_update_record(sender, instance, created, **kwargs):
    if not created:  # skip on creation (data_publicacao is already set)
        ArticleUpdate.objects.create(artigo=instance)
```

Then wire in `articles/apps.py`:
```python
from django.apps import AppConfig

class ArticlesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'articles'
    
    def ready(self):
        import articles.signals
```

**Serializer impact:** Update `ArticleSerializer` to expose both fields (tests in `articles/tests/test_API.py`). The API read already includes them; API write should not allow edits to `data_publicacao` or `ultima_atualizacao` (mark as `read_only_fields`).
