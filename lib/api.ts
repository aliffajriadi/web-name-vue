import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://192.168.1.8:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Set API key for admin actions
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["x-api-key"] = token;
  } else {
    delete api.defaults.headers.common["x-api-key"];
  }
};

// Verify API key
export const verifyAuth = () => api.get("/auth/verify").then((res) => res.data);

// Define types for better type safety
export interface Profile {
  id?: string;
  name?: string;
  role_en?: string;
  role_id?: string;
  bio_en?: string;
  bio_id?: string;
  tagline_en?: string;
  tagline_id?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

export interface Project {
  id?: string;
  title_en: string;
  title_id: string;
  description_en: string;
  description_id: string;
  type: string;
  techStack: string;
  image?: string;
  demoUrl?: string;
  githubUrl?: string;
  isFeatured?: boolean;
}

export interface Blog {
  id?: string;
  title_en: string;
  title_id: string;
  slug: string;
  content_en: string;
  content_id: string;
  excerpt_en: string;
  excerpt_id: string;
  image?: string;
  category: string;
  date?: string | Date; // Added date field
}

export interface Experience {
  id?: string;
  year: string;
  role_en: string;
  role_id: string;
  company: string;
  description_en: string;
  description_id: string;
}

export interface GalleryItem {
  id?: string;
  imageUrl: string;
  caption_en?: string;
  caption_id?: string;
  location?: string;
  date?: string | Date;
  likesCount?: number;
  isLiked?: boolean;
}

// ... (keep intervening code)

// ... (keep intervening code)

export interface Skill {
  id?: string;
  name: string;
  category: string;
  level: number;
  order: number;
  icon?: string;
}

// --- Profile ---
export const getProfile = () => api.get("/profile").then((res) => res.data);
export const updateProfile = (data: Partial<Profile>) =>
  api.put("/profile", data).then((res) => res.data);

// --- Projects ---
export const getProjects = () => api.get("/projects").then((res) => res.data);
export const createProject = (data: Omit<Project, "id">) =>
  api.post("/projects", data).then((res) => res.data);
export const updateProject = (id: string, data: Partial<Project>) =>
  api.put(`/projects/${id}`, data).then((res) => res.data);
export const deleteProject = (id: string) =>
  api.delete(`/projects/${id}`).then((res) => res.data);

// --- Blogs ---
export const getBlogs = (params?: { category?: string; search?: string }) =>
  api.get("/blogs", { params }).then((res) => res.data);
export const getBlogBySlug = (slug: string) =>
  api.get(`/blogs/${slug}`).then((res) => res.data);
export const getBlogCategories = () =>
  api.get("/blogs/categories").then((res) => res.data);
export const createBlog = (data: Omit<Blog, "id">) =>
  api.post("/blogs", data).then((res) => res.data);
export const updateBlog = (id: string, data: Partial<Blog>) =>
  api.put(`/blogs/${id}`, data).then((res) => res.data);
export const deleteBlog = (id: string) =>
  api.delete(`/blogs/${id}`).then((res) => res.data);

// --- Experiences ---
export const getExperiences = () =>
  api.get("/experiences").then((res) => res.data);
export const createExperience = (data: Omit<Experience, "id">) =>
  api.post("/experiences", data).then((res) => res.data);
export const updateExperience = (id: string, data: Partial<Experience>) =>
  api.put(`/experiences/${id}`, data).then((res) => res.data);
export const deleteExperience = (id: string) =>
  api.delete(`/experiences/${id}`).then((res) => res.data);

// --- Gallery ---
export const getGallery = () => api.get("/gallery").then((res) => res.data);
export const createGalleryItem = (data: Omit<GalleryItem, "id">) =>
  api.post("/gallery", data).then((res) => res.data);
export const updateGalleryItem = (id: string, data: Partial<GalleryItem>) =>
  api.put(`/gallery/${id}`, data).then((res) => res.data);
export const deleteGalleryItem = (id: string) =>
  api.delete(`/gallery/${id}`).then((res) => res.data);
export const toggleGalleryLike = (id: string) =>
  api.post(`/gallery/${id}/like`).then((res) => res.data);

// --- Skills ---
export const getSkills = () => api.get("/skills").then((res) => res.data);
export const createSkill = (data: Omit<Skill, "id">) =>
  api.post("/skills", data).then((res) => res.data);
export const updateSkill = (id: string, data: Partial<Skill>) =>
  api.put(`/skills/${id}`, data).then((res) => res.data);
export const deleteSkill = (id: string) =>
  api.delete(`/skills/${id}`).then((res) => res.data);

export default api;
