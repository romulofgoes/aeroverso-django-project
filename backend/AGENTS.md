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
