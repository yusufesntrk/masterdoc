import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, MoreHorizontal, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Document, DocumentStatus } from '@/types'

// Mock data for development
const mockDocuments: Document[] = [
  {
    id: '1',
    user_id: 'user-1',
    title: 'Angebot Website-Redesign',
    status: 'draft',
    total_amount: 4500,
    content: null,
    template_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: 'user-1',
    title: 'Vertrag Softwareentwicklung',
    status: 'sent',
    total_amount: 12000,
    content: null,
    template_id: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    user_id: 'user-1',
    title: 'NDA Kooperationspartner',
    status: 'signed',
    total_amount: 0,
    content: null,
    template_id: null,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
]

const statusConfig: Record<
  DocumentStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
  draft: { label: 'Entwurf', variant: 'secondary' },
  sent: { label: 'Gesendet', variant: 'default' },
  viewed: { label: 'Angesehen', variant: 'outline' },
  signed: { label: 'Unterzeichnet', variant: 'default' },
  expired: { label: 'Abgelaufen', variant: 'destructive' },
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Gerade eben'
  if (diffMins < 60) return `Vor ${diffMins} Min.`
  if (diffHours < 24) return `Vor ${diffHours} Std.`
  if (diffDays < 7) return `Vor ${diffDays} Tagen`

  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('recent')

  const filteredDocuments = mockDocuments.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-text-primary">
              MasterDoc
            </h1>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                placeholder="Dokumente durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary hover:bg-primary-hover text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Dokument
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/editor/new">Neues Dokument</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Aus Vorlage</DropdownMenuItem>
                <DropdownMenuItem>Importieren</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Avatar>
              <AvatarFallback>YE</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-border bg-surface">
        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-12 bg-transparent p-0 gap-6">
              <TabsTrigger
                value="recent"
                className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-3 font-medium text-text-secondary data-[state=active]:border-primary data-[state=active]:text-text-primary data-[state=active]:shadow-none"
              >
                Neueste
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-3 font-medium text-text-secondary data-[state=active]:border-primary data-[state=active]:text-text-primary data-[state=active]:shadow-none"
              >
                Alle Dokumente
              </TabsTrigger>
              <TabsTrigger
                value="mine"
                className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-3 font-medium text-text-secondary data-[state=active]:border-primary data-[state=active]:text-text-primary data-[state=active]:shadow-none"
              >
                Von mir erstellt
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-0 pb-3 pt-3 font-medium text-text-secondary data-[state=active]:border-primary data-[state=active]:text-text-primary data-[state=active]:shadow-none"
              >
                Archiviert
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Document List */}
      <main className="p-6">
        {filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-text-muted mb-4" />
            <h2 className="text-lg font-medium text-text-primary mb-2">
              Keine Dokumente gefunden
            </h2>
            <p className="text-text-secondary mb-4">
              {searchQuery
                ? 'Versuche einen anderen Suchbegriff.'
                : 'Erstelle dein erstes Dokument, um loszulegen.'}
            </p>
            <Button asChild className="bg-primary hover:bg-primary-hover">
              <Link to="/editor/new">
                <Plus className="mr-2 h-4 w-4" />
                Neues Dokument
              </Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Betrag</TableHead>
                <TableHead>Geändert</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow
                  key={doc.id}
                  className="cursor-pointer hover:bg-surface-hover"
                >
                  <TableCell>
                    <Link
                      to={`/editor/${doc.id}`}
                      className="flex items-center gap-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">
                          {doc.title}
                        </p>
                        <p className="text-sm text-text-muted">
                          Keine Empfänger
                        </p>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[doc.status].variant}>
                      {statusConfig[doc.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {doc.total_amount > 0
                      ? formatCurrency(doc.total_amount)
                      : '-'}
                  </TableCell>
                  <TableCell className="text-text-secondary">
                    {formatDate(doc.updated_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Duplizieren</DropdownMenuItem>
                        <DropdownMenuItem>Umbenennen</DropdownMenuItem>
                        <DropdownMenuItem>Archivieren</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Löschen
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </main>
    </div>
  )
}
