export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Emax Protocol",
  "url": "https://emaxprotocol.com",
  "logo": "https://emaxprotocol.com/logo.png",
  "description": "Automated cryptocurrency trading platform with algorithmic execution and risk management",
  "foundingDate": "2023-03-15",
  "foundingLocation": "Wilmington, Delaware",
  "legalName": "Emax Protocol Inc.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Financial District, Suite 500",
    "addressLocality": "Wilmington",
    "addressRegion": "DE",
    "postalCode": "19801",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Compliance Support",
    "email": "compliance@emaxprotocol.com",
    "telephone": "+1-800-EMAX-PROTOCOL"
  },
  "sameAs": [
    "https://linkedin.com/company/emax-protocol",
    "https://twitter.com/emaxprotocol"
  ]
}

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is cryptocurrency trading risky?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Cryptocurrency trading carries substantial risk of loss. You may lose your entire investment. Always only invest what you can afford to lose."
      }
    },
    {
      "@type": "Question",
      "name": "What is algorithmic trading?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Algorithmic trading uses automated systems to analyze market conditions and execute trades based on predefined strategies without emotional decision-making."
      }
    },
    {
      "@type": "Question",
      "name": "Is Emax Protocol regulated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Emax Protocol Inc. is registered with the SEC (Form ADV ID 173846) and operates under Delaware corporate law with full compliance documentation."
      }
    }
  ]
}

export const articleSchema = (title: string, description: string, author: string, datePublished: string, dateModified: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "author": {
    "@type": "Person",
    "name": author
  },
  "datePublished": datePublished,
  "dateModified": dateModified,
  "publisher": {
    "@type": "Organization",
    "name": "Emax Protocol",
    "logo": {
      "@type": "ImageObject",
      "url": "https://emaxprotocol.com/logo.png"
    }
  }
})

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
})
