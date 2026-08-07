# CLAUDE.md — Tu Tesis RD

## Memoria compartida

**Lee `AGENTS.md` antes de empezar.** Es la memoria compartida entre Codex y Claude: reparto de roles, propiedad de archivos, contrato de medición y bitácora de coordinación. Codex trabaja en el mismo repositorio a la vez.

**Tu rol (Claude): publicidad y medición.** Tracking, conversiones, GA4/GTM/Meta/Google Ads, SEO técnico y captación de leads. El diseño y la maquetación son de Codex — no rediseñes.

**Al terminar un bloque de trabajo, añade una línea a la bitácora de `AGENTS.md` §6.**

Dos reglas que no se negocian:
- El repositorio de GitHub es **público**. No versiones `audit-tu-tesis-rd/`, `ads-tu-tesis-rd/` ni credenciales.
- Los CTA de WhatsApp deben seguir siendo `<a href="...wa.me...">`. De eso depende toda la medición de conversiones (`AGENTS.md` §3).

## Conexión Google Ads y Robot de Servicio
- Clave de Cuenta de Servicio: `C:\Users\miang\.gemini\config\tutesisrd\google-credentials.json` (fuera del repo).
- Robot invitado en Google Ads (`CID 686-939-3137`): `tutesisrd-ai-agent@fit-crow-492714-h5.iam.gserviceaccount.com` (nivel Estándar).
- Proyecto Google Cloud: `fit-crow-492714-h5` (Proyecto `1052695851846`) con Google Ads API habilitada.
- Informe completo de Trends y arquitectura: `ads-tu-tesis-rd/08_informe_trends_y_conexion_mcp.md`.

---

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
