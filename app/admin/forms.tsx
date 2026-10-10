"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import ImageUploadField from "@/components/admin/ImageUploadField";
import { Field, Toggle } from "@/components/admin/ui";
import type { ResourceTab } from "./config";

type FormProps = { data: Record<string, any>; set: (patch: Record<string, any>) => void };

const bind = ({ data, set }: FormProps, name: string) => ({
  name,
  value: data[name] ?? "",
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set({ [name]: e.target.value }),
});

const Pair = ({ children }: { children: React.ReactNode }) => (
  <div className="grid gap-4 sm:grid-cols-2">{children}</div>
);

export function ProfileForm(p: FormProps) {
  return (
    <div className="space-y-6">
      <Pair>
        <Field label="Name" required>
          <input className="field-input" required {...bind(p, "name")} />
        </Field>
        <ImageUploadField label="Profile photo" name="imageUrl" value={p.data.imageUrl || ""} onChange={(url) => p.set({ imageUrl: url })} />
      </Pair>
      <Pair>
        <Field label="Role (EN)" required>
          <input className="field-input" required {...bind(p, "role_en")} />
        </Field>
        <Field label="Role (ID)" required>
          <input className="field-input" required {...bind(p, "role_id")} />
        </Field>
      </Pair>
      <Pair>
        <Field label="Tagline (EN)" required hint="Shown as the big headline on the home page.">
          <input className="field-input" required {...bind(p, "tagline_en")} />
        </Field>
        <Field label="Tagline (ID)" required>
          <input className="field-input" required {...bind(p, "tagline_id")} />
        </Field>
      </Pair>
      <Pair>
        <Field label="Bio (EN)" required>
          <textarea className="field-input" required rows={5} {...bind(p, "bio_en")} />
        </Field>
        <Field label="Bio (ID)" required>
          <textarea className="field-input" required rows={5} {...bind(p, "bio_id")} />
        </Field>
      </Pair>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="GitHub URL">
          <input className="field-input" type="url" placeholder="https://github.com/…" {...bind(p, "github")} />
        </Field>
        <Field label="LinkedIn URL">
          <input className="field-input" type="url" placeholder="https://linkedin.com/in/…" {...bind(p, "linkedin")} />
        </Field>
        <Field label="X / Twitter URL">
          <input className="field-input" type="url" placeholder="https://x.com/…" {...bind(p, "twitter")} />
        </Field>
      </div>
    </div>
  );
}

export function ResourceForm({ tab, ...p }: FormProps & { tab: Exclude<ResourceTab, "blogs"> }) {
  if (tab === "projects")
    return (
      <div className="space-y-5">
        <Toggle
          checked={!!p.data.isFeatured}
          onChange={(v) => p.set({ isFeatured: v })}
          label="Featured on home page"
          hint="The first 4 featured projects appear in “Selected work”."
        />
        <Pair>
          <Field label="Title (EN)" required>
            <input className="field-input" required autoFocus {...bind(p, "title_en")} />
          </Field>
          <Field label="Title (ID)" required>
            <input className="field-input" required {...bind(p, "title_id")} />
          </Field>
        </Pair>
        <Pair>
          <Field label="Type" required hint="Used as the filter chip, e.g. Web, IoT, AI.">
            <input className="field-input" required {...bind(p, "type")} />
          </Field>
          <Field label="Tech stack" required hint="Comma separated.">
            <input className="field-input" required placeholder="Next.js, Prisma, MQTT" {...bind(p, "techStack")} />
          </Field>
        </Pair>
        <ImageUploadField label="Cover image" name="image" value={p.data.image || ""} onChange={(url) => p.set({ image: url })} />
        <Pair>
          <Field label="Description (EN)" required>
            <textarea className="field-input" required rows={4} {...bind(p, "description_en")} />
          </Field>
          <Field label="Description (ID)" required>
            <textarea className="field-input" required rows={4} {...bind(p, "description_id")} />
          </Field>
        </Pair>
        <Pair>
          <Field label="Live demo URL">
            <input className="field-input" type="url" placeholder="https://…" {...bind(p, "demoUrl")} />
          </Field>
          <Field label="GitHub URL">
            <input className="field-input" type="url" placeholder="https://github.com/…" {...bind(p, "githubUrl")} />
          </Field>
        </Pair>
        <Field label="Sort order" hint="Lower numbers come first.">
          <input className="field-input w-32" type="number" {...bind(p, "order")} />
        </Field>
      </div>
    );

  if (tab === "gallery")
    return (
      <div className="space-y-5">
        <ImageUploadField label="Photo" name="imageUrl" value={p.data.imageUrl || ""} onChange={(url) => p.set({ imageUrl: url })} />
        <Pair>
          <Field label="Location">
            <input className="field-input" placeholder="Tokyo, Japan" {...bind(p, "location")} />
          </Field>
          <Field label="Date">
            <input
              className="field-input"
              type="date"
              value={p.data.date ? new Date(p.data.date).toISOString().split("T")[0] : ""}
              onChange={(e) => p.set({ date: e.target.value })}
            />
          </Field>
        </Pair>
        <Pair>
          <Field label="Caption (EN)">
            <textarea className="field-input" rows={3} {...bind(p, "caption_en")} />
          </Field>
          <Field label="Caption (ID)">
            <textarea className="field-input" rows={3} {...bind(p, "caption_id")} />
          </Field>
        </Pair>
      </div>
    );

  if (tab === "experiences")
    return (
      <div className="space-y-5">
        <Pair>
          <Field label="Period" required hint="e.g. 2024 — Now">
            <input className="field-input" required autoFocus {...bind(p, "year")} />
          </Field>
          <Field label="Company" required>
            <input className="field-input" required {...bind(p, "company")} />
          </Field>
        </Pair>
        <Pair>
          <Field label="Role (EN)" required>
            <input className="field-input" required {...bind(p, "role_en")} />
          </Field>
          <Field label="Role (ID)" required>
            <input className="field-input" required {...bind(p, "role_id")} />
          </Field>
        </Pair>
        <Pair>
          <Field label="Description (EN)" required>
            <textarea className="field-input" required rows={5} {...bind(p, "description_en")} />
          </Field>
          <Field label="Description (ID)" required>
            <textarea className="field-input" required rows={5} {...bind(p, "description_id")} />
          </Field>
        </Pair>
        <Field label="Sort order" hint="Lower numbers come first.">
          <input className="field-input w-32" type="number" {...bind(p, "order")} />
        </Field>
      </div>
    );

  // skills
  const level = Number(p.data.level ?? 0);
  return (
    <div className="space-y-5">
      <Pair>
        <Field label="Name" required>
          <input className="field-input" required autoFocus placeholder="Next.js" {...bind(p, "name")} />
        </Field>
        <Field label="Category" hint="Skills with the same category are grouped together.">
          <input className="field-input" placeholder="Frontend" {...bind(p, "category")} />
        </Field>
      </Pair>
      <Field label="Proficiency" counter={`${level}%`}>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={level}
          onChange={(e) => p.set({ level: Number(e.target.value) })}
          className="w-full accent-[var(--accent)]"
        />
      </Field>
      <Pair>
        <Field label="Sort order">
          <input className="field-input" type="number" {...bind(p, "order")} />
        </Field>
        <Field label="Icon (optional)">
          <input className="field-input" placeholder="Lucide name or URL" {...bind(p, "icon")} />
        </Field>
      </Pair>
    </div>
  );
}
