---
theme: default
transition: fade
title: Clickjacking — Comprendre & Se Protéger
class: text-center
---

# Clickjacking  
### Comprendre l’attaque. Maîtriser la défense.

---

# Plan
- Définition & intuition
- Mécanique de l’attaque
- Variantes
- Cibles & impacts
- Détection
- Protections modernes
- Pièges fréquents
- Cas réels
- Checklist finale

---

# Définition
## Clickjacking = Détournement de clic
- L’utilisateur croit cliquer sur A → clique en réalité sur B  
- Interface superposée / masquée  
- Pas besoin d’infecter la victime

---

# Intuition visuelle
- Page légitime visible  
- Iframe invisible au-dessus  
- Un clic = action sensible sur un autre site

---

# Mécanique technique
- **iframe** d’un domaine tiers  
- CSS : opacity, z-index, pointer-events  
- Piège : l’utilisateur interagit sans le savoir  
- ≠ phishing (pas d’imitation), ≠ XSS (pas d’injection)

---

# Variantes importantes
## UI Redressing
- Chevauchement interactif

## Likejacking
- Détournement de boutons sociaux

## Cursorjacking
- Curseur visuel déplacé vs curseur réel

## File Upload Hijacking
- Overlay sur champs “Choisir un fichier”

---

# Cibles fréquentes
- Changement d’email/mot de passe  
- Transfert d’argent  
- Suppression de compte  
- Consentement OAuth forcé  
- Actions admin internes

---

# Impacts
- Prise de contrôle compte  
- Fraude financière  
- Escalade de privilèges  
- Brèche RGPD (action non-intentionnelle)

---

# Détection
## Côté frontend
- iframes suspectes  
- overlays invisibles

## Côté backend
- Patterns anormaux :  
  - actions critiques déclenchées en 1 clic  
  - absence de navigation logique préalable

---

# Défenses (1) — Basique
## X-Frame-Options
- DENY / SAMEORIGIN / ALLOW-FROM  
- Simple mais limité  
- Déprécié au profit de CSP

---

# Défenses (2) — Standard moderne
## CSP frame-ancestors
- Protection robuste  
- Allowlist précise  
- Recommandé aujourd’hui

```http
Content-Security-Policy: frame-ancestors 'self';