import { useState } from "react";
import {
  Button,
  Input,
  Label,
  MarkdownContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@interviews-tool/web-ui";
import { useFormatter, useTranslations } from "@interviews-tool/i18n";
import { INTERACTION_TYPE_VALUES, type InteractionType } from "@interviews-tool/domain/constants";
import { useCreateInteraction, type CreateInteractionInput } from "@/hooks/use-interactions";
import { useInteractionTypeLabel } from "@/lib/i18n-labels";
import { toast } from "sonner";

const CONTENT_MIN = 10;
const CONTENT_MAX = 10000;

export const INTERACTION_CONTENT_ID = "interaction-content";

interface InteractionFormProps {
  hiringProcessId: string;
  onSuccess?: () => void;
}

export function InteractionForm({ hiringProcessId, onSuccess }: InteractionFormProps) {
  const t = useTranslations("interaction");
  const tCommon = useTranslations("common");
  const format = useFormatter();
  const typeLabel = useInteractionTypeLabel();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<InteractionType>("note");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [contentError, setContentError] = useState(false);

  const createMutation = useCreateInteraction();
  const overMax = content.length > CONTENT_MAX;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (content.length < CONTENT_MIN || overMax) {
      setContentError(true);
      setTab("write");
      return;
    }

    const data: CreateInteractionInput = {
      content,
      title: title || undefined,
      type,
    };

    try {
      await createMutation.mutateAsync({ hiringProcessId, data });
      toast.success(t("savedToast"));
      setTitle("");
      setContent("");
      setContentError(false);
      setTab("write");
      onSuccess?.();
    } catch (error) {
      toast.error(tCommon("error"));
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-xl border border-border bg-surface p-5"
    >
      <h3 className="text-base font-medium text-text">{t("logInteraction")}</h3>

      <div className="grid gap-2">
        <Label htmlFor="interaction-title">
          {t("title")} <span className="font-normal text-text-muted">{t("optional")}</span>
        </Label>
        <Input
          id="interaction-title"
          className="h-9"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("titlePlaceholder")}
          maxLength={100}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="interaction-type">{t("type")}</Label>
        <Select value={type} onValueChange={(value) => setType(value as InteractionType)}>
          <SelectTrigger id="interaction-type" className="h-9 w-full">
            <SelectValue>{typeLabel(type)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {INTERACTION_TYPE_VALUES.map((value) => (
              <SelectItem key={value} value={value}>
                {typeLabel(value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor={INTERACTION_CONTENT_ID}>{t("content")}</Label>
          <div className="flex rounded-md border border-border bg-surface-2 p-0.5">
            {(["write", "preview"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTab(mode)}
                className={cn(
                  "h-[22px] rounded-[5px] px-2 text-xs font-medium transition-colors",
                  tab === mode ? "bg-[#1C232B] text-text" : "text-text-muted hover:text-text",
                )}
              >
                {t(mode)}
              </button>
            ))}
          </div>
        </div>

        {tab === "write" ? (
          <textarea
            id={INTERACTION_CONTENT_ID}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (contentError && e.target.value.length >= CONTENT_MIN) setContentError(false);
            }}
            placeholder={t("contentPlaceholder")}
            className="mono min-h-[150px] w-full resize-y rounded-md border border-border bg-surface-2 px-3 py-2 text-[13px] leading-[1.65] text-text"
          />
        ) : (
          <div className="min-h-[150px] rounded-md border border-border bg-surface-2 px-3 py-2">
            {content.trim() ? (
              <MarkdownContent content={content} />
            ) : (
              <p className="text-sm text-text-muted">{t("nothingToPreview")}</p>
            )}
          </div>
        )}

        {contentError && <p className="text-xs text-danger">{t("contentMinError")}</p>}

        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">{t("markdownSupported")}</span>
          <span className={cn("mono text-xs", overMax ? "text-danger" : "text-text-muted")}>
            {format.number(content.length)} / {format.number(CONTENT_MAX)}
          </span>
        </div>
      </div>

      <Button type="submit" disabled={createMutation.isPending} className="w-full">
        {createMutation.isPending ? t("saving") : t("logInteraction")}
      </Button>
    </form>
  );
}
