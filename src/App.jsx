import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import Community from "./pages/Community";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import Flashcards from "./pages/Flashcards";
import Quiz from "./pages/Quiz";
import { ensureUserId } from "./utils/auth";

export default function App() {
  useEffect(() => {
    ensureUserId();
  }, []);

  return (
    <div className="app-container">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/community" element={<Community />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/flashcards" element={<Flashcards />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </main>
    </div>
  );
}
