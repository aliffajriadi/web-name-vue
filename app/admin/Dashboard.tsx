"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase, Camera, Cpu, Edit2, Eye, ExternalLink, FileText, Heart, History, LayoutDashboard,
  Loader2, LogOut, Plus, Save, Search, Star, Trash2, User, AlertCircle, CheckCircle2, ArrowUpRight,
} from "lucide-react";
import { getProfile, updateProfile, setAuthToken } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import { ConfirmDialog, Drawer, useDebounced, useToast } from "@/components/admin/ui";
import { cn } from "@/lib/utils";
import {
  FIELDS, REQUIRED, RESOURCES, Tab, ResourceTab, blankFor, itemTitle, pick,
} from "./config";
import { ProfileForm, ResourceForm } from "./forms";
import BlogEditor from "./BlogEditor";

const NAV: { id: Tab; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "blogs", label: "Articles", icon: FileText },
  { id: "projects", label: "Projects", icon: Briefcase },
  { id: "gallery", label: "Gallery", icon: Camera },
  { id: "experiences", label: "Experience", icon: History },
  { id: "skills", label: "Skills", icon: Cpu },
  { id: "profile", label: "Profile", icon: User },
];

type EditorState = { tab: ResourceTab; id: string | null; initial: Record<string, any>; data: Record<string, any> };

const fmtDate = (d?: string) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

export default function Dashboard({ apiKey, onLogout }: { apiKey: string; onLogout: () => void }) {
  const toast = useToast();
  const qc = useQueryClient();
  // Dashboard only mounts after client-side auth, so reading localStorage here is safe.
  const [tab, setTab] = useState<Tab>(() => {
    try {
      const saved = localStorage.getItem("admin_tab") as Tab | null;
      return saved && NAV.some((n) => n.id === saved) ? saved : "overview";
    } catch {
      return "overview";
    }
  });
  const [search, setSearch] = useState("");
  const q = useDebounced(search.trim().toLowerCase());
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [toDelete, setToDelete] = useState<{ tab: ResourceTab; item: any } | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAuthToken(apiKey);
    return () => setAuthToken(null);
  }, [apiKey]);

  const go = (t: Tab) => {
    setTab(t);
    setSearch("");
    try { localStorage.setItem("admin_tab", t); } catch {}
  };

  /* ───── data ───── */
  const lists = {
    blogs: useQuery<any[]>({ queryKey: ["admin", "blogs"], queryFn: RESOURCES.blogs.list }),
    projects: useQuery<any[]>({ queryKey: ["admin", "projects"], queryFn: RESOURCES.projects.list }),
    gallery: useQuery<any[]>({ queryKey: ["admin", "gallery"], queryFn: RESOURCES.gallery.list }),
    experiences: useQuery<any[]>({ queryKey: ["admin", "experiences"], queryFn: RESOURCES.experiences.list }),
    skills: useQuery<any[]>({ queryKey: ["admin", "skills"], queryFn: RESOURCES.skills.list }),
  };
  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: getProfile });

  const [profileData, setProfileData] = useState<Record<string, any>>({});
  const [profileInitial, setProfileInitial] = useState<Record<string, any>>({});
  useEffect(() => {
    if (profileQuery.data) {
      const p = pick(profileQuery.data, FIELDS.profile);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileData(p);
      setProfileInitial(p);
    }
  }, [profileQuery.data]);
  const profileDirty = JSON.stringify(profileData) !== JSON.stringify(profileInitial);

  const refresh = () => qc.invalidateQueries(); // admin + public caches

  /* ───── mutations ───── */
  const save = useMutation({
    mutationFn: async ({ tab, id, data }: { tab: ResourceTab; id: string | null; data: any }) => {
      const body = pick(data, FIELDS[tab]);
      const r = RESOURCES[tab] as any;
      return id ? r.update(id, body) : r.create(body);
    },
    onSuccess: (res, vars) => {
      refresh();
      toast("success", vars.id ? "Changes saved" : `${RESOURCES[vars.tab].singular[0].toUpperCase()}${RESOURCES[vars.tab].singular.slice(1)} created`);
      if (vars.tab === "blogs") {
        // keep writing: re-baseline so "dirty" resets
        setEditor((e) => (e ? { ...e, id: res?.id ?? e.id, initial: e.data, data: { ...e.data, id: res?.id ?? e.data.id } } : e));
      } else {
        setEditor(null);
      }
    },
    onError: (e: any) => toast("error", e.response?.data?.error || e.message || "Could not save"),
  });

  const remove = useMutation({
    mutationFn: ({ tab, id }: { tab: ResourceTab; id: string }) => (RESOURCES[tab] as any).remove(id),
    onSuccess: () => {
      refresh();
      toast("success", "Deleted");
      setToDelete(null);
    },
    onError: (e: any) => toast("error", e.response?.data?.error || e.message || "Could not delete"),
  });

  const saveProfile = useMutation({
    mutationFn: () => updateProfile(profileData),
    onSuccess: () => {
      refresh();
      setProfileInitial(profileData);
      toast("success", "Profile updated");
    },
    onError: (e: any) => toast("error", e.response?.data?.error || e.message || "Could not save profile"),
  });

  /* ───── editor helpers ───── */
  const dirty = !!editor && JSON.stringify(editor.data) !== JSON.stringify(editor.initial);

  const openNew = (t: ResourceTab) => {
    const blank = blankFor(t);
    setEditor({ tab: t, id: null, initial: blank, data: blank });
  };
  const openEdit = (t: ResourceTab, item: any) => {
    const d = { ...pick(item, FIELDS[t]), ...(t === "blogs" ? { id: item.id } : {}) };
    setEditor({ tab: t, id: item.id, initial: d, data: d });
  };
  const setData = useCallback(
    (patch: Record<string, any>) => setEditor((e) => (e ? { ...e, data: { ...e.data, ...patch } } : e)),
    [],
  );
  const requestClose = () => (dirty ? setConfirmDiscard(true) : setEditor(null));

  const submit = useCallback(() => {
    if (!editor) return;
    const missing = REQUIRED[editor.tab].filter(([f]) => {
      const v = editor.data[f];
      return v === undefined || v === null || String(v).replace(/<[^>]*>/g, "").trim() === "";
    });
    if (missing.length) {
      toast("error", `Please fill in: ${missing.map(([, l]) => l).join(", ")}`);
      return;
    }
    save.mutate({ tab: editor.tab, id: editor.id, data: editor.data });
  }, [editor, save, toast]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty || profileDirty) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && !editor && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s" && editor && editor.tab !== "blogs") {
        e.preventDefault();
        submit();
      }
    };
    window.addEventListener("beforeunload", warn);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("beforeunload", warn);
      window.removeEventListener("keydown", onKey);
    };
  }, [dirty, profileDirty, editor, submit]);

  /* ───── derived ───── */
  const counts = {
    blogs: lists.blogs.data?.length, projects: lists.projects.data?.length, gallery: lists.gallery.data?.length,
    experiences: lists.experiences.data?.length, skills: lists.skills.data?.length,
  } as Record<string, number | undefined>;

  const categories = useMemo(
    () => Array.from(new Set((lists.blogs.data || []).map((b) => b.category).filter(Boolean))),
    [lists.blogs.data],
  );

  const filtered = (t: ResourceTab) =>
    (lists[t].data || []).filter((i) => !q || JSON.stringify(Object.values(pick(i, FIELDS[t]))).toLowerCase().includes(q.replace(/[^\p{L}\p{N}\s-]/gu, "")));

  /* ───── render ───── */
  const resTab = tab !== "overview" && tab !== "profile" ? (tab as ResourceTab) : null;

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[232px_1fr]">
      {/* sidebar */}
      <aside className="hidden border-r border-border bg-muted/30 lg:block">
        <div className="sticky top-0 flex h-screen flex-col p-4">
          <Link href="/" className="mb-6 flex items-center gap-2 px-2 py-1 font-display text-xl font-bold">
            alif<span className="h-2 w-2 rounded-full bg-[var(--accent)]" />
            <span className="ml-1 rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] font-normal uppercase tracking-wider text-muted-foreground">admin</span>
          </Link>
          <nav className="space-y-0.5" aria-label="Admin sections">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                aria-current={tab === n.id ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  tab === n.id ? "bg-[var(--ink)] text-[color:var(--paper)]" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <n.icon size={16} />
                <span className="grow text-left">{n.label}</span>
                {counts[n.id] !== undefined && (
                  <span className={cn("font-mono text-[11px]", tab === n.id ? "opacity-70" : "text-muted-foreground")}>{counts[n.id]}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="mt-auto space-y-2 border-t border-border pt-4">
            <Link href="/" target="_blank" className="btn-sm w-full justify-between">
              View site <ExternalLink size={14} />
            </Link>
            <div className="flex gap-2">
              <ThemeToggle />
              <button onClick={onLogout} className="btn-sm danger grow justify-center">
                <LogOut size={14} /> Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        {/* mobile top bar */}
        <div className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-display text-lg font-bold">alif <span className="text-[var(--accent)]">admin</span></span>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button onClick={onLogout} className="grid h-9 w-9 place-items-center rounded-full border border-border" aria-label="Sign out">
                <LogOut size={15} />
              </button>
            </div>
          </div>
          <nav className="scrollbar-hide flex gap-1 overflow-x-auto px-3 pb-2" aria-label="Admin sections">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium",
                  tab === n.id ? "bg-[var(--ink)] text-[color:var(--paper)]" : "text-muted-foreground",
                )}
              >
                <n.icon size={14} /> {n.label}
              </button>
            ))}
          </nav>
        </div>

        <main className="mx-auto max-w-[1040px] px-4 py-8 md:px-8 md:py-10">
          {/* ───────── OVERVIEW ───────── */}
          {tab === "overview" && (
            <Overview lists={lists} go={go} openNew={openNew} openEdit={openEdit} name={profileQuery.data?.name} />
          )}

          {/* ───────── LIST ───────── */}
          {resTab && (
            <>
              <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl">{RESOURCES[resTab].label}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {counts[resTab] ?? "…"} total{q ? ` · ${filtered(resTab).length} match “${search}”` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      ref={searchRef}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search…  ( / )"
                      aria-label="Search"
                      className="field-input !h-10 !w-48 !py-0 !pl-9 sm:!w-60"
                    />
                  </div>
                  <button className="btn-sm solid !h-10" onClick={() => openNew(resTab)}>
                    <Plus size={15} /> New {RESOURCES[resTab].singular}
                  </button>
                </div>
              </header>

              {lists[resTab].isLoading ? (
                <div className="grid place-items-center py-24"><Loader2 className="animate-spin text-muted-foreground" /></div>
              ) : filtered(resTab).length === 0 ? (
                <Empty tab={resTab} searching={!!q} onNew={() => openNew(resTab)} />
              ) : (
                <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                  {filtered(resTab).map((item) => (
                    <Row key={item.id} tab={resTab} item={item} onEdit={() => openEdit(resTab, item)} onDelete={() => setToDelete({ tab: resTab, item })} />
                  ))}
                </ul>
              )}
            </>
          )}

          {/* ───────── PROFILE ───────── */}
          {tab === "profile" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveProfile.mutate();
              }}
            >
              <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl">Profile</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Shown on the home page, About section and article author card.</p>
                </div>
                <button type="submit" disabled={!profileDirty || saveProfile.isPending} className="btn-sm solid !h-10">
                  {saveProfile.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {profileDirty ? "Save changes" : "Saved"}
                </button>
              </header>
              <div className="rounded-2xl border border-border bg-card p-5 md:p-8">
                {profileQuery.isLoading ? (
                  <div className="grid place-items-center py-16"><Loader2 className="animate-spin text-muted-foreground" /></div>
                ) : (
                  <ProfileForm data={profileData} set={(p) => setProfileData((d) => ({ ...d, ...p }))} />
                )}
              </div>
            </form>
          )}
        </main>
      </div>

      {/* ───────── editors ───────── */}
      {editor?.tab === "blogs" && (
        <BlogEditor
          data={editor.data}
          set={setData}
          isNew={!editor.id}
          dirty={dirty}
          saving={save.isPending}
          categories={categories}
          onSave={submit}
          onClose={requestClose}
        />
      )}

      <Drawer
        open={!!editor && editor.tab !== "blogs"}
        title={editor ? `${editor.id ? "Edit" : "New"} ${RESOURCES[editor.tab].singular}` : ""}
        subtitle={dirty ? "Unsaved changes" : "Ctrl/⌘ + S to save"}
        onClose={requestClose}
        footer={
          <>
            <button type="button" className="btn-sm" onClick={requestClose}>Cancel</button>
            <button type="submit" form="drawer-form" className="btn-sm solid" disabled={save.isPending || (!dirty && !!editor?.id)}>
              {save.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {editor?.id ? "Save changes" : "Create"}
            </button>
          </>
        }
      >
        {editor && editor.tab !== "blogs" && (
          <form
            id="drawer-form"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <ResourceForm tab={editor.tab} data={editor.data} set={setData} />
          </form>
        )}
      </Drawer>

      <ConfirmDialog
        open={!!toDelete}
        danger
        title={`Delete this ${toDelete ? RESOURCES[toDelete.tab].singular : ""}?`}
        body={toDelete ? <>“{itemTitle(toDelete.tab, toDelete.item)}” will be permanently removed. This can’t be undone.</> : null}
        confirmLabel="Delete"
        loading={remove.isPending}
        onCancel={() => setToDelete(null)}
        onConfirm={() => toDelete && remove.mutate({ tab: toDelete.tab, id: toDelete.item.id })}
      />
      <ConfirmDialog
        open={confirmDiscard}
        title="Discard unsaved changes?"
        body="You have edits that haven’t been saved."
        confirmLabel="Discard"
        danger
        onCancel={() => setConfirmDiscard(false)}
        onConfirm={() => {
          setConfirmDiscard(false);
          setEditor(null);
        }}
      />
    </div>
  );
}

/* ───────────────────────── list rows ───────────────────────── */

function Thumb({ src }: { src?: string }) {
  return (
    <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
      {src && <Image src={src} alt="" fill sizes="80px" className="object-cover" />}
    </span>
  );
}

function Row({ tab, item, onEdit, onDelete }: { tab: ResourceTab; item: any; onEdit: () => void; onDelete: () => void }) {
  const title = itemTitle(tab, item);
  let sub: React.ReactNode = null;
  let thumb: string | undefined;
  let extra: React.ReactNode = null;

  if (tab === "blogs") {
    thumb = item.image;
    const en = !!item.content_en, id = !!item.content_id;
    sub = (
      <>
        <span className="chip !py-0.5">{item.category}</span>
        <span>{fmtDate(item.date)}</span>
        <span className="inline-flex items-center gap-1"><Eye size={12} /> {item.views ?? 0}</span>
        <span className="inline-flex items-center gap-1"><Heart size={12} /> {item.likesCount ?? 0}</span>
      </>
    );
    extra = (
      <span className="hidden gap-1 font-mono text-[10px] sm:flex">
        <span className={cn("rounded px-1.5 py-0.5", en ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "bg-amber-500/15 text-amber-600")}>EN</span>
        <span className={cn("rounded px-1.5 py-0.5", id ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "bg-amber-500/15 text-amber-600")}>ID</span>
      </span>
    );
  } else if (tab === "projects") {
    thumb = item.image;
    sub = (<><span className="chip !py-0.5">{item.type}</span><span className="truncate">{item.techStack}</span></>);
    extra = item.isFeatured ? <span className="hidden items-center gap-1 text-xs text-[var(--accent)] sm:flex"><Star size={12} className="fill-current" /> Featured</span> : null;
  } else if (tab === "gallery") {
    thumb = item.imageUrl;
    sub = (<><span>{item.location || "No location"}</span><span>{fmtDate(item.date)}</span><span className="inline-flex items-center gap-1"><Heart size={12} /> {item.likesCount ?? 0}</span></>);
  } else if (tab === "experiences") {
    sub = (<><span className="font-mono">{item.year}</span><span>{item.company}</span></>);
  } else {
    sub = (
      <>
        <span className="chip !py-0.5">{item.category || "General"}</span>
        <span className="h-1.5 w-24 overflow-hidden rounded-full bg-muted"><span className="block h-full bg-[var(--accent)]" style={{ width: `${item.level}%` }} /></span>
        <span className="font-mono">{item.level}%</span>
      </>
    );
  }

  return (
    <li className="group flex items-center gap-4 p-4 transition-colors hover:bg-muted/40">
      {(tab === "blogs" || tab === "projects" || tab === "gallery") && <Thumb src={thumb} />}
      <button onClick={onEdit} className="min-w-0 grow text-left" aria-label={`Edit ${title}`}>
        <div className="truncate font-medium">{title}</div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">{sub}</div>
      </button>
      {extra}
      <div className="flex shrink-0 items-center gap-1">
        {tab === "blogs" && item.slug && (
          <Link href={`/blog/${item.slug}`} target="_blank" className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="View on site" title="View on site">
            <ExternalLink size={15} />
          </Link>
        )}
        <button onClick={onEdit} className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Edit" title="Edit">
          <Edit2 size={15} />
        </button>
        <button onClick={onDelete} className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500" aria-label="Delete" title="Delete">
          <Trash2 size={15} />
        </button>
      </div>
    </li>
  );
}

function Empty({ tab, searching, onNew }: { tab: ResourceTab; searching: boolean; onNew: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border py-20 text-center">
      <p className="font-display text-2xl">{searching ? "No matches" : `No ${RESOURCES[tab].label.toLowerCase()} yet`}</p>
      <p className="mt-1 text-sm text-muted-foreground">{searching ? "Try a different keyword." : `Create your first ${RESOURCES[tab].singular} to get started.`}</p>
      {!searching && (
        <button className="btn-sm solid mt-6" onClick={onNew}>
          <Plus size={15} /> New {RESOURCES[tab].singular}
        </button>
      )}
    </div>
  );
}

/* ───────────────────────── overview ───────────────────────── */

function Overview({ lists, go, openNew, openEdit, name }: { lists: Record<ResourceTab, { data?: any[] }>; go: (t: Tab) => void; openNew: (t: ResourceTab) => void; openEdit: (t: ResourceTab, i: any) => void; name?: string }) {
  const blogs = lists.blogs.data || [];
  const views = blogs.reduce((n, b) => n + (b.views || 0), 0);
  const likes = blogs.reduce((n, b) => n + (b.likesCount || 0), 0);
  const top = [...blogs].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  // things worth fixing — mostly SEO
  const issues: { text: string; item: any }[] = [];
  blogs.forEach((b) => {
    const t = b.title_en || b.slug;
    if (!b.image) issues.push({ text: `“${t}” has no cover image (used for social previews)`, item: b });
    const n = (b.excerpt_en || "").length;
    if (n && (n < 70 || n > 170)) issues.push({ text: `“${t}” excerpt is ${n} chars — aim for 90–160`, item: b });
    if (!b.content_id) issues.push({ text: `“${t}” has no Indonesian content`, item: b });
  });

  const stats = [
    { label: "Articles", value: blogs.length, icon: FileText },
    { label: "Total views", value: views.toLocaleString(), icon: Eye },
    { label: "Article likes", value: likes.toLocaleString(), icon: Heart },
    { label: "Projects", value: lists.projects.data?.length ?? 0, icon: Briefcase },
  ];

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl">
          Hi{name ? `, ${name.split(" ")[0]}` : ""} <span className="font-accent text-[var(--accent)]">👋</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Here’s what’s happening on your site.</p>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 md:p-5">
            <s.icon size={16} className="text-[var(--accent)]" />
            <div className="mt-3 font-display text-3xl tabular-nums">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button className="btn-sm solid" onClick={() => openNew("blogs")}><Plus size={14} /> Write article</button>
        <button className="btn-sm" onClick={() => openNew("projects")}><Plus size={14} /> Add project</button>
        <button className="btn-sm" onClick={() => openNew("gallery")}><Plus size={14} /> Add photo</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-medium">Top articles</h2>
            <button onClick={() => go("blogs")} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">All <ArrowUpRight size={12} /></button>
          </div>
          {top.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">No articles yet.</p>
          ) : (
            <ol className="divide-y divide-border">
              {top.map((b, i) => (
                <li key={b.id}>
                  <button onClick={() => openEdit("blogs", b)} className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-muted/40">
                    <span className="w-4 font-mono text-xs text-muted-foreground">{i + 1}</span>
                    <span className="min-w-0 grow truncate text-sm">{b.title_en}</span>
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground"><Eye size={12} /> {b.views ?? 0}</span>
                    <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground"><Heart size={12} /> {b.likesCount ?? 0}</span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-medium">Needs attention</h2>
          </div>
          {issues.length === 0 ? (
            <p className="flex items-center justify-center gap-2 px-5 py-10 text-sm text-muted-foreground">
              <CheckCircle2 size={16} className="text-[var(--accent)]" /> Everything looks good.
            </p>
          ) : (
            <ul className="max-h-[320px] divide-y divide-border overflow-y-auto">
              {issues.slice(0, 12).map((x, i) => (
                <li key={i}>
                  <button onClick={() => openEdit("blogs", x.item)} className="flex w-full items-start gap-3 px-5 py-3 text-left text-sm hover:bg-muted/40">
                    <AlertCircle size={15} className="mt-0.5 shrink-0 text-amber-500" />
                    <span>{x.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
