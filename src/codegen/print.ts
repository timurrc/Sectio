import type * as t from "@babel/types";

/** Стиль сгенерированного кода: как в самом редакторе */
const PRETTIER_OPTIONS = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
} as const;

/**
 * AST → отформатированный TSX. Babel generator и Prettier грузятся лениво:
 * им нужно попасть в бандл, но не в стартовый чанк редактора.
 * Парсер babel, а не typescript: в сгенерированных секциях нет аннотаций типов, а плагин втрое легче.
 */
export const printFile = async (file: t.File, filepath: string): Promise<string> => {
  const [{ generate }, prettier, babel, estree] = await Promise.all([
    import("@babel/generator"),
    import("prettier/standalone"),
    import("prettier/plugins/babel"),
    import("prettier/plugins/estree"),
  ]);

  // Операторы верхнего уровня печатаем по одному, чтобы разделить их пустой строкой
  // (импорты остаются одним блоком): Prettier сохраняет пустые строки, но не добавляет их
  const body = file.program.body;
  const code = body
    .map((statement, index) => {
      const printed = generate(statement, { jsescOption: { minimal: true } }).code;
      const isImportRun =
        index > 0 &&
        statement.type === "ImportDeclaration" &&
        body[index - 1].type === statement.type;
      return index === 0 ? printed : `${isImportRun ? "\n" : "\n\n"}${printed}`;
    })
    .join("");

  return prettier.format(code, {
    ...PRETTIER_OPTIONS,
    filepath,
    parser: "babel",
    plugins: [babel, estree],
  });
};
