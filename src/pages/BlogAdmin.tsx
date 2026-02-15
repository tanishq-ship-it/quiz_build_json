import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Eye, Trash2, Globe, EyeOff, ArrowLeft } from "lucide-react";
import { getBlogs, createBlog, updateBlogPublished, deleteBlogApi } from "../services/api";
import type { BlogDto } from "../services/api";
import type { Lesson } from "../types/blog";
import LessonRenderer from "../Components/LessonRenderer";

const sampleHint = `Paste your lesson JSON here...

{
  "title": "...",
  "readTime": "...",
  "blocks": [...],
  "keyInsight": {...},
  "nextLesson": {...}
}`;

export default function BlogAdmin() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<BlogDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create dialog
  const [showCreate, setShowCreate] = useState(false);
  const [newJson, setNewJson] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Preview
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

  const loadBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadBlogs();
  }, []);

  const handleCreate = async () => {
    if (!newJson.trim()) {
      setCreateError("Paste your lesson JSON");
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(newJson);
    } catch (e) {
      setCreateError("Invalid JSON: " + (e as Error).message);
      return;
    }

    if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
      setCreateError("JSON must contain a 'blocks' array");
      return;
    }

    if (!parsed.title || typeof parsed.title !== "string") {
      setCreateError("JSON must contain a 'title' field");
      return;
    }

    setCreating(true);
    setCreateError(null);

    try {
      await createBlog({
        title: parsed.title.trim(),
        content: parsed,
        readTime: parsed.readTime || undefined,
        excerpt: parsed.excerpt || undefined,
      });
      setShowCreate(false);
      setNewJson("");
      await loadBlogs();
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : "Failed to create blog");
    } finally {
      setCreating(false);
    }
  };

  const handleTogglePublished = async (blog: BlogDto) => {
    try {
      await updateBlogPublished(blog.id, !blog.published);
      await loadBlogs();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update");
    }
  };

  const handleDelete = async (blog: BlogDto) => {
    if (!confirm(`Delete "${blog.title}"? This cannot be undone.`)) return;
    try {
      await deleteBlogApi(blog.id);
      await loadBlogs();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  const handlePreviewJson = () => {
    if (!newJson.trim()) return;
    try {
      const parsed = JSON.parse(newJson);
      if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
        setCreateError("JSON must contain a 'blocks' array");
        return;
      }
      setPreviewLesson(parsed as Lesson);
      setCreateError(null);
    } catch (e) {
      setCreateError("Invalid JSON: " + (e as Error).message);
    }
  };

  // Show preview
  if (previewLesson) {
    return (
      <LessonRenderer
        lesson={previewLesson}
        onBack={() => setPreviewLesson(null)}
      />
    );
  }

  const uf = "'Inter', system-ui, sans-serif";

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: uf }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "8px" }}>
          <button onClick={() => navigate("/admin")} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex" }}>
            <ArrowLeft size={20} color="rgba(26,25,24,0.4)" />
          </button>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#1A1918", margin: 0, letterSpacing: "-0.03em" }}>Blog Management</h1>
        </div>
        <p style={{ fontSize: "14px", color: "rgba(26,25,24,0.45)", margin: "0 0 24px 40px" }}>Create, edit, and publish blog posts</p>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px", marginLeft: "40px" }}>
          <button
            onClick={() => setShowCreate(true)}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", border: "none", borderRadius: "10px", background: "#6B5CA5", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            <Plus size={16} /> New Blog
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: "12px 16px", background: "rgba(220,50,50,0.08)", border: "1px solid rgba(220,50,50,0.15)", borderRadius: "10px", marginBottom: "20px", fontSize: "13px", color: "#DC3232" }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <p style={{ fontSize: "14px", color: "rgba(26,25,24,0.4)", textAlign: "center", padding: "60px 0" }}>Loading blogs...</p>
        )}

        {/* Blog list */}
        {!isLoading && blogs.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: "16px", color: "rgba(26,25,24,0.35)", marginBottom: "8px" }}>No blogs yet</p>
            <p style={{ fontSize: "13px", color: "rgba(26,25,24,0.25)" }}>Create your first blog post to get started</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "60px" }}>
          {blogs.map((blog) => (
            <div
              key={blog.id}
              style={{
                padding: "20px 24px",
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.07)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1A1918", margin: 0, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {blog.title}
                  </h3>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "6px",
                      flexShrink: 0,
                      background: blog.published ? "rgba(34,197,94,0.1)" : "rgba(0,0,0,0.05)",
                      color: blog.published ? "#16a34a" : "rgba(26,25,24,0.4)",
                    }}
                  >
                    {blog.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "rgba(26,25,24,0.35)" }}>
                  <span>/blog/{blog.slug}</span>
                  {blog.readTime && <span>{blog.readTime} read</span>}
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                {blog.excerpt && (
                  <p style={{ fontSize: "13px", color: "rgba(26,25,24,0.5)", margin: "8px 0 0", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {blog.excerpt}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                {blog.content && (
                  <button
                    onClick={() => setPreviewLesson(blog.content as Lesson)}
                    title="Preview"
                    style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "8px", width: "34px", height: "34px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <Eye size={14} color="rgba(26,25,24,0.4)" />
                  </button>
                )}
                <button
                  onClick={() => navigate(`/admin/blogs/${blog.id}/edit`)}
                  title="Edit"
                  style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "8px", width: "34px", height: "34px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <Pencil size={14} color="rgba(26,25,24,0.4)" />
                </button>
                <button
                  onClick={() => handleTogglePublished(blog)}
                  title={blog.published ? "Unpublish" : "Publish"}
                  style={{ background: "rgba(0,0,0,0.03)", border: "1px solid rgba(0,0,0,0.07)", borderRadius: "8px", width: "34px", height: "34px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  {blog.published ? <EyeOff size={14} color="rgba(26,25,24,0.4)" /> : <Globe size={14} color="#6B5CA5" />}
                </button>
                <button
                  onClick={() => handleDelete(blog)}
                  title="Delete"
                  style={{ background: "rgba(220,50,50,0.05)", border: "1px solid rgba(220,50,50,0.1)", borderRadius: "8px", width: "34px", height: "34px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <Trash2 size={14} color="#DC3232" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Dialog Overlay */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
          <div style={{ width: "100%", maxWidth: "640px", maxHeight: "90vh", overflow: "auto", background: "#FFFFFF", borderRadius: "20px", padding: "32px", margin: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#1A1918", margin: 0, letterSpacing: "-0.02em" }}>New Blog Post</h2>
              <button onClick={() => { setShowCreate(false); setCreateError(null); }} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "rgba(26,25,24,0.3)", lineHeight: 1 }}>&times;</button>
            </div>

            <p style={{ fontSize: "13px", color: "rgba(26,25,24,0.4)", margin: "0 0 16px", lineHeight: 1.5 }}>
              Paste your lesson JSON below. The title, read time, and excerpt will be extracted automatically from the JSON.
            </p>

            {/* JSON Content */}
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(26,25,24,0.5)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Lesson JSON</label>
            <textarea
              value={newJson}
              onChange={(e) => setNewJson(e.target.value)}
              placeholder={sampleHint}
              style={{
                width: "100%",
                height: "360px",
                padding: "14px",
                fontSize: "12px",
                fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
                lineHeight: "1.5",
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: "10px",
                resize: "vertical",
                outline: "none",
                marginBottom: "16px",
              }}
              spellCheck={false}
            />

            {/* Error */}
            {createError && (
              <div style={{ padding: "10px 14px", background: "rgba(220,50,50,0.08)", border: "1px solid rgba(220,50,50,0.15)", borderRadius: "10px", marginBottom: "16px", fontSize: "13px", color: "#DC3232" }}>
                {createError}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleCreate}
                disabled={creating}
                style={{ flex: 1, padding: "13px", border: "none", borderRadius: "10px", background: "#6B5CA5", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: creating ? "not-allowed" : "pointer", opacity: creating ? 0.6 : 1, fontFamily: uf }}
              >
                {creating ? "Creating..." : "Create Blog"}
              </button>
              <button
                onClick={handlePreviewJson}
                style={{ padding: "13px 20px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", background: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: uf, color: "#6B5CA5" }}
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
