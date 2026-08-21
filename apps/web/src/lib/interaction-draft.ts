import { useCallback, useEffect, useRef, useState } from "react";
import type { InteractionType } from "@interviews-tool/domain/constants";

/* Draft persistence — spec §5 of documentation/CAPTURE-V2.md.
   One draft per process, shared by the notepad form and the live mode. */

export interface InteractionDraft {
  content: string;
  title: string;
  type: InteractionType;
  at: number;
}

const draftKey = (processId: string) => `tapuy:draft:v2:${processId}`;

function readDraft(processId: string): InteractionDraft | null {
  try {
    const raw = localStorage.getItem(draftKey(processId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as InteractionDraft;
    if (!parsed || typeof parsed.content !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function useInteractionDraft(processId: string) {
  const [content, setContentState] = useState("");
  const [title, setTitleState] = useState("");
  const [type, setTypeState] = useState<InteractionType>("note");
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [restoredFrom, setRestoredFrom] = useState<number | null>(null);
  const hydrated = useRef(false);
  /* Latest values, so consecutive setter calls in one tick persist coherently */
  const latest = useRef({ content: "", title: "", type: "note" as InteractionType });

  /* Restore once on mount (client only) */
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const draft = readDraft(processId);
    if (draft && draft.content.trim()) {
      latest.current = {
        content: draft.content,
        title: draft.title ?? "",
        type: draft.type ?? "note",
      };
      setContentState(draft.content);
      setTitleState(draft.title ?? "");
      setTypeState(draft.type ?? "note");
      setSavedAt(draft.at);
      setRestoredFrom(draft.at);
    }
  }, [processId]);

  const persist = useCallback(
    (next: { content: string; title: string; type: InteractionType }) => {
      try {
        if (!next.content.trim()) {
          localStorage.removeItem(draftKey(processId));
          setSavedAt(null);
          return;
        }
        const at = Date.now();
        localStorage.setItem(draftKey(processId), JSON.stringify({ ...next, at }));
        setSavedAt(at);
      } catch {
        /* storage full/unavailable — writing continues in memory */
      }
    },
    [processId],
  );

  const setContent = useCallback(
    (value: string) => {
      latest.current = { ...latest.current, content: value };
      setContentState(value);
      persist(latest.current);
    },
    [persist],
  );

  const setTitle = useCallback(
    (value: string) => {
      latest.current = { ...latest.current, title: value };
      setTitleState(value);
      persist(latest.current);
    },
    [persist],
  );

  const setType = useCallback(
    (value: InteractionType) => {
      latest.current = { ...latest.current, type: value };
      setTypeState(value);
      persist(latest.current);
    },
    [persist],
  );

  /* Discard the restored draft (strip action) */
  const discard = useCallback(() => {
    try {
      localStorage.removeItem(draftKey(processId));
    } catch {
      /* noop */
    }
    latest.current = { content: "", title: "", type: "note" };
    setContentState("");
    setTitleState("");
    setTypeState("note");
    setSavedAt(null);
    setRestoredFrom(null);
  }, [processId]);

  /* Clear after a successful save */
  const clear = useCallback(() => {
    try {
      localStorage.removeItem(draftKey(processId));
    } catch {
      /* noop */
    }
    latest.current = { ...latest.current, content: "", title: "" };
    setContentState("");
    setTitleState("");
    setSavedAt(null);
    setRestoredFrom(null);
  }, [processId]);

  const dismissRestored = useCallback(() => setRestoredFrom(null), []);

  return {
    content,
    title,
    type,
    setContent,
    setTitle,
    setType,
    savedAt,
    restoredFrom,
    dismissRestored,
    discard,
    clear,
  };
}

export type InteractionDraftState = ReturnType<typeof useInteractionDraft>;
