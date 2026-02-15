export interface HookBlock {
  type: "hook";
  text: string;
}

export interface HookSubBlock {
  type: "hook_sub";
  text: string;
}

export interface DividerBlock {
  type: "divider";
}

export interface HeadingBlock {
  type: "heading";
  text: string;
}

export interface ParagraphBlock {
  type: "paragraph";
  text: string;
}

export interface BoxBlock {
  type: "box";
  label: string;
  paragraphs?: string[];
  text?: string;
}

export interface QuoteBlock {
  type: "quote";
  text: string;
  attribution: string;
}

export interface StatBlock {
  type: "stat";
  value: string;
  text: string;
  source?: string;
}

export interface NumberedListBlock {
  type: "numbered_list";
  items: string[];
}

export interface BulletListBlock {
  type: "bullet_list";
  items: string[];
}

export interface ContrastBlock {
  type: "contrast";
  leftLabel: string;
  rightLabel: string;
  left: string[];
  right: string[];
}

export type LessonBlock =
  | HookBlock
  | HookSubBlock
  | DividerBlock
  | HeadingBlock
  | ParagraphBlock
  | BoxBlock
  | QuoteBlock
  | StatBlock
  | NumberedListBlock
  | BulletListBlock
  | ContrastBlock;

export interface KeyInsight {
  name: string;
  definition: string;
  takeaway: string;
}

export interface NextLesson {
  title: string;
  hook: string;
  course: string;
  url?: string;
}

export interface Lesson {
  title: string;
  readTime?: string;
  audioUrl?: string | null;
  audioDuration?: string;
  course?: string;
  lessonNumber?: number;
  totalLessons?: number;
  blocks: LessonBlock[];
  keyInsight?: KeyInsight;
  nextLesson?: NextLesson;
}
