import { useInteractions } from "@/hooks/use-interactions";
import { InteractionCard } from "./interaction-card";
import type { Interaction } from "@/hooks/use-interactions";
import { Skeleton } from "@interviews-tool/web-ui";
import { MessageSquarePlus } from "lucide-react";

interface InteractionTimelineProps {
  hiringProcessId: string;
  onEdit?: (interaction: Interaction) => void;
  onDelete?: (interaction: Interaction) => void;
}

export function InteractionTimeline({
  hiringProcessId,
  onEdit,
  onDelete,
}: InteractionTimelineProps) {
  const { data, isLoading, error } = useInteractions(hiringProcessId);

  if (isLoading) {
    return (
      <div className="relative">
        <div className="absolute left-4 top-2 bottom-2 w-px bg-border/50" />
        <div className="space-y-1">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="relative pl-10">
              <div className="absolute left-[13px] top-5 size-[7px] rounded-full bg-muted" />
              <div className="rounded-lg py-3 px-4">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-4 w-48 mb-2" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Error loading interactions"}
        </p>
      </div>
    );
  }

  const interactions = data?.data || [];

  if (interactions.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="inline-flex items-center justify-center size-12 rounded-full bg-muted mb-4">
          <MessageSquarePlus className="size-5 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">No interactions yet</p>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          Start by logging your first meeting or note. It will help future you remember why this
          mattered.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline vertical line */}
      <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

      <div className="space-y-1">
        {interactions.map((interaction, index) => (
          <div key={interaction.id} className="relative pl-10">
            {/* Timeline dot */}
            <div className="absolute left-[13px] top-5 size-[7px] rounded-full bg-muted-foreground/40 ring-2 ring-background" />
            <InteractionCard
              interaction={interaction}
              onEdit={onEdit}
              onDelete={onDelete}
              isLast={index === interactions.length - 1}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
