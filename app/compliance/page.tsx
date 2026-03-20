import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, FileText, Users, Scale, Building2 } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Compliance & Legal Information | Emax Protocol',
  description:
    'Complete compliance documentation including KYC procedures, AML policies, terms of service, and regulatory licensing information for digital asset trading.',
  openGraph: {
    title: 'Compliance & Legal Information',
    description: 'Full regulatory and legal framework documentation.',
  },
}

export default function CompliancePage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex flex-col lg:flex-row justify-center mb-4">
              <Building2 className="w-16 h-16 text-indigo-600" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Compliance & Legal Framework</h1>
            <p className="text-xl text-gray-600">
              Comprehensive regulatory and legal documentation ensuring transparent operations and user protection
            </p>
            <p className="text-sm text-gray-500 mt-4">Last Updated: December 2024</p>
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Company Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legal Entity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Registered Company Name:</strong> Emax Protocol Inc.</p>
                <p><strong>Legal Structure:</strong> Delaware Registered Investment Company</p>
                <p><strong>Incorporation Date:</strong> March 15, 2023</p>
                <p><strong>Delaware Registration Number:</strong> 3927453-DEL</p>
                <p className="text-xs text-gray-500 mt-3">Registered with Delaware Division of Corporations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Jurisdiction & Licensing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Primary Jurisdiction:</strong> United States (Delaware)</p>
                <p><strong>Regulatory Authority:</strong> Securities and Exchange Commission (SEC)</p>
                <p><strong>License Number:</strong> SEC Form ADV ID 173846</p>
                <p><strong>License Status:</strong> Active & Compliant</p>
                <p className="text-xs text-blue-600 mt-2 font-semibold">
                  <a href="#" className="hover:underline">View SEC Registration</a>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Physical Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Registered Office:</strong> 123 Financial District, Suite 500</p>
                <p>Wilmington, Delaware 19801, USA</p>
                <p><strong>Email:</strong> compliance@emaxprotocol.com</p>
                <p><strong>Phone:</strong> +1-800-EMAX-PROTOCOL</p>
                <p><strong>Support Hours:</strong> 24/7 Year-Round</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leadership & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Chief Executive Officer:</strong> Dr. Marcus Sullivan</p>
                <p className="text-sm text-gray-600">20+ years in digital asset management</p>
                <p><strong>Chief Compliance Officer:</strong> Jennifer Morrison</p>
                <p className="text-sm text-gray-600">Former SEC regulatory counsel</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* KYC & AML Procedures */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Know Your Customer (KYC) Procedures</h2>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <CardTitle>User Verification Requirements</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  All users must complete verification before account activation and trading initiation:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>• Identity Verification:</strong> Government-issued ID (passport, driver's license, national ID)</li>
                  <li><strong>• Proof of Address:</strong> Recent utility bill or official government document</li>
                  <li><strong>• Source of Funds:</strong> Declaration of fund origin for accounts above thresholds</li>
                  <li><strong>• Beneficial Ownership:</strong> Disclosure of ultimate beneficial ownership for entities</li>
                  <li><strong>• Occupational Information:</strong> Employment status and industry classification</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-center gap-2">
                  <Scale className="w-5 h-5 text-purple-600" />
                  <CardTitle>Anti-Money Laundering (AML) Compliance</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Emax Protocol implements comprehensive AML procedures including:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>• Sanctions Screening:</strong> Automated checks against OFAC, UN, and other sanction lists</li>
                  <li><strong>• Transaction Monitoring:</strong> Real-time analysis of user activity for suspicious patterns</li>
                  <li><strong>• Risk Assessment:</strong> Ongoing evaluation of user risk profiles based on activity</li>
                  <li><strong>• Reporting Requirements:</strong> Suspicious activity reports filed with appropriate authorities</li>
                  <li><strong>• Enhanced Due Diligence:</strong> Additional verification for high-risk users or large transactions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ongoing Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  User accounts are subject to continuous monitoring for compliance with AML/KYC requirements. Suspicious activities trigger immediate investigation and potential account restrictions or closure. We cooperate fully with law enforcement and regulatory authorities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Legal Documents */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Legal Documents</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <CardTitle className="text-lg">Terms of Service</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Complete terms governing user access and use of the Emax Protocol platform, including rights, obligations, and limitations.
                </p>
                <a href="/terms" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  Read Full Terms →
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <CardTitle className="text-lg">Privacy Policy</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Detailed explanation of data collection, processing, storage, and protection practices. GDPR and CCPA compliant.
                </p>
                <a href="/privacy" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  Read Privacy Policy →
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-lg">Cookie Policy</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Information on cookie usage, tracking technologies, and user preferences for cookie management.
                </p>
                <a href="/cookies" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  View Cookie Policy →
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-lg">Risk Disclosure</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Comprehensive warnings about cryptocurrency trading risks and important disclaimers.
                </p>
                <a href="/risk-disclosure" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                  View Risk Disclosure →
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Regulatory Compliance */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Regulatory Compliance Standards</h2>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <CardTitle>Regulatory Framework</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Emax Protocol operates in compliance with applicable financial regulations including:
                </p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Money Services Businesses (MSB) regulations where applicable</li>
                  <li>• State money transmitter licenses and requirements</li>
                  <li>• FinCEN guidance on virtual asset service providers</li>
                  <li>• OFAC sanctions compliance and restrictions</li>
                  <li>• Securities laws for investment-related products</li>
                  <li>• Consumer protection and data privacy regulations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regulatory Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  The company maintains comprehensive records and files required regulatory reports including:
                </p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>• Suspicious Activity Reports (SARs) to FinCEN</li>
                  <li>• Currency Transaction Reports (CTRs) as required</li>
                  <li>• Annual compliance certifications</li>
                  <li>• Regulatory inquiries and information requests</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Certification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  All employees undergo mandatory AML/KYC training. The Compliance Officer reports directly to executive leadership with full authority to implement policies and cooperate with regulators. Records are maintained for minimum periods as required by law.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Data Protection & Privacy Rights</h2>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">GDPR & CCPA Compliance</h3>
            <p className="text-gray-600 mb-4">
              Emax Protocol complies with international data protection standards including:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>• General Data Protection Regulation (GDPR) requirements</li>
              <li>• California Consumer Privacy Act (CCPA) user rights</li>
              <li>• Data subject access requests and responses</li>
              <li>• Data portability and deletion rights</li>
              <li>• Privacy by design principles</li>
            </ul>
          </div>

          <p className="text-gray-600 mb-6">
            Users have rights to access, correct, or delete personal data. Requests are processed within 30 days. No personal data is sold to third parties. Data retention policies limit storage to periods necessary for business and legal purposes.
          </p>
        </div>
      </section>

      {/* Dispute Resolution */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Dispute Resolution</h2>

          <Card>
            <CardHeader>
              <CardTitle>Complaint Procedures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Users can file complaints regarding platform operations or compliance matters:
              </p>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-600 mb-2">
                  <strong>Email:</strong> complaints@emaxprotocol.com
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Expected Response Time:</strong> 10 business days
                </p>
                <p className="text-gray-600">
                  <strong>Escalation:</strong> Unresolved complaints may be escalated to regulatory authorities or arbitration.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Regulatory Cooperation */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Regulatory Cooperation</h2>

          <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded">
            <p className="text-gray-700">
              Emax Protocol maintains transparent relationships with regulatory authorities. We cooperate fully with investigations, inquiries, and enforcement actions. The company may be subject to examinations, audits, and inquiries by financial regulators, tax authorities, and law enforcement.
            </p>
          </div>
        </div>
      </section>

      {/* Document Downloads */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Download Legal Documents</h2>

          <div className="space-y-3">
            <a href="#" className="flex flex-col lg:flex-row items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Full Terms of Service (PDF)</span>
            </a>
            <a href="#" className="flex flex-col lg:flex-row items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-gray-900">Privacy Policy (PDF)</span>
            </a>
            <a href="#" className="flex flex-col lg:flex-row items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
              <FileText className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-gray-900">Risk Disclosure Statement (PDF)</span>
            </a>
            <a href="#" className="flex flex-col lg:flex-row items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-gray-900">KYC/AML Policy (PDF)</span>
            </a>
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-12 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            Last Updated: January 2024 | All documents available for download and review
          </p>
        </div>
      </section>
    </div>
  )
}
