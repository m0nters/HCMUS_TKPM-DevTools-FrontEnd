import { ReactNode } from "react";

export interface Tool {
  name: string;
  path: string;
  description: string;
  icon: ReactNode;
  premium: boolean;
  category: string;
}

export interface ToolCategory {
  name: string;
  tools: Tool[];
}
