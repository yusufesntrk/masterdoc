import { create } from 'zustand'
import type { Descendant } from 'slate'
import type { EditorBlock, Field } from '@/types'

interface EditorState {
  // Editor content (Slate.js)
  content: Descendant[]

  // Currently selected block
  selectedBlockId: string | null

  // Quick-add menu state
  quickAddOpen: boolean
  quickAddPosition: { x: number; y: number } | null
  insertIndex: number | null

  // Floating toolbar
  showBlockToolbar: boolean
  blockToolbarPosition: { x: number; y: number } | null

  // Fields
  fields: Field[]

  // Dirty state (unsaved changes)
  isDirty: boolean

  // Undo/Redo history
  history: Descendant[][]
  historyIndex: number

  // Actions
  setContent: (content: Descendant[]) => void
  insertBlock: (block: EditorBlock, index: number) => void
  updateBlock: (id: string, updates: Partial<EditorBlock>) => void
  deleteBlock: (id: string) => void
  duplicateBlock: (id: string) => void
  moveBlock: (fromIndex: number, toIndex: number) => void

  // Selection
  setSelectedBlock: (id: string | null) => void

  // Quick-add menu
  openQuickAdd: (position: { x: number; y: number }, insertIndex: number) => void
  closeQuickAdd: () => void

  // Block toolbar
  showToolbar: (position: { x: number; y: number }) => void
  hideToolbar: () => void

  // Fields
  setFields: (fields: Field[]) => void
  addField: (field: Field) => void
  updateField: (id: string, updates: Partial<Field>) => void
  removeField: (id: string) => void

  // Dirty state
  markDirty: () => void
  markClean: () => void

  // Undo/Redo
  undo: () => void
  redo: () => void
  saveToHistory: () => void
}

// Initial empty content
const initialContent: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  } as unknown as Descendant,
]

export const useEditorStore = create<EditorState>((set, get) => ({
  content: initialContent,
  selectedBlockId: null,
  quickAddOpen: false,
  quickAddPosition: null,
  insertIndex: null,
  showBlockToolbar: false,
  blockToolbarPosition: null,
  fields: [],
  isDirty: false,
  history: [initialContent],
  historyIndex: 0,

  setContent: (content) => {
    set({ content, isDirty: true })
  },

  insertBlock: (block, index) => {
    set((state) => {
      const newContent = [...state.content]
      newContent.splice(index, 0, block as unknown as Descendant)
      return { content: newContent, isDirty: true }
    })
    get().saveToHistory()
  },

  updateBlock: (id, updates) => {
    set((state) => {
      const newContent = state.content.map((block) => {
        const b = block as unknown as EditorBlock
        if (b.id === id) {
          return { ...b, ...updates } as unknown as Descendant
        }
        return block
      })
      return { content: newContent, isDirty: true }
    })
  },

  deleteBlock: (id) => {
    set((state) => {
      const newContent = state.content.filter((block) => {
        const b = block as unknown as EditorBlock
        return b.id !== id
      })
      return {
        content: newContent.length > 0 ? newContent : initialContent,
        isDirty: true,
        selectedBlockId: null,
      }
    })
    get().saveToHistory()
  },

  duplicateBlock: (id) => {
    set((state) => {
      const index = state.content.findIndex((block) => {
        const b = block as unknown as EditorBlock
        return b.id === id
      })
      if (index === -1) return state

      const block = state.content[index] as unknown as EditorBlock
      const duplicate = {
        ...block,
        id: crypto.randomUUID(),
      } as unknown as Descendant

      const newContent = [...state.content]
      newContent.splice(index + 1, 0, duplicate)

      return { content: newContent, isDirty: true }
    })
    get().saveToHistory()
  },

  moveBlock: (fromIndex, toIndex) => {
    set((state) => {
      const newContent = [...state.content]
      const [removed] = newContent.splice(fromIndex, 1)
      newContent.splice(toIndex, 0, removed)
      return { content: newContent, isDirty: true }
    })
    get().saveToHistory()
  },

  setSelectedBlock: (id) => set({ selectedBlockId: id }),

  openQuickAdd: (position, insertIndex) =>
    set({
      quickAddOpen: true,
      quickAddPosition: position,
      insertIndex,
    }),

  closeQuickAdd: () =>
    set({
      quickAddOpen: false,
      quickAddPosition: null,
      insertIndex: null,
    }),

  showToolbar: (position) =>
    set({
      showBlockToolbar: true,
      blockToolbarPosition: position,
    }),

  hideToolbar: () =>
    set({
      showBlockToolbar: false,
      blockToolbarPosition: null,
    }),

  setFields: (fields) => set({ fields }),

  addField: (field) =>
    set((state) => ({ fields: [...state.fields, field] })),

  updateField: (id, updates) =>
    set((state) => ({
      fields: state.fields.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    })),

  removeField: (id) =>
    set((state) => ({
      fields: state.fields.filter((f) => f.id !== id),
    })),

  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),

  undo: () => {
    const { history, historyIndex } = get()
    if (historyIndex > 0) {
      set({
        content: history[historyIndex - 1],
        historyIndex: historyIndex - 1,
      })
    }
  },

  redo: () => {
    const { history, historyIndex } = get()
    if (historyIndex < history.length - 1) {
      set({
        content: history[historyIndex + 1],
        historyIndex: historyIndex + 1,
      })
    }
  },

  saveToHistory: () => {
    const { content, history, historyIndex } = get()
    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(content)
    // Keep only last 50 entries
    if (newHistory.length > 50) {
      newHistory.shift()
    }
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    })
  },
}))
