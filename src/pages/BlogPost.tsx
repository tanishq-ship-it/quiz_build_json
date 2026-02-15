import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublishedBlogBySlug } from "../services/api";
import type { BlogDto } from "../services/api";
import LessonRenderer from "../Components/LessonRenderer";
import type { Lesson } from "../types/blog";
import Navigation from "./Landing/Navigation";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      try {
        const data = await getPublishedBlogBySlug(slug);
        setBlog(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Blog not found");
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [slug]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#FFFFFF", fontFamily: "'Inter', system-ui, sans-serif" }}>
        <p style={{ fontSize: "14px", color: "rgba(26,25,24,0.4)" }}>Loading...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", background: "#FFFFFF", fontFamily: "'Inter', system-ui, sans-serif", gap: "16px" }}>
        <p style={{ fontSize: "18px", fontWeight: 700, color: "#1A1918" }}>Blog not found</p>
        <button
          onClick={() => navigate("/blog")}
          style={{ padding: "10px 24px", border: "none", borderRadius: "10px", background: "#6B5CA5", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
        >
          Back to blogs
        </button>
      </div>
    );
  }

  const lesson: Lesson = blog.content as Lesson;

  return (
    <>
      <Navigation quizId={null} showHowItWorks={false} />
      <LessonRenderer
        lesson={lesson}
        onBack={() => navigate("/blog")}
        showNav={false}
      />
    </>
  );
}
