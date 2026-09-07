import api from "./axios.js";

// Uploads a file directly to Cloudinary from the browser using a signed request.
// The file bytes never touch our server. Returns the Cloudinary secure_url.
export async function uploadToCloudinary(file, { resourceType = "video" } = {}) {
  const { data: sig } = await api.get("/uploads/signature");

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", sig.apiKey);
  form.append("timestamp", sig.timestamp);
  form.append("signature", sig.signature);
  form.append("folder", sig.folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`,
    { method: "POST", body: form }
  );
  if (!res.ok) throw new Error("Upload to Cloudinary failed");
  const json = await res.json();
  return json.secure_url;
}
