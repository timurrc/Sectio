import * as t from "@babel/types";

/**
 * Короткие построители AST для codegen блоков. Модуль грузится лениво вместе с codegen,
 * поэтому @babel/types не попадает ни в бандл редактора, ни в превью.
 */

export type Child = t.JSXElement | t.Expression | string | false | null | undefined;
type AttrValue = string | t.Expression;

/** Путь вида "content.items" или "plan.features" → MemberExpression */
export const ref = (path: string): t.Expression =>
  path
    .split(".")
    .reduce<t.Expression | null>(
      (object, key) => (object ? t.memberExpression(object, t.identifier(key)) : t.identifier(key)),
      null,
    ) as t.Expression;

const toAttrValue = (value: AttrValue) =>
  typeof value === "string" ? t.stringLiteral(value) : t.jsxExpressionContainer(value);

const toChild = (child: Exclude<Child, false | null | undefined>) => {
  if (typeof child === "string") return t.jsxText(child);
  if (t.isJSXElement(child)) return child;
  return t.jsxExpressionContainer(child);
};

/** JSX-элемент. Атрибут с undefined пропускается, `aria-hidden: true` → голый атрибут */
export const el = (
  tag: string,
  attrs: Record<string, AttrValue | true | undefined> = {},
  ...children: Child[]
): t.JSXElement => {
  const name = t.jsxIdentifier(tag);
  const attributes = Object.entries(attrs)
    .filter((entry): entry is [string, AttrValue | true] => entry[1] !== undefined)
    .map(([key, value]) =>
      t.jsxAttribute(t.jsxIdentifier(key), value === true ? null : toAttrValue(value)),
    );
  const content = children
    .filter((child): child is Exclude<Child, false | null | undefined> => Boolean(child))
    .map(toChild);
  const selfClosing = content.length === 0;

  return t.jsxElement(
    t.jsxOpeningElement(name, attributes, selfClosing),
    selfClosing ? null : t.jsxClosingElement(t.jsxIdentifier(tag)),
    content,
  );
};

/** `{test && element}` */
export const and = (test: t.Expression, element: t.JSXElement) =>
  t.logicalExpression("&&", test, element);

/** `{list.map((item, index) => <… key={index} />)}`; key ставится первым атрибутом корня */
export const map = (list: string, [item, index]: [string, string], element: t.JSXElement) => {
  element.openingElement.attributes.unshift(
    t.jsxAttribute(t.jsxIdentifier("key"), t.jsxExpressionContainer(t.identifier(index))),
  );
  return t.callExpression(t.memberExpression(ref(list), t.identifier("map")), [
    t.arrowFunctionExpression([t.identifier(item), t.identifier(index)], element),
  ]);
};

/** Шаблонная строка класса: `base ${test ? "a" : "b"}` */
export const cx = (base: string, test: t.Expression, whenTrue: string, whenFalse: string) =>
  t.templateLiteral(
    [
      t.templateElement({ raw: `${base} `, cooked: `${base} ` }),
      t.templateElement({ raw: "", cooked: "" }, true),
    ],
    [t.conditionalExpression(test, t.stringLiteral(whenTrue), t.stringLiteral(whenFalse))],
  );

/** Произвольный вызов: call(ref("String"), arg) */
export const call = (callee: t.Expression, ...args: t.Expression[]) =>
  t.callExpression(callee, args);

export const method = (object: t.Expression, name: string, ...args: t.Expression[]) =>
  t.callExpression(t.memberExpression(object, t.identifier(name)), args);

export const plus = (left: t.Expression, right: t.Expression) =>
  t.binaryExpression("+", left, right);

export const num = (value: number) => t.numericLiteral(value);
export const str = (value: string) => t.stringLiteral(value);

/** `const content = {...};` — данные секции */
export const contentConst = (props: unknown, name = "content") =>
  t.variableDeclaration("const", [
    t.variableDeclarator(t.identifier(name), t.valueToNode(props) as t.Expression),
  ]);

/** `const Name = () => { const {..} = content; return (<jsx/>); };` */
export const component = (name: string, body: t.JSXElement, destructure: string[] = []) => {
  const statements: t.Statement[] = [];
  if (destructure.length > 0) {
    statements.push(
      t.variableDeclaration("const", [
        t.variableDeclarator(
          t.objectPattern(
            destructure.map((key) =>
              t.objectProperty(t.identifier(key), t.identifier(key), false, true),
            ),
          ),
          t.identifier("content"),
        ),
      ]),
    );
  }
  statements.push(t.returnStatement(body));

  return t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier(name),
      t.arrowFunctionExpression([], t.blockStatement(statements)),
    ),
  ]);
};
