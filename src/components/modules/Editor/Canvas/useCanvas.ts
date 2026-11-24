import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { isPreviewMessage, wrap, type ParentToPreview } from "@/editor/protocol";
import { useDocumentStore } from "@/store/document.store";
import { useEditorStore } from "@/store/editor.store";

/**
 * Связь с iframe-превью. Модель живёт в document.store и уходит в iframe сообщением doc:set.
 * Принимаем сообщения только от нашего iframe и нашего origin.
 */
export const useCanvas = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const warnedRef = useRef(new Set<string>());
  const [isReady, setIsReady] = useState(false);
  const document = useDocumentStore((state) => state.document);
  const viewport = useEditorStore((state) => state.viewport);

  const post = useCallback((message: ParentToPreview) => {
    iframeRef.current?.contentWindow?.postMessage(wrap(message), window.location.origin);
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (!isPreviewMessage(event.data)) return;

      switch (event.data.type) {
        case "ready": {
          setIsReady(true);
          // iframe мог перезагрузиться (HMR): отдаём ему актуальную модель сразу
          const current = useDocumentStore.getState().document;
          if (current) post({ type: "doc:set", document: current });
          break;
        }
        case "section:invalid": {
          const { id, blockName } = event.data;
          if (warnedRef.current.has(id)) break;
          warnedRef.current.add(id);
          toast.error(`Секция «${blockName}»: данные некорректны, показаны значения по умолчанию`);
          break;
        }
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [post]);

  // Любое изменение модели сразу уходит в превью
  useEffect(() => {
    if (isReady && document) post({ type: "doc:set", document });
  }, [isReady, document, post]);

  return { iframeRef, viewport, isReady };
};
