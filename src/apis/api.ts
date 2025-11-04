let PAYLOAD_BASE_URL = "";
let PAYLOAD_TOKEN = "";

export function setPayloadConfig({ baseUrl, token }) {
  if (baseUrl) PAYLOAD_BASE_URL = baseUrl.replace(/\/+$/, "");
  if (token) {
    PAYLOAD_TOKEN = token;
    localStorage.setItem("payload_token", token);
  }
}

export async function api(endpoint, method = "GET", data = null) {
  try {
    const base = PAYLOAD_BASE_URL || "";
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${base}/${endpoint.replace(/^\/+/, "")}`;

    const token = PAYLOAD_TOKEN || localStorage.getItem("payload_token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `JWT ${token}`;

    const options = { method, headers };
    if (data) options.body = JSON.stringify(data);

    const res = await fetch(url, options);
    const result = await res.json().catch(() => ({}));

    if (!res.ok)
      throw new Error(result.message || `Request failed: ${res.status}`);

    if (url.includes("/login") && result.token) {
      setPayloadConfig({ token: result.token });
    }

    return result;
  } catch (err) {
    console.error("API Error:", err.message);
    return { error: err.message };
  }
}