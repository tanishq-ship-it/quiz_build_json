import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Globe, EyeOff, Eye } from "lucide-react";
import { getBlog, updateBlog, updateBlogPublished } from "../services/api";
import type { BlogDto } from "../services/api";
import type { Lesson } from "../types/blog";
import LessonRenderer from "../Components/LessonRenderer";

export default function BlogEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<BlogDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [jsonContent, setJsonContent] = useState("");
  const [readTime, setReadTime] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Preview
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await getBlog(id);
        setBlog(data);
        setTitle(data.title);
        setJsonContent(data.content ? JSON.stringify(data.content, null, 2) : "");
        setReadTime(data.readTime || "");
        setExcerpt(data.excerpt || "");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Blog not found");
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [id]);

  const handleSave = async () => {
    if (!id || !blog) return;
    if (!title.trim()) {
      setSaveError("Title is required");
      return;
    }

    let content = undefined;
    if (jsonContent.trim()) {
      try {
        const parsed = JSON.parse(jsonContent);
        if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
          setSaveError("JSON must contain a 'blocks' array");
          return;
        }
        content = parsed;
      } catch (e) {
        setSaveError("Invalid JSON: " + (e as Error).message);
        return;
      }
    }

    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const updated = await updateBlog(id, {
        title: title.trim(),
        content,
        readTime: readTime.trim() || undefined,
        excerpt: excerpt.trim() || undefined,
      });
      setBlog(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublished = async () => {
    if (!id || !blog) return;
    try {
      const updated = await updateBlogPublished(id, !blog.published);
      setBlog(updated);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update");
    }
  };

  const handlePreview = () => {
    if (!jsonContent.trim()) return;
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
        setSaveError("JSON must contain a 'blocks' array");
        return;
      }
      setPreviewLesson(parsed as Lesson);
      setSaveError(null);
    } catch (e) {
      setSaveError("Invalid JSON: " + (e as Error).message);
    }
  };

  // Preview mode
  if (previewLesson) {
    return (
      <LessonRenderer
        lesson={previewLesson}
        onBack={() => setPreviewLesson(null)}
      />
    );
  }

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
        <button onClick={() => navigate("/admin/blogs")} style={{ padding: "10px 24px", border: "none", borderRadius: "10px", background: "#6B5CA5", color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
          Back to blogs
        </button>
      </div>
    );
  }

  const uf = "'Inter', system-ui, sans-serif";

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", fontFamily: uf }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
      `}</style>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => navigate("/admin/blogs")} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex" }}>
              <ArrowLeft size={20} color="rgba(26,25,24,0.4)" />
            </button>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#1A1918", margin: 0, letterSpacing: "-0.02em" }}>Edit Blog</h1>
              <p style={{ fontSize: "12px", color: "rgba(26,25,24,0.35)", margin: "2px 0 0" }}>/blog/{blog.slug}</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handleTogglePublished}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "8px 16px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px",
                background: blog.published ? "rgba(220,50,50,0.05)" : "rgba(34,197,94,0.05)",
                color: blog.published ? "#DC3232" : "#16a34a",
                fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: uf,
              }}
            >
              {blog.published ? <><EyeOff size={14} /> Unpublish</> : <><Globe size={14} /> Publish</>}
            </button>
            <span
              style={{
                display: "flex", alignItems: "center",
                fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "6px",
                background: blog.published ? "rgba(34,197,94,0.1)" : "rgba(0,0,0,0.05)",
                color: blog.published ? "#16a34a" : "rgba(26,25,24,0.4)",
              }}
            >
              {blog.published ? "Live" : "Draft"}
            </span>
          </div>
        </div>

        {/* Title */}
        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(26,25,24,0.5)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Blog post title"
          style={{ width: "100%", padding: "12px 14px", fontSize: "16px", fontWeight: 600, border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", outline: "none", marginBottom: "20px", background: "#fff", fontFamily: uf }}
        />

        {/* Read Time + Excerpt row */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
          <div style={{ flex: "0 0 160px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(26,25,24,0.5)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Read Time</label>
            <input
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="e.g., 5 min"
              style={{ width: "100%", padding: "10px 14px", fontSize: "14px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", outline: "none", background: "#fff", fontFamily: uf }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(26,25,24,0.5)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Excerpt</label>
            <input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short description for the blog listing..."
              style={{ width: "100%", padding: "10px 14px", fontSize: "14px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", outline: "none", background: "#fff", fontFamily: uf }}
            />
          </div>
        </div>

        {/* JSON Content */}
        <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "rgba(26,25,24,0.5)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Lesson JSON</label>
        <textarea
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
          style={{
            width: "100%",
            height: "400px",
            padding: "16px",
            fontSize: "12px",
            fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
            lineHeight: "1.5",
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "12px",
            resize: "vertical",
            outline: "none",
            marginBottom: "20px",
          }}
          spellCheck={false}
        />

        {/* Errors / Success */}
        {saveError && (
          <div style={{ padding: "10px 14px", background: "rgba(220,50,50,0.08)", border: "1px solid rgba(220,50,50,0.15)", borderRadius: "10px", marginBottom: "16px", fontSize: "13px", color: "#DC3232" }}>
            {saveError}
          </div>
        )}
        {saveSuccess && (
          <div style={{ padding: "10px 14px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: "10px", marginBottom: "16px", fontSize: "13px", color: "#16a34a" }}>
            Saved successfully
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "center", padding: "14px", border: "none", borderRadius: "10px", background: "#6B5CA5", color: "#fff", fontSize: "14px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1, fontFamily: uf }}
          >
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={handlePreview}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 24px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "10px", background: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: uf, color: "#6B5CA5" }}
          >
            <Eye size={16} /> Preview
          </button>
        </div>
      </div>
    </div>
  );
}
