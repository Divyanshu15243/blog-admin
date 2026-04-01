import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { blogApi, categoryApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { Blog, Category } from '@/types/blog';

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    try {
      const [res, cats] = await Promise.all([
        blogApi.getAll({ search: search || undefined, status: statusFilter !== 'all' ? statusFilter : undefined, category: categoryFilter !== 'all' ? categoryFilter : undefined }),
        categoryApi.getAll(),
      ]);
      setBlogs((res as any).blogs || res.data || []);
      setCategories(cats);
    } catch (e: any) {
      toast({ title: 'Error loading blogs', description: e.message, variant: 'destructive' });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [search, statusFilter, categoryFilter]);

  const toggleSelect = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const selectAll = () => setSelected(selected.length === blogs.length ? [] : blogs.map(b => b.id));

  const handleBulkAction = async (action: 'publish' | 'unpublish' | 'delete') => {
    try {
      await blogApi.bulkAction(selected, action);
      toast({ title: `${action} completed` });
      setSelected([]);
      load();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await blogApi.delete(id);
      setBlogs(prev => prev.filter(b => b.id !== id));
      toast({ title: 'Blog deleted' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const statusBadge = (status: string) => {
    const v = status === 'published' ? 'default' : status === 'draft' ? 'secondary' : 'outline';
    return <Badge variant={v} className="text-xs capitalize">{status}</Badge>;
  };

  const seoScoreColor = (score?: number) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif">All Blogs</h1>
          <p className="text-sm text-muted-foreground font-sans">{blogs.length} blog posts</p>
        </div>
        <Link to="/admin/blogs/new"><Button className="gap-1.5"><Plus className="h-4 w-4" /> New Blog</Button></Link>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search blogs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {selected.length > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground font-sans">{selected.length} selected</span>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('publish')}><Eye className="h-3.5 w-3.5 mr-1" /> Publish</Button>
              <Button variant="outline" size="sm" onClick={() => handleBulkAction('unpublish')}><EyeOff className="h-3.5 w-3.5 mr-1" /> Unpublish</Button>
              <Button variant="outline" size="sm" className="text-destructive" onClick={() => handleBulkAction('delete')}><Trash2 className="h-3.5 w-3.5 mr-1" /> Delete</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"><Checkbox checked={selected.length === blogs.length && blogs.length > 0} onCheckedChange={selectAll} /></TableHead>
                <TableHead className="w-12"></TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>SEO</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : blogs.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No blogs found.</TableCell></TableRow>
              ) : blogs.map(blog => (
                <TableRow key={blog.id} className={selected.includes(blog.id) ? 'bg-muted/50' : ''}>
                  <TableCell><Checkbox checked={selected.includes(blog.id)} onCheckedChange={() => toggleSelect(blog.id)} /></TableCell>
                  <TableCell>{(blog as any).featuredImage && <img src={(blog as any).featuredImage} alt="" className="h-9 w-14 rounded object-cover" />}</TableCell>
                  <TableCell>
                    <Link to={`/admin/blogs/${blog.id}/edit`} className="font-medium hover:text-primary font-sans text-sm">{blog.title}</Link>
                    <p className="text-xs text-muted-foreground font-sans mt-0.5">/{blog.slug}</p>
                  </TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{(blog as any).category?.name}</Badge></TableCell>
                  <TableCell><span className="text-sm font-sans">{(blog as any).author?.name}</span></TableCell>
                  <TableCell>{statusBadge(blog.status)}</TableCell>
                  <TableCell><span className={`text-sm font-medium font-sans ${seoScoreColor((blog as any).seoScore)}`}>{(blog as any).seoScore || '—'}</span></TableCell>
                  <TableCell><span className="text-sm text-muted-foreground font-sans">{(blog as any).publishedAt || (blog as any).createdAt}</span></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><Link to={`/admin/blogs/${blog.id}/edit`} className="gap-2"><Pencil className="h-3.5 w-3.5" /> Edit</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link to={`/blogs/${blog.slug}`} target="_blank" className="gap-2"><Eye className="h-3.5 w-3.5" /> View</Link></DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive gap-2" onClick={() => handleDelete(blog.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default BlogList;
