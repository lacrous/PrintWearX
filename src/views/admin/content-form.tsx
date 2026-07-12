"use client";

import { useState } from "react";
import {
  Save,
  Eye,
  ImageIcon,
  LayoutTemplate,
  BookOpen,
  FileText,
} from "lucide-react";
import {
  Field,
  FormRow,
  Section,
  Input,
  Textarea,
  Select,
  ImageUpload,
  PageHeader,
} from "@/components/admin/form";
import { content } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const TYPES = [
  { id: "banner", label: "Banner", icon: ImageIcon, desc: "Site-wide hero or section" },
  { id: "collection", label: "Collection", icon: LayoutTemplate, desc: "Curated product group" },
  { id: "blog", label: "Blog post", icon: BookOpen, desc: "Editorial article" },
  { id: "page", label: "Page", icon: FileText, desc: "Static page (about, FAQ)" },
] as const;

interface Props {
  contentId?: string;
}

export function ContentFormView({ contentId }: Props) {
  const existing = contentId ? content.find((c) => c.id === contentId) : null;
  const isEdit = !!existing;
  const [type, setType] = useState<(typeof TYPES)[number]["id"]>(existing?.type ?? "banner");
  const [hero, setHero] = useState<string[]>(
    existing ? ["from-primary-500 to-primary-700"] : []
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("pwx:toast", {
          detail: { kind: "success", message: isEdit ? "Content updated" : "Content published", description: "Visible on the storefront." }
        }));
      }}
      className="space-y-6 pb-24"
    >
      <PageHeader
        breadcrumb={[
          { href: "/admin/content", label: "Content" },
          { label: isEdit ? `Edit "${existing?.title}"` : "New content" },
        ]}
        title={isEdit ? `Edit "${existing?.title}"` : "New content"}
        description={isEdit ? `Type: ${existing?.type} · Last updated ${existing?.updatedAt}` : "Create a banner, collection, blog post, or page"}
        back={{ href: "/admin/content", label: "Content" }}
        actions={
          <>
            <button className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button type="button" className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800">
              Save draft
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30"
            >
              <Save className="w-3.5 h-3.5" />
              {isEdit ? "Save changes" : "Publish"}
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <Section title="Type">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {TYPES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={cn(
                      "h-20 px-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all",
                      type === t.id
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300"
                    )}
                  >
                    <Icon className={cn(
                      "w-5 h-5",
                      type === t.id ? "text-primary-500" : "text-neutral-500"
                    )} />
                    <div className={cn(
                      "text-xs font-semibold",
                      type === t.id ? "text-primary-700 dark:text-primary-400" : "text-neutral-900 dark:text-white"
                    )}>
                      {t.label}
                    </div>
                    <div className="text-[9px] text-neutral-500 text-center leading-tight">
                      {t.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          <Section title="Content">
            <Field label="Title" required>
              <Input defaultValue={existing?.title} placeholder="Catchy headline…" required />
            </Field>
            <Field label="URL handle" description="The path on the storefront">
              <Input defaultValue={existing?.slug} prefix="printwearx.app" placeholder="/my-page" />
            </Field>
            <Field label="Body" description="Markdown supported">
              <Textarea
                rows={12}
                placeholder="Write your content here…"
                defaultValue={existing?.type === "blog"
                  ? "## Why Swiss quartz is still worth it in 2026\n\nIn an era of smartwatches and digital everything, mechanical and quartz watches continue to hold a special place. Here's why…"
                  : ""}
              />
            </Field>
          </Section>

          {(type === "banner" || type === "collection" || type === "blog") && (
            <Section title="Hero image" description="The main image shown for this content">
              <ImageUpload value={hero} onChange={setHero} max={1} />
            </Section>
          )}

          {type === "blog" && (
            <Section title="SEO">
              <Field label="Meta description">
                <Textarea rows={2} placeholder="Max 160 characters" maxLength={160} />
              </Field>
              <Field label="Tags">
                <Input placeholder="Comma-separated tags" />
              </Field>
            </Section>
          )}

          {type === "collection" && (
            <Section title="Products in this collection">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 text-center text-sm text-neutral-500">
                Drag products here or click to add
              </div>
            </Section>
          )}
        </div>

        <div className="space-y-4 lg:space-y-6">
          <Section title="Status">
            <Field label="Visibility">
              <Select defaultValue={existing?.status ?? "draft"}>
                <option value="published">Published — live on site</option>
                <option value="draft">Draft — not visible</option>
                <option value="scheduled">Scheduled — auto-publish later</option>
              </Select>
            </Field>
            <Field label="Publish date">
              <Input type="datetime-local" defaultValue="2026-07-10T09:00" />
            </Field>
          </Section>

          <Section title="Authoring">
            <Field label="Author">
              <Select defaultValue="Hassan El-Deghidy">
                <option>Hassan El-Deghidy</option>
                <option>Maya Singh</option>
              </Select>
            </Field>
          </Section>

          <Section title="Preview">
            <div className={cn(
              "h-32 rounded-xl flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br",
              hero[0] || "from-primary-500 to-primary-700"
            )}>
              {hero[0] ? "Banner" : "No image"}
            </div>
            <div className="mt-2 text-sm">
              <div className="font-bold text-neutral-900 dark:text-white">
                {existing?.title || "Your title here"}
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {type} · Updated just now
              </div>
            </div>
          </Section>
        </div>
      </div>
    </form>
  );
}