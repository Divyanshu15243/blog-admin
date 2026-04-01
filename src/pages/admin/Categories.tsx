import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { categoryApi, siteApi } from '@/services/api';
import type { Category } from '@/types/blog';

const Categories = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sites, setSites] = useState<{ id: string; name: string; domain: string }[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [siteId, setSiteId] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
    siteApi.getAll().then(data => {
      setSites(data);
      if (data.length > 0) setSiteId(data[0].id);
    });
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryApi.getAll();
      setCategories(data);
    } catch (e: any) {
      toast({ title: 'Error loading categories', description: e.message, variant: 'destructive' });
    }
  };

  const handleCreate = async () => {
    if (!name) return toast({ title: 'Name is required', variant: 'destructive' });
    if (!siteId) return toast({ title: 'Select a site', variant: 'destructive' });
    setLoading(true);
    try {
      await categoryApi.create({ name, slug, description, metaTitle, metaDescription, siteId });
      toast({ title: 'Category created!' });
      setDialogOpen(false);
      setName('');
      setSlug('');
      setDescription('');
      setMetaTitle('');
      setMetaDescription('');
      loadCategories();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryApi.delete(id);
      toast({ title: 'Category deleted!' });
      loadCategories();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif">Categories</h1>
          <p className="text-sm text-muted-foreground font-sans">{categories.length} categories</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button className="gap-1.5"><Plus className="h-4 w-4" /> Add Category</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-sans">New Category</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-sans">Site</Label>
                <Select value={siteId} onValueChange={setSiteId}>
                  <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
                  <SelectContent>
                    {sites.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.domain})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label className="font-sans">Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Category name" /></div>
              <div className="space-y-2"><Label className="font-sans">Slug</Label><Input value={slug} onChange={e => setSlug(e.target.value)} placeholder="category-slug" /></div>
              <div className="space-y-2"><Label className="font-sans">Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description..." rows={3} /></div>
              <div className="space-y-2"><Label className="font-sans">Meta Title</Label><Input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="SEO title" /></div>
              <div className="space-y-2"><Label className="font-sans">Meta Description</Label><Textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} placeholder="SEO description" rows={2} /></div>
              <Button className="w-full" onClick={handleCreate} disabled={loading}>{loading ? 'Creating...' : 'Create Category'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map(cat => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium font-sans">{cat.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm font-sans">/{cat.slug}</TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{(cat as any)._count?.blogs || 0}</Badge></TableCell>
                <TableCell><Badge variant="default" className="text-xs">Active</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground font-sans">{new Date((cat as any).createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2"><Pencil className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive gap-2" onClick={() => handleDelete(cat.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Categories;
