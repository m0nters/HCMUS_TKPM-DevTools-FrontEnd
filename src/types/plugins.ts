import { ReactNode } from "react";

export interface Plugin {
  id: number;
  name: string;
  category: number;
  categoryName?: string; // only used in the UI
  description?: string;
  icon?: ReactNode;
  isPremium: boolean;
}

export interface PluginCategory {
  id: number;
  name: string;
  plugins: Plugin[];
}
