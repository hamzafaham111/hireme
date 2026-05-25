export interface Customer {
  id: string
  userId: string | null
  customerType: 'individual' | 'residential' | 'commercial'
  preferredLocation: string | null
  preferredServices: string[]
  totalJobsPosted: number
  totalSpent: number
  reputationScore: number
  billingAddress: string | null
  communicationPref: string
  createdAt: Date
  updatedAt: Date
  // Linked user data (from User table join)
  name?: string
  email?: string
  phone?: string
  status?: string
}
