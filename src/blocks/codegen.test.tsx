import { generate } from "@babel/generator";
import * as t from "@babel/types";
import { render } from "@testing-library/react";
import React, { type ComponentType } from "react";
import { transformWithOxc } from "vite";
import { describe, expect, it } from "vitest";
import { sectionFile } from "@/codegen/sectionFile";
import { printFile } from "@/codegen/print";
import { BLOCKS, type AnyBlockDefinition } from "./registry";
import Container from "./shared/Container";

const blocks = Object.values(BLOCKS);

/** Компилирует операторы codegen (без import/export) и возвращает компонент */
const compile = async (statements: t.Statement[], name: string) => {
  const { code } = generate(t.file(t.program(statements)));
  const result = await transformWithOxc(code, "section.jsx", {
    jsx: { runtime: "classic" },
  });
  const factory = new Function("React", "Container", `${result.code}\nreturn ${name};`);
  return factory(React, Container) as ComponentType;
};

/** Варианты props: defaults и версия, где все необязательные строки верхнего уровня пустые */
const propSets = (block: AnyBlockDefinition) => {
  const blank: Record<string, unknown> = { ...block.defaults };
  for (const [key, value] of Object.entries(blank)) {
    if (typeof value !== "string") continue;
    const candidate = { ...blank, [key]: "" };
    if (block.schema.safeParse(candidate).success) Object.assign(blank, candidate);
  }
  return [
    ["defaults", block.defaults],
    ["пустые необязательные поля", blank],
  ] as const;
};

describe.each(blocks.map((block) => [block.type, block] as const))("codegen %s", (_, block) => {
  describe.each(block.variants.map((variant) => variant.id))("вариант %s", (variant) => {
    it.each(propSets(block))("разметка совпадает с Component: %s", async (_label, props) => {
      const { default: codegen } = await block.codegen();
      const Generated = await compile(codegen(props, variant, "Section"), "Section");

      const expected = render(<block.Component props={props} variant={variant} />).container
        .innerHTML;
      const actual = render(<Generated />).container.innerHTML;
      expect(actual).toBe(expected);
    });

    it("файл секции совпадает со snapshot", async () => {
      const { default: codegen } = await block.codegen();
      const name = "Section";
      const code = await printFile(
        sectionFile(name, codegen(block.defaults, variant, name)),
        "Section.tsx",
      );
      expect(code).toMatchSnapshot();
    });
  });
});
