// Minimal auth functions for compatibility
export async function getUserFromCookie() {
  return {
    id: 1,
    name: "Guest User",
    email: "guest@example.com",
    role: "user" as const,
  }
}

export async function requireAuth() {
  return {
    id: 1,
    name: "Guest User",
    email: "guest@example.com",
    role: "user" as const,
  }
}

export async function requireAdmin() {
  return {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: "admin" as const,
  }
}
