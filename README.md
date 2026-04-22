# Artelek 03 — Électricien & Domoticien Montluçon

Site vitrine premium pour Artelek 03, artisan électricien, domoticien, décorateur et dépanneur basé à Montluçon (03100, Allier).

## Stack

Site statique `HTML` + `CSS` + `JavaScript` vanilla — aucun build step, aucune dépendance runtime.

- **index.html** — Structure sémantique, schemas `Electrician` / `FAQPage` / `BreadcrumbList`
- **styles.css** — Palette luxe tech (ink `#0B1838` + or `#D4A853`), typographies Fraunces + Inter + Space Grotesk
- **script.js** — Canvas particules électriques, logo 3D interactif, highlights rotatifs, marquee avis, parallax, scroll progress
- **llms.txt** / **robots.txt** / **sitemap.xml** — Référencement classique + GEO (IA-ready)
- **manifest.webmanifest** — PWA

## Fonctionnalités signature

- **Logo 3D animé** en hero (rotation + tilt souris + électricité ambiante sur canvas)
- **Bandeau de chiffres-clés rotatif** (47 avis / 340 chantiers / 10 ans / 4 métiers)
- **Services en blocs éditoriaux alternés** avec parallax scroll (style hupr.ca)
- **Avis Google en marquee** défilant, pause au survol, drag-to-scroll
- **4 métiers** : Électricité générale · Domotique · Dépannage réactif · Conseil & agencement
- **Devis sous 24 h** avec formulaire validé + fallback tel/mail
- **SEO/GEO** : schemas, llms.txt, zone d'intervention détaillée (12 communes), FAQ avec réponses directes

## Développement local

```bash
npx serve -l 5174 .
# ou
python3 -m http.server 5174
```

Puis ouvrir [http://localhost:5174](http://localhost:5174).

## Déploiement Vercel

Push sur `main` → déploiement automatique. `vercel.json` configure les headers de sécurité + cache long sur les assets immutables.

---

© 2026 Artelek 03 — Contact : 06 22 42 79 20 · contact@artelek03.fr
