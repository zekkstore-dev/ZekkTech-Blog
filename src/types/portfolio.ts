export interface Portfolio {
  id: string;
  title: string;
  description: string;
  image_url: string;
  demo_url: string;
  repo_url: string;
  tags: string[];
  status?: 'completed' | 'progress';
  created_at: string;
  updated_at: string;
}
