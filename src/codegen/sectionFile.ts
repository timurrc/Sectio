import * as t from "@babel/types";

const importDefault = (name: string, from: string) =>
  t.importDeclaration([t.importDefaultSpecifier(t.identifier(name))], t.stringLiteral(from));

/** Файл секции: import Container + операторы из codegen блока + export default */
export const sectionFile = (name: string, statements: t.Statement[]): t.File =>
  t.file(
    t.program([
      importDefault("Container", "../components/Container"),
      ...statements,
      t.exportDefaultDeclaration(t.identifier(name)),
    ]),
  );

export interface IAppSection {
  name: string;
  isDark: boolean;
}

/** App.tsx: секции по порядку; тёмная секция обёрнута в div.dark, как в превью */
export const appFile = (sections: IAppSection[]): t.File => {
  const element = (name: string) =>
    t.jsxElement(t.jsxOpeningElement(t.jsxIdentifier(name), [], true), null, []);

  const children = sections.map(({ name, isDark }) =>
    isDark
      ? t.jsxElement(
          t.jsxOpeningElement(t.jsxIdentifier("div"), [
            t.jsxAttribute(t.jsxIdentifier("className"), t.stringLiteral("dark")),
          ]),
          t.jsxClosingElement(t.jsxIdentifier("div")),
          [element(name)],
        )
      : element(name),
  );

  const main = t.jsxElement(
    t.jsxOpeningElement(t.jsxIdentifier("main"), []),
    t.jsxClosingElement(t.jsxIdentifier("main")),
    children,
  );

  return t.file(
    t.program([
      ...sections.map(({ name }) => importDefault(name, `./sections/${name}`)),
      t.variableDeclaration("const", [
        t.variableDeclarator(
          t.identifier("App"),
          t.arrowFunctionExpression([], t.blockStatement([t.returnStatement(main)])),
        ),
      ]),
      t.exportDefaultDeclaration(t.identifier("App")),
    ]),
  );
};
