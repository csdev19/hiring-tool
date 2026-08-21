import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import { Button, StatusBadge, cn } from "@interviews-tool/web-ui";
import { useFormatter, useTranslations } from "@interviews-tool/i18n";
import type { HiringProcessStatus } from "@interviews-tool/domain/constants";

import { useCreateInteraction, type Interaction } from "@/hooks/use-interactions";
import { useInteractionTypeLabel } from "@/lib/i18n-labels";
import { SLASH_ITEMS, excerpt, formatDuration, formatTimer } from "@/lib/capture";
import type { InteractionDraftState } from "@/lib/interaction-draft";
import { useSlashMenu } from "./slash-menu";
import { QuestionsPanel } from "./questions-panel";

const CONTENT_MIN = 10;

interface LiveNoteProps {
  processId: string;
  companyName: string;
  jobTitle?: string | null;
  status: HiringProcessStatus | string;
  statusLabel: string;
  /** Preformatted mono salary text, e.g. "$5,200 / mo · USD" */
  salaryText?: string | null;
  interactions: Interaction[];
  draft: InteractionDraftState;
  onClose: () => void;
}

/* Live mode — spec §2 of documentation/CAPTURE-V2.md. Full-screen overlay
   for taking notes during the call: mono editor over bg with no focus ring
   (the mint caret is the indicator), timer in the top bar, and a
   collapsible side panel with questions and earlier notes. */
export function LiveNote({
  processId,
  companyName,
  jobTitle,
  status,
  statusLabel,
  salaryText,
  interactions,
  draft,
  onClose,
}: LiveNoteProps) {
  const t = useTranslations("capture");
  const tInteraction = useTranslations("interaction");
  const tCommon = useTranslations("common");
  const format = useFormatter();
  const typeLabel = useInteractionTypeLabel();
  const createMutation = useCreateInteraction();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const openedAt = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);

  const { content, title, type, setContent } = draft;

  const slash = useSlashMenu({
    value: content,
    onValueChange: setContent,
    textareaRef,
    menuClassName: "bottom-4 left-7 mb-0",
  });

  /* Timer */
  useEffect(() => {
    const interval = setInterval(
      () => setElapsed(Math.floor((Date.now() - openedAt.current) / 1000)),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  /* Caret at the end on open */
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
      el.dataset.touched = "1";
    }
  }, []);

  const handleSave = async () => {
    if (content.length < CONTENT_MIN) {
      toast.error(tInteraction("contentMinError"));
      return;
    }
    const duration = formatDuration(Math.floor((Date.now() - openedAt.current) / 1000));
    const baseTitle = title.trim();
    const finalTitle = duration
      ? `${baseTitle || t("liveNoteDefaultTitle")} · ${duration}`
      : baseTitle || undefined;

    try {
      await createMutation.mutateAsync({
        hiringProcessId: processId,
        data: { content, title: finalTitle, type },
      });
      toast.success(tInteraction("savedToast"));
      draft.clear();
      onClose();
    } catch (error) {
      toast.error(tCommon("error"));
      console.error(error);
    }
  };

  const lastInteractionAt = interactions[0]?.createdAt ?? null;
  const earlierNotes = interactions.slice(0, 4);

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-bg"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      {/* Top bar — 52px */}
      <div className="flex h-[52px] shrink-0 items-center gap-3 border-b border-border px-4">
        <span className="size-[7px] shrink-0 rounded-full bg-fuchsia" />
        <span className="mono shrink-0 text-[13px] tabular-nums text-text">
          {formatTimer(elapsed)}
        </span>
        <span className="shrink-0 text-sm font-medium text-text">{companyName}</span>
        {jobTitle && (
          <span className="min-w-0 truncate text-[13px] text-text-muted">{jobTitle}</span>
        )}
        <StatusBadge status={status} label={statusLabel} className="shrink-0" />
        {salaryText && (
          <span className="mono hidden shrink-0 text-[13px] text-text-secondary lg:inline">
            {salaryText}
          </span>
        )}

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {draft.savedAt && (
            <span className="mono max-w-[160px] truncate text-xs text-text-muted">
              {t("draftSaved", {
                time: format.dateTime(new Date(draft.savedAt), {
                  hour: "numeric",
                  minute: "2-digit",
                }),
              })}
            </span>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="shrink-0 whitespace-nowrap"
            onClick={() => setPanelOpen((v) => !v)}
          >
            {panelOpen ? t("hidePanel") : t("showPanel")}
          </Button>
          <Button
            size="sm"
            className="shrink-0 whitespace-nowrap"
            onClick={handleSave}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? tInteraction("saving") : t("saveInteraction")}
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-[30px] shrink-0"
            onClick={onClose}
            title={t("close")}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* Body */}
      <div className="flex min-h-0 flex-1">
        {/* Editor */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          {slash.menu}
          <textarea
            ref={textareaRef}
            id="live-content"
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              slash.detect(e.target);
            }}
            onKeyDown={(e) => {
              if (slash.handleKeyDown(e)) {
                e.stopPropagation();
                return;
              }
              if (e.key === "Escape") return; /* bubbles to the overlay: close */
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
              e.stopPropagation();
            }}
            onPointerDown={(e) => {
              e.currentTarget.dataset.touched = "1";
            }}
            placeholder={tInteraction("contentPlaceholder")}
            className="mono w-full flex-1 resize-none border-0 bg-transparent p-7 text-[15px] leading-[1.8] text-text outline-none [caret-color:var(--mint)] focus-visible:shadow-none"
          />

          {/* Quick-insert chips */}
          <div className="flex shrink-0 flex-wrap items-center gap-2 px-7 pb-5">
            {SLASH_ITEMS.slice(0, 4).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => slash.insertSnippet(item.insert())}
                className="rounded-md border border-border bg-transparent px-2.5 py-1 text-xs text-text-secondary transition-colors hover:border-border-strong hover:text-text"
              >
                {t(`slash.${item.id}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Side panel — 320px, collapsible */}
        <aside
          className={cn(
            "box-border w-[320px] shrink-0 overflow-y-auto border-l border-border p-5",
            !panelOpen && "hidden",
          )}
        >
          <QuestionsPanel
            processId={processId}
            lastInteractionAt={lastInteractionAt}
            variant="live"
            onTick={(text) => slash.insertSnippet(`**Q:** ${text}\n`)}
          />

          {earlierNotes.length > 0 && (
            <div className="mt-8 border-t border-border pt-5">
              <h3 className="text-base font-medium text-text">{t("earlierNotes")}</h3>
              <div className="mt-4 space-y-5">
                {earlierNotes.map((interaction) => (
                  <div key={interaction.id}>
                    <div className="flex items-center gap-2">
                      <span className="rounded-[5px] bg-surface-2 px-1.5 py-0.5 text-[11px] font-medium text-text-secondary">
                        {interaction.type ? typeLabel(interaction.type) : "—"}
                      </span>
                      <span className="mono text-[11px] text-text-muted">
                        {format.dateTime(new Date(interaction.createdAt), {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
                      {excerpt(interaction.content)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
