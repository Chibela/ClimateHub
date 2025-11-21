import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";
import { getUserId } from "../utils/auth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function PostCard({ post, showContent = false, onToggled }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.like_count ?? 0);

  useEffect(() => {
    setLikeCount(post.like_count ?? 0);
    // check if current user liked
    (async () => {
      const { data, error } = await supabase
        .from("post_likes")
        .select("*")
        .eq("post_id", post.id)
        .eq("user_id", getUserId())
        .limit(1);
      if (!error && data && data.length > 0) setLiked(true);
      else setLiked(false);
    })();
  }, [post]);

  async function toggleLike() {
    const userId = getUserId();
    if (!liked) {
      // insert like (if unique constraint prevents duplicates)
      const { error } = await supabase.from("post_likes").insert([{ post_id: post.id, user_id: userId }]);
      if (error) {
        // maybe duplicate; ignore
        console.error("like error", error);
      }
      setLiked(true);
      setLikeCount((c) => c + 1);
    } else {
      // remove like
      const { error } = await supabase.from("post_likes").delete().match({ post_id: post.id, user_id: userId });
      if (error) console.error("unlike error", error);
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
    }
    if (onToggled) onToggled(); // parent can refresh if needed
  }

  return (
    <article className="post-card">
      <div className="post-card-header">
        <div className="post-card-content">
          <Link to={`/post/${post.id}`} className="post-card-title">
            {post.title}
          </Link>
          <div className="post-card-meta">{dayjs(post.created_at).fromNow()} • {likeCount} ❤️</div>
          {post.flags && post.flags.length > 0 && <div className="post-card-flags">{post.flags.join(" • ")}</div>}
          {showContent && post.content && <p className="post-card-text">{post.content}</p>}
        </div>

        {post.image_url && showContent && (
          <img src={post.image_url} alt={post.title} className="post-card-image" />
        )}
      </div>

      <div className="post-card-footer">
        <button onClick={toggleLike} className="btn" style={{background: liked ? '#fecaca' : '#e5e7eb', color: '#1a2e2a'}}>
          {liked ? "❤️ Liked" : "🤍 Like"} ({likeCount})
        </button>
        <Link to={`/post/${post.id}`} className="post-card-footer-link">View</Link>
      </div>
    </article>
  );
}
