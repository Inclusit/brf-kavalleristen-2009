// This file contains utility functions for validating user authorization and permissions.
export function requireRole(role: string, allowedRoles: string[]) {
  if (!allowedRoles.includes(role)) {
    throw new Error("Unauthorized access: Forbidden");
  }
}