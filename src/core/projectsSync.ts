const CHANNEL_NAME = "sectio:projects";

export interface IProjectsChange {
  /** Проект, который создали, сохранили или удалили */
  id: string;
}

/** BroadcastChannel не доходит до своей вкладки: сообщения получают только остальные */
const openChannel = () =>
  typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(CHANNEL_NAME);

const sender = openChannel();

/** Сообщает другим вкладкам, что проект изменился в IndexedDB */
export const notifyProjectsChanged = (change: IProjectsChange) => {
  sender?.postMessage(change);
};

/** Подписка на изменения проектов из других вкладок. Возвращает отписку */
export const subscribeProjectsChanged = (listener: (change: IProjectsChange) => void) => {
  const channel = openChannel();
  if (!channel) return () => {};
  channel.onmessage = (event: MessageEvent<IProjectsChange>) => listener(event.data);
  return () => channel.close();
};
