import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { BookOpen, Calendar, User, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Algorithmic Trading & Crypto Education | Emax Protocol',
  description:
    'Learn about algorithmic crypto trading, blockchain technology, risk management strategies, and digital asset insights from industry experts.',
  openGraph: {
    title: 'Blog | Crypto Trading Education',
    description: 'Expert insights on algorithmic trading, blockchain, and cryptocurrency strategy.',
  },
}

interface BlogPost {
  id: string
  title: string
  description: string
  category: string
  author: string
  authorBio?: string
  authorLinkedIn?: string
  date: string
  lastUpdated?: string
  readTime: string
  keywords: string[]
}

const educationBlogPosts: BlogPost[] = [
  {
    id: 'what-is-algorithmic-crypto-trading',
    title: 'What Is Algorithmic Crypto Trading?',
    description: 'Comprehensive guide to understanding algorithmic crypto trading systems, how they work, and their advantages in digital asset markets.',
    category: 'Education',
    author: 'Sarah Chen',
    authorBio: 'Former Goldman Sachs quantitative analyst with 12+ years in algorithmic trading',
    authorLinkedIn: 'https://linkedin.com/in/sarah-chen',
    date: 'Jan 15, 2024',
    lastUpdated: 'Dec 15, 2024',
    readTime: '8 min',
    keywords: ['algorithmic trading', 'crypto trading', 'automated trading'],
  },
  {
    id: 'how-crypto-arbitrage-works',
    title: 'How Crypto Arbitrage Works',
    description: 'Understanding arbitrage opportunities in cryptocurrency markets and how algorithmic systems identify profitable price discrepancies.',
    category: 'Education',
    author: 'Elena Rodriguez',
    authorBio: 'Blockchain security expert with 15 years in financial systems security',
    authorLinkedIn: 'https://linkedin.com/in/elena-rodriguez',
    date: 'Jan 12, 2024',
    lastUpdated: 'Dec 12, 2024',
    readTime: '10 min',
    keywords: ['crypto arbitrage', 'trading opportunities', 'price arbitrage'],
  },
  {
    id: 'crypto-risk-management-strategies',
    title: 'Crypto Risk Management Strategies',
    description: 'Essential risk management techniques for cryptocurrency traders and institutional investors in volatile digital asset markets.',
    category: 'Education',
    author: 'Michael Torres',
    authorBio: 'Risk management director with former head experience at major trading firms',
    authorLinkedIn: 'https://linkedin.com/in/michael-torres',
    date: 'Jan 10, 2024',
    lastUpdated: 'Dec 10, 2024',
    readTime: '7 min',
    keywords: ['risk management', 'crypto trading', 'portfolio management'],
  },
  {
    id: 'blockchain-verification-explained',
    title: 'Blockchain Verification Explained',
    description: 'Deep dive into blockchain transaction verification, smart contract execution, and consensus mechanisms in cryptocurrency networks.',
    category: 'Education',
    author: 'James Park',
    authorBio: 'Senior AI specialist and data scientist with expertise in machine learning',
    authorLinkedIn: 'https://linkedin.com/in/james-park',
    date: 'Jan 8, 2024',
    lastUpdated: 'Dec 8, 2024',
    readTime: '9 min',
    keywords: ['blockchain', 'transaction verification', 'smart contracts'],
  },
]

const advancedBlogPosts: BlogPost[] = [
  {
    id: 'ai-in-cryptocurrency-trading',
    title: 'AI in Cryptocurrency Trading',
    description: 'Exploring how artificial intelligence and machine learning algorithms optimize trading decisions in cryptocurrency markets.',
    category: 'Advanced',
    author: 'James Park',
    authorBio: 'Senior AI specialist with published research in computational finance',
    authorLinkedIn: 'https://linkedin.com/in/james-park',
    date: 'Jan 20, 2024',
    lastUpdated: 'Dec 20, 2024',
    readTime: '12 min',
    keywords: ['AI trading', 'machine learning', 'cryptocurrency'],
  },
  {
    id: 'machine-learning-trading-bots',
    title: 'Machine Learning Trading Bots',
    description: 'Understanding neural networks and machine learning models that power next-generation automated trading systems.',
    category: 'Advanced',
    author: 'James Park',
    authorBio: 'Data scientist with expertise in neural networks and AI infrastructure',
    authorLinkedIn: 'https://linkedin.com/in/james-park',
    date: 'Jan 18, 2024',
    lastUpdated: 'Dec 18, 2024',
    readTime: '11 min',
    keywords: ['machine learning', 'trading bots', 'neural networks'],
  },
  {
    id: 'institutional-crypto-trading-systems',
    title: 'Institutional Crypto Trading Systems',
    description: 'How institutional investors and hedge funds deploy sophisticated algorithmic systems for cryptocurrency portfolio management.',
    category: 'Advanced',
    author: 'Sarah Chen',
    authorBio: 'Quantitative analyst with institutional trading systems expertise',
    authorLinkedIn: 'https://linkedin.com/in/sarah-chen',
    date: 'Jan 16, 2024',
    lastUpdated: 'Dec 16, 2024',
    readTime: '10 min',
    keywords: ['institutional trading', 'hedge funds', 'crypto portfolios'],
  },
]

const searchIntentBlogPosts: BlogPost[] = [
  {
    id: 'is-automated-crypto-trading-profitable',
    title: 'Is Automated Crypto Trading Profitable?',
    description: 'Analyzing profitability factors in algorithmic crypto trading, realistic return expectations, and market conditions.',
    category: 'Market Analysis',
    author: 'Finance Analyst',
    date: 'Jan 22, 2024',
    readTime: '8 min',
    keywords: ['crypto profitability', 'trading returns', 'automated trading'],
  },
  {
    id: 'crypto-trading-vs-long-term-holding',
    title: 'Crypto Trading vs Long-Term Holding',
    description: 'Comparison of active trading strategies versus buy-and-hold approaches for cryptocurrency investors.',
    category: 'Strategy',
    author: 'Investment Advisor',
    date: 'Jan 19, 2024',
    readTime: '7 min',
    keywords: ['trading vs holding', 'investment strategy', 'cryptocurrency'],
  },
  {
    id: 'how-to-diversify-crypto-portfolio',
    title: 'How to Diversify a Crypto Portfolio',
    description: 'Portfolio diversification strategies for cryptocurrency investors including asset allocation and risk distribution.',
    category: 'Strategy',
    author: 'Portfolio Manager',
    date: 'Jan 14, 2024',
    readTime: '9 min',
    keywords: ['portfolio diversification', 'crypto assets', 'asset allocation'],
  },
  {
    id: 'common-crypto-trading-mistakes',
    title: 'Common Crypto Trading Mistakes',
    description: 'Understanding common pitfalls and mistakes that lead to losses in cryptocurrency trading and how to avoid them.',
    category: 'Strategy',
    author: 'Trading Coach',
    date: 'Jan 11, 2024',
    readTime: '8 min',
    keywords: ['trading mistakes', 'crypto losses', 'trading education'],
  },
]

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {post.category}
          </Badge>
          <span className="text-xs text-gray-500">{post.readTime}</span>
        </div>
        <CardTitle className="text-xl hover:text-blue-600 transition-colors">
          <Link href={`/blog/${post.id}`}>{post.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <CardDescription className="text-gray-600 mb-4">{post.description}</CardDescription>
        <div className="flex flex-wrap gap-1 mb-4">
          {post.keywords.map((keyword) => (
            <span key={keyword} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {keyword}
            </span>
          ))}
        </div>
        <div className="space-y-3 mt-auto pt-4 border-t">
          <div className="text-xs">
            <p className="font-semibold text-gray-700">{post.author}</p>
            {post.authorBio && <p className="text-gray-500 line-clamp-1">{post.authorBio}</p>}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {post.date}
              </span>
              {post.lastUpdated && (
                <span className="flex items-center gap-1 text-blue-600">
                  <Calendar className="w-3 h-3" />
                  Updated: {post.lastUpdated}
                </span>
              )}
            </div>
            <Link href={`/blog/${post.id}`} className="text-blue-600 hover:text-blue-700">
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function BlogPage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <BookOpen className="w-16 h-16 text-blue-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Crypto Trading & Blockchain Blog</h1>
            <p className="text-xl text-gray-600">
              Expert insights on algorithmic trading, risk management, and cryptocurrency market dynamics
            </p>
          </div>
        </div>
      </section>

      {/* Educational Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Education & Fundamentals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {educationBlogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Topics */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Advanced Trading Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {advancedBlogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Search Intent / High Traffic */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Popular Questions & Strategy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchIntentBlogPosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Get Trading Insights Delivered</h2>
          <p className="text-blue-100 mb-8">
            Subscribe to our newsletter for weekly insights on algorithmic trading, market analysis, and cryptocurrency strategy.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-400"
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
