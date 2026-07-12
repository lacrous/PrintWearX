"use client";

import { useState } from "react";
import {
  Save,
  Mail,
  Megaphone,
  Calendar,
  Users,
  Eye,
  Send,
} from "lucide-react";
import {
  Field,
  FormRow,
  Section,
  Input,
  Textarea,
  Select,
  PageHeader,
} from "@/components/admin/form";
import { cn } from "@/lib/utils";

export function CampaignNewView() {
  const [name, setName] = useState("Summer sale 25% off");
  const [subject, setSubject] = useState("☀️ 25% off — only this weekend");
  const [fromName, setFromName] = useState("PrintWearX");
  const [fromEmail, setFromEmail] = useState("hello@printwearx.com");
  const [preview, setPreview] = useState("Your cart misses you, and so do we.");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("pwx:toast", {
          detail: { kind: "success", message: "Campaign scheduled", description: `${name} will be sent to 2,840 recipients.` }
        }));
      }}
      className="space-y-6 pb-24"
    >
      <PageHeader
        breadcrumb={[
          { href: "/admin/marketing", label: "Marketing" },
          { label: "New campaign" },
        ]}
        title="New campaign"
        description="Send email to a customer segment"
        back={{ href: "/admin/marketing", label: "Marketing" }}
        actions={
          <>
            <button
              type="button"
              className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
            <button
              type="button"
              className="h-10 px-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 inline-flex items-center gap-1.5"
            >
              Save draft
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 inline-flex items-center gap-1.5 shadow-lg shadow-primary-500/30"
            >
              <Send className="w-3.5 h-3.5" />
              Schedule send
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4 lg:space-y-6">
          <Section title="Campaign info">
            <Field label="Campaign name" required description="Internal name — not visible to recipients">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Summer sale 25% off" required />
            </Field>
<Field label="Type">
              <div className="grid grid-cols-3 gap-2">
                <button type="button" className="h-12 px-3 rounded-xl border-2 border-primary-500 bg-primary-50 dark:bg-primary-500/10 flex flex-col items-center justify-center gap-0.5">
                  <Mail className="w-4 h-4 text-primary-500" />
                  <span className="text-xs font-semibold text-primary-700 dark:text-primary-400">Email</span>
                </button>
                <button type="button" className="h-12 px-3 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 flex flex-col items-center justify-center gap-0.5">
                  <Megaphone className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs font-semibold">Banner</span>
                </button>
                <button type="button" className="h-12 px-3 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 flex flex-col items-center justify-center gap-0.5">
                  <Megaphone className="w-4 h-4 text-neutral-500" />
                  <span className="text-xs font-semibold">Push</span>
                </button>
              </div>
            </Field>
          </Section>

          <Section title="Email content" description="This is what customers will see in their inbox">
            <FormRow>
              <Field label="From name">
                <Input value={fromName} onChange={(e) => setFromName(e.target.value)} />
              </Field>
              <Field label="From email">
                <Input type="email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
              </Field>
            </FormRow>
            <Field label="Subject line" required>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120} required />
              <div className="text-[10px] text-neutral-500 mt-1 text-right">{subject.length} / 120</div>
            </Field>
            <Field label="Preview text" description="Shown in inbox next to subject">
              <Input value={preview} onChange={(e) => setPreview(e.target.value)} maxLength={160} />
            </Field>
            <Field label="Email body" description="Use the visual editor or paste HTML">
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                <div className="flex items-center gap-1 p-2 bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
                  {["B", "I", "U"].map((t) => (
                    <button key={t} type="button" className="w-8 h-8 rounded font-bold text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700">{t}</button>
                  ))}
                  <span className="w-px h-5 bg-neutral-300 dark:bg-neutral-600 mx-1" />
                  <button type="button" className="h-8 px-2 rounded text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700">H1</button>
                  <button type="button" className="h-8 px-2 rounded text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700">Link</button>
                  <button type="button" className="h-8 px-2 rounded text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700">Image</button>
                  <button type="button" className="h-8 px-2 rounded text-xs font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700">Button</button>
                </div>
                <Textarea
                  rows={10}
                  defaultValue={`Hi {{first_name}},

Summer is here — and so is your 25% off.

Use code SUMMER25 at checkout for the next 7 days.

[Shop now →]

— The PrintWearX team`}
                />
              </div>
            </Field>
          </Section>

          <Section title="Audience" description="Who should receive this campaign?">
            <Field label="Segment">
              <Select defaultValue="all">
                <option value="all">All subscribers (2,840)</option>
                <option value="vip">VIP customers (8)</option>
                <option value="at_risk">At-risk (3)</option>
                <option value="cart">Cart abandoners (24)</option>
                <option value="new">New signups (60d)</option>
              </Select>
            </Field>
            <div className="rounded-xl bg-neutral-50 dark:bg-neutral-800 p-4 flex items-center gap-3">
              <Users className="w-5 h-5 text-primary-500" />
              <div className="text-sm">
                <strong className="text-neutral-900 dark:text-white">Estimated reach:</strong>{" "}
                <span className="text-neutral-500">2,840 recipients</span>
              </div>
            </div>
          </Section>

          <Section title="Schedule">
            <div className="grid grid-cols-2 gap-2">
              <button type="button" className="h-12 px-3 rounded-xl border-2 border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-left">
                <div className="text-sm font-semibold text-primary-700 dark:text-primary-400">Send immediately</div>
                <div className="text-[10px] text-neutral-500">When you click Schedule</div>
              </button>
              <button type="button" className="h-12 px-3 rounded-xl border-2 border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 text-left">
                <div className="text-sm font-semibold">Schedule for later</div>
                <div className="text-[10px] text-neutral-500">Pick a date and time</div>
              </button>
            </div>
            <FormRow>
              <Field label="Date">
                <Input type="date" defaultValue="2026-07-10" />
              </Field>
              <Field label="Time">
                <Input type="time" defaultValue="09:00" />
              </Field>
            </FormRow>
            <Field label="Timezone">
              <Select defaultValue="America/New_York">
                <option>America/New_York (UTC-5)</option>
                <option>Europe/London (UTC+0)</option>
                <option>Asia/Cairo (UTC+2)</option>
              </Select>
            </Field>
          </Section>
        </div>

        {/* Preview pane */}
        <div className="space-y-4 lg:space-y-6">
          <Section title="Inbox preview">
            <div className="rounded-xl bg-neutral-100 dark:bg-neutral-800 p-3 space-y-2">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold">
                  P
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                    {fromName} <span className="text-neutral-500 font-normal">&lt;{fromEmail}&gt;</span>
                  </div>
                  <div className="text-[10px] text-neutral-500">to you · 2 hours ago</div>
                </div>
              </div>
              <div className="text-sm font-semibold text-neutral-900 dark:text-white line-clamp-1">
                {subject || "Subject line"}
              </div>
              <div className="text-xs text-neutral-500 line-clamp-2">
                {preview || "Preview text"}
              </div>
            </div>
            <div className="mt-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold">
                Summer Sale
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">25% off your next order</h3>
                <p className="text-sm text-neutral-500 mt-1">
                  Hi there! Summer is here — and so is your discount.
                </p>
                <button type="button" className="mt-3 w-full h-10 rounded-lg bg-primary-500 text-white text-sm font-semibold">
                  Shop now →
                </button>
              </div>
            </div>
          </Section>
        </div>
      </div>
    </form>
  );
}