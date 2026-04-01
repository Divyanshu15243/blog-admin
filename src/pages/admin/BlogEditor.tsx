import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Eye, ArrowLeft, ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { blogApi, categoryApi, tagApi, siteApi, aiApi } from '@/services/api';
import { Sparkles } from 'lucide-react';
import type { BlogStatus, SchemaType, Category, Tag } from '@/types/blog';
import RichTextEditor from '@/components/admin/RichTextEditor';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [siteId, setSiteId] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<BlogStatus>('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [showHomepage, setShowHomepage] = useState(false);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [schemaType, setSchemaType] = useState<SchemaType>('BlogPosting');
  const [publishDate, setPublishDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);

  const handleGenerateDescription = async () => {
    if (!title.trim()) return toast({ title: 'Enter a title first', variant: 'destructive' });
    setGeneratingDesc(true);
    try {
      const description = await aiApi.generateDescription(title);
      setExcerpt(description);
    } catch (e: any) {
      toast({ title: 'AI Error', description: e.message, variant: 'destructive' });
    } finally {
      setGeneratingDesc(false);
    }
  };

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [sites, setSites] = useState<{ id: string; name: string; domain: string }[]>([]);

  useEffect(() => {
    Promise.all([categoryApi.getAll(), tagApi.getAll(), siteApi.getAll()]).then(([cats, tgs, sts]) => {
      setCategories(cats);
      setTags(tgs);
      setSites(sts);
      if (sts.length > 0 && !siteId) setSiteId(sts[0].id);
    });

    if (id) {
      blogApi.getAll({ page: 1, limit: 1000 }).then(res => {
        const blog = (res as any).blogs?.find((b: any) => b.id === id);
        if (blog) {
          setTitle(blog.title || '');
          setSlug(blog.slug || '');
          setExcerpt(blog.excerpt || '');
          setContent(blog.content || '');
          setFeaturedImage(blog.featuredImage || '');
          setCategoryId(blog.categoryId || '');
          setSiteId(blog.siteId || '');
          setSelectedTags(blog.tags?.map((t: any) => t.id) || []);
          setStatus(blog.status || 'draft');
          setIsFeatured(blog.isFeatured || false);
          setShowHomepage(blog.showOnHomepage || false);
          setMetaTitle(blog.metaTitle || '');
          setMetaDescription(blog.metaDescription || '');
          setMetaKeywords(blog.metaKeywords || '');
          setCanonicalUrl(blog.canonicalUrl || '');
          setOgTitle(blog.ogTitle || '');
          setOgDescription(blog.ogDescription || '');
          setSchemaType(blog.schemaType || 'BlogPosting');
        }
      });
    }
  }, [id]);

  const generateSlug = useCallback((t: string) =>
    t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), []);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!id) setSlug(generateSlug(v));
  };

  const toggleTag = (tagId: string) =>
    setSelectedTags(prev => prev.includes(tagId) ? prev.filter(x => x !== tagId) : [...prev, tagId]);

  const handleSave = async () => {
    if (!siteId) return toast({ title: 'Select a site', variant: 'destructive' });
    if (!categoryId) return toast({ title: 'Select a category', variant: 'destructive' });
    setSaving(true);
    try {
      const payload = {
        title, slug, excerpt, content, featuredImage, categoryId, siteId,
        tagIds: selectedTags, status, isFeatured, showOnHomepage: showHomepage,
        metaTitle, metaDescription, metaKeywords, canonicalUrl,
        ogTitle, ogDescription, schemaType,
        scheduledAt: status === 'scheduled' ? publishDate : undefined,
      };
      if (id) {
        await blogApi.update(id, payload);
      } else {
        await blogApi.create(payload);
      }
      toast({ title: id ? 'Blog updated!' : 'Blog created!', description: `"${title}" saved as ${status}.` });
      navigate('/admin/blogs');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blogs')}><ArrowLeft className="h-4 w-4" /></Button>
          <div>
            <h1 className="text-xl font-bold font-serif">{id ? 'Edit Blog' : 'New Blog'}</h1>
            <p className="text-sm text-muted-foreground font-sans">{id ? `Editing blog` : 'Create a new blog post'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-1.5"><Eye className="h-4 w-4" /> Preview</Button>
          <Button onClick={handleSave} disabled={saving} className="gap-1.5">
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : status === 'published' ? 'Publish' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base font-sans">Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-sans">Title</Label>
                <Input value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="Enter blog title..." className="text-lg" />
              </div>
              <div className="space-y-2">
                <Label className="font-sans">Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-sans">/blogs/</span>
                  <Input value={slug} onChange={e => setSlug(e.target.value)} className="flex-1" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="font-sans">Excerpt</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs h-7"
                    onClick={handleGenerateDescription}
                    disabled={generatingDesc || !title.trim()}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {generatingDesc ? 'Generating...' : 'Generate with AI'}
                  </Button>
                </div>
                <Textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Brief description..." rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base font-sans">Content</CardTitle></CardHeader>
            <CardContent>
              <RichTextEditor content={content} onChange={setContent} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base font-sans">SEO Settings</CardTitle></CardHeader>
            <CardContent>
              <Tabs defaultValue="meta">
                <TabsList className="mb-4">
                  <TabsTrigger value="meta">Meta Tags</TabsTrigger>
                  <TabsTrigger value="og">Open Graph</TabsTrigger>
                  <TabsTrigger value="schema">Schema</TabsTrigger>
                </TabsList>
                <TabsContent value="meta" className="space-y-4">
                  <div className="space-y-2"><Label className="font-sans">Meta Title</Label><Input value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="SEO title..." /><p className="text-xs text-muted-foreground font-sans">{metaTitle.length}/60 characters</p></div>
                  <div className="space-y-2"><Label className="font-sans">Meta Description</Label><Textarea value={metaDescription} onChange={e => setMetaDescription(e.target.value)} rows={2} placeholder="SEO description..." /><p className="text-xs text-muted-foreground font-sans">{metaDescription.length}/160 characters</p></div>
                  <div className="space-y-2"><Label className="font-sans">Keywords</Label><Input value={metaKeywords} onChange={e => setMetaKeywords(e.target.value)} placeholder="keyword1, keyword2..." /></div>
                  <div className="space-y-2"><Label className="font-sans">Canonical URL</Label><Input value={canonicalUrl} onChange={e => setCanonicalUrl(e.target.value)} placeholder="https://..." /></div>
                </TabsContent>
                <TabsContent value="og" className="space-y-4">
                  <div className="space-y-2"><Label className="font-sans">OG Title</Label><Input value={ogTitle} onChange={e => setOgTitle(e.target.value)} /></div>
                  <div className="space-y-2"><Label className="font-sans">OG Description</Label><Textarea value={ogDescription} onChange={e => setOgDescription(e.target.value)} rows={2} /></div>
                </TabsContent>
                <TabsContent value="schema" className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-sans">Schema Type</Label>
                    <Select value={schemaType} onValueChange={v => setSchemaType(v as SchemaType)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Article">Article</SelectItem>
                        <SelectItem value="BlogPosting">BlogPosting</SelectItem>
                        <SelectItem value="NewsArticle">NewsArticle</SelectItem>
                        <SelectItem value="TechArticle">TechArticle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-base font-sans">Publishing</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-sans">Status</Label>
                <Select value={status} onValueChange={v => setStatus(v as BlogStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {status === 'scheduled' && (
                <div className="space-y-2">
                  <Label className="font-sans">Publish Date</Label>
                  <Input type="date" value={publishDate} onChange={e => setPublishDate(e.target.value)} />
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <Label className="font-sans text-sm">Featured Post</Label>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="font-sans text-sm">Show on Homepage</Label>
                <Switch checked={showHomepage} onCheckedChange={setShowHomepage} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base font-sans">Featured Image</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {featuredImage ? (
                <div className="relative">
                  <img src={featuredImage} alt={imageAlt} className="w-full rounded-lg object-cover aspect-video" />
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setFeaturedImage('')}><X className="h-3.5 w-3.5" /></Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground font-sans">Enter URL below</p>
                </div>
              )}
              <div className="space-y-2">
                <Label className="font-sans text-sm">Image URL</Label>
                <Input value={featuredImage} onChange={e => setFeaturedImage(e.target.value)} placeholder="https://..." className="text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="font-sans text-sm">Alt Text</Label>
                <Input value={imageAlt} onChange={e => setImageAlt(e.target.value)} placeholder="Describe the image..." className="text-sm" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base font-sans">Site & Category</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-sans">Site</Label>
                <Select value={siteId} onValueChange={setSiteId}>
                  <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
                  <SelectContent>
                    {sites.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.domain})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-sans">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="font-sans">Tags</Label>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <Badge
                      key={tag.id}
                      variant={selectedTags.includes(tag.id) ? 'default' : 'outline'}
                      className="cursor-pointer text-xs"
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
