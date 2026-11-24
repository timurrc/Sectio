import type * as t from "@babel/types";

/** Заглушка до этапа 3: кодогенерация блока ещё не написана */
export const codegenNotImplemented = (type: string) => (): t.Statement[] => {
  throw new Error(`Кодогенерация блока "${type}" появится на этапе 3`);
};
