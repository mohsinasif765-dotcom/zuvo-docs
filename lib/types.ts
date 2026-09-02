export type GuidePage = {
  slug: string[];
  title: string;
  description: string;
  /** Plain-text body used for MCP search indexing */
  searchText: string;
  body: string;
};

export type NavGroup = {
  title: string;
  items: { slug: string[]; title: string; href: string }[];
};
