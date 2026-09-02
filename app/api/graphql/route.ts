import { DOCS_URL } from "@/lib/site-urls";
import { searchIndex } from "@/lib/guide-registry";
import { NextRequest, NextResponse } from "next/server";

/** Minimal search for MCP docs feature — scores simple term overlap. */
function searchDocs(query: string, limit = 8) {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (!terms.length) return [];

  return searchIndex()
    .map((doc) => {
      const hay = doc.content.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (hay.includes(t)) score += 1;
        if (doc.title.toLowerCase().includes(t)) score += 2;
        if (doc.slug.includes(t)) score += 2;
      }
      return { doc, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ doc }) => ({
      title: doc.title,
      href: `${DOCS_URL}${doc.href}`,
      content: doc.description,
    }));
}

export async function POST(req: NextRequest) {
  let body: { query?: string; operationName?: string; variables?: { query?: string } };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ errors: [{ message: "Invalid JSON" }] }, { status: 400 });
  }

  const searchQuery =
    body.variables?.query ||
    (typeof body.query === "string" && body.query.match(/query\s*:\s*"([^"]+)"/)?.[1]) ||
    "";

  const results = searchDocs(searchQuery);

  return NextResponse.json({
    data: {
      searchDocs: results,
    },
  });
}

export async function GET() {
  return NextResponse.json({
    data: {
      __schema: {
        queryType: { name: "Query" },
      },
    },
  });
}
