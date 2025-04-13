import { ReactNode } from "react";

export interface Plugin {
  id: number;
  name: string;
  categoryId: number;
  categoryName?: string; // only used in UI
  description?: string;
  icon?: ReactNode;
  isPremium: boolean;
}

export interface AdminPlugin extends Plugin {
  isActive: boolean;
}

export interface PluginCategory {
  id: number;
  name: string;
  plugins: Plugin[];
}
