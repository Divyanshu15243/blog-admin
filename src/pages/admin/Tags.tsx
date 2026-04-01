import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { tagApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { Tag } from '@/types/blog';

const Tags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    tagApi.getAll().then(data => setTags((data as any).tags || data)).catch(e => toast({ title: 'Error', description: e.message, variant: 'destructive' }));
  }, []);

  const handleCreate = async () => {
    try {
      const tag = await tagApi.create({ name });
      setTags(prev => [...prev, tag]);
      toast({ title: 'Tag created!' });
      setDialogOpen(false); setName('');
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  const handleDelete = async (id: string) => {
    try {
      await tagApi.delete(id);
      setTags(prev => prev.filter(t => t.id !== id));
      toast({ title: 'Tag deleted' });
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif">Tags</h1>
          <p className="text-sm text-muted-foreground font-sans">{tags.length} tags</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button className="gap-1.5"><Plus className="h-4 w-4" /> Add Tag</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Tag</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Tag name" /></div>
              <Button className="w-full" onClick={handleCreate}>Create Tag</Button>
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
              <TableHead>Created</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No tags yet.</TableCell></TableRow>
            ) : tags.map(tag => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium font-sans">#{tag.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground font-sans">/{tag.slug}</TableCell>
                <TableCell><Badge variant="secondary" className="text-xs">{(tag as any).post_count ?? (tag as any)._count?.blogs ?? 0}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground font-sans">{tag.created_at?.slice(0, 10)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2"><Pencil className="h-3.5 w-3.5" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive gap-2" onClick={() => handleDelete(tag.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
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

export default Tags;
