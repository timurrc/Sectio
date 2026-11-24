import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container = ({ children, className }: ContainerProps) => {
  return <div className={cn("mx-auto w-full max-w-[1200px] px-3.5", className)}>{children}</div>;
};

export default Container;
