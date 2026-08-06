export type SiteSettings = { key: string; value: string; updated_at?: string };
export type Album = { id: string; title: string; slug: string; description: string | null; cover_url: string | null; sort_order: number; published: boolean };
export type Photo = { id: string; album_id: string | null; title: string | null; description: string | null; image_path: string; image_url?: string; sort_order: number; featured: boolean; published: boolean };
export type Project = { id: string; title: string; slug: string; description: string; body: string | null; technologies: string[]; links: { label: string; url: string }[]; image_path: string | null; image_url?: string | null; date: string | null; category: string; featured: boolean; published: boolean };
export const projectCategories = ['Coding','Web development','3D printing','Filmmaking','Self-hosting','Engineering'] as const;
export type ProjectCategory = typeof projectCategories[number];
