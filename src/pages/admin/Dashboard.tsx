import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Eye, PenSquare, FolderOpen, Users, TrendingUp, Plus, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dashboardApi } from '@/services/api';
import type { DashboardStats } from '@/types/blog';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);

  useEffect(() => {
    dashboardApi.getStats().then((res: any) => {
      const s = res.stats || res;
      setStats({ total_blogs: s.totalBlogs, published_blogs: s.published, draft_blogs: s.drafts, total_categories: s.totalCategories, total_views: s.totalViews || 0, total_users: s.totalUsers });
      setRecentBlogs(res.recentBlogs || []);
    }).catch(() => {});
  }, []);

  const statCards = stats ? [
    { title: 'Total Blogs', value: stats.total_blogs, icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
    { title: 'Published', value: stats.published_blogs, icon: Eye, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Drafts', value: stats.draft_blogs, icon: PenSquare, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { title: 'Categories', value: stats.total_categories, icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Views', value: (stats.total_views || 0).toLocaleString(), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Users', value: stats.total_users, icon: Users, color: 'text-destructive', bg: 'bg-destructive/10' },
  ] : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif">Dashboard</h1>
          <p className="text-muted-foreground font-sans text-sm">Welcome back! Here's what's happening.</p>
        </div>
        <Link to="/blogs/new">
          <Button className="gap-1.5"><Plus className="h-4 w-4" /> New Blog</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(stat => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold font-sans">{stat.value}</p>
              <p className="text-xs text-muted-foreground font-sans">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-sans">Recent Blogs</CardTitle>
            <Link to="/blogs"><Button variant="ghost" size="sm" className="text-xs gap-1">View All <ArrowUpRight className="h-3 w-3" /></Button></Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {recentBlogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No blogs yet.</p>
            ) : recentBlogs.map((blog: any) => (
              <div key={blog.id} className="flex items-center gap-3">
                {blog.featuredImage && <img src={blog.featuredImage} alt="" className="h-10 w-10 rounded-md object-cover shrink-0" />}
                <div className="flex-1 min-w-0">
                  <Link to={`/blogs/${blog.id}/edit`} className="text-sm font-medium hover:text-primary truncate block font-sans">{blog.title}</Link>
                  <p className="text-xs text-muted-foreground font-sans">{blog.author?.name} · {blog.createdAt?.slice(0, 10)}</p>
                </div>
                <Badge variant={blog.status === 'published' ? 'default' : 'secondary'} className="text-[10px] shrink-0">{blog.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
