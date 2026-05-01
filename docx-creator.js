const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, LevelFormat,
  TableOfContents
} = require('docx');
const fs = require('fs');

// Color palette
const PURPLE = "7C3AED";
const DARK_PURPLE = "4C1D95";
const CORAL = "F97316";
const DARK_BG = "1E1B4B";
const LIGHT_GRAY = "F3F4F6";
const MID_GRAY = "E5E7EB";
const DARK_TEXT = "1F2937";
const WHITE = "FFFFFF";
const ACCENT = "8B5CF6";
const GREEN = "059669";
const BLUE = "2563EB";

const border = { style: BorderStyle.SINGLE, size: 1, color: "D1D5DB" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function heading1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: PURPLE, space: 4 } },
    children: [new TextRun({ text, bold: true, size: 36, color: DARK_BG, font: "Arial" })]
  });
}

function heading2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 160 },
    children: [new TextRun({ text, bold: true, size: 28, color: DARK_PURPLE, font: "Arial" })]
  });
}

function heading3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, bold: true, size: 24, color: ACCENT, font: "Arial" })]
  });
}

function para(text, options = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 22, color: DARK_TEXT, font: "Arial", ...options })]
  });
}

function bullet(text, bold = false) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, color: DARK_TEXT, font: "Arial", bold })]
  });
}

function spacer(lines = 1) {
  return new Paragraph({ spacing: { before: 0, after: 0 }, children: [new TextRun({ text: "", size: lines * 12 })] });
}

function labeledBullet(label, text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 60, after: 60 },
    children: [
      new TextRun({ text: label + ": ", bold: true, size: 22, color: DARK_TEXT, font: "Arial" }),
      new TextRun({ text, size: 22, color: DARK_TEXT, font: "Arial" })
    ]
  });
}

function sectionDivider() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: MID_GRAY, space: 1 } },
    children: [new TextRun("")]
  });
}

// Cover page table
function makeCoverPage() {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1800, after: 200 },
      children: [
        new TextRun({ text: "StratifyAI", bold: true, size: 72, color: PURPLE, font: "Arial" }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 160 },
      children: [
        new TextRun({ text: "AI-Powered Marketing Strategy Generation Platform", size: 28, color: ACCENT, font: "Arial", italics: true }),
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 0, after: 400 },
      children: [
        new TextRun({ text: "Turn Chaos Into a Clear Marketing Strategy", size: 24, color: DARK_TEXT, font: "Arial" }),
      ]
    }),
    new Table({
      width: { size: 7200, type: WidthType.DXA },
      columnWidths: [7200],
      alignment: AlignmentType.CENTER,
      rows: [
        new TableRow({
          children: [
            new TableCell({
              borders,
              width: { size: 7200, type: WidthType.DXA },
              shading: { fill: "F5F3FF", type: ShadingType.CLEAR },
              margins: { top: 240, bottom: 240, left: 360, right: 360 },
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 80, after: 80 },
                  children: [new TextRun({ text: "Product Features Document", bold: true, size: 28, color: DARK_PURPLE, font: "Arial" })]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 60, after: 60 },
                  children: [new TextRun({ text: "Version 1.0  |  April 2026", size: 22, color: "6B7280", font: "Arial" })]
                }),
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 60, after: 60 },
                  children: [new TextRun({ text: "Confidential & Proprietary", size: 20, color: "9CA3AF", font: "Arial", italics: true })]
                }),
              ]
            })
          ]
        })
      ]
    }),
    new Paragraph({ children: [new PageBreak()] }),
  ];
}

function makeFeatureTable(rows) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2400, 6960],
    rows: rows.map(([label, value]) => new TableRow({
      children: [
        new TableCell({
          borders,
          width: { size: 2400, type: WidthType.DXA },
          shading: { fill: "EDE9FE", type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 20, color: DARK_PURPLE, font: "Arial" })] })]
        }),
        new TableCell({
          borders,
          width: { size: 6960, type: WidthType.DXA },
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          children: [new Paragraph({ children: [new TextRun({ text: value, size: 20, color: DARK_TEXT, font: "Arial" })] })]
        })
      ]
    }))
  });
}

function makeAgentTable() {
  const headers = ["Agent", "Purpose", "Output"];
  const data = [
    ["Content Agent", "Content creation pipeline", "Posts, calendar, briefs"],
    ["Channel Agent", "Channel planning & budget allocation", "Channel plan, budget shifts"],
    ["Campaign Execution", "Full campaign management", "Tasks, timeline, emails"],
    ["Analytics Agent", "Analytics setup & tracking", "Dashboard, tracking, alerts"],
    ["Optimization Agent", "Performance optimization", "Actions, A/B tests, quick wins"],
  ];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2200, 3780, 3380],
    rows: [
      new TableRow({
        children: headers.map((h, i) => new TableCell({
          borders,
          width: { size: [2200, 3780, 3380][i], type: WidthType.DXA },
          shading: { fill: DARK_PURPLE, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 160, right: 160 },
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, color: WHITE, font: "Arial" })] })]
        }))
      }),
      ...data.map((row, ri) => new TableRow({
        children: row.map((cell, i) => new TableCell({
          borders,
          width: { size: [2200, 3780, 3380][i], type: WidthType.DXA },
          shading: { fill: ri % 2 === 0 ? "F5F3FF" : WHITE, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 160, right: 160 },
          children: [new Paragraph({ children: [new TextRun({ text: cell, size: 20, color: DARK_TEXT, font: "Arial" })] })]
        }))
      }))
    ]
  });
}

function makeComparisonTable() {
  const rows = [
    ["No architecture overview", "Full system + AI architecture included"],
    ["No step-by-step workflows", "Detailed process flows per feature"],
    ["Basic business value", "Strong ROI metrics and impact data"],
    ["No enterprise focus", "Enterprise-grade features covered"],
    ["No scalability section", "Performance & scalability documented"],
    ["No integration details", "API & integration capabilities listed"],
    ["Flat feature listing", "Modular, grouped feature design"],
  ];
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 4680, type: WidthType.DXA },
            shading: { fill: "FEE2E2", type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 160, right: 160 },
            children: [new Paragraph({ children: [new TextRun({ text: "Typical Docs Miss", bold: true, size: 22, color: "991B1B", font: "Arial" })] })]
          }),
          new TableCell({
            borders,
            width: { size: 4680, type: WidthType.DXA },
            shading: { fill: "D1FAE5", type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 160, right: 160 },
            children: [new Paragraph({ children: [new TextRun({ text: "StratifyAI Includes", bold: true, size: 22, color: "065F46", font: "Arial" })] })]
          })
        ]
      }),
      ...rows.map(([miss, include]) => new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 4680, type: WidthType.DXA },
            margins: { top: 80, bottom: 80, left: 160, right: 160 },
            children: [new Paragraph({ children: [new TextRun({ text: "✗  " + miss, size: 20, color: "B91C1C", font: "Arial" })] })]
          }),
          new TableCell({
            borders,
            width: { size: 4680, type: WidthType.DXA },
            shading: { fill: "F0FDF4", type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 160, right: 160 },
            children: [new Paragraph({ children: [new TextRun({ text: "✓  " + include, size: 20, color: "065F46", font: "Arial" })] })]
          })
        ]
      }))
    ]
  });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 }, spacing: { before: 60, after: 60 } } } }]
      },
      {
        reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 }, spacing: { before: 60, after: 60 } } } }]
      },
    ]
  },
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22 } }
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: DARK_BG },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: DARK_PURPLE },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: ACCENT },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: PURPLE, space: 4 } },
            spacing: { before: 0, after: 120 },
            children: [
              new TextRun({ text: "StratifyAI", bold: true, size: 20, color: PURPLE, font: "Arial" }),
              new TextRun({ text: "   |   Product Features Document   |   v1.0   |   2026", size: 18, color: "9CA3AF", font: "Arial" }),
            ]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 2, color: MID_GRAY, space: 4 } },
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 0 },
            children: [
              new TextRun({ text: "Confidential — StratifyAI © 2026", size: 18, color: "9CA3AF", font: "Arial" })
            ]
          })
        ]
      })
    },
    children: [
      // ---- COVER PAGE ----
      ...makeCoverPage(),

      // ---- TABLE OF CONTENTS ----
      heading1("Table of Contents"),
      new TableOfContents("Table of Contents", {
        hyperlink: true,
        headingStyleRange: "1-3",
      }),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 1. INTRODUCTION ----
      heading1("1. Introduction"),
      heading2("1.1 About StratifyAI"),
      para("StratifyAI is an AI-powered marketing strategy generation platform designed to transform business complexity into clear, actionable marketing roadmaps. Built for founders, growth teams, and marketing professionals, the platform leverages advanced AI agents to produce complete 30/60/90-day strategies in seconds — covering personas, channel recommendations, content plans, funnels, and KPIs."),
      spacer(),
      para("The core problem StratifyAI solves is the gap between business ambition and executable strategy. Marketing teams often spend weeks building plans that lack data-driven precision. StratifyAI compresses that timeline to under 30 seconds while delivering enterprise-grade depth."),

      spacer(),
      heading2("1.2 Vision"),
      para("\"To transform raw business context into actionable marketing intelligence instantly — empowering every founder and growth team to execute with the clarity of a seasoned CMO.\""),

      spacer(),
      heading2("1.3 Key Differentiators"),
      bullet("AI-first platform — strategy generation powered by multi-provider LLM architecture"),
      bullet("Multi-agent execution system — specialized agents for content, channels, campaigns, analytics, and optimization"),
      bullet("30/60/90-day roadmaps — structured, phased growth plans tied to business goals"),
      bullet("Provider flexibility — supports Together AI, Grok, and Groq with automatic fallback"),
      bullet("Full-stack SaaS — React frontend, Flask backend, MongoDB database, SMTP email dispatch"),

      spacer(),
      heading2("1.4 Target Audience"),
      labeledBullet("Founders", "Early-stage and growth-stage startup founders needing rapid strategy clarity"),
      labeledBullet("Growth Teams", "Marketing and growth professionals at scaling companies"),
      labeledBullet("Agencies", "Marketing agencies serving multiple clients needing scalable strategy output"),
      labeledBullet("Enterprises", "Larger organizations needing structured AI-powered planning workflows"),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 2. PLATFORM OVERVIEW ----
      heading1("2. Platform Overview"),
      heading2("2.1 What StratifyAI Does"),
      para("StratifyAI takes raw business inputs — stage, industry, budget, geography, and goals — and produces a complete, structured marketing strategy. The platform combines a sophisticated AI generation engine with an intuitive dashboard, giving users both the strategy and the tools to execute it."),

      spacer(),
      heading2("2.2 Core Capabilities"),
      bullet("AI Strategy Generation — complete 30/60/90-day marketing plans built from user inputs"),
      bullet("Target Persona Builder — detailed ICPs with pain points, channels, and messaging hooks"),
      bullet("Channel Recommendations — ranked channel strategy with budget allocation by ROI fit"),
      bullet("Content Calendar — theme-based content plan mapped to personas and business stage"),
      bullet("KPI Framework — north star metrics, leading and lagging indicators, success benchmarks"),
      bullet("Funnel Optimization — TOFU, MOFU, BOFU mapping with content types and conversion KPIs"),
      bullet("Growth Roadmaps — sequenced milestones tied to budget, team capacity, and goals"),
      bullet("AI Agents Execution — five specialized agents that act on the generated strategy"),
      bullet("Campaign Management — create, track, and manage campaigns with status and metrics"),

      spacer(),
      heading2("2.3 Platform Workflow"),
      para("The platform follows a clear three-step process from input to execution:"),
      spacer(),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { before: 80, after: 60 },
        children: [
          new TextRun({ text: "Input Business Details", bold: true, size: 22, color: DARK_TEXT, font: "Arial" }),
          new TextRun({ text: " — Enter your business stage, industry, budget range, geography, and goals. Optionally add product description, target audience hints, and competitor names.", size: 22, color: DARK_TEXT, font: "Arial" })
        ]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { before: 80, after: 60 },
        children: [
          new TextRun({ text: "AI Generates Strategy", bold: true, size: 22, color: DARK_TEXT, font: "Arial" }),
          new TextRun({ text: " — The engine processes your context through multi-provider AI models and produces a complete, structured marketing strategy in under 30 seconds.", size: 22, color: DARK_TEXT, font: "Arial" })
        ]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { before: 80, after: 60 },
        children: [
          new TextRun({ text: "Execute & Track Growth", bold: true, size: 22, color: DARK_TEXT, font: "Arial" }),
          new TextRun({ text: " — Run specialized AI agents on your strategy, launch campaigns, monitor KPIs on the analytics dashboard, and iterate weekly.", size: 22, color: DARK_TEXT, font: "Arial" })
        ]
      }),
      spacer(),
      para("Platform stats: 10,000+ strategies generated | 2,400+ startups & agencies | 30s average generation time | 94% user satisfaction"),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 3. AUTHENTICATION ----
      heading1("3. Authentication & User Management"),
      heading2("3.1 Registration & Login"),
      para("StratifyAI provides a secure, streamlined authentication experience supporting both email/password credentials and Google OAuth. New users can create an account in seconds with name, email, and a minimum 6-character password."),
      spacer(),
      makeFeatureTable([
        ["Auth Methods", "Email/password with JWT tokens; Google OAuth via Sign-In button"],
        ["Session", "Automatic persistence in localStorage; session validation on load"],
        ["Routing", "Protected route middleware with beforeLoad hooks; auto-redirect for authenticated users"],
        ["Password", "Minimum 6 characters; client-side validation before submission"],
      ]),

      spacer(),
      heading2("3.2 User Profile Data"),
      para("Each user profile stores identity, preferences, and platform configuration:"),
      spacer(),
      bullet("Name, email, role, and company"),
      bullet("Avatar selection from 6 pre-defined options with real-time update across the app"),
      bullet("Preferred AI provider (Together / Grok / Groq)"),
      bullet("Notification preferences: email notifications, weekly reports, auto-enrichment"),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 4. LANDING PAGE ----
      heading1("4. Landing Page & Marketing"),
      heading2("4.1 Landing Page Sections"),
      para("The public landing page communicates the platform's value proposition across seven distinct sections, each designed for a specific conversion objective."),
      spacer(),
      heading3("Navbar"),
      bullet("Logo with Sparkles icon, navigation links (Features, How it Works, Customers)"),
      bullet("Sign In link and Get Started CTA button"),
      bullet("Responsive mobile menu for small screens"),

      heading3("Hero Section"),
      bullet("Headline: \"Turn chaos into a clear marketing strategy\""),
      bullet("Subheadline: Generate data-driven 30/60/90-day plans in seconds"),
      bullet("Live preview cards showing Target Personas, MRR Forecast, Channel allocation, and 30/60/90 Roadmap"),
      bullet("CTA buttons: Generate Strategy and View Demo"),
      bullet("Social proof indicator: Trusted by 10,000+ founders"),

      heading3("Features Grid"),
      bullet("6 feature cards: AI Strategy Generator, Target Personas Builder, Channel Recommendations, Funnel Optimization, KPI Tracking, Growth Roadmaps"),
      bullet("Headline: \"Everything you need to launch and scale\""),

      heading3("How It Works"),
      bullet("3-step visual process: Input Business Details → AI Generates Strategy → Execute & Track Growth"),
      bullet("Stats bar: 10,000+ strategies | 2,400+ startups | 30s generation | 94% satisfaction"),

      heading3("Stats, CTA Banner & Footer"),
      bullet("Social proof metrics section reinforcing platform credibility"),
      bullet("Final call-to-action banner driving sign-up conversion"),
      bullet("Footer with navigation links and copyright information"),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 5. DASHBOARD ----
      heading1("5. Dashboard & Analytics"),
      heading2("5.1 Main Dashboard"),
      para("The main dashboard provides a personalized command center for each user, surfacing key metrics, recent activity, and quick actions at a glance."),
      spacer(),
      bullet("Personalized welcome section with user name"),
      bullet("Stats Cards: Total Strategies Generated, Agent Runs Count, Success Rate %, Average Execution Time"),
      bullet("Recent Strategies List: last 5 strategies with status indicators"),
      bullet("Recent Agent Runs: last 10 executions with progress bars"),
      bullet("Quick Action: New Strategy button linking directly to strategy generator"),
      bullet("Growth Pulse panel with pipeline value, MQL count, and goal progress"),

      spacer(),
      heading2("5.2 Analytics Page"),
      para("The Analytics page provides deeper insight into platform usage, agent performance, and execution trends over configurable time ranges."),
      spacer(),
      bullet("Time Range Selector: 3M / 6M / 12M views"),
      bullet("Key Metrics Cards: Total Strategies, Agent Runs, Success Rate, Average Execution Time"),
      bullet("Agent Execution Trend Chart: monthly bar chart visualization using Recharts"),
      bullet("Agent Performance Table: runs, success rate, execution time, and health status per agent type"),
      bullet("Recent Executions List with full execution history"),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 6. STRATEGY GENERATOR ----
      heading1("6. Marketing Strategy Generator"),
      heading2("6.1 Strategy Input Form"),
      para("Users configure their marketing strategy through a structured input form with both basic and advanced options:"),
      spacer(),
      heading3("Core Input Fields"),
      makeFeatureTable([
        ["Business Stage", "Idea Stage / MVP Stage / Growth Stage / Mature Stage"],
        ["Industry", "Free-text input for business sector or category"],
        ["Budget Range", "$0-1K/mo (Bootstrap) through $100K+/mo (Enterprise)"],
        ["Geography", "Free-text target market location"],
        ["Goals", "Multi-select chips: Lead Gen, Revenue Growth, Brand Awareness, Customer Retention, Product Launch"],
      ]),
      spacer(),
      heading3("Advanced Options (Collapsible)"),
      bullet("Product Description — detailed textarea for product/service context"),
      bullet("Target Audience Hint — textarea for specific audience guidance"),
      bullet("Competitors — tag input with add/remove functionality"),
      bullet("Sample Data button — pre-fill form for quick testing and demonstration"),

      spacer(),
      heading2("6.2 Strategy Output Structure"),
      para("The generated strategy is organized into 10 structured tabs, each representing a distinct strategic dimension:"),
      spacer(),
      makeFeatureTable([
        ["Executive Summary", "2–3 sentence strategic overview tailored to the business context"],
        ["Target Personas", "Detailed persona cards: demographics, pain points, goals, channels"],
        ["Channel Strategy", "Primary/secondary channels with budget allocation and ROI ranking"],
        ["Funnel Strategy", "TOFU/MOFU/BOFU stages with content types and stage-specific KPIs"],
        ["Content Themes", "Theme-based content ideas mapped to personas and business objectives"],
        ["KPI Framework", "North star metric, leading indicators, lagging indicators"],
        ["Roadmap", "30/60/90-day phases with objectives and key deliverables per phase"],
        ["Budget Allocation", "Breakdown across organic, paid, and tools spending"],
        ["Quick Wins", "Immediate actionable items for early momentum"],
        ["Risks & Mitigations", "Risk identification with corresponding mitigation strategies"],
      ]),

      spacer(),
      heading2("6.3 Strategy Scoring"),
      para("Every generated strategy receives a quality score across four dimensions:"),
      bullet("Completeness (0–100): Coverage of all core strategy sections"),
      bullet("Actionability (0–100): Specificity of executable recommendations"),
      bullet("Specificity (0–100): Degree of tailoring to user context"),
      bullet("Measurability (0–100): Clarity of defined success metrics"),
      para("The Overall Score is a weighted average of all four components, giving users immediate confidence assessment of their strategy."),

      spacer(),
      heading2("6.4 Export Functionality"),
      para("Strategies can be exported in three formats for use outside the platform:"),
      bullet("Markdown (.md) — for documentation tools and GitHub"),
      bullet("Plain Text (.txt) — for universal compatibility"),
      bullet("JSON (.json) — for programmatic integration and API use"),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 7. AI AGENTS ----
      heading1("7. AI Agents Execution System"),
      heading2("7.1 Agents Overview"),
      para("The AI Agents system is the execution layer of StratifyAI. After generating a strategy, users can deploy five specialized AI agents that act on specific dimensions of the strategy — producing campaign-ready outputs with real business utility."),
      spacer(),
      makeAgentTable(),

      spacer(),
      heading2("7.2 Agent Execution Flow"),
      para("Each agent follows a consistent four-stage execution pipeline:"),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { before: 80, after: 60 },
        children: [new TextRun({ text: "Strategy Selection — User selects from saved strategies to base the execution on.", size: 22, color: DARK_TEXT, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { before: 80, after: 60 },
        children: [new TextRun({ text: "Agent Card Selection — Click the desired agent card to initiate execution.", size: 22, color: DARK_TEXT, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { before: 80, after: 60 },
        children: [new TextRun({ text: "Execution Progress — Real-time progress indicators cycle through: Initializing → Generating → Executing → Completed.", size: 22, color: DARK_TEXT, font: "Arial" })]
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { before: 80, after: 60 },
        children: [new TextRun({ text: "Result Display — Structured output rendered based on agent type. All executions saved to MongoDB history.", size: 22, color: DARK_TEXT, font: "Arial" })]
      }),

      spacer(),
      heading2("7.3 Agent Output Types"),
      heading3("Content Agent"),
      bullet("Platform-specific social posts with channel targeting"),
      bullet("Content calendar with scheduled publication timeline"),
      bullet("Editorial notes and content strategy guidance"),

      heading3("Channel Agent"),
      bullet("Channel-by-channel plan with audience and objective alignment"),
      bullet("Weekly execution schedule across all channels"),
      bullet("Budget allocation recommendations and shift triggers"),
      bullet("Insight summary with strategic rationale"),

      heading3("Campaign Execution Agent"),
      bullet("Campaign task list with ownership and priority"),
      bullet("Timeline phases with milestones and dependencies"),
      bullet("Email campaign: subject, body, segments, and dispatch configuration"),
      bullet("Launch checklist and success metrics"),

      heading3("Analytics Agent"),
      bullet("KPI definitions with targets and tracking methodology"),
      bullet("Dashboard configuration for monitoring setup"),
      bullet("Alert rules for threshold-based notifications"),
      bullet("Tracking plan and reporting schedule"),

      heading3("Optimization Agent"),
      bullet("Prioritized recommendation list with implementation guidance"),
      bullet("A/B test proposals with hypothesis and measurement criteria"),
      bullet("Quick wins for immediate impact"),
      bullet("Strategic notes for long-term optimization direction"),

      spacer(),
      heading2("7.4 Campaign Email Dispatch"),
      bullet("Enable/disable email dispatch toggle per agent run"),
      bullet("Recipient list input via comma-separated addresses"),
      bullet("Subject line customization"),
      bullet("HTML email preview before sending"),
      bullet("Actual email delivery via configured SMTP backend"),

      spacer(),
      heading2("7.5 Agent History & Rerunning"),
      bullet("Filter executions by agent type or view all history"),
      bullet("View full execution details and structured outputs"),
      bullet("One-click rerun of any previous execution"),
      bullet("Success rate tracking and execution time analytics"),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 8. CAMPAIGN MANAGEMENT ----
      heading1("8. Campaign Management"),
      heading2("8.1 Campaigns Overview"),
      para("The Campaigns module provides a lightweight but functional campaign management layer, allowing users to track and manage marketing campaigns created through the platform or manually."),
      spacer(),
      makeFeatureTable([
        ["Campaign Status", "Active / Paused / Draft with color-coded status indicators"],
        ["Core Fields", "Name, channel, objective, start/end dates, budget"],
        ["Metrics", "Reach (with k-suffix formatting), conversion rate"],
        ["Operations", "Create, update (PATCH), status change via dropdown"],
      ]),

      spacer(),
      heading2("8.2 Campaign Operations"),
      bullet("Create campaigns with name, channel, and objective as required fields"),
      bullet("Update any campaign attribute via PATCH endpoint for partial updates"),
      bullet("Change campaign status with instant visual feedback via color coding"),
      bullet("View reach metrics with human-readable formatting (e.g., 12.4k)"),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 9. NOTIFICATIONS ----
      heading1("9. Notifications System"),
      heading2("9.1 Notification Features"),
      para("The notifications system keeps users informed of platform activity across strategy generation, agent execution, and system events."),
      spacer(),
      bullet("All/Unread filter tabs for focused inbox management"),
      bullet("Typed notification cards: Alert (red) for failures, Success (green) for completions, Info (blue) for reports"),
      bullet("NEW badge on unread items for at-a-glance prioritization"),
      bullet("Mark individual notifications as read"),
      bullet("Mark all as read with single action"),

      spacer(),
      heading2("9.2 Notification Sources"),
      bullet("Strategy generation completion events"),
      bullet("Agent execution completions and failures"),
      bullet("System notifications including weekly report availability"),

      spacer(),
      heading2("9.3 Topbar Notification Bell"),
      bullet("Persistent notification bell icon in the application topbar"),
      bullet("Unread count badge with live update"),
      bullet("Dropdown panel surfacing the most recent notifications"),
      bullet("Quick navigation link to the full notifications page"),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 10. USER SETTINGS ----
      heading1("10. User Settings & Preferences"),
      heading2("10.1 Settings Categories"),
      heading3("Avatar & Identity"),
      bullet("6 pre-defined avatar images selectable via visual grid"),
      bullet("Avatar updates persist across all app sessions and surfaces"),
      bullet("Name, role, and company fields with real-time profile updates"),

      heading3("AI Provider Preference"),
      bullet("Together AI (default) — Meta Llama models via Together AI API"),
      bullet("Grok — xAI models for alternative generation"),
      bullet("Groq — High-speed inference for faster strategy generation"),
      para("Provider preference is stored both in localStorage and the backend for session persistence. Active provider is visible in the UI with a provider indicator badge."),

      heading3("Notification Preferences"),
      bullet("Email notifications toggle"),
      bullet("Weekly reports toggle"),
      bullet("Auto-enrichment toggle for automated data processing"),

      heading3("Danger Zone"),
      bullet("Delete workspace option for full account data removal"),

      spacer(),
      heading2("10.2 AI Provider System"),
      para("The unified AI service layer provides transparent multi-provider access with automatic fallback. If the user's preferred provider is unavailable or fails, the system automatically routes to an alternative provider without disrupting the user experience."),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 11. TECHNICAL ARCHITECTURE ----
      heading1("11. Technical Architecture"),
      heading2("11.1 System Architecture Overview"),
      para("StratifyAI is a full-stack SaaS application with a React frontend, Flask backend, MongoDB database, and a multi-provider AI abstraction layer. The architecture is designed for scalability, provider flexibility, and rapid iteration."),
      spacer(),
      makeFeatureTable([
        ["Frontend", "React 19 + TypeScript + TanStack Router + TailwindCSS 4"],
        ["Backend", "Flask 3.1.0 + Python with JWT authentication"],
        ["Database", "MongoDB with PyMongo — 5 collections"],
        ["AI Layer", "Unified service supporting Together AI, Grok, and Groq"],
        ["Email", "SMTP-based email service for campaign dispatch"],
        ["Auth", "JWT tokens + Google OAuth via Google Sign-In"],
      ]),

      spacer(),
      heading2("11.2 Frontend Architecture"),
      heading3("Key Dependencies"),
      bullet("@tanstack/react-router — file-based routing with type safety"),
      bullet("TailwindCSS 4 — utility-first styling with glassmorphism design system"),
      bullet("Radix UI + shadcn/ui — 46+ headless and pre-built UI components"),
      bullet("Recharts — data visualization for analytics and agent performance charts"),
      bullet("Lucide React — consistent iconography throughout the application"),
      bullet("Sonner — toast notification system"),
      bullet("date-fns — date formatting and manipulation"),

      spacer(),
      heading2("11.3 Backend Architecture"),
      heading3("Route Structure"),
      bullet("Auth routes (/api/auth): register, login, Google OAuth, profile retrieval"),
      bullet("App Data routes (/api/app-data): dashboard, analytics, campaigns, notifications, settings"),
      bullet("Strategy routes (/api/marketing-strategy): generate, refine, export, agent execute"),
      bullet("Agents routes (/api/agents): execute, history, rerun, strategy and task management"),

      heading3("Service Layer"),
      bullet("unified_ai_service.py — multi-provider AI abstraction with automatic fallback"),
      bullet("agents_service.py — core agent execution logic for all five agent types"),
      bullet("email_service.py — SMTP email sending for campaign dispatch"),
      bullet("mongo_service.py — MongoDB connection pooling and collection management"),

      spacer(),
      heading2("11.4 Database Schema"),
      para("MongoDB is used as the primary database with five collections:"),
      makeFeatureTable([
        ["users", "User profiles, preferences, avatar selections, auth data"],
        ["strategies", "Generated marketing strategies with full structured output"],
        ["agent_executions", "Agent run history with inputs, outputs, and metadata"],
        ["campaigns", "User campaigns with status, metrics, and timeline"],
        ["notifications", "User notification history with type and read status"],
      ]),

      spacer(),
      heading2("11.5 AI Provider Integration"),
      para("StratifyAI supports three AI providers through a unified abstraction layer, giving users choice and ensuring reliability through automatic fallback:"),
      bullet("Together AI (default) — Meta Llama models; primary generation provider"),
      bullet("Grok — xAI models; alternative generation with distinct reasoning style"),
      bullet("Groq — High-speed inference; optimized for rapid strategy generation"),
      para("Each provider is configured with appropriate temperature and token settings per request type. Provider health checks ensure smooth automatic fallback when a provider is unavailable."),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 12. DESIGN SYSTEM ----
      heading1("12. UI/UX Design System"),
      heading2("12.1 Color Palette"),
      makeFeatureTable([
        ["Primary", "Purple gradient (#7C3AED → #4C1D95) — brand identity and CTAs"],
        ["Accent", "Coral (#F97316) — highlights and gradient text effects"],
        ["Background", "Dark navy (#1E1B4B) — glassmorphism dark theme base"],
        ["Success", "Green (#059669) — positive status indicators"],
        ["Error/Alert", "Coral/red — failure states and critical notifications"],
        ["Muted", "Gray (#9CA3AF) — secondary text and metadata"],
      ]),

      spacer(),
      heading2("12.2 Component Patterns"),
      bullet("Glass Cards — backdrop-blur effect with white/10 borders for card surfaces"),
      bullet("Gradient Buttons — btn-glow class with purple-to-coral gradients"),
      bullet("Rounded Inputs — dark backgrounds with subtle white borders"),
      bullet("Hover Cards — card-hover class with subtle lift and shadow on interaction"),
      bullet("Progress Bars — gradient fills for visual progress representation"),

      spacer(),
      heading2("12.3 Layout System"),
      makeFeatureTable([
        ["Sidebar", "Collapsible — 64px expanded / 20px icon-only collapsed state"],
        ["Topbar", "Fixed header with notification bell and user profile access"],
        ["Main Content", "Responsive padding: p-4 on mobile, p-8 on desktop"],
        ["Grid System", "CSS Grid with responsive breakpoints for dashboard stat cards"],
        ["Typography", "Inter/system font stack; gradient text for key headlines"],
      ]),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 13. SECURITY ----
      heading1("13. Security & Compliance"),
      heading2("13.1 Authentication Security"),
      bullet("JWT token-based authentication with server-side validation"),
      bullet("Google OAuth 2.0 integration via verified Google Sign-In SDK"),
      bullet("Protected route middleware preventing unauthorized access to app routes"),
      bullet("Automatic session invalidation and redirect on token expiry"),

      heading2("13.2 Data Security"),
      bullet("All API endpoints require valid JWT bearer token"),
      bullet("User data scoped per account — strategies, campaigns, and notifications are user-isolated"),
      bullet("Environment-based configuration for all secrets, API keys, and connection strings"),
      bullet("CORS configuration restricting cross-origin requests to defined origins"),

      heading2("13.3 Email Security"),
      bullet("SMTP credentials managed via environment variables, never hardcoded"),
      bullet("Email dispatch requires authenticated user session"),
      bullet("Recipient validation before campaign email dispatch"),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 14. BUSINESS IMPACT ----
      heading1("14. Business Impact & ROI"),
      heading2("14.1 Key Metrics"),
      para("StratifyAI delivers measurable impact across critical business dimensions:"),
      spacer(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [3120, 3120, 3120],
        rows: [
          new TableRow({
            children: [
              new TableCell({
                borders,
                width: { size: 3120, type: WidthType.DXA },
                shading: { fill: DARK_PURPLE, type: ShadingType.CLEAR },
                margins: { top: 120, bottom: 120, left: 160, right: 160 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Metric", bold: true, size: 22, color: WHITE, font: "Arial" })] })]
              }),
              new TableCell({
                borders,
                width: { size: 3120, type: WidthType.DXA },
                shading: { fill: DARK_PURPLE, type: ShadingType.CLEAR },
                margins: { top: 120, bottom: 120, left: 160, right: 160 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Before StratifyAI", bold: true, size: 22, color: WHITE, font: "Arial" })] })]
              }),
              new TableCell({
                borders,
                width: { size: 3120, type: WidthType.DXA },
                shading: { fill: DARK_PURPLE, type: ShadingType.CLEAR },
                margins: { top: 120, bottom: 120, left: 160, right: 160 },
                children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "With StratifyAI", bold: true, size: 22, color: WHITE, font: "Arial" })] })]
              }),
            ]
          }),
          ...([
            ["Strategy creation time", "2–4 weeks", "Under 30 seconds"],
            ["Strategy cost", "$5,000–$20,000 consultant", "SaaS subscription"],
            ["Persona development", "3–5 business days", "Included in strategy"],
            ["KPI framework setup", "1–2 weeks", "Auto-generated"],
            ["Channel plan creation", "1 week", "Instant, ranked by ROI"],
          ].map(([m, b, a], i) => new TableRow({
            children: [
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: i%2===0 ? "F5F3FF" : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 160 }, children: [new Paragraph({ children: [new TextRun({ text: m, size: 20, color: DARK_TEXT, font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: i%2===0 ? "F5F3FF" : WHITE, type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 160 }, children: [new Paragraph({ children: [new TextRun({ text: b, size: 20, color: DARK_TEXT, font: "Arial" })] })] }),
              new TableCell({ borders, width: { size: 3120, type: WidthType.DXA }, shading: { fill: i%2===0 ? "D1FAE5" : "F0FDF4", type: ShadingType.CLEAR }, margins: { top: 80, bottom: 80, left: 160, right: 160 }, children: [new Paragraph({ children: [new TextRun({ text: a, bold: true, size: 20, color: "065F46", font: "Arial" })] })] }),
            ]
          })))
        ]
      }),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 15. PRODUCT ROADMAP ----
      heading1("15. Product Roadmap"),
      heading2("15.1 Short-Term (Q2–Q3 2026)"),
      bullet("Enhanced strategy refinement with multi-turn AI conversation"),
      bullet("Expanded export formats: PowerPoint deck and PDF report"),
      bullet("Team collaboration features with shared strategy workspaces"),
      bullet("Webhook support for strategy completion events"),

      heading2("15.2 Mid-Term (Q4 2026)"),
      bullet("CRM and marketing tool integrations (HubSpot, Mailchimp, Google Analytics)"),
      bullet("Custom AI model fine-tuning per industry vertical"),
      bullet("Advanced A/B testing framework with statistical significance tracking"),
      bullet("White-label deployment for agency partners"),

      heading2("15.3 Long-Term (2027+)"),
      bullet("Real-time strategy adaptation based on live campaign performance data"),
      bullet("Predictive revenue forecasting integrated into roadmap planning"),
      bullet("Multi-language strategy generation for global market expansion"),
      bullet("Enterprise SSO and advanced role-based access control"),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- 16. CONCLUSION ----
      heading1("16. Conclusion"),
      para("StratifyAI represents a step change in how businesses approach marketing strategy. By combining the depth of expert marketing thinking with the speed and scalability of AI, the platform makes world-class strategic planning accessible to every founder and growth team — regardless of budget or team size."),
      spacer(),
      para("The platform's multi-agent execution system goes beyond strategy generation to become a genuine execution companion — turning plans into campaigns, content calendars into posts, and KPI frameworks into live dashboards. With a modern technical architecture, flexible AI provider support, and a design system built for clarity and trust, StratifyAI is positioned to be the definitive strategy platform for the next generation of data-driven companies."),
      spacer(),
      heading2("Why StratifyAI Wins"),
      makeComparisonTable(),

      spacer(),
      para("StratifyAI is built for the world where marketing clarity is a competitive advantage — and AI is the fastest path to getting there.", { italics: true, color: ACCENT }),

      sectionDivider(),
      new Paragraph({ children: [new PageBreak()] }),

      // ---- APPENDIX ----
      heading1("Appendix: Technical Reference"),
      heading2("A. API Endpoints Summary"),
      makeFeatureTable([
        ["POST /api/auth/register", "User registration with name, email, password"],
        ["POST /api/auth/login", "Email/password login returning JWT token"],
        ["POST /api/auth/google", "Google OAuth token verification and login"],
        ["GET /api/app-data/dashboard", "Dashboard statistics and recent activity"],
        ["GET /api/app-data/analytics", "Analytics data with time range filter"],
        ["POST /api/marketing-strategy/generate", "Generate full marketing strategy"],
        ["POST /api/marketing-strategy/refine", "Refine a specific strategy section"],
        ["POST /api/marketing-strategy/export", "Export strategy in specified format"],
        ["POST /api/agents/execute", "Execute a specialized AI agent on a strategy"],
        ["GET /api/agents/history", "Retrieve agent execution history"],
        ["POST /api/agents/rerun", "Rerun a previous agent execution"],
        ["GET /api/app-data/campaigns", "List user campaigns"],
        ["POST /api/app-data/campaigns", "Create new campaign"],
        ["PATCH /api/app-data/campaigns/:id", "Update campaign attributes"],
        ["GET /api/app-data/notifications", "Retrieve user notifications"],
        ["POST /api/app-data/notifications/read-all", "Mark all notifications as read"],
      ]),

      spacer(),
      heading2("B. Supported Business Stages"),
      bullet("Idea Stage — Pre-launch, validating concept"),
      bullet("MVP Stage — Early traction, finding product-market fit"),
      bullet("Growth Stage — Scaling operations and revenue"),
      bullet("Mature Stage — Optimizing efficiency and retention"),

      heading2("C. Supported Budget Ranges"),
      bullet("$0–1K/mo — Bootstrap"),
      bullet("$1K–5K/mo — Starter"),
      bullet("$5K–20K/mo — Growth"),
      bullet("$20K–100K/mo — Scale"),
      bullet("$100K+/mo — Enterprise"),

      heading2("D. Supported Marketing Goals"),
      bullet("Lead Generation"),
      bullet("Revenue Growth"),
      bullet("Brand Awareness"),
      bullet("Customer Retention"),
      bullet("Product Launch"),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("./StratifyAI_Features_Document.docx", buffer);
  console.log("Done! Document saved as StratifyAI_Features_Document.docx");
});
