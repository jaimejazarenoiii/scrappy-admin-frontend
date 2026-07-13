# Design Overrides — Apple-like SaaS Admin

> Overrides MASTER.md for Scrappy Admin Console implementation.

## Intent

Human, sleek, Apple Human Interface–inspired admin console: quiet surfaces,
precise typography, soft depth, intentional motion. Dense but breathable.

## Typography (override)

- **UI / Headings**: Plus Jakarta Sans
- **Metrics / mono**: JetBrains Mono
- Import:
```css
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
```

## Color (override) — soft graphite + lucid blue

| Role | Hex | Notes |
|------|-----|-------|
| Background | `#F5F5F7` | Apple system gray |
| Surface | `#FFFFFF` | Cards / panels |
| Surface elevated | `rgba(255,255,255,0.72)` | Glass sidebar |
| Foreground | `#1D1D1F` | Near-black |
| Muted text | `#6E6E73` | Secondary |
| Border | `rgba(0,0,0,0.08)` | Hairline |
| Primary / CTA | `#0071E3` | Lucid Apple-like blue |
| Accent soft | `#E8F1FC` | Soft blue wash |
| Success | `#34C759` | |
| Warning | `#FF9F0A` | |
| Destructive | `#FF3B30` | |
| Dark bg | `#000000` | |
| Dark surface | `#1C1C1E` | |

## Atmosphere

Subtle radial gradient mesh behind content (cool blue + warm gray), never purple.
Hairline separators; soft shadow `0 8px 30px rgba(0,0,0,0.06)`.

## Motion

- Page enter: fade + 8px rise, 400ms spring
- Widget stagger: 40ms delay cascade
- Hover: 150–200ms opacity/transform, no layout shift
- Respect `prefers-reduced-motion`

## Density

Dashboard density 8/10 — compact tables, 12–16px card padding, clear hierarchy.
