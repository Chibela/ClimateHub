import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import LoadingSpinner from "../components/LoadingSpinner";
import PostCard from "../components/PostCard";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("created_at"); // or 'like_count'
  const [query, setQuery] = useState("");
  const [flagFilter, setFlagFilter] = useState("All");
  const [showContent, setShowContent] = useState(false);

  async function fetchPosts() {
    setLoading(true);
    if (!supabase) {
      setPosts([]);
      setLoading(false);
      return;
    }
    // use view if available
    let { data, error } = await supabase
      .from("posts") // we'll get like counts separately
      .select(`*, (
        select count(*) from post_likes pl where pl.post_id = posts.id
      ) as like_count`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setPosts([]);
      setLoading(false);
      return;
    }
    setPosts(data || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
    // Realtime subscription to posts and likes/comments -> re-fetch on changes
    const channel = supabase
      .channel("public:community")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, fetchPosts)
      .on("postgres_changes", { event: "*", schema: "public", table: "post_likes" }, fetchPosts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    let arr = posts.slice();
    if (query.trim()) {
      arr = arr.filter((p) => p.title.toLowerCase().includes(query.trim().toLowerCase()));
    }
    if (flagFilter !== "All") {
      arr = arr.filter((p) => Array.isArray(p.flags) && p.flags.includes(flagFilter));
    }
    if (sortBy === "like_count") {
      arr.sort((a, b) => (b.like_count || 0) - (a.like_count || 0));
    } else {
      arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return arr;
  }, [posts, query, sortBy, flagFilter]);

  return (
    <div className="community-container">
      <header className="community-header">
        <div className="community-header-info">
          <h1>Community Feed</h1>
          <p>See actions, tips, and stories.</p>
        </div>

        <div className="community-filters">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts by title..."
            className="input"
          />

          <select className="input" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="created_at">Newest</option>
            <option value="like_count">Most Loved</option>
          </select>

          <select className="input" value={flagFilter} onChange={e => setFlagFilter(e.target.value)}>
            <option>All</option>
            <option>Question</option>
            <option>Opinion</option>
            <option>Achievement</option>
            <option>Tip</option>
          </select>

          <label className="community-filter-checkbox-label">
            <input type="checkbox" checked={showContent} onChange={(e) => setShowContent(e.target.checked)} />
            Show content & image
          </label>
        </div>
      </header>

      <section>
        {loading ? (
          <LoadingSpinner size={48} />
        ) : filtered.length === 0 ? (
          <div className="community-empty">No posts yet — be the first to create one!</div>
        ) : (
          <div className="posts-grid">
            {filtered.map((p) => (
              <PostCard key={p.id} post={p} showContent={showContent} onToggled={fetchPosts} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
