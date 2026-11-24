import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Контейнер ЛЕНДИНГА (не путать с components/layouts/Container — тот для интерфейса редактора).
 * В экспорте превращается в src/components/Container.tsx сайта пользователя.
 */
const Container = ({ children, className = "" }: ContainerProps) => {
  return <div className={`mx-auto w-full max-w-6xl px-6 ${className}`}>{children}</div>;
};

export default Container;
