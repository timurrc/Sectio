import type { ComponentType } from "react";
import type * as t from "@babel/types";
import type { z } from "zod";
import type { BlockType } from "@/types/document.types";

export interface IBlockVariant {
  id: string;
  name: string;
}

/**
 * Кодогенерация секции: операторы файла — `const content = {...}` с данными и компонент `name`
 * выбранного варианта. Импорт Container и `export default` добавляет codegen/sectionFile.
 * Разметка обязана совпадать с Component (тест blocks/codegen.test.tsx).
 */
export type BlockCodegen<TProps> = (props: TProps, variant: string, name: string) => t.Statement[];

export interface IBlockComponentProps<TProps> {
  props: TProps;
  variant: string;
}

/**
 * Описание блока. Из одного модуля строятся превью (Component), инспектор (schema),
 * поиск ⌘K (name, tags, variants) и экспорт (codegen).
 */
export interface IBlockDefinition<TSchema extends z.ZodType = z.ZodType> {
  type: BlockType;
  name: string;
  tags: string[];
  variants: IBlockVariant[];
  schema: TSchema;
  /** Валидные props по умолчанию */
  defaults: z.infer<TSchema>;
  /** Рендер в превью */
  Component: ComponentType<IBlockComponentProps<z.infer<TSchema>>>;
  /** Ленивая загрузка codegen: Babel грузится только для вкладки «Код» и экспорта */
  codegen: () => Promise<{ default: BlockCodegen<z.infer<TSchema>> }>;
}

/** Проверяет блок при объявлении: defaults обязаны проходить схему, variants не пустой */
export const defineBlock = <TSchema extends z.ZodType>(
  block: IBlockDefinition<TSchema>,
): IBlockDefinition<TSchema> => {
  if (block.variants.length === 0) {
    throw new Error(`Блок "${block.type}": нужен хотя бы один вариант`);
  }
  const result = block.schema.safeParse(block.defaults);
  if (!result.success) {
    throw new Error(`Блок "${block.type}": defaults не проходят схему — ${result.error.message}`);
  }
  return block;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- реестр хранит блоки с разными схемами
export type AnyBlockDefinition = IBlockDefinition<any>;
