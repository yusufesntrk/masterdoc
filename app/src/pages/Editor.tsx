import { useState, useCallback, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { createEditor, Transforms, type Descendant } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
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
  Trash2,
  Copy,
  Columns2,
} from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'
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


// Block types for the sidebar
const blockTypes = [
  { id: 'text', label: 'Text', icon: Type, shortcut: '1' },
  { id: 'heading', label: 'Überschrift', icon: Type, shortcut: '2' },
  { id: 'image', label: 'Bild', icon: Image, shortcut: '3' },
  { id: 'video', label: 'Video', icon: Video, shortcut: '4' },
  { id: 'table', label: 'Tabelle', icon: Table2, shortcut: '5' },
  { id: 'price-list', label: 'Preisliste', icon: List, shortcut: '6' },
  { id: 'columns', label: 'Spalten', icon: Columns2, shortcut: '7' },
  { id: 'page-break', label: 'Seitenumbruch', icon: Minus, shortcut: '8' },
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

// Default content for empty editor - defined outside component for stability
// Note: ID is generated at runtime to ensure uniqueness
const createDefaultContent = (): Descendant[] => [
  { id: crypto.randomUUID(), type: 'paragraph', children: [{ text: '' }] } as Descendant
]

export function Editor() {
  const { id } = useParams()
  const isNew = id === 'new'

  const [title, setTitle] = useState(isNew ? 'Neues Dokument' : 'New document')
  const lastSaved = 'Aktualisiert vor 11 Minuten'
  const [sidebarTab, setSidebarTab] = useState('content')
  const [hoveredBlockIndex, setHoveredBlockIndex] = useState<number | null>(null)
  const [insertLineIndex, setInsertLineIndex] = useState<number | null>(null)
  const [quickAddIndex, setQuickAddIndex] = useState<number | null>(null)
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [draggedBlockType, setDraggedBlockType] = useState<string | null>(null)

  // Block Drag & Drop for side-by-side placement
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<{
    blockId: string
    side: 'left' | 'right'
  } | null>(null)

  // Store
  const {
    content: storeContent,
    setContent,
    deleteBlock,
    duplicateBlock,
    selectedBlockId,
    setSelectedBlock,
  } = useEditorStore()

  // Safe content - guaranteed to never be undefined
  // Use useMemo to create default content only once
  const defaultContent = useMemo(() => createDefaultContent(), [])
  const content = storeContent && Array.isArray(storeContent) && storeContent.length > 0
    ? storeContent
    : defaultContent

  // Create Slate editor
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  // Insert block using Slate's API
  const insertSlateBlock = useCallback((type: string, atIndex?: number) => {
    let block: Descendant

    if (type === 'columns') {
      // Create a columns block with 2 columns by default
      block = {
        id: crypto.randomUUID(),
        type: 'columns',
        gap: 16,
        columns: [
          {
            id: crypto.randomUUID(),
            type: 'column',
            width: 50,
            children: [{ id: crypto.randomUUID(), type: 'paragraph', children: [{ text: '' }] }],
          },
          {
            id: crypto.randomUUID(),
            type: 'column',
            width: 50,
            children: [{ id: crypto.randomUUID(), type: 'paragraph', children: [{ text: '' }] }],
          },
        ],
        children: [{ text: '' }], // Slate requires children
      } as unknown as Descendant
    } else {
      block = {
        id: crypto.randomUUID(),
        type: type === 'text' ? 'paragraph' : type,
        children: [{ text: '' }],
      } as unknown as Descendant
    }

    // Insert at specified index or at the end
    const insertAt = atIndex !== undefined ? atIndex : editor.children.length
    Transforms.insertNodes(editor, block, {
      at: [insertAt],
    })

    // Focus the editor
    ReactEditor.focus(editor)
  }, [editor])

  // Handle dropping a block next to another block (side-by-side)
  const handleSideDrop = useCallback((
    e: React.DragEvent,
    targetBlockId: string,
    side: 'left' | 'right'
  ) => {
    e.preventDefault()
    e.stopPropagation()

    // Use state instead of dataTransfer (browser security restriction)
    if (!draggedBlockId || draggedBlockId === targetBlockId) {
      setDropTarget(null)
      setDraggedBlockId(null)
      return
    }

    const draggedId = draggedBlockId

    // Find both blocks
    const draggedIndex = editor.children.findIndex((c: any) => c.id === draggedId)
    const targetIndex = editor.children.findIndex((c: any) => c.id === targetBlockId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const draggedBlock = editor.children[draggedIndex] as any
    const targetBlock = editor.children[targetIndex] as any

    // Don't allow nesting columns inside columns
    if (draggedBlock.type === 'columns' || targetBlock.type === 'columns') {
      // If target is columns, add to it (up to 4 columns)
      if (targetBlock.type === 'columns' && draggedBlock.type !== 'columns') {
        const currentColumns = targetBlock.columns?.length || 0
        if (currentColumns >= 4) {
          setDropTarget(null)
          setDraggedBlockId(null)
          return
        }

        const newWidth = Math.floor(100 / (currentColumns + 1))
        const newColumn = {
          id: crypto.randomUUID(),
          type: 'column',
          width: newWidth,
          children: [draggedBlock],
        }

        // Update existing column widths and add new column
        const updatedColumns = targetBlock.columns.map((col: any) => ({
          ...col,
          width: newWidth,
        }))

        if (side === 'left') {
          updatedColumns.unshift(newColumn)
        } else {
          updatedColumns.push(newColumn)
        }

        // Remove dragged block
        Transforms.removeNodes(editor, { at: [draggedIndex] })

        // Update columns block
        const newTargetIndex = draggedIndex < targetIndex ? targetIndex - 1 : targetIndex
        Transforms.setNodes(
          editor,
          { columns: updatedColumns } as any,
          { at: [newTargetIndex] }
        )
      }
      setDropTarget(null)
      setDraggedBlockId(null)
      return
    }

    // Create new columns block from two regular blocks
    const columnsBlock = {
      id: crypto.randomUUID(),
      type: 'columns',
      gap: 16,
      columns: side === 'left'
        ? [
            { id: crypto.randomUUID(), type: 'column', width: 50, children: [draggedBlock] },
            { id: crypto.randomUUID(), type: 'column', width: 50, children: [targetBlock] },
          ]
        : [
            { id: crypto.randomUUID(), type: 'column', width: 50, children: [targetBlock] },
            { id: crypto.randomUUID(), type: 'column', width: 50, children: [draggedBlock] },
          ],
      children: [{ text: '' }],
    } as unknown as Descendant

    // Remove both blocks (remove higher index first to maintain correct indices)
    const [firstIndex, secondIndex] = draggedIndex > targetIndex
      ? [draggedIndex, targetIndex]
      : [targetIndex, draggedIndex]

    Transforms.removeNodes(editor, { at: [firstIndex] })
    Transforms.removeNodes(editor, { at: [secondIndex] })

    // Insert columns block at the position of the lower index
    Transforms.insertNodes(editor, columnsBlock, { at: [secondIndex] })

    setDropTarget(null)
    setDraggedBlockId(null)
  }, [editor, draggedBlockId])

  // Render element with hover controls integrated
  const renderElement = useCallback((props: any) => {
    const { element, attributes, children } = props
    const blockId = element.id
    const index = editor.children.findIndex((child: any) => child.id === blockId)
    const isHovered = hoveredBlockIndex === index
    const isSelected = selectedBlockId === blockId

    const showInsertLine = insertLineIndex === index

    // Wrapper with hover controls
    const BlockWrapper = ({ children: blockContent }: { children: React.ReactNode }) => (
      <div
        data-block-id={blockId}
        className="group relative"
        onMouseEnter={() => setHoveredBlockIndex(index)}
        onMouseLeave={() => {
          setHoveredBlockIndex(null)
          setInsertLineIndex(null)
          if (quickAddIndex === index) setQuickAddIndex(null)
        }}
        onMouseMove={(e) => {
          // Show insert line only when hovering near the top edge (within 12px)
          const rect = e.currentTarget.getBoundingClientRect()
          const relativeY = e.clientY - rect.top
          if (relativeY < 12) {
            setInsertLineIndex(index)
          } else {
            if (insertLineIndex === index) setInsertLineIndex(null)
          }
        }}
        onClick={() => blockId && setSelectedBlock(blockId)}
      >
        {/* Insert Line (above block) - only shows when hovering near top edge */}
        {showInsertLine && (
          <div className="absolute -top-2 left-0 right-0 z-10 flex items-center justify-center">
            <div className="h-0.5 flex-1 bg-blue-500" />
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setQuickAddIndex(quickAddIndex === index ? null : index)
                }}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-sm"
              >
                <Plus className="h-3 w-3" />
              </button>

              {/* Quick Add Menu */}
              {quickAddIndex === index && (
                <div className="absolute top-7 left-1/2 -translate-x-1/2 z-20 bg-white rounded-lg shadow-lg border border-border p-2 w-[180px]">
                  <div className="text-xs text-text-muted mb-2 px-2">Block einfügen</div>
                  {blockTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        insertSlateBlock(type.id, index)
                        setQuickAddIndex(null)
                      }}
                      className="flex items-center justify-between w-full px-2 py-1.5 text-sm text-left hover:bg-gray-100 rounded h-[30px]"
                    >
                      <span className="flex items-center gap-2">
                        <type.icon className="h-4 w-4 text-text-secondary" />
                        {type.label}
                      </span>
                      <span className="text-xs text-text-muted">{type.shortcut}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="h-0.5 flex-1 bg-blue-500" />
          </div>
        )}

        {/* Block Container */}
        <div
          className={cn(
            'relative flex items-start gap-1 rounded px-1 py-0.5 transition-colors group/block',
            isHovered && 'bg-gray-50/30'
          )}
        >
          {/* Left Drop Zone - Always listens, visibility controlled by opacity */}
          <div
            data-drop-zone="left"
            className="absolute left-0 top-0 bottom-0 w-12 rounded-l transition-all duration-150 z-20 bg-blue-400/50 opacity-0 hover:opacity-30"
            onDragEnter={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('📍 LEFT ZONE ENTER', blockId)
              setDropTarget({ blockId, side: 'left' })
              e.currentTarget.classList.add('opacity-100', 'bg-blue-500')
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('opacity-100', 'bg-blue-500')
              setDropTarget(null)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
              e.dataTransfer.dropEffect = 'move'
            }}
            onDrop={(e) => {
              console.log('💧 DROP LEFT', blockId)
              e.currentTarget.classList.remove('opacity-100', 'bg-blue-500')
              handleSideDrop(e, blockId, 'left')
            }}
          />

          {/* Right Drop Zone - Always listens, visibility controlled by opacity */}
          <div
            data-drop-zone="right"
            className="absolute right-0 top-0 bottom-0 w-12 rounded-r transition-all duration-150 z-20 bg-blue-400/50 opacity-0 hover:opacity-30"
            onDragEnter={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log('📍 RIGHT ZONE ENTER', blockId)
              setDropTarget({ blockId, side: 'right' })
              e.currentTarget.classList.add('opacity-100', 'bg-blue-500')
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('opacity-100', 'bg-blue-500')
              setDropTarget(null)
            }}
            onDragOver={(e) => {
              e.preventDefault()
              e.stopPropagation()
              e.dataTransfer.dropEffect = 'move'
            }}
            onDrop={(e) => {
              console.log('💧 DROP RIGHT', blockId)
              e.currentTarget.classList.remove('opacity-100', 'bg-blue-500')
              handleSideDrop(e, blockId, 'right')
            }}
          />
          {/* Hover Controls - Test with window.alert */}
          <span
            contentEditable={false}
            style={{ userSelect: 'none', display: 'inline-flex', gap: '2px' }}
          >
            <span
              draggable={true}
              onDragStart={(e) => {
                window.alert('Drag Started! Block: ' + blockId)
                e.dataTransfer.setData('text/plain', blockId || 'unknown')
                e.dataTransfer.effectAllowed = 'move'
                if (blockId) setDraggedBlockId(blockId)
              }}
              onDragEnd={() => {
                setDraggedBlockId(null)
                setDropTarget(null)
              }}
              style={{ cursor: 'grab', padding: '4px', background: '#eee', borderRadius: '4px' }}
            >
              ⋮⋮
            </span>
            <span
              onClick={() => window.alert('Duplicate clicked! Block: ' + blockId)}
              style={{ cursor: 'pointer', padding: '4px', background: '#eee', borderRadius: '4px' }}
            >
              📋
            </span>
            <span
              onClick={() => window.alert('Delete clicked! Block: ' + blockId)}
              style={{ cursor: 'pointer', padding: '4px', background: '#fee', borderRadius: '4px' }}
            >
              🗑️
            </span>
          </span>

          {/* Block Content */}
          <div className="flex-1 min-h-[24px]">
            {blockContent}
          </div>
        </div>
      </div>
    )

    switch (element.type) {
      case 'heading':
        return (
          <BlockWrapper>
            <h2 {...attributes} className="text-2xl font-bold mb-3">
              {children}
            </h2>
          </BlockWrapper>
        )

      case 'image':
        return (
          <BlockWrapper>
            <div {...attributes} contentEditable={false} className="my-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <Image className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Klicke um ein Bild hochzuladen</p>
                <p className="text-xs text-gray-400 mt-1">oder ziehe eine Datei hierher</p>
              </div>
              {children}
            </div>
          </BlockWrapper>
        )

      case 'video':
        return (
          <BlockWrapper>
            <div {...attributes} contentEditable={false} className="my-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <Video className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Video-URL einfügen</p>
                <p className="text-xs text-gray-400 mt-1">YouTube, Vimeo oder direkte URL</p>
              </div>
              {children}
            </div>
          </BlockWrapper>
        )

      case 'table':
        return (
          <BlockWrapper>
            <div {...attributes} className="my-4 overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <tbody>
                  {[0, 1, 2].map((row) => (
                    <tr key={row}>
                      {[0, 1, 2].map((col) => (
                        <td key={col} className="border border-gray-300 p-2 min-w-[100px]">
                          {row === 0 && col === 0 ? children : <span className="text-gray-400">Zelle</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </BlockWrapper>
        )

      case 'price-list':
        return (
          <BlockWrapper>
            <div {...attributes} contentEditable={false} className="my-4 border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <span className="font-medium text-sm">Preisliste</span>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 text-sm font-medium">Produkt</th>
                    <th className="text-right px-4 py-2 text-sm font-medium">Menge</th>
                    <th className="text-right px-4 py-2 text-sm font-medium">Preis</th>
                    <th className="text-right px-4 py-2 text-sm font-medium">Gesamt</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-100">
                    <td className="px-4 py-2 text-sm text-gray-500">Klicke um Produkt hinzuzufügen...</td>
                    <td className="px-4 py-2 text-right text-sm">-</td>
                    <td className="px-4 py-2 text-right text-sm">-</td>
                    <td className="px-4 py-2 text-right text-sm">-</td>
                  </tr>
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right font-medium text-sm">Gesamt:</td>
                    <td className="px-4 py-2 text-right font-medium">€0,00</td>
                  </tr>
                </tfoot>
              </table>
              {children}
            </div>
          </BlockWrapper>
        )

      case 'page-break':
        return (
          <BlockWrapper>
            <div {...attributes} contentEditable={false} className="my-8">
              <div className="flex items-center gap-4">
                <div className="flex-1 border-t-2 border-dashed border-gray-300" />
                <span className="text-xs text-gray-400 bg-white px-2">Seitenumbruch</span>
                <div className="flex-1 border-t-2 border-dashed border-gray-300" />
              </div>
              {children}
            </div>
          </BlockWrapper>
        )

      case 'columns':
        return (
          <BlockWrapper>
            <div {...attributes} className="my-4">
              <div
                className="flex gap-4"
                style={{ gap: `${element.gap || 16}px` }}
              >
                {element.columns?.map((column: any, colIndex: number) => (
                  <div
                    key={column.id || colIndex}
                    className="flex-1 border border-dashed border-gray-300 rounded-lg p-4 min-h-[100px] hover:border-blue-400 transition-colors"
                    style={{ flex: `0 0 ${column.width || 50}%` }}
                  >
                    {column.children?.map((child: any, childIndex: number) => (
                      <div key={child.id || childIndex} className="min-h-[24px]">
                        {child.type === 'paragraph' ? (
                          <p className="text-gray-400 text-sm">
                            {child.children?.[0]?.text || 'Text eingeben...'}
                          </p>
                        ) : (
                          <span className="text-gray-400 text-sm">Block</span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              {/* Hidden children for Slate compatibility */}
              <div className="hidden">{children}</div>
            </div>
          </BlockWrapper>
        )

      case 'column':
        // Column blocks are rendered by their parent columns block
        return (
          <div {...attributes}>
            {children}
          </div>
        )

      default:
        return (
          <BlockWrapper>
            <p {...attributes} className="min-h-[1.5em]">{children}</p>
          </BlockWrapper>
        )
    }
  }, [editor, hoveredBlockIndex, insertLineIndex, quickAddIndex, selectedBlockId, insertSlateBlock, duplicateBlock, deleteBlock, setHoveredBlockIndex, setInsertLineIndex, setQuickAddIndex, setSelectedBlock, draggedBlockId, dropTarget, handleSideDrop])

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
            <div
              className="mx-auto w-12 aspect-[210/297] bg-white border-2 border-primary rounded shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              title="Seite 1"
            />
            <Button
              variant="ghost"
              size="icon"
              className="mx-auto mt-2 flex h-8 w-8 hover:bg-primary/10"
              title="Neue Seite hinzufügen"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </aside>

          {/* Canvas (Center) */}
          <main className="flex-1 overflow-auto bg-gray-100 p-8">
            <div className="mx-auto max-w-[816px]">
              {/* A4 Page */}
              <div
                data-dragging={draggedBlockId ? "true" : undefined}
                className={cn(
                  "bg-white shadow-lg rounded min-h-[1056px] p-16 transition-all group/editor",
                  isDraggingOver && "ring-2 ring-blue-500 ring-dashed bg-blue-50/30",
                  draggedBlockId && "is-dragging"
                )}
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDraggingOver(true)
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setIsDraggingOver(false)
                  const blockType = e.dataTransfer.getData('blockType')
                  if (blockType) {
                    insertSlateBlock(blockType)
                  }
                }}
              >
                <Slate
                  editor={editor}
                  initialValue={content}
                  onChange={(newValue) => setContent(newValue)}
                >
                  <Editable
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Text eingeben..."
                    className="outline-none"
                  />

                  {/* Add block at end */}
                  <div className="mt-4 flex justify-center">
                    <button
                      onClick={() => insertSlateBlock('text')}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-text-primary hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      Block hinzufügen
                    </button>
                  </div>
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
                    {blockTypes.map((blockType) => (
                      <button
                        key={blockType.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('blockType', blockType.id)
                          setDraggedBlockType(blockType.id)
                        }}
                        onDragEnd={() => setDraggedBlockType(null)}
                        onClick={() => insertSlateBlock(blockType.id)}
                        className={cn(
                          "flex flex-col items-center justify-center rounded border border-border bg-white h-[45px] text-center hover:bg-surface-hover hover:border-primary/50 transition-colors cursor-grab active:cursor-grabbing",
                          draggedBlockType === blockType.id && "opacity-50"
                        )}
                      >
                        <blockType.icon className="mb-0.5 h-4 w-4 text-text-secondary" />
                        <span className="text-[11px] text-text-primary leading-tight">
                          {blockType.label}
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
                        className="flex flex-col items-center justify-center rounded border border-primary/30 bg-primary/5 h-[40px] text-center hover:bg-primary/10 hover:border-primary/50 transition-colors"
                      >
                        <field.icon className="mb-0.5 h-4 w-4 text-primary" />
                        <span className="text-[11px] text-text-primary leading-tight">
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
