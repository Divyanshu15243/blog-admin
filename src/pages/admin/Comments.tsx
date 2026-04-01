import { useEffect, useState } from 'react';
import { Check, X, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { commentApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { Comment } from '@/types/blog';

const Comments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    commentApi.getAll().then(setComments).catch(e => toast({ title: 'Error', description: e.message, variant: 'destructive' }));
  }, []);

  const handleStatus = async (id: string, status: Comment['status']) => {
    try {
      const updated = await commentApi.updateStatus(id, status);
      setComments(prev => prev.map(c => c.id === id ? updated : c));
      toast({ title: `Comment ${status}` });
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  const handleDelete = async (id: string) => {
    try {
      await commentApi.delete(id);
      setComments(prev => prev.filter(c => c.id !== id));
      toast({ title: 'Comment deleted' });
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  const statusBadge = (status: string) => {
    if (status === 'approved') return <Badge className="bg-green-100 text-green-800 border-0 text-xs">Approved</Badge>;
    if (status === 'rejected') return <Badge className="bg-red-100 text-red-800 border-0 text-xs">Rejected</Badge>;
    return <Badge className="bg-yellow-100 text-yellow-800 border-0 text-xs">Pending</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-serif">Comments</h1>
        <p className="text-sm text-muted-foreground font-sans">{comments.length} comments · {comments.filter(c => c.status === 'pending').length} pending</p>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No comments yet.</TableCell></TableRow>
            ) : comments.map(comment => (
              <TableRow key={comment.id}>
                <TableCell>
                  <p className="font-medium text-sm font-sans">{comment.user_name}</p>
                  <p className="text-xs text-muted-foreground font-sans">{comment.user_email}</p>
                </TableCell>
                <TableCell className="max-w-xs"><p className="text-sm font-sans truncate">{comment.content}</p></TableCell>
                <TableCell>{statusBadge(comment.status)}</TableCell>
                <TableCell className="text-sm text-muted-foreground font-sans">{comment.created_at?.slice(0, 10)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2" onClick={() => handleStatus(comment.id, 'approved')}><Check className="h-3.5 w-3.5" /> Approve</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2" onClick={() => handleStatus(comment.id, 'rejected')}><X className="h-3.5 w-3.5" /> Reject</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive gap-2" onClick={() => handleDelete(comment.id)}><Trash2 className="h-3.5 w-3.5" /> Delete</DropdownMenuItem>
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

export default Comments;
