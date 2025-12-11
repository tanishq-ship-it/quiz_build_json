import { useState } from "react";
import Screens from "./Screens/Screens";
import qtImage from "./assests/qt.svg";

// ============================================================
// SCREENS JSON - Pure JSON definition of all 10 screens
// ============================================================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SCREENS_JSON: any[] = [
  {
    "id": "screen-1-gender",
      "content": [
        {
          "type": "heading",
          "content": "Become the best version of yourself."
        },
        {
          "type": "text",
          "content": "Select your gender.",
          "align": "center",
          "color": "#555"
        },
        {
          "type": "selection",
          "mode": "radio",
          "layout": "1x2",
          "gap": 16,
          "position": "top",
          "options": [
            {
              "variant": "imageCard",
              "imageSrc": "https://api.dicebear.com/7.x/avataaars/svg?seed=male&backgroundColor=b6e3f4",
              "text": "Male",
              "width": 140,
              "imageShape": "circle",
              "value": "male"
            },
            {
              "variant": "imageCard",
              "imageSrc": "https://api.dicebear.com/7.x/avataaars/svg?seed=female&backgroundColor=ffd5dc",
              "text": "Female",
              "width": 140,
              "imageShape": "circle",
              "value": "female"
            }
          ]
        }
      ]
    },
    {
      "id": "screen-2-brand-trust",
      "content": [
        {
          "type": "image",
          "src": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
          "width": "70%",
          "shape": "rounded",
          "align": "center"
        },
        {
          "type": "heading",
          "content": "Join millions who trust micro-learning to build life skills.",
          "fontSize": 24
        },
        {
          "type": "text",
          "content": "**Microlearning featured in**\n\nForbes · Business Insider · Fast Company · TechCrunch · Entrepreneur",
          "align": "center",
          "color": "#555"
        },
        {
          "type": "button",
          "text": "Continue"
        }
      ]
    },
    {
      "id": "screen-3-age",
      "content": [
        {
          "type": "heading",
          "content": "What's your age?",
          "fontSize": 24
        },
        {
          "type": "text",
          "content": "We only use your age to personalize your plan.",
          "align": "center",
          "color": "#555"
        },
        {
          "type": "selection",
          "mode": "radio",
          "layout": "4x1",
          "gap": 12,
          "options": [
            {
              "variant": "flat",
              "text": "18–24",
              "width": 280,
              "height": 52,
              "bgColor": "#fff",
              "textColor": "#333",
              "textAlign": "left",
              "value": "18-24"
            },
            {
              "variant": "flat",
              "text": "25–34",
              "width": 280,
              "height": 52,
              "bgColor": "#fff",
              "textColor": "#333",
              "textAlign": "left",
              "value": "25-34"
            },
            {
              "variant": "flat",
              "text": "35–44",
              "width": 280,
              "height": 52,
              "bgColor": "#fff",
              "textColor": "#333",
              "textAlign": "left",
              "value": "35-44"
            },
            {
              "variant": "flat",
              "text": "45+",
              "width": 280,
              "height": 52,
              "bgColor": "#fff",
              "textColor": "#333",
              "textAlign": "left",
              "value": "45+"
            }
          ]
        }
      ]
    },
    {
      "id": "screen-4-motivation-intro",
      "content": [
        {
          "type": "heading",
          "content": "Awesome, you’re on your way!",
          "fontSize": 24
        },
        {
          "type": "text",
          "content": "Let’s start your journey of self-growth. First, we’ll learn about you to customize your personal plan.",
          "align": "center",
          "color": "#555"
        },
        {
          "type": "image",
          "src": "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
          "width": "70%",
          "shape": "rounded",
          "align": "center"
        },
        {
          "type": "button",
          "text": "Continue"
        }
      ]
    },
    {
      "id": "screen-5-growth-areas",
      "content": [
        {
          "type": "heading",
          "content": "In which areas would you like to grow?",
          "fontSize": 22
        },
        {
          "type": "text",
          "content": "Your experience won’t be limited by choice.",
          "align": "center",
          "color": "#555"
        },
        {
          "type": "selection",
          "mode": "checkbox",
          "layout": "4x3",
          "gap": 10,
          "options": [
            { "variant": "flat", "text": "Leadership", "width": 150, "height": 44, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "leadership" },
            { "variant": "flat", "text": "Productivity", "width": 150, "height": 44, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "productivity" },
            { "variant": "flat", "text": "Career", "width": 150, "height": 44, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "career" },
            { "variant": "flat", "text": "Personal finance", "width": 150, "height": 44, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "personal-finance" },
            { "variant": "flat", "text": "Self-confidence", "width": 150, "height": 44, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "self-confidence" },
            { "variant": "flat", "text": "Relationships", "width": 150, "height": 44, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "relationships" },
            { "variant": "flat", "text": "Self-care", "width": 150, "height": 44, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "self-care" },
            { "variant": "flat", "text": "Emotions", "width": 150, "height": 44, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "emotions" },
            { "variant": "flat", "text": "Motivation", "width": 150, "height": 44, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "motivation" },
            { "variant": "flat", "text": "Habits", "width": 150, "height": 44, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "habits" },
            { "variant": "flat", "text": "Exercise", "width": 150, "height": 44, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "exercise" },
            { "variant": "flat", "text": "Happiness", "width": 150, "height": 44, "bgColor": "#fff", "textColor": "#333", "textAlign": "left", "value": "happiness" }
          ]
        },
        {
          "type": "button",
          "text": "Continue"
        }
      ]
    },
    {
      "id": "screen-6-core-value-prop",
      "content": [
        {
          "type": "heading",
          "content": "Small lessons. Big shifts.",
          "fontSize": 24
        },
        {
          "type": "text",
          "content": "Build confidence, clarity, and calm in just a few minutes a day — no burnout, no endless courses.",
          "align": "center",
          "color": "#555"
        },
        {
          "type": "image",
          "src": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=300&fit=crop",
          "width": "70%",
          "shape": "rounded",
          "align": "center"
        },
        {
          "type": "button",
          "text": "Continue"
        }
      ]
    },
    {
      "id": "screen-7-voice-preference",
      "content": [
        {
          "type": "heading",
          "content": "What kind of voice or energy keeps you learning?",
          "fontSize": 22
        },
        {
          "type": "selection",
          "mode": "radio",
          "layout": "3x2",
          "gap": 12,
          "options": [
            {
              "variant": "imageCard",
              "imageSrc": "https://res.cloudinary.com/dgroslu5r/image/upload/v1763116843/3_inmcyz.png",
              "text": "Raw & honest",
              "width": 140,
              "imageShape": "circle",
              "value": "raw-honest"
            },
            {
              "variant": "imageCard",
              "imageSrc": "https://res.cloudinary.com/dgroslu5r/image/upload/v1763116842/4_uy2wo1.png",
              "text": "Calm & reflective",
              "width": 140,
              "imageShape": "circle",
              "value": "calm-reflective"
            },
            {
              "variant": "imageCard",
              "imageSrc": "https://res.cloudinary.com/dgroslu5r/image/upload/v1763116843/5_h3hk2s.png",
              "text": "Analytical & structured",
              "width": 140,
              "imageShape": "circle",
              "value": "analytical-structured"
            },
            {
              "variant": "imageCard",
              "imageSrc": "https://res.cloudinary.com/dgroslu5r/image/upload/v1763116842/6_myqxsn.png",
              "text": "Practical & positive",
              "width": 140,
              "imageShape": "circle",
              "value": "practical-positive"
            },
            {
              "variant": "imageCard",
              "imageSrc": "https://res.cloudinary.com/dgroslu5r/image/upload/v1763116842/7_nm9byq.png",
              "text": "Philosophical & minimal",
              "width": 140,
              "imageShape": "circle",
              "value": "philosophical-minimal"
            },
            {
              "variant": "imageCard",
              "imageSrc": "https://res.cloudinary.com/dgroslu5r/image/upload/v1763116842/8_qjv0pn.png",
              "text": "Empathetic & vulnerable",
              "width": 140,
              "imageShape": "circle",
              "value": "empathetic-vulnerable"
            }
          ]
        }
      ]
    },
    {
      "id": "screen-8-social-proof",
      "content": [
        {
          "type": "heading",
          "content": "9 out of 10 say Mindsnack improved their lives!",
          "fontSize": 24
        },
        {
          "type": "text",
          "content": "Users said Mindsnack improved their lives with minimal daily effort.\n\nBased on a survey of users who use Mindsnack 3 times a week.",
          "align": "center",
          "color": "#555"
        },
        {
          "type": "image",
          "src": "https://res.cloudinary.com/dgroslu5r/image/upload/v1763117390/15_lessons_a_week_2_y0qiyz.png",
          "width": "70%",
          "shape": "rounded",
          "align": "center"
        },
        {
          "type": "button",
          "text": "Continue"
        }
      ]
    },
    {
      "id": "screen-9-experience-check",
      "content": [
        {
          "type": "heading",
          "content": "Have you ever tried learning through short 5-minute lessons?",
          "fontSize": 22
        },
        {
          "type": "selection",
          "mode": "radio",
          "layout": "3x1",
          "gap": 12,
          "options": [
            {
              "variant": "flat",
              "text": "👍 Yes",
              "width": 280,
              "height": 52,
              "bgColor": "#fff",
              "textColor": "#333",
              "textAlign": "left",
              "value": "yes"
            },
            {
              "variant": "flat",
              "text": "👎 No",
              "width": 280,
              "height": 52,
              "bgColor": "#fff",
              "textColor": "#333",
              "textAlign": "left",
              "value": "no"
            },
            {
              "variant": "flat",
              "text": "🤷 Not sure",
              "width": 280,
              "height": 52,
              "bgColor": "#fff",
              "textColor": "#333",
              "textAlign": "left",
              "value": "not-sure"
            }
          ]
        }
      ]
    },
    // {
    //   "id": "screen-10-comparison",
    //   "content": [
    //     {
    //       "type": "heading",
    //       "content": "Mindsnack vs book summaries",
    //       "fontSize": 24
    //     },
    //     {
    //       "type": "card",
    //       "variant": "message",
    //       "message": "### Book summaries → Mindsnack\n\n- 😴 Passive reading → ✅ Active learning\n- ⏳ Long summaries → ✅ 5-min lessons\n- 💬 Ideas to know → ✅ Skills to use\n\nMindsnack isn’t about summaries.\nIt’s about rewiring how you think, decide, and grow — one micro-action at a time.",
    //       "bgColor": "#eff6ff",
    //       "textColor": "#333"
    //     },
    //     {
    //       "type": "image",
    //       "src": "https://res.cloudinary.com/dgroslu5r/image/upload/v1763120817/15_lessons_a_week_4_w1emce.png",
    //       "width": "50%",
    //       "shape": "rounded",
    //       "align": "center"
    //     },
    //     {
    //       "type": "button",
    //       "text": "Continue"
    //     }
    //   ]
    // },
    {
      "id": "screen-11-life-satisfaction",
      "content": [
        {
          "type": "heading",
          "content": "How would you describe your current life?",
          "fontSize": 22
        },
        {
          "type": "selection",
          "mode": "radio",
          "layout": "5x1",
          "gap": 10,
          "options": [
            {
              "variant": "flat",
              "text": "Satisfied",
              "width": 280,
              "height": 48,
              "bgColor": "#fff",
              "textColor": "#333",
              "textAlign": "left",
              "value": "satisfied"
            },
            {
              "variant": "flat",
              "text": "Alright and want to self-improve",
              "width": 280,
              "height": 48,
              "bgColor": "#fff",
              "textColor": "#333",
              "textAlign": "left",
              "value": "alright-self-improve"
            },
            {
              "variant": "flat",
              "text": "Doing okay",
              "width": 280,
              "height": 48,
              "bgColor": "#fff",
              "textColor": "#333",
              "textAlign": "left",
              "value": "doing-okay"
            },
            {
              "variant": "flat",
              "text": "Often sad",
              "width": 280,
              "height": 48,
              "bgColor": "#fff",
              "textColor": "#333",
              "textAlign": "left",
              "value": "often-sad"
            },
            {
              "variant": "flat",
              "text": "At the lowest and need help",
              "width": 280,
              "height": 48,
              "bgColor": "#fff",
              "textColor": "#333",
              "textAlign": "left",
              "value": "lowest-need-help"
            }
          ]
        }
      ]
    },
    {
      "id": "screen-12-self-awareness",
      "content": [
        {
          "type": "heading",
          "content": "I always know what I want.",
          "fontSize": 22
        },
        {
          "type": "selection",
          "mode": "radio",
          "layout": "1x5",
          "gap": 12,
          "position": "middle",
          "options": [
            { "variant": "square", "character": "1", "size": 52, "value": 1 },
            { "variant": "square", "character": "2", "size": 52, "value": 2 },
            { "variant": "square", "character": "3", "size": 52, "value": 3 },
            { "variant": "square", "character": "4", "size": 52, "value": 4 },
            { "variant": "square", "character": "5", "size": 52, "value": 5 }
          ],
          "responseCards": {
            "1": {
              "variant": "message",
              "message": "Say no more! It’s hard to figure out your wishes. But a personal growth plan will help you determine, prioritize, and achieve goals smoothly.",
              "bgColor": "#fef3c7"
            },
            "2": {
              "variant": "message",
              "message": "Say no more! It’s hard to figure out your wishes. But a personal growth plan will help you determine, prioritize, and achieve goals smoothly.",
              "bgColor": "#fef3c7"
            },
            "3": {
              "variant": "message",
              "message": "We understand. We’ll consider the growth points you’ve picked to craft the most relevant plan.",
              "bgColor": "#eff6ff"
            },
            "4": {
              "variant": "message",
              "message": "The average person checks their phone 58 times a day. Dedicating 15 minutes to Mindsnack can help you achieve your goals.",
              "bgColor": "#ecfdf5"
            },
            "5": {
              "variant": "message",
              "message": "The average person checks their phone 58 times a day. Dedicating 15 minutes to Mindsnack can help you achieve your goals.",
              "bgColor": "#ecfdf5"
            }
          },
          "responsePosition": "top"
        }
      ]
    },
    {
      "id": "screen-13-self-doubt",
      "content": [
        {
          "type": "heading",
          "content": "How often do you doubt yourself when you make a mistake?",
          "fontSize": 22
        },
        {
          "type": "selection",
          "mode": "radio",
          "layout": "1x5",
          "gap": 12,
          "position": "top",
          "options": [
            { "variant": "square", "character": "1", "size": 52, "value": 1 },
            { "variant": "square", "character": "2", "size": 52, "value": 2 },
            { "variant": "square", "character": "3", "size": 52, "value": 3 },
            { "variant": "square", "character": "4", "size": 52, "value": 4 },
            { "variant": "square", "character": "5", "size": 52, "value": 5 }
          ],
          "responseCards": {
            "1": {
              "variant": "message",
              "message": "We’re thrilled to hear that.\nMistakes are chances to grow, not setbacks. Your plan shows you how to turn them into success.",
              "bgColor": "#ecfdf5"
            },
            "2": {
              "variant": "message",
              "message": "We’re thrilled to hear that.\nMistakes are chances to grow, not setbacks. Your plan shows you how to turn them into success.",
              "bgColor": "#ecfdf5"
            },
            "3": {
              "variant": "message",
              "message": "Remember, mistakes are part of the journey.\nDoubt is a sign of progress. We’ll help you turn that into clarity and growth.",
              "bgColor": "#eff6ff"
            },
            "4": {
              "variant": "message",
              "message": "Remember, mistakes are part of the journey.\nDoubt is a sign of progress. We’ll help you turn that into clarity and growth.",
              "bgColor": "#eff6ff"
            },
            "5": {
              "variant": "message",
              "message": "Remember, mistakes are part of the journey.\nDoubt is a sign of progress. We’ll help you turn that into clarity and growth.",
              "bgColor": "#eff6ff"
            }
          },
          "responsePosition": "bottom"
        }
      ]
    },
    {
      "id": "screen-14-self-doubt-visual",
      "content": [
        {
          "type": "image",
          "src": "https://res.cloudinary.com/dgroslu5r/image/upload/v1763121718/11_mrsnef.png",
          "width": "70%",
          "shape": "rounded",
          "align": "center"
        },
        {
          "type": "button",
          "text": "Continue"
        }
      ]
    },
    {
      "id": "screen-15-leadership-orientation",
      "content": [
        {
          "type": "heading",
          "content": "Let’s get to know you better.",
          "fontSize": 24
        },
        {
          "type": "text",
          "content": "Which better describes you?",
          "align": "center",
          "color": "#555"
        },
        {
          "type": "selection",
          "mode": "radio",
          "layout": "3x1",
          "gap": 12,
          "options": [
            {
              "variant": "flat",
              "text": "Lead the way",
              "width": 280,
              "height": 52,
              "bgColor": "#fff",
              "textColor": "#333",
              "textAlign": "left",
              "value": "lead"
            },
            {
              "variant": "flat",
              "text": "Follow along",
              "width": 280,
              "height": 52,
              "bgColor": "#fff",
              "textColor": "#333",
              "textAlign": "left",
              "value": "follow"
            },
            {
              "variant": "flat",
              "text": "Mix of both",
              "width": 280,
              "height": 52,
              "bgColor": "#fff",
              "textColor": "#333",
              "textAlign": "left",
              "value": "mix"
            }
          ],
          "responseCards": {
            "lead": {
              "variant": "message",
              "message": "Leadership isn’t just a title; it’s a skill. Your plan will help you grow as a confident, effective leader.",
              "bgColor": "#ecfdf5"
            },
            "follow": {
              "variant": "message",
              "message": "Understanding your strengths and blind spots is the foundation of growth. We’ll help you build from the inside out.",
              "bgColor": "#eff6ff"
            },
            "mix": {
              "variant": "message",
              "message": "Whether you lead or follow, both matter. Your plan will strengthen teamwork and leadership skills for a well-rounded edge.",
              "bgColor": "#fef3c7"
            }
          },
          "responsePosition": "bottom"
        }
      ]
    },
];

// ============================================================
// APP - Renders screens from JSON
// ============================================================
function App() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => Math.min(i + 1, SCREENS_JSON.length - 1));
  const reset = () => setIndex(0);

  // Delayed next (2 sec) - for radio with responseCards so user can read the message
  const delayedNext = () => {
    setTimeout(() => {
      next();
    }, 2000);
  };

  // Replace placeholders and inject callbacks
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processContent = (content: any[], isLast: boolean): any[] => {
    return content.map((item) => {
      const copy = { ...item };

      // Replace image placeholders
      if (copy.src === "{{image}}") copy.src = qtImage;
      if (copy.imageSrc === "{{image}}") copy.imageSrc = qtImage;

      // Button: add onClick
      if (copy.type === "button") {
        copy.onClick = isLast ? reset : next;
      }

      // Selection: add callbacks
      if (copy.type === "selection") {
        copy.onChange = () => {};
        // If radio mode with responseCards, add 2sec delay so user can read the message
        // Otherwise go to next screen immediately
        const hasResponseCards = copy.responseCards && Object.keys(copy.responseCards).length > 0;
        const isRadio = copy.mode === "radio";
        copy.onComplete = (isRadio && hasResponseCards) ? delayedNext : next;
        if (copy.options) {
          copy.options = copy.options.map((o: { imageSrc?: string }) =>
            o.imageSrc === "{{image}}" ? { ...o, imageSrc: qtImage } : o
          );
        }
        if (copy.responseScreens) {
          for (const key of Object.keys(copy.responseScreens)) {
            copy.responseScreens[key].content = processContent(copy.responseScreens[key].content, isLast);
          }
        }
      }

      // Card info: replace images
      if (copy.type === "card" && copy.variant === "info" && copy.content) {
        copy.content = copy.content.map((c: { src?: string }) =>
          c.src === "{{image}}" ? { ...c, src: qtImage } : c
        );
      }

      return copy;
    });
  };

  const screen = SCREENS_JSON[index];
  const isLast = index === SCREENS_JSON.length - 1;
  const content = processContent(screen.content, isLast);

  return (
    <div className="app-container">
      <section className="screen-section">
        <div className="mobile-frame">
          <Screens key={screen.id} content={content} />
        </div>
      </section>
    </div>
  );
}

export default App;
