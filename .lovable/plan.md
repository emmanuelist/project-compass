

# Mobile Responsiveness — Stacking Panels on Small Screens

## Overview
Make the app fully usable on mobile by stacking the bottom panels vertically and adjusting the header layout for narrow screens.

## Changes

### 1. Index.tsx — Bottom Panels Stack Vertically
The bottom panels currently sit side-by-side (`flex` row). On mobile they should stack:
- Change the bottom panels container from `flex` (row) to `flex flex-col md:flex-row`
- Remove the right border on the Details panel on mobile (only apply `md:border-r`)
- Add a top border between stacked panels on mobile
- Give each panel a minimum height on mobile so they are usable (`min-h-[200px] md:min-h-0`)
- On mobile, give the graph area a fixed minimum height instead of flex-based sizing (`min-h-[250px]`)

### 2. Index.tsx — Overall Layout on Mobile
- Switch from flex-ratio layout to a scrollable column on mobile: wrap the main content area in `md:flex-1 md:flex md:flex-col md:min-h-0` while on mobile allow natural scrolling (`overflow-y-auto md:overflow-hidden`)
- Graph gets a fixed height on mobile (`h-[50vh] md:flex-[3]`), panels get auto height

### 3. Header.tsx — Better Mobile Layout
The header already hides text labels on small screens. Minor improvements:
- Wrap the header to allow the search bar to go full-width on very small screens: `flex flex-wrap` with the search section getting `w-full sm:w-auto sm:flex-1 order-last sm:order-none mt-2 sm:mt-0`
- This puts the search input below the logo and buttons on very narrow screens

## Technical Details

**Files modified:**
- `src/pages/Index.tsx` — Responsive flex direction, mobile scroll, graph fixed height
- `src/components/Header.tsx` — Wrap on mobile for search bar

No new dependencies needed. All changes use existing Tailwind responsive prefixes (`sm:`, `md:`).
