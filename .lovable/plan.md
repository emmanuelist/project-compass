

# Framer Motion Animations Integration

## Overview
Add `framer-motion` for physics-based, interruptible animations across the app -- replacing CSS-only `animate-fade-in` / `animate-scale-in` with smoother, spring-driven transitions that feel more alive. This covers page-level mounts, panel content swaps, graph overlay entrance/exit, breadcrumb pill additions, FAB expansion, onboarding steps, toast feedback, and connection banner slide-in/out.

## What Changes

### 1. Install framer-motion
Add `framer-motion` as a dependency (the only new package).

### 2. Shared animation variants helper
**New file: `src/lib/motion.ts`**

A small file exporting reusable variant objects and transition presets so every component uses consistent spring physics:
- `fadeInUp` -- fade + translateY for content sections
- `scaleIn` -- scale from 0.95 with opacity
- `slideDown` -- for banners sliding in from top
- `staggerContainer` -- parent variant that staggers children
- `springTransition` -- shared spring config (stiffness: 300, damping: 24)

### 3. Page-level entrance (`src/pages/Index.tsx`)
Wrap the root `<div>` content in `<motion.div>` with `fadeInUp` on initial mount. The graph panel, details panel, and label editor each get `<AnimatePresence>` wrappers so content transitions (empty state to loaded, node selection changes) animate smoothly with crossfade.

### 4. Connection Banner (`src/components/ConnectionBanner.tsx`)
Wrap in `<motion.div>` with `slideDown` entry and slide-up exit via `<AnimatePresence>`. When dismissed, it slides up and fades out instead of instantly vanishing.

### 5. Graph Breadcrumb pills (`src/components/GraphBreadcrumb.tsx`)
Each breadcrumb pill becomes a `<motion.button>` using `layoutId` for smooth position transitions when the trail changes. New pills animate in with `scaleIn`; the entire bar uses `<AnimatePresence>` so it slides away when the trail is empty.

### 6. Transaction Details content swap (`src/components/TransactionDetails.tsx`)
Wrap the entire return in `<AnimatePresence mode="wait">` keyed on `selectedTxid`. When the selected transaction changes, the old content fades out and the new content fades in with a subtle Y-shift -- giving the feeling of "flipping" between transaction cards. The 2x2 metric cards use staggered children (each card animates in 50ms apart).

### 7. Label Editor (`src/components/LabelEditor.tsx`)
- The label list items use `<AnimatePresence>` + `<motion.div layout>` so adding/removing labels animates (new ones scale in, deleted ones scale out and collapse)
- The editing border highlight animates via `motion.div`'s `animate` prop on `borderColor`/`backgroundColor` instead of a CSS class toggle

### 8. Floating Action Button (`src/components/FloatingActions.tsx`)
Replace CSS `animate-scale-in` with framer-motion `<motion.div>` using spring-based scale + opacity. The sub-buttons fan out with staggered spring animations (more organic than CSS delays). The main FAB rotates its icon 45 degrees on open.

### 9. Onboarding Overlay (`src/components/OnboardingOverlay.tsx`)
- The backdrop fades in with `motion.div`
- Each step card staggers in with `scaleIn` variant (replacing CSS `animationDelay`)
- The "Got it" button pulses subtly with a spring scale on hover
- On dismiss, the entire overlay fades out before unmounting (via `AnimatePresence`)

### 10. Graph panel overlays (`src/components/TransactionGraph.tsx`)
- The node hover tooltip uses `<motion.div>` with `scaleIn` + `AnimatePresence` for smooth entry/exit (currently pops in/out)
- The node/edge count badge and zoom controls fade in when graph loads
- The loading spinner and empty state crossfade with `AnimatePresence mode="wait"`

### 11. Status Bar copy pill (`src/components/StatusBar.tsx`)
The "Copied!" pill uses `<motion.span>` with spring scale + opacity entry, and a smooth fade-out exit via `AnimatePresence`.

### 12. Header demo badge (`src/components/Header.tsx`)
The "DEMO" badge uses `<AnimatePresence>` + `<motion.div layoutId="demo-badge">` so it smoothly appears/disappears when toggling demo mode.

### 13. Graph Legend (`src/components/GraphLegend.tsx`)
Animate the legend card entrance with a slide-in from the left + fade when the graph first loads.

## Technical Details

**New dependency:** `framer-motion` (latest)

**New file:** `src/lib/motion.ts` -- shared variants and transitions

**Modified files (12):**
- `src/pages/Index.tsx` -- motion.div wrapper, AnimatePresence for panels
- `src/components/ConnectionBanner.tsx` -- motion.div with slideDown/exit
- `src/components/GraphBreadcrumb.tsx` -- motion.button with layoutId, AnimatePresence
- `src/components/TransactionDetails.tsx` -- AnimatePresence keyed swap, staggered cards
- `src/components/LabelEditor.tsx` -- AnimatePresence for label list, motion layout
- `src/components/FloatingActions.tsx` -- spring-based FAB expansion
- `src/components/OnboardingOverlay.tsx` -- staggered steps, exit animation
- `src/components/TransactionGraph.tsx` -- tooltip AnimatePresence, overlay fade-ins
- `src/components/StatusBar.tsx` -- copy pill AnimatePresence
- `src/components/Header.tsx` -- demo badge AnimatePresence
- `src/components/GraphLegend.tsx` -- slide-in entrance

**Scope:** Animation-only changes. No data flow, API, or business logic modifications. All existing CSS animations remain as fallbacks; framer-motion layers on top for the interactive/transition cases where CSS alone falls short (mount/unmount, layout shifts, spring physics, gesture-driven).
