import "zod/v4/core";

/** Подсказки для инспектора: задаются в схеме блока через .meta({ ... }) */
declare module "zod/v4/core" {
  interface GlobalMeta {
    /** Подпись поля */
    label?: string;
    /** Многострочное поле (textarea) */
    multiline?: boolean;
    /** Подпись одного элемента массива: «Тариф», «Ссылка» */
    itemLabel?: string;
  }
}
