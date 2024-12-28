import { lazy, ComponentType } from 'react';

export function lazyWithPreload<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
) {
  const Component = lazy(factory);
  // Add preload to Component type
  (Component as any).preload = factory;
  return Component as typeof Component & { preload: () => Promise<{ default: T }> };
}