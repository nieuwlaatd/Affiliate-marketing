import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using the Best Bike For Me website.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Terms of Service</h1>
        <p className="text-sm text-[var(--muted)] mb-10">Last updated: May 29, 2026</p>

        <div className="prose-bbfm">
          <p>
            These Terms of Service ("Terms") govern your use of bestbikeforme.com ("the Site"), operated by Best Bike For Me ("we", "us", "our"). By accessing or using the Site, you agree to be bound by these Terms. If you do not agree, please do not use the Site.
          </p>

          <h2>1. Use of the site</h2>
          <p>
            You may use the Site for personal, non-commercial purposes. You agree not to:
          </p>
          <ul>
            <li>Scrape, copy, or reproduce our content, scores, or data without written permission</li>
            <li>Use the Site in any way that could damage, disable, or impair its functionality</li>
            <li>Attempt to gain unauthorized access to any part of the Site or its systems</li>
            <li>Use automated tools (bots, scrapers, crawlers) to access the Site beyond what is permitted by our robots.txt</li>
          </ul>

          <h2>2. Content and accuracy</h2>
          <p>
            We do our best to provide accurate, up-to-date information about electric bikes, including specifications, pricing, and availability. However:
          </p>
          <ul>
            <li>Specifications and prices are sourced from manufacturers and may change without notice</li>
            <li>Our scores and rankings reflect our methodology at the time of publication and are opinions, not guarantees</li>
            <li>Real-world range, performance, and other metrics may vary based on riding conditions, rider weight, terrain, temperature, and other factors</li>
            <li>We are not responsible for errors or omissions in product information</li>
          </ul>
          <p>
            Always verify specifications and pricing directly with the manufacturer or retailer before making a purchase. See our <Link href="/disclaimer">Disclaimer</Link> for more details.
          </p>

          <h2>3. Affiliate links</h2>
          <p>
            The Site contains affiliate links to third-party retailers and brands. When you click these links and make a purchase, we may earn a commission at no additional cost to you. These affiliate relationships do not influence our rankings or recommendations. See our <Link href="/affiliate-disclosure">Affiliate Disclosure</Link> for full details.
          </p>
          <p>
            We are not responsible for the products, services, content, or practices of any third-party website you visit through our links. Your interactions with third-party sites are governed by their own terms and privacy policies.
          </p>

          <h2>4. Intellectual property</h2>
          <p>
            All content on the Site, including text, scoring methodology, design, logos, and graphics, is owned by Best Bike For Me or used with permission. Product images are the property of their respective brands and are used for informational and comparison purposes.
          </p>
          <p>
            You may share links to our content and quote short excerpts with attribution. You may not reproduce, distribute, or create derivative works from our content without written permission.
          </p>

          <h2>5. Newsletter and email</h2>
          <p>
            By subscribing to our newsletter or opting in to receive quiz results by email, you consent to receive emails from us. You can unsubscribe at any time using the link in any email. See our <Link href="/privacy">Privacy Policy</Link> for details on how we handle your data.
          </p>

          <h2>6. Disclaimer of warranties</h2>
          <p>
            The Site is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the Site will be uninterrupted, error-free, or free of harmful components.
          </p>

          <h2>7. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Best Bike For Me shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Site, including but not limited to damages from purchasing products through affiliate links.
          </p>
          <p>
            Our total liability for any claim related to the Site shall not exceed the amount you paid to us (if any) in the 12 months preceding the claim.
          </p>

          <h2>8. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Best Bike For Me, its owners, and contributors from any claims, damages, or expenses arising from your use of the Site or violation of these Terms.
          </p>

          <h2>9. Changes to these terms</h2>
          <p>
            We may update these Terms from time to time. The updated version will be indicated by the "Last updated" date at the top. Your continued use of the Site after changes are posted constitutes your acceptance of the revised Terms.
          </p>

          <h2>10. Governing law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of the United States. Any disputes arising from these Terms or your use of the Site shall be resolved in the courts of competent jurisdiction.
          </p>

          <h2>11. Contact</h2>
          <p>
            Questions about these Terms? Contact us at:
          </p>
          <p>
            <strong>Email:</strong> legal@bestbikeforme.com
          </p>
        </div>
      </div>
    </div>
  );
}
