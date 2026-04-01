export type UserRole = 'super_admin' | 'admin' | 'editor' | 'writer';

export type BlogStatus = 'draft' | 'published' | 'scheduled';

export type SchemaType = 'Article' | 'BlogPosting' | 'NewsArticle' | 'TechArticle';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profile_image?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  meta_title?: string;
  meta_description?: string;
  status: 'active' | 'inactive';
  post_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  post_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  image_alt?: string;
  category_id: string;
  category?: Category;
  author_id: string;
  author?: User;
  tags?: Tag[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  schema_type: SchemaType;
  status: BlogStatus;
  is_featured: boolean;
  show_homepage: boolean;
  reading_time?: number;
  views?: number;
  seo_score?: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  file_name: string;
  file_path: string;
  file_url: string;
  file_size: number;
  file_type: string;
  alt_text?: string;
  uploaded_by: string;
  uploader?: User;
  created_at: string;
}

export interface Comment {
  id: string;
  blog_id: string;
  blog?: Blog;
  user_name: string;
  user_email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface SEOSettings {
  default_title_format: string;
  default_meta_description: string;
  robots_txt: string;
  sitemap_enabled: boolean;
  schema_defaults: SchemaType;
  social_share_image?: string;
}

export interface DashboardStats {
  total_blogs: number;
  published_blogs: number;
  draft_blogs: number;
  total_categories: number;
  total_views: number;
  total_users: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}
