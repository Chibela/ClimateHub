import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import LoadingSpinner from "../components/LoadingSpinner";
import { getUserId } from "../utils/auth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [commentSecret, setCommentSecret] = useState("");
  const [actionSecret, setActionSecret] = useState("");
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const navigate = useNavigate();

  async function fetchPost() {
    setLoading(true);
    if (!supabase) {
      setPost(null);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("posts")
      .select(`*, (
        select count(*) from post_likes pl where pl.post_id = posts.id
      ) as like_count`)
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setPost(null);
      setLoading(false);
      return;
    }

    setPost(data);
    setLikeCount(Number(data.like_count || 0));
    setEditTitle(data.title);
    setEditContent(data.content || "");
    setLoading(false);
  }

  async function fetchComments() {
    const { data } = await supabase.from("comments").select("*").eq("post_id", id).order("created_at", { ascending: true });
    setComments(data || []);
  }

  async function checkLiked() {
    const { data } = await supabase.from("post_likes").select("*").eq("post_id", id).eq("user_id", getUserId()).limit(1);
    setLiked(!!(data && data.length > 0));
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    fetchPost();
    fetchComments();
    checkLiked();

    const channel = supabase
      .channel("public:postpage")
      .on("postgres_changes", { event: "*", schema: "public", table: "post_likes" }, () => fetchPost())
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => fetchPost())
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => fetchComments())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [id]);

  async function toggleLike() {
    const userId = getUserId();
    if (!liked) {
      await supabase.from("post_likes").insert([{ post_id: id, user_id: userId }]);
      setLiked(true);
      setLikeCount(c => c + 1);
    } else {
      await supabase.from("post_likes").delete().match({ post_id: id, user_id: userId });
      setLiked(false);
      setLikeCount(c => Math.max(0, c - 1));
    }
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!commentText.trim() || !commentSecret.trim()) return alert("Comment text and secret required");
    const user_id = getUserId();
    const { error } = await supabase.from("comments").insert([{ post_id: id, content: commentText, user_id, secret_key: commentSecret }]);
    if (error) return alert("Error adding comment: " + error.message);
    setCommentText("");
    setCommentSecret("");
    fetchComments();
  }

  async function handleDeleteComment(c) {
    const s = prompt("Enter secret for this comment:");
    if (!s) return;
    if (s !== c.secret_key) return alert("Secret mismatch");
    await supabase.from("comments").delete().eq("id", c.id);
    fetchComments();
  }

  async function handleDeletePost() {
    if (!actionSecret) return alert("Enter secret to delete");
    if (!post) return;
    if (actionSecret !== post.secret_key) return alert("Secret mismatch — only author can delete");
    await supabase.from("posts").delete().eq("id", id);
    navigate("/community");
  }

  async function handleSaveEdit() {
    if (!actionSecret) return alert("Enter secret to edit");
    if (!post) return;
    if (actionSecret !== post.secret_key) return alert("Secret mismatch — only author can edit");
    await supabase.from("posts").update({ title: editTitle, content: editContent }).eq("id", id);
    setEditing(false);
    fetchPost();
  }

  return (
    <div>
      {loading || !post ? <LoadingSpinner size={40} /> : (
        <div className="post-page-container">
          {post.referenced_post && (
            <div className="post-page-referenced">Repost of: <Link className="text-green-600 underline" to={`/post/${post.referenced_post}`}>{post.referenced_post}</Link></div>
          )}

          <div className="post-page-header">
            <div>
              <h2 className="post-page-title">{post.title}</h2>
              <div className="post-page-meta">{dayjs(post.created_at).format("MMM D, YYYY h:mm A")} • {likeCount} ❤️</div>
              {post.flags && post.flags.length > 0 && (<div className="post-page-flags">{post.flags.join(" • ")}</div>)}
            </div>

            <div className="post-page-actions">
              <button onClick={toggleLike} className="btn" style={{background: liked ? '#fecaca' : '#e5e7eb', color: '#1a2e2a'}}>{liked ? "❤️ Liked" : "🤍 Like"}</button>
              <button onClick={() => setEditing(s => !s)} className="btn-edit">Edit</button>
            </div>
          </div>

          {post.image_url && <img src={post.image_url} alt={post.title} className="post-page-image" />}

          {!editing ? <p className="post-page-content">{post.content}</p> : (
            <div className="post-page-edit-form">
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
              <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={4} />
              <div className="post-page-edit-actions">
                <input value={actionSecret} onChange={e => setActionSecret(e.target.value)} placeholder="Post secret" className="post-page-add-comment-input" />
                <button onClick={handleSaveEdit} className="btn-save">Save</button>
              </div>
            </div>
          )}

          <div className="post-page-comments">
            <h3>Comments</h3>
            <div className="post-page-comments-list">
              {comments.length === 0 && <div className="post-page-comments-empty">No comments yet.</div>}
              {comments.map(c => (
                <div key={c.id} className="comment-item">
                  <div className="comment-item-meta">
                    <div>{c.user_id}</div>
                    <div>{dayjs(c.created_at).format("MMM D, YYYY h:mm A")}</div>
                  </div>
                  <div className="comment-item-text">{c.content}</div>
                  <div className="post-page-add-comment-actions">
                    <button onClick={() => handleDeleteComment(c)} className="comment-item-delete">Delete (secret)</button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="post-page-add-comment">
              <textarea value={commentText} onChange={e => setCommentText(e.target.value)} rows={3} placeholder="Add a supportive comment..."></textarea>
              <div className="post-page-add-comment-actions">
                <input value={commentSecret} onChange={e => setCommentSecret(e.target.value)} placeholder="Secret for this comment" className="post-page-add-comment-input" />
                <button className="btn-submit">Post Comment</button>
              </div>
            </form>
          </div>

          <div className="post-page-delete-actions">
            <input value={actionSecret} onChange={e => setActionSecret(e.target.value)} placeholder="Enter secret to delete post" className="post-page-delete-input" />
            <button onClick={handleDeletePost} className="btn-delete">Delete Post</button>
          </div>
        </div>
      )}
    </div>
  );
}