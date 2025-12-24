import { useState, useCallback, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { createEditor, type Descendant } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import {
  ArrowLeft,
  UserPlus,
  Send,
  MoreHorizontal,
  Plus,
  Type,
  Image,
  Video,
  Table2,
  List,
  FileText,
  Minus,
  GripVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// Initial content for new documents
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'Dies ist ein Beispieltext.' }],
  } as Descendant,
  {
    type: 'paragraph',
    children: [{ text: '' }],
  } as Descendant,
  {
    type: 'paragraph',
    children: [{ text: 'Dies ist der zweite Textblock.' }],
  } as Descendant,
]

// Block types for the sidebar
const blockTypes = [
  { id: 'text', label: 'Text', icon: Type, shortcut: '1' },
  { id: 'image', label: 'Bild', icon: Image, shortcut: '2' },
  { id: 'video', label: 'Video', icon: Video, shortcut: '3' },
  { id: 'table', label: 'Tabelle', icon: Table2, shortcut: '4' },
  { id: 'price-list', label: 'Preisliste', icon: List, shortcut: '5' },
  { id: 'toc', label: 'Inhaltsver...', icon: FileText, shortcut: '7' },
  { id: 'page-break', label: 'Seitenumbr...', icon: Minus, shortcut: '8' },
]

// Fillable field types
const fieldTypes = [
  { id: 'text-field', label: 'Textfeld', icon: Type },
  { id: 'signature', label: 'Unterschrift', icon: FileText },
  { id: 'initials', label: 'Initialen', icon: Type },
  { id: 'date', label: 'Datum', icon: FileText },
  { id: 'checkbox', label: 'Kontrollkä...', icon: FileText },
  { id: 'dropdown', label: 'Dropdown-Menü', icon: FileText },
]

export function Editor() {
  const { id } = useParams()
  const isNew = id === 'new'

  const [title, setTitle] = useState(isNew ? 'Neues Dokument' : 'New document')
  const lastSaved = 'Aktualisiert vor 11 Minuten'
  const [sidebarTab, setSidebarTab] = useState('content')
  const [hoveredBlockIndex, setHoveredBlockIndex] = useState<number | null>(null)

  // Create Slate editor
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [value, setValue] = useState<Descendant[]>(initialValue)

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case 'heading':
        return <h1 {...props.attributes}>{props.children}</h1>
      default:
        return <p {...props.attributes}>{props.children}</p>
    }
  }, [])

  const renderLeaf = useCallback((props: any) => {
    let { children } = props
    if (props.leaf.bold) {
      children = <strong>{children}</strong>
    }
    if (props.leaf.italic) {
      children = <em>{children}</em>
    }
    if (props.leaf.underline) {
      children = <u>{children}</u>
    }
    return <span {...props.attributes}>{children}</span>
  }, [])

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col bg-background">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Zurück zum Dashboard</TooltipContent>
            </Tooltip>

            <Separator orientation="vertical" className="h-6" />

            {/* Document Title (editable) */}
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-none bg-transparent text-lg font-medium text-text-primary outline-none focus:ring-0"
              />
              <Badge variant="secondary">Entwurf</Badge>
              <span className="text-sm text-text-muted">EUR 0,00</span>
              <span className="text-sm text-text-muted">{lastSaved}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Einladen
            </Button>
            <Button className="bg-primary hover:bg-primary-hover text-white">
              <Send className="mr-2 h-4 w-4" />
              Senden
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Main Editor Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Page Strip (Left) */}
          <aside className="w-16 border-r border-border bg-surface p-2">
            <div className="mb-2 text-center text-xs text-text-muted">
              1 Seite
            </div>
            <div className="mx-auto w-12 aspect-[210/297] bg-white border border-border rounded shadow-sm" />
            <Button
              variant="ghost"
              size="icon"
              className="mx-auto mt-2 flex h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </aside>

          {/* Canvas (Center) */}
          <main className="flex-1 overflow-auto bg-gray-100 p-8">
            <div className="mx-auto max-w-[816px]">
              {/* A4 Page */}
              <div className="bg-white shadow-lg rounded min-h-[1056px] p-16">
                <Slate
                  editor={editor}
                  initialValue={value}
                  onChange={(newValue) => setValue(newValue)}
                >
                  {value.map((_, index) => (
                    <div
                      key={index}
                      className="group relative"
                      onMouseEnter={() => setHoveredBlockIndex(index)}
                      onMouseLeave={() => setHoveredBlockIndex(null)}
                    >
                      {/* Insert Line (above block) */}
                      {hoveredBlockIndex === index && (
                        <div className="absolute -top-2 left-0 right-0 flex items-center justify-center">
                          <div className="h-px flex-1 bg-primary/50" />
                          <button className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-hover">
                            <Plus className="h-3 w-3" />
                          </button>
                          <div className="h-px flex-1 bg-primary/50" />
                        </div>
                      )}

                      {/* Block Container */}
                      <div
                        className={cn(
                          'relative flex items-start gap-2 rounded px-2 py-1.5 transition-colors',
                          hoveredBlockIndex === index && 'bg-gray-50'
                        )}
                      >
                        {/* Drag Handle */}
                        <div
                          className={cn(
                            'flex h-6 w-2 cursor-grab items-center justify-center opacity-0 transition-opacity',
                            hoveredBlockIndex === index && 'opacity-100'
                          )}
                        >
                          <GripVertical className="h-4 w-4 text-text-muted" />
                        </div>

                        {/* Block Content */}
                        <div className="flex-1">
                          <Editable
                            renderElement={renderElement}
                            renderLeaf={renderLeaf}
                            placeholder="Text eingeben..."
                            className="outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </Slate>
              </div>
            </div>
          </main>

          {/* Sidebar (Right) */}
          <aside className="w-[220px] border-l border-border bg-surface">
            <Tabs value={sidebarTab} onValueChange={setSidebarTab}>
              <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
                <TabsTrigger
                  value="content"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Inhalt
                </TabsTrigger>
                <TabsTrigger
                  value="recipients"
                  className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Empf.
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-0 p-4">
                {/* Bausteine */}
                <div className="mb-6">
                  <h3 className="mb-3 text-xs font-medium uppercase text-text-muted">
                    Bausteine
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {blockTypes.map((block) => (
                      <button
                        key={block.id}
                        className="flex flex-col items-center justify-center rounded border border-border bg-white p-3 text-center hover:bg-surface-hover hover:border-primary/50 transition-colors"
                      >
                        <block.icon className="mb-1 h-5 w-5 text-text-secondary" />
                        <span className="text-xs text-text-primary">
                          {block.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ausfüllbare Felder */}
                <div>
                  <h3 className="mb-3 text-xs font-medium uppercase text-text-muted">
                    Ausfüllbare Felder
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {fieldTypes.map((field) => (
                      <button
                        key={field.id}
                        className="flex flex-col items-center justify-center rounded border border-primary/30 bg-primary/5 p-3 text-center hover:bg-primary/10 hover:border-primary/50 transition-colors"
                      >
                        <field.icon className="mb-1 h-5 w-5 text-primary" />
                        <span className="text-xs text-text-primary">
                          {field.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recipients" className="mt-0 p-4">
                <p className="text-sm text-text-muted">
                  Keine Empfänger hinzugefügt.
                </p>
                <Button variant="outline" className="mt-4 w-full">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Empfänger hinzufügen
                </Button>
              </TabsContent>
            </Tabs>
          </aside>
        </div>
      </div>
    </TooltipProvider>
  )
}
