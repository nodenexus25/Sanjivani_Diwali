/**
 * React 18 has no notion of `fetchPriority`, so it passes the camelCase prop
 * straight through to the DOM — where the browser ignores it, because the HTML
 * attribute is lowercase. React only leaves lowercase unknown attributes alone,
 * so the hero LCP image asks for the hint as `fetchpriority`.
 *
 * Augmenting the type keeps that spelling type-checked instead of casting.
 */
declare module 'react' {
  // The type parameter has to match React's declaration even though it is unused here.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ImgHTMLAttributes<T> {
    fetchpriority?: 'high' | 'low' | 'auto';
  }
}

export {};
