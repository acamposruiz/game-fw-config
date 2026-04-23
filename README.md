# game-fw-config

Remote config para juegos del framework. Los JSON
de este repo se sirven via **jsDelivr CDN** y los
clientes los consumen en caliente (kill-switch,
batching, allow/block lists, etc.) sin necesidad
de redeploy.

> Renombrar este archivo a `README.md` una vez que
> lo copies al repo nuevo (el scaffold lo trae como
> `REPO-README.md` para no pisar el README del
> scaffold cuando vives en este monorepo).

## Layout

```
game-fw-config/
├── v1/
│   └── snake-classic/
│       ├── prod.json   # produccion (100% devices)
│       ├── beta.json   # opt-in via env var
│       └── dev.json    # solo dev builds
├── schemas/
│   └── snake-classic.schema.json
├── scripts/
│   └── validate.mjs
├── .github/workflows/
│   └── publish.yml
└── package.json
```

## URL publica (jsDelivr)

```
https://cdn.jsdelivr.net/gh/<user>/game-fw-config@main/v1/snake-classic/prod.json
```

Con tag inmutable:

```
https://cdn.jsdelivr.net/gh/<user>/game-fw-config@v1.0.0/v1/snake-classic/prod.json
```

## Publicar un cambio

1. Abrir PR modificando el JSON correspondiente.
2. CI valida contra `schemas/snake-classic.schema.json`.
3. Review + merge a `main`.
4. El workflow purga la cache de jsDelivr de los
   archivos modificados en ~60s.

## Kill-switch de emergencia

```json
{
  "schemaVersion": 1,
  "analytics": { "posthog": { "enabled": false } }
}
```

Commitea a `main` y espera al purge (o ejecuta
`curl "https://purge.jsdelivr.net/gh/<user>/game-fw-config@main/v1/snake-classic/prod.json"`).

## Relacion con el juego

- Cliente generico:
  `src/modules/remote-config/` (en el repo del
  framework).
- Consumidor: `src/games/snake-classic/core/analytics/`.
- Guia de setup y operacion:
  `docs/platform/remote-config-setup-github.md`
  (repo framework).
- Referencia de campos:
  `docs/analytics/remote-config-proposal.md`
  (repo framework).

## Validar localmente

```bash
npm install
npm run validate
```
