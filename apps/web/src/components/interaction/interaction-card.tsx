import { Button, MarkdownContent } from "@interviews-tool/web-ui";
import { InteractionTypeBadge } from "./interaction-type-badge";
import type { Interaction } from "@/hooks/use-interactions";
import { Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface InteractionCardProps {
  interaction: Interaction;
  onEdit?: (interaction: Interaction) => void;
  onDelete?: (interaction: Interaction) => void;
  isLast?: boolean;
}

const COLLAPSE_HEIGHT = 200;

export function InteractionCard({ interaction, onEdit, onDelete }: InteractionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight > COLLAPSE_HEIGHT);
    }
  }, [interaction.content]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="group/card rounded-lg py-3 px-4 hover:bg-muted/30 transition-colors">
      {/* Header row: badge + date + actions */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <InteractionTypeBadge type={interaction.type} />
          <span className="text-xs text-muted-foreground/70">
            {formatDate(interaction.createdAt)}
          </span>
        </div>
        <div className="flex gap-0.5 opacity-0 group-hover/card:opacity-100 transition-opacity">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onEdit(interaction)}
              className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
            >
              <Pencil className="size-3" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(interaction)}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Title */}
      {interaction.title && (
        <h4 className="font-medium text-sm mb-2 text-foreground/90 border-l-2 border-primary/50 pl-2.5">
          {interaction.title}
        </h4>
      )}

      {/* Collapsible markdown content */}
      <div className="relative max-w-prose">
        <div
          ref={contentRef}
          className={`overflow-hidden transition-[max-height] duration-300 ${
            isExpanded ? "" : isOverflowing ? `max-h-[${COLLAPSE_HEIGHT}px]` : ""
          }`}
          style={!isExpanded && isOverflowing ? { maxHeight: `${COLLAPSE_HEIGHT}px` } : undefined}
        >
          <MarkdownContent content={interaction.content} variant="compact" />
        </div>
      </div>

      {/* Subtle separator when content is collapsed */}
      {isOverflowing && !isExpanded && <div className="mt-1 h-px bg-border/30" />}

      {/* Read more / Show less button — outside the relative container for full visibility */}
      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 inline-flex items-center gap-1 rounded-md bg-muted/80 hover:bg-muted px-2.5 py-1 text-xs font-medium text-foreground/80 hover:text-foreground transition-colors"
        >
          {isExpanded ? (
            <>
              Show less <ChevronUp className="size-3.5" />
            </>
          ) : (
            <>
              Read more <ChevronDown className="size-3.5" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
