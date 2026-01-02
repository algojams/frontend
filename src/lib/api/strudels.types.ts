export interface Strudel {
  id: string;
  user_id: string;
  title: string;
  code: string;
  description?: string;
  tags: string[];
  is_public: boolean;
  fork_count: number;
  forked_from_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateStrudelRequest {
  title: string;
  code: string;
  description?: string;
  tags?: string[];
  is_public?: boolean;
}

export interface UpdateStrudelRequest {
  title?: string;
  code?: string;
  description?: string;
  tags?: string[];
  is_public?: boolean;
}

export interface StrudelsResponse {
  strudels: Strudel[];
  total: number;
  page: number;
  page_size: number;
}

export interface StrudelResponse {
  strudel: Strudel;
}
