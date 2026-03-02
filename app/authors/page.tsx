import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Authors | Emax Protocol',
  description: 'Meet our team of cryptocurrency trading experts, data scientists, and fintech professionals.',
}

const authors = [
  {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    title: 'Lead Trading Strategist',
    bio: 'Former Goldman Sachs quantitative analyst with 12+ years in algorithmic trading and cryptocurrency market infrastructure. PhD in Mathematics from Stanford.',
    linkedIn: 'https://linkedin.com/in/sarah-chen',
    email: 'sarah.chen@emaxprotocol.com',
    expertise: ['Algorithmic Trading', 'Risk Management', 'Market Microstructure'],
    articles: 5,
  },
  {
    id: 'james-park',
    name: 'James Park',
    title: 'Senior AI Specialist',
    bio: 'Data scientist with expertise in machine learning and neural networks. Previously led AI infrastructure at top fintech firms. Published researcher in computational finance.',
    linkedIn: 'https://linkedin.com/in/james-park',
    email: 'james.park@emaxprotocol.com',
    expertise: ['Machine Learning', 'AI Trading Systems', 'Neural Networks'],
    articles: 8,
  },
  {
    id: 'elena-rodriguez',
    name: 'Elena Rodriguez',
    title: 'Blockchain Security Expert',
    bio: 'Cybersecurity specialist with 15 years in financial systems security. Certified in blockchain security and compliance. Advisor to multiple cryptocurrency projects.',
    linkedIn: 'https://linkedin.com/in/elena-rodriguez',
    email: 'elena.rodriguez@emaxprotocol.com',
    expertise: ['Blockchain Security', 'Smart Contracts', 'Compliance'],
    articles: 6,
  },
  {
    id: 'michael-torres',
    name: 'Michael Torres',
    title: 'Risk Management Director',
    bio: 'Former head of risk management at major trading firms. Specializes in portfolio optimization and volatility management. CFA charterholder.',
    linkedIn: 'https://linkedin.com/in/michael-torres',
    email: 'michael.torres@emaxprotocol.com',
    expertise: ['Risk Management', 'Portfolio Theory', 'Volatility Analysis'],
    articles: 4,
  },
]

export default function AuthorsPage() {
  return (
    <div className="pt-16">
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Our Expert Authors</h1>
            <p className="text-xl text-gray-600">
              Meet the team of industry experts and researchers behind our educational content on algorithmic trading and cryptocurrency.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {authors.map((author) => (
              <Card key={author.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{author.name}</CardTitle>
                  <p className="text-sm font-semibold text-blue-600">{author.title}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{author.bio}</p>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {author.expertise.map((exp) => (
                        <span key={exp} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t flex items-center justify-between">
                    <span className="text-xs text-gray-500">{author.articles} articles published</span>
                    <div className="flex gap-2">
                      <a href={`mailto:${author.email}`} className="text-gray-400 hover:text-blue-600 transition">
                        <Mail className="w-4 h-4" />
                      </a>
                      <a href={author.linkedIn} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
