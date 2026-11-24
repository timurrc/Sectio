import type { IDocument } from "@/types/document.types";

/** Метка наших сообщений: всё остальное, что прилетает в окно, игнорируем */
export const PROTOCOL_SOURCE = "sectio" as const;

/** Родитель → iframe */
export type ParentToPreview =
  | { type: "doc:set"; document: IDocument }
  | { type: "selection:set"; id: string | null }
  | { type: "hover:set"; id: string | null }
  /** Прокрутить превью: автопрокрутка, пока блок из библиотеки тянут у края холста */
  | { type: "scroll:by"; dy: number };

/** Положение секции во вьюпорте iframe (px, getBoundingClientRect). Шлётся при рендере, скролле и ресайзе */
export interface ISectionRect {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

/** Нажатие клавиши, пока фокус внутри iframe: родитель обрабатывает его как свой хоткей */
export interface IHotkeyEvent {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
}

/** iframe → родитель */
export type PreviewToParent =
  | { type: "ready" }
  | { type: "section:rects"; rects: ISectionRect[] }
  | { type: "section:click"; id: string }
  | { type: "section:hover"; id: string | null }
  | { type: "hotkey"; event: IHotkeyEvent }
  /** Секцию тянут прямо в превью: y курсора во вьюпорте iframe */
  | { type: "section:drag"; id: string; y: number }
  /** Секцию отпустили: родитель переносит её в модели */
  | { type: "section:drop"; id: string; y: number }
  /** Перетаскивание отменено (Esc, потеря указателя) */
  | { type: "section:drag-cancel" }
  /** Props секции не прошли схему, в превью подставлены defaults */
  | { type: "section:invalid"; id: string; blockName: string };

export type Envelope<T> = T & { source: typeof PROTOCOL_SOURCE };

export const wrap = <T extends { type: string }>(message: T): Envelope<T> => ({
  ...message,
  source: PROTOCOL_SOURCE,
});

const PARENT_TYPES: ParentToPreview["type"][] = [
  "doc:set",
  "selection:set",
  "hover:set",
  "scroll:by",
];
const PREVIEW_TYPES: PreviewToParent["type"][] = [
  "ready",
  "section:rects",
  "section:click",
  "section:hover",
  "section:invalid",
  "hotkey",
  "section:drag",
  "section:drop",
  "section:drag-cancel",
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
