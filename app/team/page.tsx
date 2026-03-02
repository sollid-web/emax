'use client'

import Link from 'next/link'

export default function TeamPage() {
  const team = [
    {
      name: 'Dr. Marcus Sullivan',
      title: 'Chief Executive Officer',
      bio: '20+ years in digital asset management. Former head of algorithmic trading at Goldman Sachs. PhD in Computational Finance from Stanford University.',
      expertise: ['Algorithmic Trading', 'Risk Management', 'Blockchain Infrastructure'],
      linkedin: 'https://linkedin.com/in/marcus-sullivan'
    },
    {
      name: 'Jennifer Morrison',
      title: 'Chief Compliance Officer',
      bio: 'Former SEC regulatory counsel with 15 years in financial services compliance. Expert in cryptocurrency regulatory frameworks and AML/KYC procedures.',
      expertise: ['Regulatory Compliance', 'Risk Management', 'Legal Framework'],
      linkedin: 'https://linkedin.com/in/jennifer-morrison'
    },
    {
      name: 'Sarah Chen',
      title: 'Head of Quantitative Research',
      bio: 'Former Goldman Sachs quantitative analyst with 12+ years in algorithmic trading. Published research in computational finance and machine learning.',
      expertise: ['Algorithm Development', 'Data Analysis', 'Machine Learning'],
      linkedin: 'https://linkedin.com/in/sarah-chen'
    },
    {
      name: 'James Park',
      title: 'Head of Technology',
      bio: 'Senior AI specialist and data scientist. Previously led infrastructure at major crypto hedge fund. Expert in system architecture and scalability.',
      expertise: ['System Architecture', 'Machine Learning', 'Infrastructure'],
      linkedin: 'https://linkedin.com/in/james-park'
    },
    {
      name: 'Elena Rodriguez',
      title: 'Chief Security Officer',
      bio: 'Blockchain security expert with 15 years in financial systems security. Led security implementations at major crypto exchanges.',
      expertise: ['Cryptography', 'Network Security', 'Audit Standards'],
      linkedin: 'https://linkedin.com/in/elena-rodriguez'
    },
    {
      name: 'Michael Torres',
      title: 'Head of Risk Management',
      bio: 'Risk management director with former head experience at major trading firms. Specialist in portfolio optimization and drawdown mitigation.',
      expertise: ['Risk Modeling', 'Portfolio Management', 'Trading Strategy'],
      linkedin: 'https://linkedin.com/in/michael-torres'
    }
  ]

  return (
    <div className="pt-16 pb-16">
      <div className="container mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enterprise-grade expertise in algorithmic trading, compliance, security, and digital asset management.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {team.map((member, index) => (
            <div key={index} className="bg-white border rounded-lg p-8 hover:shadow-lg transition">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm text-blue-600 font-semibold">{member.title}</p>
              </div>
              <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                View LinkedIn Profile →
              </a>
            </div>
          ))}
        </div>

        {/* Values Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Transparency</h3>
              <p className="text-gray-600 text-sm">Full disclosure of risks, fees, and performance metrics without marketing hype.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Security First</h3>
              <p className="text-gray-600 text-sm">Enterprise-grade security standards and third-party audits to protect user assets.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Continuous Innovation</h3>
              <p className="text-gray-600 text-sm">Ongoing research and development to improve algorithms and risk management.</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">User-Centric Design</h3>
              <p className="text-gray-600 text-sm">Platform built around user needs with accessible education and 24/7 support.</p>
            </div>
          </div>
        </div>

        {/* Careers CTA */}
        <div className="text-center p-12 border rounded-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Team</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We're building the future of algorithmic cryptocurrency trading. If you're passionate about blockchain, quantitative finance, or security, we'd love to hear from you.
          </p>
          <a href="mailto:careers@emaxprotocol.com" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
            View Open Positions
          </a>
        </div>
      </div>
    </div>
  )
}
