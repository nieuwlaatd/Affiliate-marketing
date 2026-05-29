import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Best Bike For Me collects, uses, and protects your personal information.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full bg-[var(--background)] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Privacy Policy</h1>
        <p className="text-sm text-[var(--muted)] mb-10">Last updated: May 29, 2026</p>

        <div className="prose-bbfm">
          <p>
            Best Bike For Me ("we", "us", "our") operates the website bestbikeforme.com. This Privacy Policy explains what information we collect, how we use it, and what choices you have.
          </p>

          <h2>Information we collect</h2>

          <h3>Information you provide</h3>
          <p>
            <strong>Email address.</strong> If you subscribe to our newsletter or take the Find My E-Bike quiz and choose to receive results by email, we collect your email address. We store this in our database (hosted on Supabase) and use it solely to send you the content you requested.
          </p>
          <p>
            <strong>Quiz responses.</strong> When you use our e-bike finder quiz, your answers (terrain, budget, riding style, height preference) are used in real time to generate personalized results. We do not store your individual quiz responses in a way that is linked to your identity.
          </p>

          <h3>Information collected automatically</h3>
          <p>
            <strong>Cookies.</strong> We use a small number of cookies to operate the site:
          </p>
          <ul>
            <li><strong>Session cookies</strong> (Supabase): used to maintain your session if you interact with features that require it. These are essential for the site to function.</li>
            <li><strong>Theme preference:</strong> we store your light/dark mode choice in your browser's local storage (not a cookie). This never leaves your device.</li>
          </ul>
          <p>
            We do not use Google Analytics, Facebook Pixel, or any third-party tracking scripts at this time. If we add analytics in the future, we will update this policy and notify subscribers.
          </p>

          <h3>Affiliate link interactions</h3>
          <p>
            When you click a "Check best price" or similar link on a product page, you are redirected to the e-bike brand's website through an affiliate link. The affiliate network (such as ShareASale or AvantLink) may place a cookie on your device to track whether a purchase was made. This cookie is set by the affiliate network or the brand, not by us. We receive a commission if you make a purchase, but we never see your payment details, order information, or personal data from that transaction.
          </p>
          <p>
            For more details on how affiliate links work, see our <Link href="/affiliate-disclosure">Affiliate Disclosure</Link>.
          </p>

          <h2>How we use your information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Send you newsletter emails with e-bike deals and content (if you subscribed)</li>
            <li>Send you personalized quiz results by email (if you opted in)</li>
            <li>Operate and improve the website</li>
          </ul>
          <p>
            We do not sell, rent, or share your email address with third parties for their marketing purposes.
          </p>

          <h2>Email service provider</h2>
          <p>
            We use Brevo (formerly Sendinblue) to send transactional and newsletter emails. When you provide your email address, it is shared with Brevo solely for the purpose of delivering emails on our behalf. Brevo processes this data under their own privacy policy, which you can review on their website.
          </p>

          <h2>Data storage and security</h2>
          <p>
            Your data is stored on Supabase, which uses industry-standard encryption and security practices. We take reasonable measures to protect your information, but no method of electronic storage is 100% secure.
          </p>

          <h2>Your rights and choices</h2>
          <ul>
            <li><strong>Unsubscribe:</strong> every email we send includes an unsubscribe link. Click it and you will be removed from our mailing list.</li>
            <li><strong>Delete your data:</strong> you can request deletion of your email address and any associated data by emailing us at the address below. We will process your request within 30 days.</li>
            <li><strong>Access your data:</strong> you can request a copy of the data we hold about you by contacting us.</li>
          </ul>

          <h2>Children's privacy</h2>
          <p>
            Best Bike For Me is not directed at children under 16. We do not knowingly collect personal information from children. If you believe a child has provided us with their information, please contact us and we will delete it.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make significant changes, we will update the "Last updated" date at the top of this page. We encourage you to review this page periodically.
          </p>

          <h2>Contact us</h2>
          <p>
            If you have questions about this Privacy Policy or want to exercise your data rights, contact us at:
          </p>
          <p>
            <strong>Email:</strong> privacy@bestbikeforme.com
          </p>
        </div>
      </div>
    </div>
  );
}
