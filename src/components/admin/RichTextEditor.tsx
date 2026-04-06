import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Heading3, Quote, Code, Link2, ImageIcon, Minus, Undo, Redo } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useCallback } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
      Placeholder.configure({ placeholder: 'Start writing your blog post...' }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'min-h-[400px] outline-none p-4 font-sans prose prose-sm max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:my-2 prose-ul:my-2 prose-ol:my-2',
      },
    },
  });

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter image URL');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  if (!editor) return null;

  const ToolButton = ({ onClick, active, children, title }: { onClick: () => void; active?: boolean; children: React.ReactNode; title: string }) => (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className={`h-8 w-8 flex items-center justify-center rounded text-sm transition-colors ${
        active ? 'bg-secondary text-secondary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/30">
        <ToolButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic className="h-4 w-4" />
        </ToolButton>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 className="h-4 w-4" />
        </ToolButton>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <ToolButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
          <List className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">
          <ListOrdered className="h-4 w-4" />
        </ToolButton>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <ToolButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
          <Quote className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
          <Code className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
          <Minus className="h-4 w-4" />
        </ToolButton>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <ToolButton onClick={addLink} active={editor.isActive('link')} title="Add Link">
          <Link2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={addImage} title="Add Image">
          <ImageIcon className="h-4 w-4" />
        </ToolButton>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <ToolButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo className="h-4 w-4" />
        </ToolButton>
        <ToolButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo className="h-4 w-4" />
        </ToolButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
