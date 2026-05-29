import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Important disclaimers about the information, reviews, and recommendations on Best Bike For Me.',
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Disclaimer</h1>
        <p className="text-sm text-[var(--muted)] mb-10">Last updated: May 29, 2026</p>

        <div className="prose-bbfm">
          <p>
            The information on bestbikeforme.com ("the Site") is provided for general informational purposes only. By using the Site, you acknowledge and agree to the following.
          </p>

          <h2>Not professional advice</h2>
          <p>
            The content on this Site does not constitute professional, financial, medical, legal, or safety advice. Our e-bike reviews, scores, and recommendations are based on our own research methodology and should be treated as opinions, not definitive guidance. Always consult with qualified professionals and do your own research before making purchasing decisions.
          </p>

          <h2>Product information accuracy</h2>
          <p>
            We source product specifications, pricing, and availability from manufacturer websites, product listings, and publicly available data. While we strive to keep this information accurate and up to date:
          </p>
          <ul>
            <li>Manufacturers may change specifications, pricing, or availability at any time without notifying us</li>
            <li>Prices displayed on our site may differ from the current price at the retailer</li>
            <li>Product images are provided by the manufacturers and may not exactly represent the product you receive</li>
            <li>Errors and omissions may occur despite our best efforts</li>
          </ul>
          <p>
            <strong>Always verify specifications and pricing directly with the retailer or manufacturer before purchasing.</strong>
          </p>

          <h2>Range and performance estimates</h2>
          <p>
            The range, speed, and performance figures on our site come from two sources: the manufacturer's claimed specifications and our own practical estimates. Both are approximations. Actual performance depends on many variables including:
          </p>
          <ul>
            <li>Rider weight and cargo load</li>
            <li>Terrain and elevation changes</li>
            <li>Wind conditions and temperature</li>
            <li>Assist level and riding style</li>
            <li>Tire pressure and condition</li>
            <li>Battery age and health</li>
          </ul>
          <p>
            Our "practical range" estimates are educated guesses based on available data. They are not guarantees of the range you will experience.
          </p>

          <h2>Scores and rankings</h2>
          <p>
            Our scoring system evaluates e-bikes across multiple criteria including range, power, comfort, build quality, versatility, and value. These scores represent our assessment based on available data and are inherently subjective. Different riders with different needs may disagree with our rankings, and that is expected.
          </p>
          <p>
            We update scores periodically as new information becomes available, but scores may not always reflect the latest product updates or firmware changes from the manufacturer.
          </p>

          <h2>Third-party websites</h2>
          <p>
            Our site contains links to third-party websites, including retailer and manufacturer sites. We have no control over the content, privacy practices, or availability of these external sites. Linking to a third-party site does not imply endorsement of that site's content or practices beyond the specific product being referenced.
          </p>
          <p>
            When you leave our site through an affiliate or external link, you are subject to the terms and privacy policies of the destination site. See our <Link href="/affiliate-disclosure">Affiliate Disclosure</Link> for details on how affiliate links work.
          </p>

          <h2>Safety</h2>
          <p>
            Electric bikes are vehicles that can reach speeds of 20 to 28 mph. Riding an e-bike involves inherent risks including the risk of injury or death. We strongly recommend:
          </p>
          <ul>
            <li>Always wearing a properly fitted helmet</li>
            <li>Following local traffic laws and e-bike regulations</li>
            <li>Inspecting your e-bike before each ride</li>
            <li>Not exceeding the manufacturer's recommended weight limits</li>
            <li>Adjusting your riding for weather and road conditions</li>
          </ul>
          <p>
            Nothing on this Site should be interpreted as encouraging unsafe riding practices. We are not liable for any injuries, accidents, or damages resulting from the use of products featured on this Site.
          </p>

          <h2>No guarantees</h2>
          <p>
            We do not guarantee that:
          </p>
          <ul>
            <li>The information on the Site is complete, accurate, or current at all times</li>
            <li>The Site will be available without interruption</li>
            <li>Any e-bike we recommend will meet your specific needs or expectations</li>
            <li>Affiliate links will always lead to available products or current pricing</li>
          </ul>

          <h2>Limitation of liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Best Bike For Me, its owners, and contributors shall not be held liable for any damages, losses, or expenses arising from your use of or reliance on the information provided on this Site, including but not limited to purchasing decisions made based on our content.
          </p>

          <h2>Changes</h2>
          <p>
            We may update this Disclaimer at any time. Changes take effect when posted on this page. The "Last updated" date at the top indicates the most recent revision.
          </p>

          <h2>Contact</h2>
          <p>
            If you have questions about this Disclaimer, reach out to us at:
          </p>
          <p>
            <strong>Email:</strong> legal@bestbikeforme.com
          </p>
          <p>
            See also: <Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms of Service</Link> · <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
