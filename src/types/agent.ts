export interface Agent {
  id: string
  name: string
  description: string
  type: string
  lastModified: string
  status: 'active' | 'draft'
}
