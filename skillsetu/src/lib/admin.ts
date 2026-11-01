// Admins are listed in ADMIN_EMAILS (comma-separated) in .env.

export function isAdminEmail(email?: string | null) {
  const list = (process.env.ADMIN_EMAILS ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  return !!email && list.includes(email.toLowerCase());
}
