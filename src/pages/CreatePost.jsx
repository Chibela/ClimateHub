import React, { useState } from "react";
import { supabase, STORAGE_BUCKET } from "../lib/supabaseClient";
import { getUserId } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [flags, setFlags] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [secret, setSecret] = useState("");
  const [referencedId, setReferencedId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function toggleFlag(flag) {
    setFlags(flags === flag ? "" : flag);
  }

  async function uploadImage(file) {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const path = `${fileName}`;
    const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) return alert("Title required");
    if (!secret.trim()) return alert("Please set a secret key (used to edit/delete)");

    setLoading(true);

    try {
      const user_id = getUserId() || `anonymous_${Date.now()}`;

      // Upload image if file exists
      let image_url = imageUrlInput?.trim() || null;
      if (imageFile) {
        image_url = await uploadImage(imageFile);
      }

      // Prepare row to insert
      const row = {
        title,
        content: content?.trim() || null,
        image_url,
        flags: flags ? [flags] : [],
        user_id,
        secret_key: secret,
        referenced_post: referencedId?.trim() || null,
      };

      console.log("Inserting row:", row);

      const { data, error } = await supabase.from("posts").insert([row]).select().single();
      if (error) throw error;

      navigate(`/post/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Error creating post: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="create-post-container">
      <h2 className="create-post-title">Create Post</h2>
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-group">
          <label>Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="I recycled 10 plastic bottles today..." required />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows="4" placeholder="Add details..."></textarea>
        </div>

        <div className="form-group">
          <label>Image (external URL)</label>
          <input value={imageUrlInput} onChange={e => setImageUrlInput(e.target.value)} placeholder="https://..." />
          <div className="form-group-small-text">Or upload an image file below</div>
        </div>

        <div className="form-group">
          <label>Upload image file</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
        </div>

        <div className="form-group">
          <label>Flags</label>
          <div className="form-group-flags">
            {["Question", "Opinion", "Achievement", "Tip"].map(f => (
              <button type="button" key={f} onClick={() => toggleFlag(f)} className={`form-flag-btn ${flags === f ? "selected" : ""}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Reference post ID (repost)</label>
          <input value={referencedId} onChange={e => setReferencedId(e.target.value)} placeholder="Optional: id of the post you want to reference" />
        </div>

        <div className="form-group">
          <label>Secret Key * (used to edit/delete)</label>
          <input value={secret} onChange={e => setSecret(e.target.value)} placeholder="Pick a secret only you know" required />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Posting..." : "Create Post"}
          </button>
          <button type="button" onClick={() => { setTitle(""); setContent(""); setImageFile(null); setImageUrlInput(""); setFlags(""); setSecret(""); setReferencedId(""); }} className="btn-reset">Reset</button>
        </div>

        {loading && <LoadingSpinner size={36} />}
      </form>
    </div>
  );
}
