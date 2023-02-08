export interface ChicagoBill {
  status: string;
  date: string;
  sponsor: string;
  id: string;
  title: string;
  link: string;
  tags: string[];
}

export type Bill = ChicagoBill;

export type Locales = "Illinois" | "Chicago";
