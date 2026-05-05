import { describe, it, expect } from 'vitest';
import router from '../router/index';

describe('router', () => {
  it('should be defined', () => {
    expect(router).toBeDefined();
  });

  it('should have routes defined', () => {
    expect(router.options.routes).toBeDefined();
    expect(Array.isArray(router.options.routes)).toBe(true);
    expect(router.options.routes.length).toBeGreaterThan(0);
  });

  it('should have a root "/" route (Login)', () => {
    const route = router.options.routes.find((r) => r.path === '/');
    expect(route).toBeDefined();
  });

  it('should have a "/home" route', () => {
    const route = router.options.routes.find((r) => r.path === '/home');
    expect(route).toBeDefined();
  });

  it('should have a "/plan" route', () => {
    const route = router.options.routes.find((r) => r.path === '/plan');
    expect(route).toBeDefined();
  });

  it('should have a "/recipes" route with children', () => {
    const route = router.options.routes.find((r) => r.path === '/recipes');
    expect(route).toBeDefined();
    expect(route!.children).toBeDefined();
    expect(route!.children!.length).toBeGreaterThan(0);
  });

  it('should have "/recipes/create" child route', () => {
    const route = router.options.routes.find((r) => r.path === '/recipes');
    const child = route!.children!.find((c) => c.path === 'create');
    expect(child).toBeDefined();
  });

  it('should have "/recipes/:id/edit" child route', () => {
    const route = router.options.routes.find((r) => r.path === '/recipes');
    const child = route!.children!.find((c) => c.path === ':id/edit');
    expect(child).toBeDefined();
  });

  it('should have "/recipes/oldcreate" child route', () => {
    const route = router.options.routes.find((r) => r.path === '/recipes');
    const child = route!.children!.find((c) => c.path === 'oldcreate');
    expect(child).toBeDefined();
  });

  it('should have a "/browse" route with children', () => {
    const route = router.options.routes.find((r) => r.path === '/browse');
    expect(route).toBeDefined();
    expect(route!.children).toBeDefined();
  });

  it('should have "/browse/listall" child route', () => {
    const route = router.options.routes.find((r) => r.path === '/browse');
    const child = route!.children!.find((c) => c.path === 'listall');
    expect(child).toBeDefined();
  });

  it('should have exactly 5 top-level routes', () => {
    expect(router.options.routes).toHaveLength(5);
  });

  it('all top-level routes should have a meta.titleKey', () => {
    for (const route of router.options.routes) {
      expect(route.meta).toBeDefined();
      expect(route.meta!.titleKey).toBeDefined();
      expect(typeof route.meta!.titleKey).toBe('string');
    }
  });
});
