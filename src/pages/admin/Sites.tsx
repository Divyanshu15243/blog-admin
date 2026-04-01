import { useEffect, useState } from 'react';
import { siteApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, RefreshCw, Trash2, Plus, Globe } from 'lucide-react';

interface Site {
  id: string;
  name: string;
  domain: string;
  apiKey: string;
  isActive: boolean;
  createdAt: string;
}

const Sites = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const load = async () => {
    try {
      const data = await siteApi.getAll();
      setSites(data);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const site = await siteApi.create({ name, domain });
      setSites(prev => [site, ...prev]);
      setName(''); setDomain('');
      toast({ title: 'Site created', description: `API Key: ${site.apiKey}` });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally { setCreating(false); }
  };

  const handleRegenerate = async (id: string) => {
    try {
      const site = await siteApi.regenerateKey(id);
      setSites(prev => prev.map(s => s.id === id ? site : s));
      toast({ title: 'API Key regenerated' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this site? All associated blogs will be unlinked.')) return;
    try {
      await siteApi.delete(id);
      setSites(prev => prev.filter(s => s.id !== id));
      toast({ title: 'Site deleted' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Sites</h1>
      <p className="text-muted-foreground text-sm">Each site gets a unique API key. Use it in your external website to fetch only that site's blogs.</p>

      <Card>
        <CardHeader><CardTitle className="text-base">Add New Site</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex gap-3 items-end">
            <div className="space-y-1 flex-1">
              <Label>Site Name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="My Website" required />
            </div>
            <div className="space-y-1 flex-1">
              <Label>Domain</Label>
              <Input value={domain} onChange={e => setDomain(e.target.value)} placeholder="mywebsite.com" required />
            </div>
            <Button type="submit" disabled={creating}>
              <Plus className="w-4 h-4 mr-1" /> Add Site
            </Button>
          </form>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-3">
          {sites.map(site => (
            <Card key={site.id}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{site.name}</span>
                      <span className="text-muted-foreground text-sm">— {site.domain}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded truncate max-w-sm">{site.apiKey}</code>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => copy(site.apiKey)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use header <code className="bg-muted px-1 rounded">x-api-key: {site.apiKey}</code> in your website's fetch calls
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleRegenerate(site.id)}>
                      <RefreshCw className="w-3 h-3 mr-1" /> Regenerate Key
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(site.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {sites.length === 0 && <p className="text-muted-foreground text-sm">No sites yet. Add one above.</p>}
        </div>
      )}

      <Card className="border-dashed">
        <CardContent className="pt-4">
          <p className="text-sm font-medium mb-2">How to use in your external website:</p>
          <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">{`// Fetch blogs for your site
const res = await fetch('http://localhost:5000/api/blogs/public', {
  headers: { 'x-api-key': 'YOUR_API_KEY' }
});
const { blogs } = await res.json();`}</pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default Sites;
