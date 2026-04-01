import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const AdminSettings = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif">Settings</h1>
          <p className="text-sm text-muted-foreground font-sans">General site configuration</p>
        </div>
        <Button className="gap-1.5" onClick={() => toast({ title: 'Settings saved!' })}><Save className="h-4 w-4" /> Save</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base font-sans">General</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label className="font-sans">Site Name</Label><Input defaultValue="BlogCMS" /></div>
          <div className="space-y-2"><Label className="font-sans">Site URL</Label><Input defaultValue="https://yourdomain.com" /></div>
          <div className="space-y-2"><Label className="font-sans">Site Description</Label><Textarea defaultValue="A modern, self-hosted blog platform." rows={2} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base font-sans">Branding</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label className="font-sans">Logo URL</Label><Input placeholder="https://..." /></div>
          <div className="space-y-2"><Label className="font-sans">Favicon URL</Label><Input placeholder="https://..." /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base font-sans">API & Integrations</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label className="font-sans">API Base URL</Label><Input defaultValue="/api" /></div>
          <Separator />
          <div className="space-y-2">
            <Label className="font-sans">OpenAI API Key (for AI content generation)</Label>
            <Input type="password" placeholder="sk-..." />
            <p className="text-xs text-muted-foreground font-sans">Used for AI-powered content suggestions and generation</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base font-sans">Danger Zone</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans font-medium text-sm">Clear Cache</p>
              <p className="text-xs text-muted-foreground font-sans">Clear all cached data and rebuild</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast({ title: 'Cache cleared!' })}>Clear</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans font-medium text-sm text-destructive">Delete All Data</p>
              <p className="text-xs text-muted-foreground font-sans">Permanently remove all blogs and media</p>
            </div>
            <Button variant="destructive" size="sm">Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
