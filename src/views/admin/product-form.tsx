"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Eye,
  Archive,
  Image as ImageIcon,
  Tag as TagIcon,
  DollarSign,
  Package,
  Layers,
  Search,
  Sparkles,
} from "lucide-react";
import {
  Field,
  FormRow,
  Section,
  Input,
  Textarea,
  Select,
  Toggle,
  ImageUpload,
  TagsInput,
  PageHeader,
} from "@/components/admin/form";
import { getProduct, variantsForProduct } from "@/lib/admin-models";
import type { Product } from "@/lib/admin-data";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const CATEGORIES = ["T-Shirts", "Hoodies", "Crewnecks", "Long-Sleeves", "Caps", "Totes"] as const;

interface Props {
  productId?: string;
}

export function ProductFormView({ productId }: Props) {
  const existing = productId ? getProduct(productId) : null;
  const isEdit = !!existing;

  const [images, setImages] = useState<string[]>(
    existing ? ["from-primary-500 to-primary-700", "from-neutral-200 to-neutral-300", "from-amber-100 to-amber-200"] : []
  );
  const [tags, setTags] = useState<string[]>(
    existing ? ["bestseller", "sustainable"] : []
  );
  const [trackInventory, setTrackInventory] = useState(existing ? true : true);
  const [physical, setPhysical] = useState(existing ? !!existing.cost : true);
  const [variantsEnabled, setVariantsEnabled] = useState(true);
  const [status, setStatus] = useState<Product["status"]>(existing?.status ?? "draft");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("pwx:toast", {
          detail: {
            kind: "success",
            message: isEdit ? "Product updated" : "Product published",
            description: isEdit ? "Changes are live on the storefront." : "Your new product is now visible to customers.",
          }
        }));
      }}
      className="space-y-6 pb-24"
    >
      <PageHeader
        breadcrumb={[
          { href: "/admin/products", label: "Products" },
          { label: isEdit ? "Edit" : "New" },
        ]}
        title={isEdit ? existing!.name : "New product"}
        description={isEdit ? `SKU placeholder · ${formatCurrency(existing!.price)} · ${existing!.status}` : "Add a new product to your catalog"}
        back={{ href: "/admin/products", label: "Products" }}
        actions={
          <>
            {isEdit && (
              <a
                href={`/products/${existing!.slug}`}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </a>
            )}
            <button
              type="button"
              className="hidden sm:inline-flex h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 items-center gap-1.5"
            >
              <Archive className="w-3.5 h-3.5" />
              Save draft
            </button>
            <button
              type="submit"
              className="h-10 px-4 sm:px-5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30"
            >
              <Save className="w-3.5 h-3.5" />
              {isEdit ? "Save changes" : "Publish"}
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <Section title="General" description="Basic information customers see">
            <Field label="Title" required>
              <Input
                defaultValue={existing?.name}
                placeholder="e.g. Premium Leather Watch"
                required
              />
            </Field>
            <Field label="Description" description="Tell customers what makes it special">
              <Textarea
                rows={5}
                defaultValue={existing?.name?.includes("Watch")
                  ? "Experience timeless elegance with our Premium Leather Watch. Crafted with precision and attention to detail, this timepiece features a genuine Italian leather strap and Swiss quartz movement for accurate timekeeping. Perfect for both formal and casual occasions."
                  : ""}
                placeholder="A clear, helpful description…"
              />
            </Field>
          </Section>

          <Section
            title="Media"
            description="Upload up to 8 images. The first image is the main product image."
          >
            <ImageUpload value={images} onChange={setImages} max={8} />
          </Section>

          <Section
            title="Pricing"
            description="Set your price, cost (for margin), and compare-at price for sale display."
          >
            <FormRow cols={3}>
              <Field label="Price" required>
                <Input
                  type="number"
                  step="0.01"
                  defaultValue={existing?.price}
                  prefix="$"
                  placeholder="0.00"
                  required
                />
              </Field>
              <Field label="Cost" description="For margin calc">
                <Input
                  type="number"
                  step="0.01"
                  defaultValue={existing?.cost}
                  prefix="$"
                  placeholder="0.00"
                />
              </Field>
              <Field label="Compare-at" description="Strikethrough price">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  prefix="$"
                />
              </Field>
            </FormRow>
<div className="rounded-xl bg-neutral-50 dark:bg-neutral-800 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <Margin label="Margin" value={`${(((existing?.price ?? 99) - (existing?.cost ?? 30)) / (existing?.price ?? 99) * 100).toFixed(1)}%`} accent="success" />
              <Margin label="Profit / unit" value={formatCurrency((existing?.price ?? 99) - (existing?.cost ?? 30))} accent="neutral" />
              <Margin label="Tax (8%)" value={formatCurrency((existing?.price ?? 99) * 0.08)} accent="neutral" />
            </div>
          </Section>

          <Section
            title="Inventory"
            description="Track stock and decide if you need variants"
          >
            <Toggle
              checked={trackInventory}
              onChange={setTrackInventory}
              label="Track inventory"
              description="Decrement stock when orders are placed"
            />
            <Toggle
              checked={physical}
              onChange={setPhysical}
              label="Physical product"
              description="Requires shipping"
            />
            <Toggle
              checked={variantsEnabled}
              onChange={setVariantsEnabled}
              label="This product has multiple variants"
              description="e.g. sizes, colors, materials"
            />
            {variantsEnabled && (
              <div className="pt-2">
                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 p-3 bg-neutral-50 dark:bg-neutral-800 text-[10px] uppercase tracking-wider font-bold text-neutral-500">
                    <div className="col-span-12 md:col-span-4">Option</div>
                    <div className="col-span-4 md:col-span-2">SKU</div>
                    <div className="col-span-3 md:col-span-2 text-right">Price</div>
                    <div className="col-span-3 md:col-span-2 text-right">Stock</div>
                    <div className="hidden md:block md:col-span-2 text-right">Cost</div>
                  </div>
                  {(variantsForProduct(productId ?? "5").length > 0
                    ? variantsForProduct(productId ?? "5")
                    : [
                        { id: "new1", productId: "", sku: "PWX-NEW-001", option: "Default", price: 0, cost: 0, stock: 0, reserved: 0 },
                      ]
                  ).map((v) => (
                    <div key={v.id} className="grid grid-cols-12 gap-2 p-3 border-t border-neutral-200 dark:border-neutral-800 text-sm items-center">
                      <div className="col-span-12 md:col-span-4 truncate font-medium">{v.option}</div>
                      <div className="col-span-4 md:col-span-2 font-mono text-xs text-neutral-500">{v.sku}</div>
                      <div className="col-span-4 md:col-span-2 text-right tabular-nums">{formatCurrency(v.price)}</div>
                      <div className="col-span-4 md:col-span-2 text-right tabular-nums font-semibold">{v.stock}</div>
                      <div className="hidden md:block md:col-span-2 text-right tabular-nums text-neutral-500">{formatCurrency(v.cost)}</div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-3 inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold"
                >
                  + Add variant
                </button>
              </div>
            )}
          </Section>

          <Section title="SEO" description="How this product appears on Google and social media">
            <Field label="Page title" description="Max 60 characters">
              <Input
                placeholder="Auto-generated from title"
                defaultValue={existing ? `${existing.name} · PrintWearX` : ""}
                maxLength={60}
              />
            </Field>
            <Field label="Meta description" description="Max 160 characters">
              <Textarea
                rows={2}
                defaultValue={existing ? `Elegant timepiece with Swiss movement` : ""}
                maxLength={160}
              />
            </Field>
            <Field label="URL handle" description="The path this product lives at">
              <Input
                defaultValue={existing?.slug}
                prefix="printwearx.app/products/"
                placeholder="my-product"
              />
            </Field>
          </Section>
        </div>

        {/* Sidebar column */}
        <div className="space-y-4 lg:space-y-6">
          <Section title="Status">
            <Field label="Visibility">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as Product["status"])}
              >
                <option value="active">Active — visible to customers</option>
                <option value="draft">Draft — hidden from customers</option>
                <option value="archived">Archived — not listed</option>
              </Select>
            </Field>
          </Section>

          <Section title="Organization">
            <Field label="Category" required>
              <Select defaultValue={existing?.category} required>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Select>
            </Field>
            <Field label="Tags" description="Used for search and filtering">
              <TagsInput
                value={tags}
                onChange={setTags}
                suggestions={["new-arrival", "bestseller", "sustainable", "limited-edition", "giftable", "staff-pick"]}
              />
            </Field>
          </Section>

          <Section title="Shipping">
            <Field label="Weight" description="Used for shipping calculations">
              <Input type="number" placeholder="0" suffix="grams" />
            </Field>
            <Field label="Origin country">
              <Select defaultValue="US">
                <option>US — United States</option>
                <option>CN — China</option>
                <option>IT — Italy</option>
                <option>IN — India</option>
              </Select>
            </Field>
          </Section>

          {isEdit && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-primary-200 dark:border-primary-500/30 bg-gradient-to-br from-primary-50 to-primary-100/50 dark:from-primary-500/10 dark:to-primary-500/5 p-4 space-y-2"
            >
              <div className="flex items-center gap-1.5 text-primary-700 dark:text-primary-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">AI suggestion</span>
              </div>
              <p className="text-sm text-primary-900 dark:text-primary-300 leading-snug">
                This product's title performs 23% better with the word <strong>"Swiss"</strong> in it. You currently have it.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </form>
  );
}

function Margin({ label, value, accent }: { label: string; value: string; accent: "success" | "neutral" }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500">
        {label}
      </div>
      <div className={cn(
        "text-base font-bold tabular-nums",
        accent === "success" ? "text-success" : "text-neutral-900 dark:text-white"
      )}>
        {value}
      </div>
    </div>
  );
}