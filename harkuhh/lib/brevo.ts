const BREVO_API_URL = "https://api.brevo.com/v3";

const SITE_URL = "https://harkuhh.vercel.app";

interface SendEmailParams {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
}

export async function sendEmail({ to, subject, htmlContent }: SendEmailParams) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("BREVO_API_KEY not set, skipping email");
    return null;
  }

  const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Harkuhh", email: "noreply@harkuhh.nl" },
      to,
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Brevo email error:", error);
    throw new Error(`Failed to send email: ${response.status}`);
  }

  return response.json();
}

function shell(inner: string, footer: string): string {
  return `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F2EFE6; padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 24px; font-weight: bold; color: #6E1E2C;">HARKUHH</span>
      </div>
      <div style="background-color: #FAF8F2; border-radius: 12px; padding: 32px; border: 1px solid #D8D3C4;">
        ${inner}
      </div>
      <p style="text-align: center; color: #7A8270; font-size: 12px; margin-top: 24px;">
        ${footer}
      </p>
    </div>
  `;
}

const PREFS_FOOTER = `<a href="${SITE_URL}/account" style="color: #7A8270;">Manage email preferences</a> · <a href="${SITE_URL}" style="color: #7A8270;">Unsubscribe</a>`;

export interface QuizResultBike {
  brand: string;
  model: string;
  price: number;
  slug: string;
  brandSlug: string;
  affiliateUrl: string;
  scoreOverall: number;
  whyMatch?: string;
}

/** Email sent immediately after a user completes the E-Bike Finder quiz. */
export function quizResultsEmailHtml(name: string | null, bikes: QuizResultBike[]): string {
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const cards = bikes
    .map(
      (b, i) => `
      <div style="border: 1px solid #D8D3C4; border-radius: 10px; padding: 16px; margin: 12px 0;">
        <p style="margin: 0 0 4px; color: #7A8270; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
          #${i + 1} match · ${b.brand}
        </p>
        <p style="margin: 0 0 6px; color: #1C1E18; font-size: 18px; font-weight: bold;">${b.model}</p>
        <p style="margin: 0 0 6px; color: #1C1E18; font-size: 16px;">$${b.price.toLocaleString("en-US")} · Score ${b.scoreOverall}/10</p>
        ${b.whyMatch ? `<p style="margin: 0 0 12px; color: #7A8270; font-size: 13px; line-height: 1.5;">${b.whyMatch}</p>` : ""}
        <a href="${b.affiliateUrl}" style="display: inline-block; padding: 10px 18px; background-color: #C8A24B; color: #2A1418; border-radius: 9999px; text-decoration: none; font-size: 13px; font-weight: 600;">
          Check price
        </a>
        <a href="${SITE_URL}/e-bikes/${b.brandSlug}/${b.slug}" style="display: inline-block; margin-left: 8px; padding: 10px 18px; border: 1px solid #6E1E2C; color: #6E1E2C; border-radius: 9999px; text-decoration: none; font-size: 13px; font-weight: 600;">
          Full review
        </a>
      </div>`
    )
    .join("");

  const inner = `
    <h1 style="color: #1C1E18; font-size: 20px; margin: 0 0 12px;">Your personalized top ${bikes.length} e-bikes</h1>
    <p style="color: #7A8270; font-size: 14px; line-height: 1.6;">
      ${greeting} based on your answers, these are the electric bikes that fit you best.
      Prices and availability can change — check the latest before you buy.
    </p>
    ${cards}
    <a href="${SITE_URL}/compare" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background-color: #C8A24B; color: #2A1418; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 500;">
      Compare these side by side
    </a>
  `;
  return shell(inner, `You received this email because you took the E-Bike Finder quiz on Harkuhh. ${PREFS_FOOTER}`);
}

export function welcomeEmailHtml(displayName: string): string {
  const inner = `
    <h1 style="color: #1C1E18; font-size: 20px; margin: 0 0 12px;">Welcome to Harkuhh, ${displayName}!</h1>
    <p style="color: #7A8270; font-size: 14px; line-height: 1.6;">
      Thanks for signing up. Harkuhh helps you find the right electric bike with data-driven
      comparisons and the best deals — all in one calm place.
    </p>
    <p style="color: #7A8270; font-size: 14px; line-height: 1.6;">Here's how to get started:</p>
    <ul style="color: #7A8270; font-size: 14px; line-height: 1.8;">
      <li>Take the 60-second quiz to get a personalized top 3</li>
      <li>Save your favorite bikes to compare them side by side</li>
      <li>Get notified when prices drop</li>
    </ul>
    <a href="${SITE_URL}/quiz" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background-color: #C8A24B; color: #2A1418; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 500;">
      Find My E-Bike
    </a>
  `;
  return shell(inner, "You received this email because you created an account at Harkuhh.");
}
