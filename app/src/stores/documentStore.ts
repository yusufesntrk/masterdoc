import { create } from 'zustand'
import type { Document, DocumentWithRecipients, Recipient } from '@/types'

interface DocumentState {
  // Current document being edited
  currentDocument: DocumentWithRecipients | null

  // Document list for dashboard
  documents: Document[]
  isLoading: boolean
  error: string | null

  // Actions
  setCurrentDocument: (doc: DocumentWithRecipients | null) => void
  updateDocument: (updates: Partial<Document>) => void
  setDocuments: (docs: Document[]) => void
  addDocument: (doc: Document) => void
  removeDocument: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Recipients
  addRecipient: (recipient: Recipient) => void
  updateRecipient: (id: string, updates: Partial<Recipient>) => void
  removeRecipient: (id: string) => void
  reorderRecipients: (recipientIds: string[]) => void
}

export const useDocumentStore = create<DocumentState>((set) => ({
  currentDocument: null,
  documents: [],
  isLoading: false,
  error: null,

  setCurrentDocument: (doc) => set({ currentDocument: doc }),

  updateDocument: (updates) =>
    set((state) => ({
      currentDocument: state.currentDocument
        ? { ...state.currentDocument, ...updates }
        : null,
    })),

  setDocuments: (docs) => set({ documents: docs }),

  addDocument: (doc) =>
    set((state) => ({ documents: [doc, ...state.documents] })),

  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    })),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Recipients
  addRecipient: (recipient) =>
    set((state) => ({
      currentDocument: state.currentDocument
        ? {
            ...state.currentDocument,
            recipients: [...state.currentDocument.recipients, recipient],
          }
        : null,
    })),

  updateRecipient: (id, updates) =>
    set((state) => ({
      currentDocument: state.currentDocument
        ? {
            ...state.currentDocument,
            recipients: state.currentDocument.recipients.map((r) =>
              r.id === id ? { ...r, ...updates } : r
            ),
          }
        : null,
    })),

  removeRecipient: (id) =>
    set((state) => ({
      currentDocument: state.currentDocument
        ? {
            ...state.currentDocument,
            recipients: state.currentDocument.recipients.filter(
              (r) => r.id !== id
            ),
          }
        : null,
    })),

  reorderRecipients: (recipientIds) =>
    set((state) => {
      if (!state.currentDocument) return state

      const recipientMap = new Map(
        state.currentDocument.recipients.map((r) => [r.id, r])
      )

      const reorderedRecipients = recipientIds
        .map((id, index) => {
          const recipient = recipientMap.get(id)
          return recipient ? { ...recipient, order_index: index } : null
        })
        .filter((r): r is Recipient => r !== null)

      return {
        currentDocument: {
          ...state.currentDocument,
          recipients: reorderedRecipients,
        },
      }
    }),
}))
