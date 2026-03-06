import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Eye, CheckCircle, Server, Key } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crypto Platform Security Standards | Emax Protocol',
  description:
    'Enterprise-grade security architecture for digital asset protection. Learn about our encryption, multi-layer access control, cold storage, and third-party audits.',
  openGraph: {
    title: 'Crypto Platform Security Standards',
    description: 'Comprehensive security measures protecting digital assets and user data.',
  },
}

export default function SecurityPage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex flex-col lg:flex-row justify-center mb-4">
              <Shield className="w-16 h-16 text-green-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Crypto Platform Security Standards</h1>
            <p className="text-xl text-gray-600">
              Enterprise-grade infrastructure protecting digital assets through multi-layer security architecture
            </p>
            <p className="text-sm text-gray-500 mt-4">Last Updated: December 2024</p>
          </div>
        </div>
      </section>

      {/* Security Framework Overview */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Security Architecture</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Authentication */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-center mb-2">
                  <Key className="w-6 h-6 text-blue-600 mr-3" />
                  <CardTitle>Encrypted User Authentication</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Multi-factor authentication (MFA) including:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Email verification</li>
                  <li>• SMS/TOTP-based second factor</li>
                  <li>• Biometric authentication support</li>
                  <li>• Session-based access tokens</li>
                </ul>
              </CardContent>
            </Card>

            {/* Access Control */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-center mb-2">
                  <Lock className="w-6 h-6 text-purple-600 mr-3" />
                  <CardTitle>Multi-Layer Access Control</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Role-based security architecture:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• User-level permission restrictions</li>
                  <li>• IP whitelisting capabilities</li>
                  <li>• Device fingerprinting</li>
                  <li>• Suspicious activity monitoring</li>
                </ul>
              </CardContent>
            </Card>

            {/* Wallet Security */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-center mb-2">
                  <Server className="w-6 h-6 text-indigo-600 mr-3" />
                  <CardTitle>Secure Wallet Infrastructure</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Digital asset protection measures:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Cold storage for majority of funds</li>
                  <li>• Hardware wallet integration</li>
                  <li>• Automated withdrawal limits</li>
                  <li>• Fund segregation protocols</li>
                </ul>
              </CardContent>
            </Card>

            {/* Transaction Security */}
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-center mb-2">
                  <Eye className="w-6 h-6 text-green-600 mr-3" />
                  <CardTitle>Transaction Verification</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Blockchain transaction security:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Multi-signature approval chains</li>
                  <li>• Blockchain network verification</li>
                  <li>• Transaction reversal protection</li>
                  <li>• Smart contract audit trails</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Data Protection Standards</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex flex-col lg:flex-row items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Encryption Standards
              </h3>
              <p className="text-gray-600 mb-4">
                All data transmission and storage utilizes enterprise-grade encryption:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li><strong>• In Transit:</strong> TLS 1.3 for all API communications</li>
                <li><strong>• At Rest:</strong> AES-256 encryption for sensitive data</li>
                <li><strong>• Key Management:</strong> Hardware security modules for encryption key storage</li>
                <li><strong>• End-to-End:</strong> User data encrypted beyond platform visibility</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex flex-col lg:flex-row items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Continuous System Monitoring
              </h3>
              <p className="text-gray-600 mb-4">
                24/7 operational oversight and threat detection:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Real-time intrusion detection systems</li>
                <li>• Anomaly detection and behavioral analysis</li>
                <li>• Security information and event management (SIEM)</li>
                <li>• Automated incident response protocols</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex flex-col lg:flex-row items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Infrastructure Security
              </h3>
              <p className="text-gray-600 mb-4">
                Enterprise-grade technical infrastructure:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Distributed data center architecture</li>
                <li>• DDoS protection and mitigation</li>
                <li>• Load balancing and redundancy</li>
                <li>• Regular backup and disaster recovery procedures</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Audits */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Third-Party Verification</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">SOC 2 Type II Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Annual assessment of security, availability, processing integrity, confidentiality, and privacy controls.
                </p>
                <p className="text-sm text-gray-500">Last audit: [Year] - Verified by Big 4 accounting firm</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ISO 27001 Certification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  International information security management system standard compliance with annual recertification.
                </p>
                <p className="text-sm text-gray-500">Certification valid through [Year]</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Smart Contract Audits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Independent security audits of all smart contracts by leading blockchain security firms (CertiK, SlowMist).
                </p>
                <p className="text-sm text-gray-500">Audit reports available upon request</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Penetration Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Regular penetration testing and vulnerability assessments by independent security researchers.
                </p>
                <p className="text-sm text-gray-500">Quarterly assessment cycles</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Insurance & Coverage */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Fund Protection Coverage</h2>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Insurance Program</h3>
            <p className="text-gray-600 mb-4">
              User funds are protected through comprehensive insurance coverage including:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• Cybersecurity breach coverage</li>
              <li>• Digital asset theft protection</li>
              <li>• Institutional custody insurance</li>
              <li>• Errors and omissions coverage</li>
            </ul>
          </div>

          <p className="text-gray-600 border-l-4 border-orange-400 pl-6 py-4 bg-orange-50">
            While comprehensive security and insurance protect user assets, no system is 100% immune to sophisticated attacks or unforeseen circumstances. We encourage users to implement additional personal security measures (strong passwords, device security, careful login practices).
          </p>
        </div>
      </section>

      {/* Security Best Practices */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">User Security Recommendations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">✓ Enable 2FA/MFA</h3>
              <p className="text-gray-600 text-sm">
                Always activate multi-factor authentication for additional account protection.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">✓ Strong Passwords</h3>
              <p className="text-gray-600 text-sm">
                Use complex, unique passwords and consider password managers for security.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">✓ Phishing Awareness</h3>
              <p className="text-gray-600 text-sm">
                Verify URLs, never click suspicious links, and confirm requests directly with support.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">✓ Device Security</h3>
              <p className="text-gray-600 text-sm">
                Keep devices updated, use antivirus software, and avoid public WiFi for sensitive activities.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">✓ Withdrawal Limits</h3>
              <p className="text-gray-600 text-sm">
                Set withdrawal limits and whitelist addresses to prevent unauthorized transfers.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-4">✓ Regular Monitoring</h3>
              <p className="text-gray-600 text-sm">
                Regularly review account activity and transaction history for suspicious activity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 mb-6">
            Questions about security? Contact our compliance team for detailed information.
          </p>
          <a href="/compliance" className="text-blue-600 hover:text-blue-700 font-semibold">
            View Compliance Documentation →
          </a>
        </div>
      </section>
    </div>
  )
}
