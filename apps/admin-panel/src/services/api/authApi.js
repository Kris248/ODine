import { httpRequest } from "../httpClient.js";

export function loginWithPassword(credentials) {
  return httpRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
}

export function createStaffMember(payload) {
  return httpRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
