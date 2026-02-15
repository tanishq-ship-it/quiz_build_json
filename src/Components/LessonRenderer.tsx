import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import type { Lesson, LessonBlock } from "../types/blog";

interface ColorTheme {
  bg: string; ink: string; body: string; muted: string; accent: string; divider: string;
  navBg: string; progressTrack: string; btnBg: string; btnBorder: string;
  audioBg: string; audioBorder: string; contrastDivider: string;
  bullet: string; numColor: string; quoteAttr: string; dialog: string;
  boxBg: string; boxBorder: string; boxLabel: string; boxText: string;
  kiBg: string; kiBorder: string; kiLabel: string; kiName: string; kiDef: string;
  kiDivider: string; kiTakeaway: string;
  nextBg: string; nextBorder: string; nextLabel: string; nextTitle: string;
  nextHook: string; nextBtnBg: string; nextBtnText: string;
}

type Breakpoint = "mobile" | "tablet" | "desktop";

function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() => {
    if (typeof window === "undefined") return "desktop";
    const w = window.innerWidth;
    if (w < 640) return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  });

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      if (w < 640) setBp("mobile");
      else if (w < 1024) setBp("tablet");
      else setBp("desktop");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return bp;
}

function parseInline(
  text: string,
  inkColor: string,
  dialogColor: string,
  boldWeight: number
): ReactNode[] | null {
  if (!text) return null;
  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/);

    let firstMatch: RegExpMatchArray | null = null;
    let matchType: "bold" | "italic" | null = null;

    if (boldMatch && italicMatch) {
      if ((boldMatch.index ?? 0) <= (italicMatch.index ?? 0)) {
        firstMatch = boldMatch;
        matchType = "bold";
      } else {
        firstMatch = italicMatch;
        matchType = "italic";
      }
    } else if (boldMatch) {
      firstMatch = boldMatch;
      matchType = "bold";
    } else if (italicMatch) {
      firstMatch = italicMatch;
      matchType = "italic";
    }

    if (!firstMatch) {
      parts.push(<span key={key++}>{remaining}</span>);
      break;
    }

    const matchIndex = firstMatch.index ?? 0;

    if (matchIndex > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, matchIndex)}</span>);
    }

    if (matchType === "bold") {
      parts.push(
        <strong key={key++} style={{ color: inkColor, fontWeight: boldWeight }}>
          {firstMatch[1]}
        </strong>
      );
    } else {
      parts.push(
        <em key={key++} style={{ color: dialogColor }}>
          {firstMatch[1]}
        </em>
      );
    }

    remaining = remaining.slice(matchIndex + firstMatch[0].length);
  }

  return parts;
}

interface LessonRendererProps {
  lesson: Lesson;
  onBack?: () => void;
  showNav?: boolean;
}

export default function LessonRenderer({ lesson, onBack, showNav = true }: LessonRendererProps) {
  const [dark, setDark] = useState<boolean>(false);
  const [serif, setSerif] = useState<boolean>(true);
  const [large, setLarge] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [navVis, setNavVis] = useState<boolean>(true);
  const [playing, setPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScroll = useRef<number>(0);
  const bp = useBreakpoint();

  const onScroll = useCallback((): void => {
    const el = scrollRef.current;
    if (!el) return;
    const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
    setProgress(Math.min(pct, 100));
    const dir = el.scrollTop > lastScroll.current ? "down" : "up";
    if (dir === "down" && el.scrollTop > 120) setNavVis(false);
    if (dir === "up") setNavVis(true);
    lastScroll.current = el.scrollTop;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll, lesson]);

  // Audio playback
  const toggleAudio = useCallback(() => {
    if (!lesson.audioUrl) return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(lesson.audioUrl);
        audioRef.current.addEventListener("ended", () => setPlaying(false));
      }
      audioRef.current.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  }, [playing, lesson.audioUrl]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // ── Responsive layout values ──
  const layout = {
    mobile: {
      maxWidth: "100%",
      contentPad: "0 20px",
      navPad: "10px 16px",
      titleFs: serif ? "28px" : "30px",
      titleFsLg: serif ? "32px" : "34px",
    },
    tablet: {
      maxWidth: "680px",
      contentPad: "0 36px",
      navPad: "12px 24px",
      titleFs: serif ? "32px" : "34px",
      titleFsLg: serif ? "36px" : "38px",
    },
    desktop: {
      maxWidth: "720px",
      contentPad: "0 48px",
      navPad: "14px 32px",
      titleFs: serif ? "36px" : "38px",
      titleFsLg: serif ? "40px" : "42px",
    },
  }[bp];

  const sizeScale = { mobile: 0, tablet: 1.5, desktop: 2.5 }[bp];

  const bf = serif ? "'Lora', Georgia, serif" : "'Inter', system-ui, sans-serif";
  const uf = "'Inter', system-ui, sans-serif";

  const baseFs = (serif ? 17 : 16.5) + sizeScale;
  const fs = large ? `${baseFs + 2}px` : `${baseFs}px`;
  const lh = large ? (serif ? "1.92" : "1.88") : (serif ? "1.88" : "1.82");

  const baseH2 = (serif ? 21 : 20) + sizeScale;
  const h2Fs = large ? `${baseH2 + 2}px` : `${baseH2}px`;

  const baseHook = (serif ? 19.5 : 19) + sizeScale;
  const hookFs = large ? `${baseHook + 2.5}px` : `${baseHook}px`;

  const basePull = (serif ? 19 : 18) + sizeScale;
  const pullFs = large ? `${basePull + 2}px` : `${basePull}px`;

  const baseBox = (serif ? 15 : 14.5) + sizeScale;
  const boxFs = large ? `${baseBox + 1}px` : `${baseBox}px`;

  const bw = serif ? 600 : 650;

  // ── Colors ──
  const c: ColorTheme = dark
    ? {
        bg: "#111110", ink: "#E8E6E1", body: "rgba(232,230,225,0.72)", muted: "rgba(232,230,225,0.26)",
        accent: "#A69BDA", divider: "rgba(255,255,255,0.05)",
        navBg: "rgba(17,17,16,0.92)", progressTrack: "rgba(255,255,255,0.04)",
        btnBg: "rgba(255,255,255,0.05)", btnBorder: "rgba(255,255,255,0.08)",
        audioBg: "rgba(255,255,255,0.04)", audioBorder: "rgba(255,255,255,0.06)",
        contrastDivider: "rgba(255,255,255,0.06)",
        bullet: "rgba(166,155,218,0.35)", numColor: "rgba(166,155,218,0.5)",
        quoteAttr: "rgba(166,155,218,0.5)", dialog: "#E8E6E1",
        boxBg: "rgba(166,155,218,0.12)", boxBorder: "rgba(166,155,218,0.22)",
        boxLabel: "rgba(166,155,218,0.75)", boxText: "rgba(232,230,225,0.78)",
        kiBg: "linear-gradient(160deg, #1F1D2E, #181720)", kiBorder: "rgba(166,155,218,0.15)",
        kiLabel: "rgba(166,155,218,0.5)", kiName: "#E8E6E1", kiDef: "rgba(232,230,225,0.45)",
        kiDivider: "rgba(255,255,255,0.06)", kiTakeaway: "rgba(232,230,225,0.75)",
        nextBg: "linear-gradient(160deg, rgba(166,155,218,0.08), rgba(166,155,218,0.03))",
        nextBorder: "rgba(166,155,218,0.12)", nextLabel: "rgba(166,155,218,0.45)",
        nextTitle: "#E8E6E1", nextHook: "rgba(232,230,225,0.50)",
        nextBtnBg: "#A69BDA", nextBtnText: "#111110",
      }
    : {
        bg: "#FFFFFF", ink: "#1A1918", body: "rgba(26,25,24,0.72)", muted: "rgba(26,25,24,0.28)",
        accent: "#6B5CA5", divider: "rgba(0,0,0,0.07)",
        navBg: "rgba(255,255,255,0.92)", progressTrack: "rgba(0,0,0,0.05)",
        btnBg: "rgba(0,0,0,0.03)", btnBorder: "rgba(0,0,0,0.07)",
        audioBg: "rgba(0,0,0,0.025)", audioBorder: "rgba(0,0,0,0.07)",
        contrastDivider: "rgba(0,0,0,0.09)",
        bullet: "rgba(107,92,165,0.35)", numColor: "rgba(107,92,165,0.45)",
        quoteAttr: "rgba(107,92,165,0.55)", dialog: "#1A1918",
        boxBg: "rgba(107,92,165,0.08)", boxBorder: "rgba(107,92,165,0.18)",
        boxLabel: "rgba(107,92,165,0.70)", boxText: "rgba(26,25,24,0.72)",
        kiBg: "#1A1918", kiBorder: "transparent",
        kiLabel: "rgba(255,255,255,0.35)", kiName: "#FAF9F6", kiDef: "rgba(255,255,255,0.50)",
        kiDivider: "rgba(255,255,255,0.08)", kiTakeaway: "rgba(255,255,255,0.82)",
        nextBg: "linear-gradient(160deg, rgba(107,92,165,0.06), rgba(107,92,165,0.02))",
        nextBorder: "rgba(107,92,165,0.12)", nextLabel: "rgba(107,92,165,0.50)",
        nextTitle: "#1A1918", nextHook: "rgba(26,25,24,0.45)",
        nextBtnBg: "#6B5CA5", nextBtnText: "#FFFFFF",
      };

  const P = (text: string): ReactNode[] | null => parseInline(text, c.ink, c.dialog, bw);

  const statFs = bp === "desktop" ? (large ? "68px" : "62px") : bp === "tablet" ? (large ? "64px" : "58px") : (large ? "60px" : "54px");
  const kiNameFs = bp === "desktop" ? (large ? "28px" : "26px") : bp === "tablet" ? (large ? "26px" : "24px") : (large ? "24px" : "22px");

  const renderBlock = (block: LessonBlock, i: number) => {
    switch (block.type) {
      case "hook":
        return (
          <p key={i} style={{ fontSize: hookFs, lineHeight: "1.55", color: c.ink, fontFamily: bf, fontWeight: serif ? 500 : 560, margin: "0 0 14px 0" }}>
            {block.text}
          </p>
        );

      case "hook_sub":
        return (
          <p key={i} style={{ fontSize: fs, lineHeight: lh, color: c.body, fontFamily: bf, margin: "0 0 40px 0" }}>
            {block.text}
          </p>
        );

      case "divider":
        return <div key={i} style={{ width: "24px", height: "1.5px", background: c.accent, marginBottom: "48px", borderRadius: "1px", opacity: 0.5 }} />;

      case "heading":
        return (
          <h2 key={i} style={{ fontSize: h2Fs, fontWeight: serif ? 600 : 700, color: c.accent, fontFamily: bf, margin: "0 0 20px 0", letterSpacing: "-0.015em", lineHeight: 1.3 }}>
            {block.text}
          </h2>
        );

      case "paragraph":
        return (
          <p key={i} style={{ fontSize: fs, lineHeight: lh, color: c.body, fontFamily: bf, margin: "0 0 18px 0" }}>
            {P(block.text)}
          </p>
        );

      case "box": {
        const boxParagraphs: string[] = block.paragraphs || (block.text ? [block.text] : []);
        const boxLabelFs = bp === "desktop" ? (large ? "21px" : "19px") : bp === "tablet" ? (large ? "20px" : "18px") : (large ? "19px" : "17px");
        return (
          <div key={i} style={{ padding: bp === "mobile" ? "28px 24px" : "32px 28px", borderRadius: "20px", background: c.boxBg, border: `1px solid ${c.boxBorder}`, marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <div style={{ width: "3px", height: "22px", borderRadius: "2px", background: c.accent, opacity: 0.7 }} />
              <p style={{ fontSize: boxLabelFs, fontWeight: serif ? 600 : 700, letterSpacing: "-0.02em", color: c.ink, margin: 0, fontFamily: bf, lineHeight: 1.3 }}>{block.label}</p>
            </div>
            <div style={{ paddingLeft: "13px" }}>
              {boxParagraphs.map((para: string, j: number) => (
                <p key={j} style={{ fontSize: boxFs, lineHeight: "1.8", color: c.boxText, fontFamily: bf, margin: j < boxParagraphs.length - 1 ? "0 0 12px 0" : "0" }}>{P(para)}</p>
              ))}
            </div>
          </div>
        );
      }

      case "quote":
        return (
          <div key={i} style={{ margin: "0 0 48px 0", textAlign: "center", padding: bp === "desktop" ? "0 40px" : bp === "tablet" ? "0 24px" : "0 8px" }}>
            <p style={{ fontSize: pullFs, lineHeight: 1.55, color: c.ink, fontFamily: bf, fontStyle: "italic", margin: "0 0 8px 0", fontWeight: serif ? 400 : 450 }}>
              &ldquo;{block.text}&rdquo;
            </p>
            <p style={{ fontSize: "12px", fontWeight: 700, color: c.quoteAttr, margin: 0, fontFamily: uf, letterSpacing: "0.03em" }}>
              — {block.attribution}
            </p>
          </div>
        );

      case "stat":
        return (
          <div key={i} style={{ padding: bp === "mobile" ? "36px 0" : "44px 0", margin: "0 0 48px 0", textAlign: "center", borderTop: `1px solid ${c.divider}`, borderBottom: `1px solid ${c.divider}` }}>
            <p style={{ fontSize: statFs, fontWeight: 800, color: c.accent, margin: "0 0 12px 0", letterSpacing: "-0.04em", lineHeight: 1, fontFamily: uf }}>{block.value}</p>
            <p style={{ fontSize: fs, lineHeight: "1.6", color: c.body, fontFamily: bf, margin: "0 0 8px 0", maxWidth: bp === "desktop" ? "400px" : "300px", marginLeft: "auto", marginRight: "auto" }}>{block.text}</p>
            {block.source && <p style={{ fontSize: "11px", color: c.muted, fontStyle: "italic", margin: 0, fontFamily: uf }}>{block.source}</p>}
          </div>
        );

      case "numbered_list":
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: bp === "mobile" ? "12px" : "16px", marginBottom: "18px", paddingLeft: "4px" }}>
            {block.items.map((item: string, j: number) => (
              <div key={j} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: c.numColor, fontFamily: uf, minWidth: "18px", paddingTop: serif ? "5px" : "3px", textAlign: "right" }}>{j + 1}</span>
                <span style={{ fontSize: fs, lineHeight: lh, color: c.body, fontFamily: bf }}>{P(item)}</span>
              </div>
            ))}
          </div>
        );

      case "bullet_list":
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: bp === "mobile" ? "10px" : "14px", marginBottom: "18px", paddingLeft: "4px" }}>
            {block.items.map((item: string, j: number) => (
              <div key={j} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: c.bullet, flexShrink: 0, marginTop: serif ? "13px" : "12px" }} />
                <span style={{ fontSize: fs, lineHeight: lh, color: c.body, fontFamily: bf }}>{P(item)}</span>
              </div>
            ))}
          </div>
        );

      case "contrast": {
        const maxRows = Math.max(block.left?.length || 0, block.right?.length || 0);
        const contrastTextFs = bp === "desktop" ? (large ? "16px" : "15px") : (large ? "15px" : "14px");
        return (
          <div key={i} style={{ marginBottom: "32px", borderRadius: "16px", overflow: "hidden", border: `1px solid ${c.contrastDivider}` }}>
            <div style={{ display: "flex", gap: "2px", background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
              <div style={{ flex: 1, padding: bp === "mobile" ? "14px 16px" : "16px 20px" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "-0.01em", color: c.accent, margin: 0, fontFamily: uf }}>{block.leftLabel}</p>
              </div>
              <div style={{ flex: 1, padding: bp === "mobile" ? "14px 16px" : "16px 20px" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "-0.01em", color: c.accent, margin: 0, fontFamily: uf }}>{block.rightLabel}</p>
              </div>
            </div>
            {Array.from({ length: maxRows }).map((_, j: number) => (
              <div key={j} style={{ display: "flex", gap: "2px", background: j % 2 === 0 ? "transparent" : (dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)") }}>
                <div style={{ flex: 1, padding: bp === "mobile" ? "12px 16px" : "14px 20px" }}>
                  <p style={{ fontSize: contrastTextFs, lineHeight: "1.65", color: c.body, fontFamily: bf, margin: 0 }}>{block.left[j] ? P(block.left[j]) : ""}</p>
                </div>
                <div style={{ flex: 1, padding: bp === "mobile" ? "12px 16px" : "14px 20px" }}>
                  <p style={{ fontSize: contrastTextFs, lineHeight: "1.65", color: c.body, fontFamily: bf, margin: 0 }}>{block.right[j] ? P(block.right[j]) : ""}</p>
                </div>
              </div>
            ))}
          </div>
        );
      }

      default: {
        const unknownBlock = block as { type: string };
        return (
          <div key={i} style={{ padding: "12px", marginBottom: "18px", background: "rgba(255,0,0,0.1)", borderRadius: "8px", fontSize: "13px", fontFamily: uf, color: c.ink }}>
            Unknown block type: <strong>{unknownBlock.type}</strong>
          </div>
        );
      }
    }
  };

  const ln = lesson.lessonNumber || "?";
  const tl = lesson.totalLessons || "?";
  const titleFs = large ? layout.titleFsLg : layout.titleFs;

  return (
    <div style={{ width: "100%", height: "100vh", margin: "0 auto", background: c.bg, position: "relative", overflow: "hidden", transition: "background 0.4s ease" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@400;500;600;640;700;800&display=swap');
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        .ms::-webkit-scrollbar { display: none; }
        .ms { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Progress bar */}
      {showNav && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 110, height: "2px", background: c.progressTrack }}>
          <div style={{ height: "100%", width: `${progress}%`, background: c.accent, transition: "width 0.1s ease-out", borderRadius: "0 1px 1px 0" }} />
        </div>
      )}

      {/* Nav */}
      {showNav && (
        <div style={{ position: "fixed", top: 2, left: 0, right: 0, zIndex: 100, maxWidth: layout.maxWidth, margin: "0 auto", padding: layout.navPad, display: "flex", alignItems: "center", justifyContent: "space-between", background: c.navBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", opacity: navVis ? 1 : 0, pointerEvents: navVis ? "auto" : "none", transition: "opacity 0.25s ease" }}>
          <button onClick={onBack} style={{ background: c.btnBg, border: `1px solid ${c.btnBorder}`, borderRadius: "10px", width: "34px", height: "34px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke={c.muted} strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button onClick={() => setSerif(!serif)} style={{ background: c.btnBg, border: `1px solid ${c.btnBorder}`, borderRadius: "7px", padding: "4px 8px", cursor: "pointer", fontSize: "11px", fontWeight: 600, color: c.muted, fontFamily: serif ? "'Lora', serif" : "'Inter', sans-serif" }}>{serif ? "Serif" : "Sans"}</button>
            <button onClick={() => setLarge(!large)} style={{ background: c.btnBg, border: `1px solid ${c.btnBorder}`, borderRadius: "7px", padding: "4px 8px", cursor: "pointer", fontSize: large ? "13px" : "11px", fontWeight: 700, color: c.muted, fontFamily: uf, transition: "font-size 0.2s ease" }}>A</button>
            <span style={{ fontSize: "11px", fontWeight: 600, color: c.muted, fontFamily: uf, padding: "0 2px" }}>{ln} / {tl}</span>
            <button onClick={() => setDark(!dark)} style={{ background: c.btnBg, border: `1px solid ${c.btnBorder}`, borderRadius: "7px", padding: "4px 8px", cursor: "pointer", fontSize: "11px", fontWeight: 600, color: c.muted, fontFamily: uf }}>{dark ? "Light" : "Dark"}</button>
          </div>
          <button style={{ background: c.btnBg, border: `1px solid ${c.btnBorder}`, borderRadius: "10px", width: "34px", height: "34px", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M2 2C2 1.45 2.45 1 3 1H11C11.55 1 12 1.45 12 2V13.5L7 10.5L2 13.5V2Z" stroke={c.muted} strokeWidth="1.3" fill="none" /></svg>
          </button>
        </div>
      )}

      {/* Scrollable content */}
      <div ref={scrollRef} className="ms" style={{ height: "100vh", overflowY: "auto", maxWidth: layout.maxWidth, margin: "0 auto", padding: layout.contentPad, paddingTop: showNav ? "64px" : "80px" }}>

        {/* Title */}
        <h1 style={{ fontSize: titleFs, fontWeight: serif ? 700 : 800, lineHeight: 1.08, color: c.ink, fontFamily: bf, margin: "0 0 10px 0", letterSpacing: serif ? "-0.01em" : "-0.035em" }}>
          {lesson.title}
        </h1>
        {lesson.readTime && <p style={{ fontSize: "13px", fontWeight: 500, color: c.muted, fontFamily: uf, margin: "0 0 26px 0" }}>{lesson.readTime} read</p>}

        {/* Audio player */}
        {lesson.audioDuration && (
          <button onClick={toggleAudio} style={{ display: "flex", alignItems: "center", gap: "12px", width: "100%", maxWidth: bp === "desktop" ? "360px" : "100%", padding: "11px 14px", background: c.audioBg, border: `1px solid ${c.audioBorder}`, borderRadius: "12px", cursor: "pointer", marginBottom: "44px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: c.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {playing
                ? <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="2.5" y="2" width="3" height="10" rx="1" fill="white"/><rect x="8.5" y="2" width="3" height="10" rx="1" fill="white"/></svg>
                : <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3.5 1.5L11.5 7L3.5 12.5V1.5Z" fill="white"/></svg>}
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: c.ink, margin: 0, fontFamily: uf }}>{playing ? "Playing..." : "Listen to this lesson"}</p>
              <p style={{ fontSize: "11px", color: c.muted, margin: "1px 0 0 0", fontFamily: uf }}>{lesson.audioDuration} · narrated</p>
            </div>
          </button>
        )}

        {/* Render all blocks */}
        {lesson.blocks.map((block: LessonBlock, i: number) => renderBlock(block, i))}

        {/* Key Insight */}
        {lesson.keyInsight && (
          <div style={{ padding: bp === "mobile" ? "28px 24px" : "36px 32px", borderRadius: "16px", background: c.kiBg, border: `1px solid ${c.kiBorder}` }}>
            <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: c.kiLabel, margin: "0 0 10px 0", fontFamily: uf }}>Key Insight</p>
            <p style={{ fontSize: kiNameFs, fontWeight: serif ? 700 : 800, color: c.kiName, margin: "0 0 10px 0", letterSpacing: "-0.02em", lineHeight: 1.2, fontFamily: bf }}>{lesson.keyInsight.name}</p>
            <p style={{ fontSize: `${(bp === "desktop" ? 16.5 : bp === "tablet" ? 15.5 : 14.5) + (large ? 1 : 0)}px`, lineHeight: 1.65, color: c.kiDef, margin: "0 0 20px 0", fontFamily: bf }}>{lesson.keyInsight.definition}</p>
            <div style={{ width: "100%", height: "1px", background: c.kiDivider, margin: "0 0 20px 0" }} />
            <p style={{ fontSize: `${(bp === "desktop" ? 17.5 : bp === "tablet" ? 16.5 : 15.5) + (large ? 1 : 0)}px`, lineHeight: 1.7, color: c.kiTakeaway, margin: 0, fontStyle: "italic", fontFamily: bf }}>{lesson.keyInsight.takeaway}</p>
          </div>
        )}

        {/* Next Lesson */}
        {lesson.nextLesson && (
          <div style={{ margin: "28px 0 0 0", padding: bp === "mobile" ? "24px 22px 22px" : "28px 28px 26px", borderRadius: "16px", background: c.nextBg, border: `1px solid ${c.nextBorder}` }}>
            <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: c.nextLabel, margin: "0 0 14px 0", fontFamily: uf }}>Up next in {lesson.nextLesson.course}</p>
            <p style={{ fontSize: bp === "desktop" ? (large ? "22px" : "20px") : (large ? "20px" : "18px"), fontWeight: serif ? 600 : 700, color: c.nextTitle, margin: "0 0 8px 0", fontFamily: bf, letterSpacing: "-0.015em", lineHeight: 1.3 }}>{lesson.nextLesson.title}</p>
            <p style={{ fontSize: `${(bp === "desktop" ? 16.5 : bp === "tablet" ? 15.5 : 14.5) + (large ? 1 : 0)}px`, lineHeight: 1.6, color: c.nextHook, margin: "0 0 20px 0", fontFamily: bf }}>{lesson.nextLesson.hook}</p>
            <button onClick={() => { if (lesson.nextLesson?.url) window.location.href = lesson.nextLesson.url; }} style={{ width: bp === "desktop" ? "auto" : "100%", padding: bp === "desktop" ? "14px 40px" : "14px", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 700, fontFamily: uf, background: c.nextBtnBg, color: c.nextBtnText, cursor: "pointer", letterSpacing: "-0.01em" }}>
              Start next lesson →
            </button>
          </div>
        )}

        <div style={{ height: "80px" }} />
      </div>
    </div>
  );
}
