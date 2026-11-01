## Agent skills

### Issue tracker

Issues live in GitHub Issues (PerspicaciousGuy/my-portfolio), via the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Portfolio updates

Issues labelled `portfolio-update` are notes from other projects about content to add to the site (title
`<type>: <subject>`, type is project | case-study | post | skill | timeline | now | about | stats). They are
separate from the triage labels above. When asked to process them:

1. List them: `gh issue list --label portfolio-update --state open --json number,title,body`.
2. Apply each one where the content lives: projects, skills, timeline, `now`, hero status, about text and
   stats in `src/data/site.ts`; case studies in `src/content/work/<slug>.mdx`; posts in
   `src/content/posts/<slug>.mdx`; a project's card art is its `art` field (scenes in `src/lib/scene-art.ts`).
   Content goes in data and MDX, not in components.
3. Never invent facts. If an issue says "unknown", or a number, link or date is missing, ask me before
   writing it. Match the tone of the existing copy and keep the `now` card to current items only.
4. Run `npx tsc --noEmit`, `npm run lint` and `npm run build`. Update `HANDOFF.md` if structure changed.
5. Commit with a clear message, with no AI author, co-author or trailer lines. Comment on each issue with
   the commit and close it. Do not open a pull request unless asked.
