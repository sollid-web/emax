import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, User, ArrowLeft, Linkedin, Mail } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { articleSchema } from '@/lib/schema'

interface BlogPostDetail {
  id: string
  title: string
  description: string
  content: string
  author: string
  authorBio: string
  authorLinkedIn: string
  email: string
  date: string
  lastUpdated: string
  readTime: string
  category: string
  keywords: string[]
}

const blogPosts: Record<string, BlogPostDetail> = {
  'what-is-algorithmic-crypto-trading': {
    id: 'what-is-algorithmic-crypto-trading',
    title: 'What Is Algorithmic Crypto Trading?',
    description: 'Comprehensive guide to understanding algorithmic crypto trading systems, how they work, and their advantages in digital asset markets.',
    content: `Algorithmic crypto trading represents a fundamental shift in how digital assets are managed and traded. Rather than relying on human emotion and intuition, algorithmic systems execute trades based on predefined mathematical models and market conditions.

## Core Principles

Algorithmic trading systems analyze vast amounts of market data in milliseconds, identifying patterns and opportunities that human traders would miss. The systems execute trades automatically when predetermined conditions are met, eliminating emotional decision-making from the process.

### Key Components:
- Market data analysis
- Signal generation
- Risk management
- Order execution
- Position monitoring

## Advantages in Cryptocurrency Markets

Cryptocurrency markets operate 24/7, unlike traditional stock exchanges. This continuous operation creates both opportunities and challenges. Algorithmic systems excel in such environments by:

1. **Speed**: Execute trades faster than human traders
2. **Consistency**: Follow strategies without deviation
3. **Risk Management**: Automatically enforce stop-losses and position limits
4. **Scalability**: Handle multiple assets and markets simultaneously

## Real-World Applications

Algorithmic trading powers modern cryptocurrency exchanges, enabling faster price discovery and improved liquidity. Institutional investors increasingly rely on sophisticated algorithms for portfolio rebalancing and hedging strategies.

## Conclusion

Algorithmic crypto trading is not about "getting rich quick." Instead, it represents disciplined, systematic approaches to navigating volatile digital asset markets with structured risk management and data-driven decision-making.`,
    author: 'Sarah Chen',
    authorBio: 'Former Goldman Sachs quantitative analyst with 12+ years in algorithmic trading',
    authorLinkedIn: 'https://linkedin.com/in/sarah-chen',
    email: 'sarah.chen@emaxprotocol.com',
    date: 'January 15, 2024',
    lastUpdated: 'December 15, 2024',
    readTime: '8 min',
    category: 'Education',
    keywords: ['algorithmic trading', 'crypto trading', 'automated trading', 'fintech'],
  },
  'how-crypto-arbitrage-works': {
    id: 'how-crypto-arbitrage-works',
    title: 'How Crypto Arbitrage Works',
    description: 'Understanding arbitrage opportunities in cryptocurrency markets and how algorithmic systems identify profitable price discrepancies.',
    content: `Arbitrage is one of the oldest and most fundamental trading strategies in finance. In cryptocurrency markets, arbitrage opportunities often exist due to price inefficiencies across exchanges and markets.

## What is Arbitrage?

Arbitrage involves simultaneously buying and selling the same asset in different markets to profit from price differences. In cryptocurrency, this might mean buying Bitcoin on one exchange where it's trading at $45,000 and selling it on another where it's $45,500.

## Types of Crypto Arbitrage

**Exchange Arbitrage**: Exploiting price differences between cryptocurrency exchanges
**Cross-Market Arbitrage**: Trading price differences for the same crypto across different markets
**Statistical Arbitrage**: Using mathematical models to identify mispriced relationships between assets

## How Algorithmic Systems Find Opportunities

Modern algorithms continuously monitor prices across multiple exchanges, calculating potential profit opportunities after accounting for transaction fees and transfer costs. When opportunities exceed the cost threshold, the system automatically executes the trades.

## Challenges and Considerations

While arbitrage sounds risk-free, several factors affect real-world implementation:
- Transfer delays and network congestion
- Exchange fees and withdrawal costs
- Market volatility during execution
- Liquidity constraints

## The Future of Crypto Arbitrage

As markets mature and become more efficient, arbitrage opportunities diminish. However, emerging markets and new trading pairs continue to create opportunities for well-positioned traders.`,
    author: 'Elena Rodriguez',
    authorBio: 'Blockchain security expert with 15 years in financial systems security',
    authorLinkedIn: 'https://linkedin.com/in/elena-rodriguez',
    email: 'elena.rodriguez@emaxprotocol.com',
    date: 'January 12, 2024',
    lastUpdated: 'December 12, 2024',
    readTime: '10 min',
    category: 'Education',
    keywords: ['crypto arbitrage', 'trading', 'price discrepancies'],
  },
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug]
  if (!post) return { title: 'Not Found' }

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
    },
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug]

  if (!post) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 justify-center">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleSchema(post.title, post.description, post.author, post.date, post.lastUpdated)
          ),
        }}
      />

      <article className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/blog" className="text-blue-600 hover:text-blue-700 flex items-center gap-2 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <div className="mb-8">
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{post.description}</p>

            {/* Author Card */}
            <Card className="mb-8">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">About the Author</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{post.author}</p>
                    <p className="text-sm text-gray-600 mb-3">{post.authorBio}</p>
                    <div className="flex gap-3">
                      <a
                        href={`mailto:${post.email}`}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                      >
                        <Mail className="w-4 h-4" />
                        Email
                      </a>
                      <a
                        href={post.authorLinkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meta Information */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600 pb-8 border-b">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Published: {post.date}
              </span>
              <span className="flex items-center gap-2 text-blue-600 font-semibold">
                <Calendar className="w-4 h-4" />
                Updated: {post.lastUpdated}
              </span>
              <span>{post.readTime} read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {post.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('##')) {
                return (
                  <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                    {paragraph.replace('## ', '')}
                  </h2>
                )
              }
              if (paragraph.startsWith('###')) {
                return (
                  <h3 key={idx} className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                )
              }
              if (paragraph.startsWith('-')) {
                return (
                  <ul key={idx} className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                    {paragraph
                      .split('\n')
                      .map((item, i) => (
                        <li key={i}>{item.replace('- ', '')}</li>
                      ))}
                  </ul>
                )
              }
              if (paragraph.match(/^\d+\./)) {
                return (
                  <ol key={idx} className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
                    {paragraph
                      .split('\n')
                      .map((item, i) => (
                        <li key={i}>{item.replace(/^\d+\.\s?/, '')}</li>
                      ))}
                  </ol>
                )
              }
              return (
                <p key={idx} className="text-gray-700 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              )
            })}
          </div>

          {/* Keywords */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {post.keywords.map((keyword) => (
                <span key={keyword} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Related Links */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Want to learn more?</h3>
            <p className="text-gray-600 mb-4">Explore our platform and discover how algorithmic trading can work for you.</p>
            <Link href="/how-it-works" className="text-blue-600 hover:text-blue-700 font-semibold">
              See How It Works →
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
