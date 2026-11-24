import Editor, { type BeforeMount } from "@monaco-editor/react";
import { LoaderCircle } from "lucide-react";
import { useSyncExternalStore } from "react";

interface CodeEditorProps {
  path: string;
  code: string;
}

const LANGUAGES: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  css: "css",
  json: "json",
  html: "html",
  md: "markdown",
};

const languageOf = (path: string) => LANGUAGES[path.split(".").at(-1) ?? ""] ?? "plaintext";

const DARK_QUERY = "(prefers-color-scheme: dark)";
const subscribeScheme = (onChange: () => void) => {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const isDarkScheme = () => window.matchMedia(DARK_QUERY).matches;

/**
 * Код только для чтения: без проверки типов (у Monaco нет node_modules проекта,
 * ошибки импортов были бы ложными), только подсветка JSX.
 */
const beforeMount: BeforeMount = (monaco) => {
  // Новые версии Monaco держат TS-API на верхнем уровне, старые — в languages
  const typescript =
    monaco.typescript ??
    (monaco.languages as unknown as { typescript?: typeof monaco.typescript }).typescript;
  if (!typescript?.typescriptDefaults) return;
  typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true,
  });
  typescript.typescriptDefaults.setCompilerOptions({ jsx: typescript.JsxEmit.Preserve });
};

/** Monaco грузится лениво (React.lazy в CodeView), сам редактор — с CDN через @monaco-editor/react */
const CodeEditor = ({ path, code }: CodeEditorProps) => {
  const isDark = useSyncExternalStore(subscribeScheme, isDarkScheme);

  return (
    <Editor
      path={path}
      value={code}
      language={languageOf(path)}
      theme={isDark ? "vs-dark" : "light"}
      beforeMount={beforeMount}
      loading={<LoaderCircle className="size-6 animate-spin text-[var(--color-muted)]" />}
      options={{
        readOnly: true,
        domReadOnly: true,
        minimap: { enabled: false },
        fontSize: 13,
        scrollBeyondLastLine: false,
        wordWrap: "on",
        automaticLayout: true,
        renderLineHighlight: "none",
      }}
    />
  );
};

export default CodeEditor;
