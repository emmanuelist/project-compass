

# Add "Transaction Not Found" Toast on 404

## Overview
Show a specific, user-friendly toast when a transaction search returns a 404, instead of a generic error.

## Changes

### 1. `src/lib/api.ts` — Export a custom error class with status code
- Create a simple `ApiError` class that extends `Error` and includes the HTTP `status` code
- Throw `ApiError` instead of plain `Error` in the `request` function so callers can distinguish 404 from other errors

### 2. `src/pages/Index.tsx` — Handle 404 specifically in the graph query
- Add an `onError` callback via React Query's `meta` or use the `useEffect` + `error` pattern to detect when the graph query fails
- Check if the error is an `ApiError` with status 404
- Show a specific toast: title "Transaction Not Found", description "No transaction exists with that ID. Please check and try again."
- For other errors, show a generic "Failed to fetch transaction" toast

## Technical Details

**`ApiError` class (api.ts):**
```ts
export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}
```

**Error handling (Index.tsx):**
- Use a `useEffect` watching the query's `error` object
- Check `error instanceof ApiError && error.status === 404` for the specific toast
- Show generic error toast otherwise

**Files modified:**
- `src/lib/api.ts`
- `src/pages/Index.tsx`

