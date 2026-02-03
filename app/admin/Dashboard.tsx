"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import Image from "next/image";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  updateProfile,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  setAuthToken,
} from "@/lib/api";
import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  LogOut,
  X,
  Save,
  User,
  FileText,
  Briefcase,
  History,
  Sparkles,
  Loader2,
  Camera,
  Command,
  Globe,
  Languages as LanguagesIcon,
  RefreshCw,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import MediumEditor from "@/components/admin/MediumEditor";

interface DashboardProps {
  apiKey: string;
  onLogout: () => void;
}

export default function Dashboard({ apiKey, onLogout }: DashboardProps) {
  const [tab, setTab] = useState<
    "profile" | "blogs" | "projects" | "experiences" | "gallery" | "skills"
  >("profile");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const [blogLang, setBlogLang] = useState<"en" | "id">("en");
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "idle">(
    "idle",
  );

  const queryClient = useQueryClient();

  useEffect(() => {
    setAuthToken(apiKey);
    return () => setAuthToken(null);
  }, [apiKey]);

  // Queries
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: getProfile });
  const blogsQuery = useQuery({
    queryKey: ["blogs-admin"],
    queryFn: () => getBlogs(),
  });
  const projectsQuery = useQuery({
    queryKey: ["projects-admin"],
    queryFn: getProjects,
  });
  const experiencesQuery = useQuery({
    queryKey: ["experiences-admin"],
    queryFn: getExperiences,
  });
  const galleryQuery = useQuery({
    queryKey: ["gallery-admin"],
    queryFn: getGallery,
  });
  const skillsQuery = useQuery({
    queryKey: ["skills-admin"],
    queryFn: getSkills,
  });

  // Mutations
  const mutationOptions = (key: string) => ({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [key] });
      closeModal();
    },
  });

  const blogMutations = {
    create: useMutation({
      mutationFn: createBlog,
      ...mutationOptions("blogs-admin"),
    }),
    update: useMutation({
      mutationFn: (data: any) => updateBlog(editingId!, data),
      ...mutationOptions("blogs-admin"),
    }),
    delete: useMutation({
      mutationFn: deleteBlog,
      ...mutationOptions("blogs-admin"),
    }),
  };

  const projectMutations = {
    create: useMutation({
      mutationFn: createProject,
      ...mutationOptions("projects-admin"),
    }),
    update: useMutation({
      mutationFn: (data: any) => updateProject(editingId!, data),
      ...mutationOptions("projects-admin"),
    }),
    delete: useMutation({
      mutationFn: deleteProject,
      ...mutationOptions("projects-admin"),
    }),
  };

  const experienceMutations = {
    create: useMutation({
      mutationFn: createExperience,
      ...mutationOptions("experiences-admin"),
    }),
    update: useMutation({
      mutationFn: (data: any) => updateExperience(editingId!, data),
      ...mutationOptions("experiences-admin"),
    }),
    delete: useMutation({
      mutationFn: deleteExperience,
      ...mutationOptions("experiences-admin"),
    }),
  };

  const galleryMutations = {
    create: useMutation({
      mutationFn: createGalleryItem,
      ...mutationOptions("gallery-admin"),
    }),
    update: useMutation({
      mutationFn: (data: any) => updateGalleryItem(editingId!, data),
      ...mutationOptions("gallery-admin"),
    }),
    delete: useMutation({
      mutationFn: deleteGalleryItem,
      ...mutationOptions("gallery-admin"),
    }),
  };

  const skillMutations = {
    create: useMutation({
      mutationFn: createSkill,
      ...mutationOptions("skills-admin"),
    }),
    update: useMutation({
      mutationFn: (data: any) => updateSkill(editingId!, data),
      ...mutationOptions("skills-admin"),
    }),
    delete: useMutation({
      mutationFn: deleteSkill,
      ...mutationOptions("skills-admin"),
    }),
  };

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      alert("Success: Profile harmonized with database.");
    },
  });

  // Handlers
  const openEdit = (item: any) => {
    setEditingId(item.id);
    setFormData(item);
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "blogs") {
      if (editingId) {
        blogMutations.update.mutate(formData);
      } else {
        blogMutations.create.mutate(formData);
      }
    } else if (tab === "projects") {
      if (editingId) {
        projectMutations.update.mutate(formData);
      } else {
        projectMutations.create.mutate(formData);
      }
    } else if (tab === "experiences") {
      if (editingId) {
        experienceMutations.update.mutate(formData);
      } else {
        experienceMutations.create.mutate(formData);
      }
    } else if (tab === "gallery") {
      if (editingId) {
        galleryMutations.update.mutate(formData);
      } else {
        galleryMutations.create.mutate(formData);
      }
    } else if (tab === "skills") {
      if (editingId) {
        skillMutations.update.mutate(formData);
      } else {
        skillMutations.create.mutate(formData);
      }
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    profileMutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    // @ts-expect-error: suppressing implicit any for checked property check
    const val = type === "checkbox" ? e.target.checked : value;
    setFormData((prev: any) => ({ ...prev, [name]: val }));
  };

  useEffect(() => {
    if (tab === "profile" && profileQuery.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(profileQuery.data);
    }
  }, [tab, profileQuery.data]);

  const renderForm = () => {
    if (tab === "blogs") {
      return (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Title (EN)
              </label>
              <input
                name="title_en"
                value={formData.title_en || ""}
                onChange={handleChange}
                placeholder="Article Title"
                className="admin-input-premium"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Judul (ID)
              </label>
              <input
                name="title_id"
                value={formData.title_id || ""}
                onChange={handleChange}
                placeholder="Judul Indonesia"
                className="admin-input-premium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Slug
              </label>
              <input
                name="slug"
                value={formData.slug || ""}
                onChange={handleChange}
                placeholder="e.g. advent-of-iot"
                className="admin-input-premium"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Category
              </label>
              <input
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                placeholder="e.g. Engineering"
                className="admin-input-premium"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Cover Image URL
              </label>
              <input
                name="image"
                value={formData.image || ""}
                onChange={handleChange}
                placeholder="https://..."
                className="admin-input-premium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Excerpt (EN)
              </label>
              <textarea
                name="excerpt_en"
                value={formData.excerpt_en || ""}
                onChange={handleChange}
                className="admin-input-premium h-24"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Excerpt (ID)
              </label>
              <textarea
                name="excerpt_id"
                value={formData.excerpt_id || ""}
                onChange={handleChange}
                className="admin-input-premium h-24"
                required
              />
            </div>
          </div>

          <div className="flex border-b border-border gap-4">
            <button
              type="button"
              onClick={() => setBlogLang("en")}
              className={`px-6 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${blogLang === "en" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
            >
              <Globe size={14} /> English Manuscript
            </button>
            <button
              type="button"
              onClick={() => setBlogLang("id")}
              className={`px-6 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${blogLang === "id" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
            >
              <LanguagesIcon size={14} /> Naskah Indonesia
            </button>
            <div className="ml-auto self-center">
              {saveStatus === "saving" && (
                <span className="flex items-center gap-2 text-[10px] font-bold text-primary animate-pulse">
                  <RefreshCw size={12} className="animate-spin" />{" "}
                  Auto-saving...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="flex items-center gap-2 text-[10px] font-bold text-green-500">
                  <CheckCircle2 size={12} /> Progress Secure
                </span>
              )}
            </div>
          </div>

          <div className="min-h-[500px]">
            <MediumEditor
              key={`${editingId}-${blogLang}`}
              content={
                blogLang === "en"
                  ? formData.content_en || ""
                  : formData.content_id || ""
              }
              onChange={(html) => {
                const field = blogLang === "en" ? "content_en" : "content_id";
                setFormData((prev: any) => ({ ...prev, [field]: html }));
                setSaveStatus("saved");
                setTimeout(() => setSaveStatus("idle"), 2000);
              }}
              onAutoSaveStatus={setSaveStatus}
              placeholder={
                blogLang === "en"
                  ? "Tell your story in English..."
                  : "Tulis cerita Anda dalam Bahasa Indonesia..."
              }
            />
          </div>
        </div>
      );
    }
    if (tab === "projects") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="title_en"
              value={formData.title_en || ""}
              onChange={handleChange}
              placeholder="Project Name (EN)"
              className="admin-input-premium"
              required
            />
            <input
              name="title_id"
              value={formData.title_id || ""}
              onChange={handleChange}
              placeholder="Nama Proyek (ID)"
              className="admin-input-premium"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <input
              name="type"
              value={formData.type || ""}
              onChange={handleChange}
              placeholder="Type (e.g. IoT, AI)"
              className="admin-input-premium"
              required
            />
            <input
              name="techStack"
              value={formData.techStack || ""}
              onChange={handleChange}
              placeholder="Tech (comma separated)"
              className="admin-input-premium"
              required
            />
            <input
              name="image"
              value={formData.image || ""}
              onChange={handleChange}
              placeholder="Image URL"
              className="admin-input-premium"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <textarea
              name="description_en"
              value={formData.description_en || ""}
              onChange={handleChange}
              placeholder="Description (EN)"
              className="admin-input-premium h-32"
              required
            />
            <textarea
              name="description_id"
              value={formData.description_id || ""}
              onChange={handleChange}
              placeholder="Deskripsi (ID)"
              className="admin-input-premium h-32"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="demoUrl"
              value={formData.demoUrl || ""}
              onChange={handleChange}
              placeholder="Live Demo URL"
              className="admin-input-premium"
            />
            <input
              name="githubUrl"
              value={formData.githubUrl || ""}
              onChange={handleChange}
              placeholder="GitHub URL"
              className="admin-input-premium"
            />
          </div>
        </div>
      );
    }
    if (tab === "gallery") {
      return (
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Visual Matrix Source (URL)
            </label>
            <input
              name="imageUrl"
              value={formData.imageUrl || ""}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="admin-input-premium"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <input
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              placeholder="Location (e.g. Tokyo, Japan)"
              className="admin-input-premium"
            />
            <input
              name="date"
              type="date"
              value={
                formData.date
                  ? new Date(formData.date).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="admin-input-premium"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Caption (EN)
              </label>
              <textarea
                name="caption_en"
                value={formData.caption_en || ""}
                onChange={handleChange}
                placeholder="English caption..."
                className="admin-input-premium h-32"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Caption (ID)
              </label>
              <textarea
                name="caption_id"
                value={formData.caption_id || ""}
                onChange={handleChange}
                placeholder="Keterangan Bahasa Indonesia..."
                className="admin-input-premium h-32"
                required
              />
            </div>
          </div>
        </div>
      );
    }
    if (tab === "experiences") {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <input
              name="year"
              value={formData.year || ""}
              onChange={handleChange}
              placeholder="Years (e.g. 2024-Now)"
              className="admin-input-premium"
              required
            />
            <input
              name="company"
              value={formData.company || ""}
              onChange={handleChange}
              placeholder="Company"
              className="admin-input-premium"
              required
            />
            <input
              name="order"
              type="number"
              value={formData.order || 0}
              onChange={handleChange}
              placeholder="Sort Order"
              className="admin-input-premium"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="role_en"
              value={formData.role_en || ""}
              onChange={handleChange}
              placeholder="Role Name (EN)"
              className="admin-input-premium"
              required
            />
            <input
              name="role_id"
              value={formData.role_id || ""}
              onChange={handleChange}
              placeholder="Peran (ID)"
              className="admin-input-premium"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <textarea
              name="description_en"
              value={formData.description_en || ""}
              onChange={handleChange}
              placeholder="Key Achievements (EN)"
              className="admin-input-premium h-40"
              required
            />
            <textarea
              name="description_id"
              value={formData.description_id || ""}
              onChange={handleChange}
              placeholder="Pencapaian Utama (ID)"
              className="admin-input-premium h-40"
              required
            />
          </div>
        </div>
      );
    }
    if (tab === "skills") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Skill Name
              </label>
              <input
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="e.g. Next.js"
                className="admin-input-premium"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Category
              </label>
              <input
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                placeholder="e.g. Frontend"
                className="admin-input-premium"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Proficiency (%)
              </label>
              <input
                name="level"
                type="number"
                value={formData.level || 0}
                onChange={handleChange}
                className="admin-input-premium"
                min="0"
                max="100"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Display Order
              </label>
              <input
                name="order"
                type="number"
                value={formData.order || 0}
                onChange={handleChange}
                className="admin-input-premium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Icon (Optional)
              </label>
              <input
                name="icon"
                value={formData.icon || ""}
                onChange={handleChange}
                placeholder="Lucide name or URL"
                className="admin-input-premium"
              />
            </div>
          </div>
        </div>
      );
    }
  };

  const isWorking =
    blogsQuery.isLoading ||
    projectsQuery.isLoading ||
    experiencesQuery.isLoading ||
    profileQuery.isLoading ||
    galleryQuery.isLoading ||
    skillsQuery.isLoading;

  return (
    <div className="py-12 pb-40 lg:pb-20">
      <div className="container-custom max-w-7xl!">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-black text-foreground flex items-center gap-4 tracking-tighter uppercase">
              <span className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/30">
                <Command />
              </span>{" "}
              Command Center
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500 transition-all border border-red-500/30 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </header>

        <div className="flex gap-1 p-1.5 bg-muted/30 backdrop-blur-md rounded-4xl border border-border mb-12 sticky top-20 z-40 overflow-x-auto no-scrollbar shadow-2xl">
          {[
            { id: "profile", icon: User, label: "Identity" },
            { id: "blogs", icon: FileText, label: "Archive" },
            { id: "projects", icon: Briefcase, label: "Laboratory" },
            { id: "gallery", icon: Camera, label: "Visuals" },
            { id: "experiences", icon: History, label: "Timeline" },
            { id: "skills", icon: Cpu, label: "Neural Net" },
          ].map((t) => (
            <button
              key={t.id}
              //@ts-expect-error: suppressing implicit any for tab id
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2.5 py-3 px-8 rounded-3xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                tab === t.id
                  ? "bg-background text-primary shadow-xl border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "profile" ? (
          <div className="bg-card border border-border rounded-[2.5rem] p-10 max-w-4xl mx-auto shadow-2xl">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <Sparkles size={24} />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-[0.2em]">
                Profile Config
              </h2>
            </div>
            <form onSubmit={handleProfileSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="admin-input-premium"
                  placeholder="Name"
                  required
                />
                <input
                  name="imageUrl"
                  value={formData.imageUrl || ""}
                  onChange={handleChange}
                  className="admin-input-premium"
                  placeholder="Photo URL"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input
                  name="role_en"
                  value={formData.role_en || ""}
                  onChange={handleChange}
                  className="admin-input-premium"
                  placeholder="Role (EN)"
                  required
                />
                <input
                  name="role_id"
                  value={formData.role_id || ""}
                  onChange={handleChange}
                  className="admin-input-premium"
                  placeholder="Role (ID)"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input
                  name="tagline_en"
                  value={formData.tagline_en || ""}
                  onChange={handleChange}
                  className="admin-input-premium"
                  placeholder="Tagline (EN)"
                  required
                />
                <input
                  name="tagline_id"
                  value={formData.tagline_id || ""}
                  onChange={handleChange}
                  className="admin-input-premium"
                  placeholder="Tagline (ID)"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <textarea
                  name="bio_en"
                  value={formData.bio_en || ""}
                  onChange={handleChange}
                  className="admin-input-premium h-40"
                  placeholder="Bio (EN)"
                  required
                />
                <textarea
                  name="bio_id"
                  value={formData.bio_id || ""}
                  onChange={handleChange}
                  className="admin-input-premium h-40"
                  placeholder="Bio (ID)"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={profileMutation.isPending}
                className="w-full bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] py-5 rounded-3xl flex items-center justify-center gap-3 hover:opacity-90 shadow-2xl shadow-primary/30 transition-all"
              >
                {profileMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}{" "}
                Commit Changes
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-[2.5rem] p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
              <h2 className="text-3xl font-black uppercase tracking-tight">
                {tab} Records
              </h2>
              <button
                onClick={openAdd}
                className="w-full md:w-auto flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 shadow-2xl shadow-primary/30 transition-all"
              >
                <Plus size={20} /> New Record
              </button>
            </div>

            {isWorking ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(tab === "blogs"
                  ? blogsQuery.data
                  : tab === "projects"
                    ? projectsQuery.data
                    : tab === "gallery"
                      ? galleryQuery.data
                      : tab === "skills"
                        ? skillsQuery.data
                        : experiencesQuery.data
                )?.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-6 bg-muted/20 border border-border rounded-3xl group hover:border-primary/50 transition-all"
                  >
                    {item.imageUrl || item.image ? (
                      <div className="relative aspect-square w-full rounded-2xl bg-muted overflow-hidden border border-border mb-4">
                        <Image
                          src={item.imageUrl || item.image}
                          alt=""
                          fill
                          className="object-cover grayscale group-hover:grayscale-0 transition-all"
                        />
                      </div>
                    ) : null}
                    <h3 className="font-bold text-foreground text-lg truncate mb-1">
                      {item.title_en ||
                        item.caption_en ||
                        item.role_en ||
                        item.name ||
                        "Untitled"}
                    </h3>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">
                        {tab === "blogs"
                          ? item.category
                          : tab === "gallery"
                            ? item.location || "Undisclosed"
                            : tab === "skills"
                              ? `${item.category || "General"} • ${item.level}%`
                              : item.company || item.type}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-2 text-muted-foreground hover:text-primary transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete permanently?")) {
                              if (tab === "blogs")
                                blogMutations.delete.mutate(item.id);
                              if (tab === "projects")
                                projectMutations.delete.mutate(item.id);
                              if (tab === "gallery")
                                galleryMutations.delete.mutate(item.id);
                              if (tab === "experiences")
                                experienceMutations.delete.mutate(item.id);
                              if (tab === "skills")
                                skillMutations.delete.mutate(item.id);
                            }
                          }}
                          className="p-2 text-muted-foreground hover:text-red-500 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-3xl p-4 md:p-8">
          <div className="bg-card border border-border w-full max-w-6xl rounded-[3rem] shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-border flex justify-between items-center bg-card/80 backdrop-blur-md sticky top-0 z-10">
              <h3 className="text-xl font-black uppercase tracking-[0.3em]">
                {editingId ? "Updating" : "Creating"} {tab.slice(0, -1)} Record
              </h3>
              <button
                onClick={closeModal}
                className="p-4 bg-muted hover:bg-red-500 hover:text-white rounded-3xl transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-10 overflow-y-auto space-y-10 custom-scrollbar grow"
            >
              {renderForm()}
              <div className="pt-10 border-t border-border flex gap-4">
                <button
                  type="submit"
                  disabled={isWorking}
                  className="grow bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] py-6 rounded-4xl flex items-center justify-center gap-4 hover:brightness-110 shadow-3xl shadow-primary/30 transition-all"
                >
                  <Save size={24} /> Deploy Record
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-12 py-6 bg-muted text-foreground font-black uppercase tracking-widest rounded-4xl hover:bg-border transition-all"
                >
                  Abort
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .admin-input-premium {
          width: 100%;
          background: var(--muted);
          border: 1px solid var(--border);
          border-radius: 1.5rem;
          padding: 1.25rem 1.75rem;
          color: var(--foreground);
          font-size: 1rem;
          font-weight: 500;
          outline: none;
          transition: all 0.3s;
        }
        .admin-input-premium:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 6px
            color-mix(in srgb, var(--primary), transparent 90%);
        }
        .admin-textarea-medium {
          width: 100%;
          background: var(--muted);
          border: 1px solid var(--border);
          border-radius: 2rem;
          padding: 1.5rem;
          color: var(--foreground);
          min-height: 300px;
          outline: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 50px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
