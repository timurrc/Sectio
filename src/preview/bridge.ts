import { isParentMessage, wrap, type ParentToPreview, type PreviewToParent } from "@/core/protocol";

/** Сторона iframe. Принимаем сообщения только от родительского окна нашего origin */

export const sendToParent = (message: PreviewToParent) => {
  window.parent.postMessage(wrap(message), window.location.origin);
};

export const onParentMessage = (handler: (message: ParentToPreview) => void) => {
  const listener = (event: MessageEvent) => {
    if (event.source !== window.parent || event.origin !== window.location.origin) return;
    if (!isParentMessage(event.data)) return;
    handler(event.data);
  };
  window.addEventListener("message", listener);
  return () => window.removeEventListener("message", listener);
};
