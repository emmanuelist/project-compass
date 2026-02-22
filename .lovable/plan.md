

# Smooth Transitions & Loading Animations

## What Changes

Add polished animations across all state transitions: searching, loading graph data, selecting nodes, and panel content changes.

---

## 1. Custom Keyframes & Animation Classes (tailwind.config.ts + src/index.css)

Add new keyframes to `tailwind.config.ts`:
- `fade-in` — opacity 0 to 1 with slight upward slide
- `fade-out` — reverse of fade-in
- `pulse-glow` — a subtle pulsing glow for the loading spinner
- `shimmer` — a left-to-right shine effect for skeleton loaders
- `spin-slow` — a slower spin for the Bitcoin logo spinner

Add CSS utility classes in `index.css`:
- `.animate-fade-in`, `.animate-shimmer`, `.animate-spin-slow`
- Transition utilities for panel content swaps

## 2. Graph Loading State (TransactionGraph.tsx)

Replace the plain `Skeleton` rectangle with a branded loading animation:
- Centered Bitcoin icon with a slow spin animation
- "Loading graph..." text below with a fade-in
- Pulsing ring around the icon
- Wrap the entire graph area in a transition so the graph fades in when data arrives (using CSS opacity transition + a mounted state)

## 3. Search Button Spinner (Header.tsx)

- When `isSearching` is true, replace the `Search` icon with a spinning `Loader2` icon from lucide-react
- Add a subtle transition on the input border when searching (e.g., a glowing ring)

## 4. Transaction Details Panel Transitions (TransactionDetails.tsx)

- Wrap the panel content in a container with `animate-fade-in` class that re-triggers when `selectedTxid` changes (using a `key` prop tied to `selectedTxid`)
- Add staggered fade-in for the skeleton loaders (each skeleton slightly delayed)
- Smooth transition when switching between "no selection" placeholder and actual content

## 5. Label Editor Panel Transitions (LabelEditor.tsx)

- Same `key`-based fade-in when the selected txid changes
- Add a brief scale-in animation on the "Label saved" success state
- Smooth list transitions when labels appear/disappear

## 6. Connection Banner (ConnectionBanner.tsx)

- Slide down animation when the banner appears
- Slide up when it disappears
- Use a wrapper with `animate-fade-in` or a slide-down keyframe

---

## Technical Details

**Re-triggering animations on data change**: Use React's `key` prop set to the `selectedTxid` value. When the key changes, React unmounts and remounts the element, replaying the CSS animation.

**Graph fade-in approach**: Use a state variable (`isReady`) set after a short `requestAnimationFrame` delay once `graphData` is available. Apply `opacity-0 -> opacity-100` with a CSS `transition-opacity duration-300`.

**Files modified**:
- `tailwind.config.ts` — Add keyframes and animation utilities
- `src/index.css` — Add shimmer gradient and utility classes
- `src/components/TransactionGraph.tsx` — Branded spinner + graph fade-in
- `src/components/Header.tsx` — Loader spinner on search button
- `src/components/TransactionDetails.tsx` — Fade-in on txid change via `key` prop
- `src/components/LabelEditor.tsx` — Fade-in on txid change via `key` prop
- `src/components/ConnectionBanner.tsx` — Slide-down entrance animation

