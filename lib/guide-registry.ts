import { allGuides, guidePath } from "@/lib/content/guides";
import type { NavGroup } from "@/lib/types";

export const DOC_NAV: NavGroup[] = [
  {
    title: "Start",
    items: [{ slug: ["getting-started"], title: "Getting started" }],
  },
  {
    title: "Auth",
    items: [
      { slug: ["auth", "redirect-urls"], title: "Redirect URLs" },
      { slug: ["auth", "auth-hooks"], title: "Auth hooks" },
      {
        slug: ["auth", "auth-hooks", "send-email-hook"],
        title: "Send Email hook",
      },
    ],
  },
  {
    title: "Database",
    items: [
      {
        slug: ["database", "postgres", "row-level-security"],
        title: "Row Level Security",
      },
      { slug: ["database", "postgres", "roles"], title: "Postgres roles" },
      { slug: ["database", "migrations"], title: "Migrations" },
      { slug: ["database", "postgres", "functions"], title: "Functions" },
      { slug: ["database", "postgres", "triggers"], title: "Triggers" },
    ],
  },
  {
    title: "Platform",
    items: [
      { slug: ["storage"], title: "Storage" },
      {
        slug: ["storage", "security", "access-control"],
        title: "Storage access control",
      },
      { slug: ["functions"], title: "Edge Functions" },
      { slug: ["realtime"], title: "Realtime" },
      { slug: ["hosting"], title: "App hosting" },
      { slug: ["security", "advisors"], title: "Security advisors" },
    ],
  },
  {
    title: "CLI",
    items: [{ slug: ["cli", "getting-started"], title: "Zuvo CLI" }],
  },
];

/** Flat search index for MCP GraphQL */
export function searchIndex() {
  return allGuides().map((g) => ({
    slug: g.slug.join("/"),
    title: g.title,
    description: g.description,
    href: guidePath(g.slug),
    content: `${g.title} ${g.description} ${g.searchText} ${g.body}`,
  }));
}

export function allGuideSlugs(): string[][] {
  return allGuides().map((g) => g.slug);
}
