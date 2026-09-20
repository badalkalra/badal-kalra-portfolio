# Editorial Transition System — Badal Kalra

This build uses an original transition system inspired by the supplied portfolio references.

## Included

- Layered three-panel page curtain on initial load and internal case-study navigation
- Large `BK` mark in the transition center
- Staggered hero text reveals
- Image reveal / scale entrance
- Scroll-triggered section reveals
- Large editorial heading clip reveals
- Project card spotlight, lift and image choreography
- Magnetic buttons and cursor expansion on interactive elements
- Smooth internal anchor scrolling with a focus pulse
- Case-study entrance choreography
- CSS View Transitions API support for same-origin navigation-capable browsers
- `prefers-reduced-motion` support

## Integration

Main files:

- `index.html`
- `styles.css`
- `script.js`

The existing portfolio content, LinkedIn credential links and supplied portrait are preserved.

## Transition concept

The page transition uses three stacked panels:

1. Deep black base panel
2. Deep blue angled panel
3. Electric-blue angled panel

On navigation, the panels cover the current page in sequence; on arrival, they retract in reverse order. This creates an editorial “page turn” effect rather than a standard fade.

## Notes

The visual language is intentionally original rather than a direct reproduction of the referenced portfolios.

## Latest update — Recognition + Contact Motion
- Four recognition items with supplied evidence images are treated as featured cards.
- Additional recognitions without supplied images are kept in a smaller linked row.
- Featured recognition cards use staggered 3D reveal, pointer tilt, spotlight tracking and a sweep effect.
- Section navigation now adds a brief focus pulse.
- Contact typography is constrained so the complete “Let's connect.” heading remains visible at all desktop/mobile widths.
