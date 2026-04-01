import type { Blog, Category, Tag, User, Media, Comment, DashboardStats, SEOSettings, ApiResponse } from '@/types/blog';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getToken = () => localStorage.getItem('blog_cms_token');
export const setToken = (token: string) => localStorage.setItem('blog_cms_token', token);
export const removeToken = () => localStorage.removeItem('blog_cms_token');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { ...headers(), ...(options?.headers || {}) } });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Request failed');
  return json;
}

// ============ AUTH ============
export const authApi = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const data = await request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
  },
  register: async (data: { name: string; email: string; password: string }): Promise<{ user: User; token: string }> => {
    const res = await request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setToken(res.token);
    return res;
  },
  logout: async () => { removeToken(); },
  me: async (): Promise<User> => {
    const data = await request<{ user: User }>('/auth/me');
    return data.user;
  },
};

// ============ BLOGS ============
export const blogApi = {
  getAll: async (params?: { search?: string; category?: string; status?: string; tag?: string; page?: number; limit?: number }): Promise<ApiResponse<Blog[]>> => {
    const q = new URLSearchParams(Object.fromEntries(Object.entries(params || {}).filter(([,v]) => v !== undefined).map(([k,v]) => [k, String(v)]))).toString();
    return request<ApiResponse<Blog[]>>(`/blogs?${q}`);
  },
  getBySlug: async (slug: string): Promise<Blog> => {
    const data = await request<{ blog: Blog }>(`/blogs/public/${slug}`);
    return data.blog;
  },
  getPublished: async (params?: { search?: string; category?: string; tag?: string; page?: number; limit?: number }): Promise<ApiResponse<Blog[]>> => {
    const q = new URLSearchParams(Object.fromEntries(Object.entries(params || {}).filter(([,v]) => v !== undefined).map(([k,v]) => [k, String(v)]))).toString();
    return request<ApiResponse<Blog[]>>(`/blogs/public?${q}`);
  },
  getFeatured: async (): Promise<Blog[]> => request<Blog[]>('/blogs/featured'),
  getRelated: async (slug: string): Promise<Blog[]> => request<Blog[]>(`/blogs/related/${slug}`),
  create: async (data: Partial<Blog>): Promise<Blog> => request<Blog>('/blogs', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: string, data: Partial<Blog>): Promise<Blog> => request<Blog>(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: string): Promise<void> => request<void>(`/blogs/${id}`, { method: 'DELETE' }),
  bulkAction: async (ids: string[], action: 'publish' | 'unpublish' | 'delete'): Promise<void> =>
    request<void>('/blogs/bulk', { method: 'POST', body: JSON.stringify({ ids, action }) }),
};

// ============ CATEGORIES ============
export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const data = await request<{ categories: Category[] }>('/categories');
    return data.categories;
  },
  create: async (data: Partial<Category>): Promise<Category> => request<Category>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: async (id: string, data: Partial<Category>): Promise<Category> => request<Category>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id: string): Promise<void> => request<void>(`/categories/${id}`, { method: 'DELETE' }),
};

// ============ TAGS ============
export const tagApi = {
  getAll: async (): Promise<Tag[]> => {
    const data = await request<{ tags: Tag[] }>('/tags');
    return data.tags;
  },
  create: async (data: Partial<Tag>): Promise<Tag> => {
    const res = await request<{ tag: Tag }>('/tags', { method: 'POST', body: JSON.stringify(data) });
    return res.tag;
  },
  update: async (id: string, data: Partial<Tag>): Promise<Tag> => {
    const res = await request<{ tag: Tag }>(`/tags/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return res.tag;
  },
  delete: async (id: string): Promise<void> => request<void>(`/tags/${id}`, { method: 'DELETE' }),
};

// ============ MEDIA ============
export const mediaApi = {
  getAll: async (): Promise<Media[]> => {
    const data = await request<{ media: Media[] }>('/media');
    return data.media;
  },
  upload: async (file: File): Promise<Media> => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: form,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Upload failed');
    return json.media || json;
  },
  delete: async (id: string): Promise<void> => request<void>(`/media/${id}`, { method: 'DELETE' }),
  updateAlt: async (id: string, alt_text: string): Promise<Media> => {
    const data = await request<{ media: Media }>(`/media/${id}`, { method: 'PUT', body: JSON.stringify({ altText: alt_text }) });
    return data.media;
  },
};

// ============ USERS ============
export const userApi = {
  getAll: async (): Promise<User[]> => {
    const data = await request<{ users: User[] }>('/users');
    return data.users;
  },
  create: async (data: Partial<User>): Promise<User> => {
    const res = await request<{ user: User }>('/users', { method: 'POST', body: JSON.stringify(data) });
    return res.user;
  },
  update: async (id: string, data: Partial<User>): Promise<User> => {
    const res = await request<{ user: User }>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return res.user;
  },
  delete: async (id: string): Promise<void> => request<void>(`/users/${id}`, { method: 'DELETE' }),
};

// ============ COMMENTS ============
export const commentApi = {
  getAll: async (): Promise<Comment[]> => {
    const data = await request<{ comments: Comment[] }>('/comments');
    return data.comments;
  },
  updateStatus: async (id: string, status: Comment['status']): Promise<Comment> => {
    const endpoint = status === 'approved' ? 'approve' : 'reject';
    const res = await request<{ comment: Comment }>(`/comments/${id}/${endpoint}`, { method: 'PUT' });
    return res.comment;
  },
  delete: async (id: string): Promise<void> => request<void>(`/comments/${id}`, { method: 'DELETE' }),
};

// ============ SITES ============
export const siteApi = {
  getAll: async (): Promise<{ id: string; name: string; domain: string; apiKey: string; isActive: boolean; createdAt: string }[]> => {
    const data = await request<{ sites: any[] }>('/sites');
    return data.sites;
  },
  create: async (data: { name: string; domain: string }): Promise<any> => {
    const res = await request<{ site: any }>('/sites', { method: 'POST', body: JSON.stringify(data) });
    return res.site;
  },
  update: async (id: string, data: Partial<{ name: string; domain: string; isActive: boolean }>): Promise<any> => {
    const res = await request<{ site: any }>(`/sites/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return res.site;
  },
  delete: async (id: string): Promise<void> => request<void>(`/sites/${id}`, { method: 'DELETE' }),
  regenerateKey: async (id: string): Promise<any> => {
    const res = await request<{ site: any }>(`/sites/${id}/regenerate-key`, { method: 'POST' });
    return res.site;
  },
};

// ============ AI ============
export const aiApi = {
  generateDescription: async (title: string): Promise<string> => {
    const data = await request<{ description: string }>('/ai/generate-description', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
    return data.description;
  },
};

// ============ DASHBOARD ============
export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => request<DashboardStats>('/dashboard/stats'),
};

// ============ SEO ============
export const seoApi = {
  getSettings: async (): Promise<SEOSettings> => {
    const data = await request<{ settings: SEOSettings }>('/seo');
    return data.settings;
  },
  updateSettings: async (data: Partial<SEOSettings>): Promise<SEOSettings> => {
    const res = await request<{ settings: SEOSettings }>('/seo', { method: 'PUT', body: JSON.stringify(data) });
    return res.settings;
  },
};
