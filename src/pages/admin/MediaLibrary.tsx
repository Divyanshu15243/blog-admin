import { useEffect, useState } from 'react';
import { Upload, Trash2, Copy, LayoutGrid, List, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { mediaApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { Media } from '@/types/blog';

const MediaLibrary = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<Media | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    mediaApi.getAll().then(data => setMedia((data as any).media || data)).catch(e => toast({ title: 'Error', description: e.message, variant: 'destructive' }));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const uploaded = await mediaApi.upload(file);
      setMedia(prev => [uploaded, ...prev]);
      toast({ title: 'Uploaded!' });
    } catch (err: any) { toast({ title: 'Upload failed', description: err.message, variant: 'destructive' }); }
  };

  const handleDelete = async (id: string) => {
    try {
      await mediaApi.delete(id);
      setMedia(prev => prev.filter(m => m.id !== id));
      setSelected(null);
      toast({ title: 'Deleted' });
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const fileUrl = (m: Media) => (m as any).url || (m as any).file_url || '';
  const fileName = (m: Media) => (m as any).originalName || (m as any).file_name || m.filename || '';

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif">Media Library</h1>
          <p className="text-sm text-muted-foreground font-sans">{media.length} files</p>
        </div>
        <div className="flex gap-2">
          <div className="flex border border-border rounded-md">
            <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9 rounded-r-none" onClick={() => setView('grid')}><LayoutGrid className="h-4 w-4" /></Button>
            <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-9 w-9 rounded-l-none" onClick={() => setView('list')}><List className="h-4 w-4" /></Button>
          </div>
          <label>
            <Button className="gap-1.5" asChild><span><Upload className="h-4 w-4" /> Upload</span></Button>
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map(m => (
            <Card key={m.id} className="group overflow-hidden cursor-pointer hover:shadow-md transition-all" onClick={() => setSelected(m)}>
              <div className="aspect-square overflow-hidden">
                <img src={fileUrl(m)} alt={(m as any).altText || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
              </div>
              <CardContent className="p-2.5">
                <p className="text-xs font-medium font-sans truncate">{fileName(m)}</p>
                <p className="text-[10px] text-muted-foreground font-sans">{formatSize(m.size || (m as any).file_size || 0)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="divide-y divide-border">
            {media.map(m => (
              <div key={m.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer" onClick={() => setSelected(m)}>
                <img src={fileUrl(m)} alt="" className="h-12 w-12 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium font-sans">{fileName(m)}</p>
                </div>
                <span className="text-sm text-muted-foreground font-sans">{formatSize(m.size || (m as any).file_size || 0)}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2" onClick={() => { navigator.clipboard.writeText(fileUrl(m)); toast({ title: 'URL copied!' }); }}><Copy className="h-3.5 w-3.5" /> Copy URL</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive gap-2" onClick={() => handleDelete(m.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Media Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <img src={fileUrl(selected)} alt="" className="w-full rounded-lg object-cover aspect-video" />
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">URL</Label>
                <div className="flex gap-2">
                  <Input value={fileUrl(selected)} readOnly className="text-xs" />
                  <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(fileUrl(selected)); toast({ title: 'Copied!' }); }}><Copy className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
              <Button variant="destructive" className="w-full" onClick={() => handleDelete(selected.id)}><Trash2 className="h-4 w-4 mr-2" /> Delete</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaLibrary;
