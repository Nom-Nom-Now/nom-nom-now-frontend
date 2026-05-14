import { describe, it, expect } from 'vitest';
import router from '../router/index';

const routes = router.options.routes;
const findRoute = (path: string) => routes.find((route) => route.path === path);
const expectRoute = (path: string) => {
  const route = findRoute(path);
  expect(route, `Missing route: ${path}`).toBeDefined();
  return route!;
};
const expectChildRoute = (parentPath: string, childPath: string) => {
  const parent = expectRoute(parentPath);
  const child = parent.children?.find((route) => route.path === childPath);
  expect(child, `Missing child route: ${parentPath}/${childPath}`).toBeDefined();
  return child!;
};

describe('router', () => {
  it('should be defined', () => {
    expect(router).toBeDefined();
  });

  it('should have routes defined', () => {
    expect(routes).toBeDefined();
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);
  });

  it('should have required top-level routes', () => {
    const topLevelPaths = ['/', '/home', '/plan', '/recipes', '/browse'];
    for (const path of topLevelPaths) {
      expectRoute(path);
    }
  });

  it('should have a "/recipes" route with children', () => {
    const route = expectRoute('/recipes');
    expect(route.children).toBeDefined();
    expect(route.children!.length).toBeGreaterThan(0);
  });

  it('should have required "/recipes" child routes', () => {
    const childPaths = ['create', ':id/edit', 'oldcreate'];
    for (const childPath of childPaths) {
      expectChildRoute('/recipes', childPath);
    }
  });

  it('should have a "/browse" route with children', () => {
    const route = expectRoute('/browse');
    expect(route.children).toBeDefined();
  });

  it('should have "/browse/listall" child route', () => {
    expectChildRoute('/browse', 'listall');
  });

  it('should have exactly 5 top-level routes', () => {
    expect(routes).toHaveLength(5);
  });

  it('all top-level routes should have a meta.titleKey', () => {
    for (const route of routes) {
      expect(route.meta).toBeDefined();
      expect(route.meta!.titleKey).toBeDefined();
      expect(typeof route.meta!.titleKey).toBe('string');
    }
  });
});
