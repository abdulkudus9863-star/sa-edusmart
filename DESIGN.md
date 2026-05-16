# SA EduSmart — Premium School Management Platform

## Tone & Purpose
Premium futuristic education platform. Combines modern tech aesthetics with professional institutional design. Builds trust through clarity while exciting users with glassmorphism and smooth motion.

## Color Palette
| Token | Light OKLCH | Dark OKLCH | Purpose |
| --- | --- | --- | --- |
| Primary | 0.45 0.2 142 | 0.65 0.2 142 | Green (#22c55e equivalent), education authority |
| Accent | 0.65 0.2 60 | 0.75 0.2 60 | Gold, premium CTAs and highlights |
| Secondary | 0.92 0.01 0 | 0.22 0.01 0 | Neutral greys, institutional |
| Destructive | 0.55 0.22 25 | 0.65 0.19 22 | Red, alerts and errors |
| Background | 0.98 0 0 | 0.1 0 0 | Near-white / near-black |
| Card | 0.99 0 0 | 0.14 0 0 | Glassmorphism surfaces |

## Typography
- **Display**: Space Grotesk (modern, geometric, tech-forward)
- **Body**: Inter (neutral, legible, professional)
- **Mono**: GeistMono (code, data)

## Shape Language
- Base radius: 12px (generous, approachable)
- Cards: 12px rounded with glassmorphism backdrop blur
- Buttons: 8px rounded, bold green or gold
- Elevation via backdrop blur + border (white/10–20%), not drop shadows

## Glassmorphism Strategy
- `.glass`: 5% white + 12px blur + subtle border (white/10%)
- `.glass-elevated`: 8% white + 20px blur + stronger border (white/20%)
- `.glass-card`: 6% white + 16px blur + medium border (white/15%)
- Dark mode: opacity shifts to 20% black, maintains visual separation

## Structural Zones
| Zone | Light | Dark | Rationale |
| --- | --- | --- | --- |
| Header/Nav | Green primary with white text | Green primary with white text | Authority, institution branding |
| Content | 0.98 bg, white cards (0.99) | 0.1 bg, dark cards (0.14) | Clean, card-based dashboard |
| Sidebar | White (0.99) with green accents | Dark card (0.14) with green accents | Navigation context |
| Footer | Muted secondary (0.88 light, 0.22 dark) | Muted secondary | Subtle grounding |
| Highlights/CTAs | Gold accent (0.65 light, 0.75 dark) | Gold accent | Premium signals |

## Motion & Animation
- Fade In: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- Slide Up: 300ms cubic-bezier(0.4, 0, 0.2, 1)
- Pulse Soft: 3s ease-in-out infinite (soft breathing for status indicators)
- Interaction: smooth 300ms transitions on all interactive elements
- Entrance: Stagger animations for dashboard sections (50ms offset per card)

## Component Patterns
- **Buttons**: Green primary (gradient-primary for emphasis), gold accent for secondary, white text
- **Cards**: Glassmorphism with backdrop blur, subtle border, 12px radius
- **Forms**: Transparent inputs with gold border focus, green primary ring
- **Badges**: Inline labels with accent color or muted background
- **Notifications**: Green for success, red for error, positioned sticky top-right
- **Data Viz**: Chart colors use primary/accent/secondary palette; no generic rainbow

## Constraints
- No raw hex colors — all token-based
- No drop shadows; elevation via glassmorphism blur + border
- No bouncy or playful animations; cubic-bezier only
- No arbitrary Tailwind colors; semantic tokens only
- Minimum text contrast AA+ in both light and dark modes

## Signature Detail
Glassmorphism as defining visual. Every interactive surface (cards, buttons, popovers) uses frosted glass aesthetic with intentional backdrop blur and semi-transparent white/black border. Paired with vivid green + gold palette, creates premium tech-forward education brand distinct from generic SaaS.

## Responsive Breakpoints
- Mobile-first: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Dashboard adapts: 1-col mobile → 2-col tablet → 3-4 col desktop
- Typography scales: base mobile, +2px tablet, +4px desktop
