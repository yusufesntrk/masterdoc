// ============================================
// MasterDoc - TypeScript Types
// ============================================

import type { Descendant } from 'slate'

// ============================================
// User & Auth
// ============================================

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  company_name: string | null
  created_at: string
}

// ============================================
// Document
// ============================================

export type DocumentStatus = 'draft' | 'sent' | 'viewed' | 'signed' | 'expired'

export interface Document {
  id: string
  user_id: string
  title: string
  status: DocumentStatus
  total_amount: number
  content: Descendant[] | null
  template_id: string | null
  created_at: string
  updated_at: string
}

export interface DocumentWithRecipients extends Document {
  recipients: Recipient[]
}

// ============================================
// Template
// ============================================

export interface Template {
  id: string
  user_id: string
  title: string
  content: Descendant[] | null
  category: string | null
  is_public: boolean
  created_at: string
}

// ============================================
// Recipient
// ============================================

export type RecipientRole = 'signer' | 'approver' | 'cc'
export type RecipientStatus = 'pending' | 'viewed' | 'signed'

export interface Recipient {
  id: string
  document_id: string
  email: string
  name: string | null
  role: RecipientRole
  order_index: number
  status: RecipientStatus
  signed_at: string | null
  signature_data: SignatureData | null
}

// ============================================
// Fields (Ausfüllbare Felder)
// ============================================

export type FieldType =
  | 'text'
  | 'signature'
  | 'initials'
  | 'date'
  | 'checkbox'
  | 'radio'
  | 'dropdown'
  | 'file'

export interface FieldPosition {
  x: number
  y: number
  width: number
  height: number
  page: number
}

export interface Field {
  id: string
  document_id: string
  recipient_id: string | null
  type: FieldType
  block_id: string | null
  label: string | null
  required: boolean
  value: unknown
  position: FieldPosition | null
}

// ============================================
// Signature
// ============================================

export type SignatureType = 'draw' | 'type' | 'upload'

export interface SignatureData {
  type: SignatureType
  data: string // Base64 für draw/upload, Text für type
  created_at: string
}

// ============================================
// Activity Log
// ============================================

export type ActivityAction =
  | 'created'
  | 'edited'
  | 'sent'
  | 'viewed'
  | 'signed'
  | 'completed'
  | 'expired'

export interface ActivityLog {
  id: string
  document_id: string
  user_id: string | null
  action: ActivityAction
  details: Record<string, unknown> | null
  created_at: string
}

// ============================================
// Content Library
// ============================================

export type ContentLibraryType = 'text' | 'image' | 'block'

export interface ContentLibraryItem {
  id: string
  user_id: string
  title: string
  type: ContentLibraryType
  content: Descendant[] | Record<string, unknown>
  created_at: string
}

// ============================================
// Editor Blocks
// ============================================

export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'image'
  | 'video'
  | 'table'
  | 'price-list'
  | 'quote-builder'
  | 'toc'
  | 'page-break'
  | 'field'

export interface BaseBlock {
  id: string
  type: BlockType
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph'
  children: Descendant[]
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading'
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: Descendant[]
}

export interface ImageBlock extends BaseBlock {
  type: 'image'
  url: string
  alt: string | null
  width: number | null
  height: number | null
}

export interface VideoBlock extends BaseBlock {
  type: 'video'
  url: string
  provider: 'youtube' | 'vimeo' | 'custom'
}

export interface TableCell {
  content: Descendant[]
}

export interface TableRow {
  cells: TableCell[]
}

export interface TableBlock extends BaseBlock {
  type: 'table'
  rows: TableRow[]
  header: boolean
}

export interface PriceListItem {
  id: string
  product: string
  description: string | null
  quantity: number
  unit_price: number
  discount: number
  total: number
}

export interface PriceListBlock extends BaseBlock {
  type: 'price-list'
  items: PriceListItem[]
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  currency: string
}

export interface PageBreakBlock extends BaseBlock {
  type: 'page-break'
}

export interface TocBlock extends BaseBlock {
  type: 'toc'
}

export interface FieldBlock extends BaseBlock {
  type: 'field'
  field_type: FieldType
  field_id: string | null
  recipient_id: string | null
  label: string | null
  required: boolean
}

export type EditorBlock =
  | ParagraphBlock
  | HeadingBlock
  | ImageBlock
  | VideoBlock
  | TableBlock
  | PriceListBlock
  | PageBreakBlock
  | TocBlock
  | FieldBlock

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}
