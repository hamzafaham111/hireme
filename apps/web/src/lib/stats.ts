export const platformStats = {
  totalCustomers: 2000,
  totalWorkers: 2500,
  jobsCompleted: 15000,
  avgRating: 4.9,
  totalReviews: 1200,
  avgWorkerEarnings: 40000, // PKR per month
  avgResponseTime: 4, // minutes
}

export const testimonials = [
  {
    quote: "I needed documents collected from 3 offices. Done in 90 minutes!",
    author: "Sarah K.",
    role: "customer" as const,
    verified: true,
  },
  {
    quote: "I made Rs 45,000 in my first month doing deliveries part-time.",
    author: "Ahmed M.",
    role: "worker" as const,
    verified: true,
  },
  {
    quote: "Updates came instantly on WhatsApp. No need for another app!",
    author: "Ali R.",
    role: "customer" as const,
    verified: true,
  },
]
