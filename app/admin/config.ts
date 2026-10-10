/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createBlog, updateBlog, deleteBlog, getBlogs,
  createProject, updateProject, deleteProject, getProjects,
  createExperience, updateExperience, deleteExperience, getExperiences,
  createGalleryItem, updateGalleryItem, deleteGalleryItem, getGallery,
  createSkill, updateSkill, deleteSkill, getSkills,
} from "@/lib/api";

export type ResourceTab = "blogs" | "projects" | "gallery" | "experiences" | "skills";
export type Tab = "overview" | ResourceTab | "profile";

/** Only these fields are ever sent to the API (list endpoints add computed counts that Prisma would reject). */
export const FIELDS: Record<ResourceTab | "profile", string[]> = {
  blogs: ["title_en", "title_id", "slug", "excerpt_en", "excerpt_id", "content_en", "content_id", "category", "date", "image"],
  projects: ["title_en", "title_id", "description_en", "description_id", "type", "techStack", "image", "demoUrl", "githubUrl", "isFeatured", "order"],
  experiences: ["year", "role_en", "role_id", "company", "description_en", "description_id", "order"],
  gallery: ["imageUrl", "caption_en", "caption_id", "location", "date"],
  skills: ["name", "category", "icon", "level", "order"],
  profile: ["name", "role_en", "role_id", "bio_en", "bio_id", "tagline_en", "tagline_id", "imageUrl", "github", "linkedin", "twitter"],
};

export const REQUIRED: Record<ResourceTab, [string, string][]> = {
  blogs: [["title_en", "English title"], ["title_id", "Judul Indonesia"], ["slug", "URL slug"], ["category", "Category"], ["excerpt_en", "English excerpt"], ["excerpt_id", "Ringkasan Indonesia"], ["content_en", "English content"], ["content_id", "Konten Indonesia"]],
  projects: [["title_en", "Title (EN)"], ["title_id", "Title (ID)"], ["type", "Type"], ["techStack", "Tech stack"], ["description_en", "Description (EN)"], ["description_id", "Description (ID)"]],
  experiences: [["year", "Period"], ["company", "Company"], ["role_en", "Role (EN)"], ["role_id", "Role (ID)"], ["description_en", "Description (EN)"], ["description_id", "Description (ID)"]],
  gallery: [["imageUrl", "Photo"]],
  skills: [["name", "Name"]],
};

export const RESOURCES = {
  blogs: { label: "Articles", singular: "article", list: () => getBlogs(), create: createBlog, update: updateBlog, remove: deleteBlog },
  projects: { label: "Projects", singular: "project", list: getProjects, create: createProject, update: updateProject, remove: deleteProject },
  gallery: { label: "Gallery", singular: "photo", list: getGallery, create: createGalleryItem, update: updateGalleryItem, remove: deleteGalleryItem },
  experiences: { label: "Experience", singular: "experience", list: getExperiences, create: createExperience, update: updateExperience, remove: deleteExperience },
  skills: { label: "Skills", singular: "skill", list: getSkills, create: createSkill, update: updateSkill, remove: deleteSkill },
} as const;

export const pick = (data: Record<string, any>, fields: string[]) =>
  Object.fromEntries(fields.filter((f) => f in data).map((f) => [f, data[f]]));

export const itemTitle = (tab: ResourceTab, i: any): string =>
  (tab === "blogs" && i.title_en) ||
  (tab === "projects" && i.title_en) ||
  (tab === "gallery" && (i.caption_en || i.location)) ||
  (tab === "experiences" && i.role_en) ||
  (tab === "skills" && i.name) ||
  "Untitled";

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

export const blankFor = (tab: ResourceTab): Record<string, any> =>
  tab === "projects" ? { isFeatured: false, order: 0 } : tab === "skills" ? { level: 70, order: 0 } : tab === "experiences" ? { order: 0 } : {};
