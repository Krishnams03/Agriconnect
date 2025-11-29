const PUBLIC_ROUTES = ["/", "/log-in", "/sign-up", "/forgot-password", "/reset-password"] as const;
const PUBLIC_PREFIXES = ["/_next", "/api", "/public", "/assets"] as const;

const stripQuery = (path?: string | null): string => {
  if (!path) return "/";
  const [cleanPath] = path.split("?");
  if (!cleanPath) return "/";
  return cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
};

export const normalizePath = (path?: string | null): string => {
  const normalized = stripQuery(path);
  if (normalized.length > 1 && normalized.endsWith("/")) {
    return normalized.slice(0, -1);
  }
  return normalized;
};

export const isRoutePublic = (path?: string | null): boolean => {
  const normalized = normalizePath(path);
  return (
    PUBLIC_ROUTES.some((route) => normalized === route || normalized.startsWith(`${route}/`)) ||
    PUBLIC_PREFIXES.some((prefix) => normalized.startsWith(prefix))
  );
};

export const shouldProtectRoute = (path?: string | null): boolean => !isRoutePublic(path);

export const buildRedirectParam = (path?: string | null, search?: string | null): string => {
  const normalized = normalizePath(path);
  if (search && search.length > 0) {
    return `${normalized}?${search}`;
  }
  return normalized;
};
