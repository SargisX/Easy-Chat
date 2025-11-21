export function initTabSession() {
  if (!localStorage.getItem("sessionId")) {
    localStorage.setItem("sessionId", crypto.randomUUID());
  }
}

export function logoutEverywhere() {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  const bc = new BroadcastChannel("auth");
  bc.postMessage({ type: "logout" });
}
