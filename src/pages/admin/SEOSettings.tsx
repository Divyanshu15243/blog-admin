import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { seoApi } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { SEOSettings as SEOSettingsType } from '@/types/blog';

const SEOSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SEOSettingsType | null>(null);

  useEffect(() => {
    seoApi.getSettings().then(setSettings).catch(e => toast({ title: 'Error', description: e.message, variant: 'destructive' }));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    try {
      await seoApi.updateSettings(settings);
      toast({ title: 'Settings saved!' });
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
  };

  if (!settings) return <div className="p-6 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-serif">SEO Settings</h1>
          <p className="text-sm text-muted-foreground font-sans">Configure global SEO settings</p>
        </div>
        <Button className="gap-1.5" onClick={handleSave}><Save className="h-4 w-4" /> Save</Button>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base font-sans">Meta Defaults</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-sans">Default Title Format</Label>
            <Input value={(settings as any).default_title_format || (settings as any).titleFormat || ''} onChange={e => setSettings({ ...settings, default_title_format: e.target.value } as any)} />
          </div>
          <div className="space-y-2">
            <Label className="font-sans">Default Meta Description</Label>
            <Textarea value={(settings as any).default_meta_description || (settings as any).defaultDescription || ''} onChange={e => setSettings({ ...settings, default_meta_description: e.target.value } as any)} rows={2} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base font-sans">Crawling & Indexing</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-sans">robots.txt</Label>
            <Textarea value={(settings as any).robots_txt || (settings as any).robotsTxt || ''} onChange={e => setSettings({ ...settings, robots_txt: e.target.value } as any)} rows={5} className="font-mono text-sm" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label className="font-sans">Auto-generate Sitemap</Label>
              <p className="text-xs text-muted-foreground font-sans mt-0.5">Automatically create and update sitemap.xml</p>
            </div>
            <Switch checked={(settings as any).sitemap_enabled ?? (settings as any).enableSitemap ?? true} onCheckedChange={v => setSettings({ ...settings, sitemap_enabled: v } as any)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base font-sans">Schema & Social</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="font-sans">Default Schema Type</Label>
            <Select value={(settings as any).schema_defaults || 'BlogPosting'} onValueChange={v => setSettings({ ...settings, schema_defaults: v as any } as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Article">Article</SelectItem>
                <SelectItem value="BlogPosting">BlogPosting</SelectItem>
                <SelectItem value="NewsArticle">NewsArticle</SelectItem>
                <SelectItem value="TechArticle">TechArticle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOSettings;
