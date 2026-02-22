
# Collapsible Panels on Mobile

## Overview
On mobile, wrap the Transaction Details and Label Editor panels in accordion-style collapsible sections so users can expand/collapse each independently. On desktop, panels remain side-by-side as they are now.

## Changes

### Index.tsx
- Import `useIsMobile` hook and the `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` components (already in the project)
- On mobile (`useIsMobile()`), wrap each panel in a `Collapsible` with:
  - A trigger bar showing the section title ("Transaction Details" / "Label Editor") with a chevron icon
  - Content that collapses/expands with animation
  - "Transaction Details" defaults to open, "Label Editor" defaults to collapsed
  - Remove the fixed `min-h-[200px]` on mobile since collapsed panels should take minimal space
- On desktop, render panels exactly as they are now (no collapsible wrapper)

### TransactionDetails.tsx + LabelEditor.tsx
- No changes needed -- the `h3` title inside each component stays as-is; the collapsible trigger in Index.tsx will have its own label so there's no duplication issue. Alternatively, we can hide the internal `h3` on mobile to avoid showing the title twice. We'll hide it on mobile with `hidden md:block`.

## Technical Details

**Files modified:**
- `src/pages/Index.tsx` -- Add mobile collapsible wrappers around each panel
- `src/components/TransactionDetails.tsx` -- Hide `h3` on mobile (`hidden md:block`)
- `src/components/LabelEditor.tsx` -- Hide `h3` on mobile (`hidden md:block`)

**Approach:** Use the existing `Collapsible` component from Radix UI (already installed). On mobile, each panel gets a styled trigger bar with the section name and a chevron that rotates on open. The content area animates open/closed. On desktop, the collapsible wrapper is bypassed entirely, keeping the current layout unchanged.
