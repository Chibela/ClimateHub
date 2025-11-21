// pseudo-auth: create a random user id and persist in localStorage
export function ensureUserId() {
  let id = localStorage.getItem("climatehub_user_id");
  if (!id) {
    id = "u_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("climatehub_user_id", id);
  }
  return id;
}

export function getUserId() {
  return localStorage.getItem("climatehub_user_id") || ensureUserId();
}
