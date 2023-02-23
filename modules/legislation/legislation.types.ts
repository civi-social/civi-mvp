export interface LegislationData {
  status: string;
  date: string;
  id: string;
  title: string;
  link: string;
  tags: string[];
  sponsors: string[];
  description?: string;
  source_id?: string;
}
