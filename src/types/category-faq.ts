export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  variant: 'blue' | 'white';
  created_at: string;
}

export type CategoryInsert = Omit<Category, 'id' | 'created_at'>;

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export type FAQInsert = Omit<FAQ, 'id' | 'created_at'>;
