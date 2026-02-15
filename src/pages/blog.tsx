import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublishedBlogs } from "../services/api";
import type { BlogListItemDto } from "../services/api";
import Navigation from "./Landing/Navigation";

export default function BlogListing() {
  const [blogs, setBlogs] = useState<BlogListItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getPublishedBlogs();
        setBlogs(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load blogs");
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const uf = "'Inter', system-ui, sans-serif";
  const bf = "'Lora', Georgia, serif";

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: uf }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@400;500;600;640;700;800&display=swap');
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        .blog-card { text-decoration: none; color: inherit; display: block; transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .blog-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.06); }
      `}</style>

      <Navigation quizId={null} showHowItWorks={false} />

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "100px 24px 80px" }}>
        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <h1 style={{ fontSize: "42px", fontWeight: 800, color: "#1A1918", margin: "16px 0 0", letterSpacing: "-0.035em", lineHeight: 1.1, fontFamily: bf }}>
            Blog
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(26,25,24,0.45)", margin: "12px 0 0", lineHeight: 1.6 }}>
            Insights, lessons, and ideas
          </p>
        </div>

        {/* Loading */}
        {isLoading && (
          <p style={{ fontSize: "14px", color: "rgba(26,25,24,0.35)", textAlign: "center", padding: "60px 0" }}>Loading...</p>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding: "14px 18px", background: "rgba(220,50,50,0.06)", border: "1px solid rgba(220,50,50,0.12)", borderRadius: "12px", marginBottom: "24px", fontSize: "14px", color: "#DC3232" }}>
            {error}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && blogs.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "18px", color: "rgba(26,25,24,0.3)", fontFamily: bf, fontStyle: "italic" }}>No posts yet</p>
          </div>
        )}

        {/* Blog cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              to={`/blog/${blog.slug}`}
              className="blog-card"
            >
              <div
                style={{
                  padding: "28px 28px",
                  background: "#FFFFFF",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                  {blog.readTime && (
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(107,92,165,0.6)" }}>
                      {blog.readTime} read
                    </span>
                  )}
                  <span style={{ fontSize: "12px", color: "rgba(26,25,24,0.25)" }}>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1A1918", margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.25, fontFamily: bf }}>
                  {blog.title}
                </h2>

                {blog.excerpt && (
                  <p style={{ fontSize: "15px", color: "rgba(26,25,24,0.5)", margin: 0, lineHeight: 1.6 }}>
                    {blog.excerpt}
                  </p>
                )}

                <span style={{ display: "inline-block", marginTop: "14px", fontSize: "13px", fontWeight: 600, color: "#6B5CA5" }}>
                  Read more &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
