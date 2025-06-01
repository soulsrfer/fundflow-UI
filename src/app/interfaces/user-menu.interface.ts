import { MenuItem } from "primeng/api";

export interface UserMenu extends MenuItem {
  id: string;
  parentId: number | null;
  role: string;
}