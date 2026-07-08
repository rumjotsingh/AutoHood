"use client";

import { useEffect, useState } from "react";

/**
 * False on the server and on the first client render so SSR HTML matches.
 * Becomes true after mount (when Zustand persist has typically rehydrated).
 * Prevents React hydration error #418 for auth/cart/wishlist UI.
 */
export function useHasHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
