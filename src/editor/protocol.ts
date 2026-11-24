import type { IDocument } from "@/types/document.types";

/** Метка наших сообщений: всё остальное, что прилетает в окно, игнорируем */
export const PROTOCOL_SOURCE = "sectio" as const;

/** Родитель → iframe */
export type ParentToPreview =
  | { type: "doc:set"; document: IDocument }
  | { type: "selection:set"; id: string | null }
  | { type: "hover:set"; id: string | null };

/** Положение секции внутри iframe (px, относительно его документа) */
export interface ISectionRect {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

/** iframe → родитель */
export type PreviewToParent =
  | { type: "ready" }
  | { type: "section:rects"; rects: ISectionRect[] }
  | { type: "section:click"; id: string }
  | { type: "section:hover"; id: string | null }
  /** Props секции не прошли схему, в превью подставлены defaults */
  | { type: "section:invalid"; id: string; blockName: string };

export type Envelope<T> = T & { source: typeof PROTOCOL_SOURCE };

export const wrap = <T extends { type: string }>(message: T): Envelope<T> => ({
  ...message,
  source: PROTOCOL_SOURCE,
});

const PARENT_TYPES: ParentToPreview["type"][] = ["doc:set", "selection:set", "hover:set"];
const PREVIEW_TYPES: PreviewToParent["type"][] = [
  "ready",
  "section:rects",
  "section:click",
  "section:hover",
  "section:invalid",
];

const hasType = (data: unknown, types: string[]): data is { type: string; source: string } =>
  typeof data === "object" &&
  data !== null &&
  "source" in data &&
  data.source === PROTOCOL_SOURCE &&
  "type" in data &&
  typeof data.type === "string" &&
  types.includes(data.type);

export const isParentMessage = (data: unknown): data is Envelope<ParentToPreview> =>
  hasType(data, PARENT_TYPES);

export const isPreviewMessage = (data: unknown): data is Envelope<PreviewToParent> =>
  hasType(data, PREVIEW_TYPES);
