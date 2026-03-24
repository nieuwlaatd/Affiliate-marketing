const BREVO_API_URL = "https://api.brevo.com/v3";

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

export function welcomeEmailHtml(displayName: string): string {
  return `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F2EFE6; padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 24px; font-weight: bold; color: #5A7A48;">HARKUHH</span>
      </div>
      <div style="background-color: #FAF8F2; border-radius: 12px; padding: 32px; border: 1px solid #D8D3C4;">
        <h1 style="color: #1C1E18; font-size: 20px; margin: 0 0 12px;">Welkom bij Harkuhh, ${displayName}!</h1>
        <p style="color: #7A8270; font-size: 14px; line-height: 1.6;">
          Bedankt voor je registratie. Bij Harkuhh vind je alle werkende kortingscodes op één rustige plek.
        </p>
        <p style="color: #7A8270; font-size: 14px; line-height: 1.6;">
          Zo werkt het:
        </p>
        <ul style="color: #7A8270; font-size: 14px; line-height: 1.8;">
          <li>Zoek een kortingscode bij het afrekenen</li>
          <li>Sla je favoriete deals op met het hartje</li>
          <li>Ontvang meldingen als deals bijna verlopen</li>
        </ul>
        <a href="https://harkuhh.vercel.app/deals" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background-color: #5A7A48; color: white; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 500;">
          Bekijk deals
        </a>
      </div>
      <p style="text-align: center; color: #7A8270; font-size: 12px; margin-top: 24px;">
        Je ontvangt deze e-mail omdat je een account hebt aangemaakt bij Harkuhh.
      </p>
    </div>
  `;
}

export function newDealEmailHtml(brand: string, product: string, discount: string, slug: string): string {
  return `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F2EFE6; padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 24px; font-weight: bold; color: #5A7A48;">HARKUHH</span>
      </div>
      <div style="background-color: #FAF8F2; border-radius: 12px; padding: 32px; border: 1px solid #D8D3C4;">
        <h1 style="color: #1C1E18; font-size: 20px; margin: 0 0 12px;">Nieuwe deal: ${brand}</h1>
        <p style="color: #1C1E18; font-size: 24px; font-weight: bold; margin: 8px 0;">${discount}</p>
        <p style="color: #7A8270; font-size: 14px;">${product}</p>
        <a href="https://harkuhh.vercel.app/deal/${slug}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background-color: #5A7A48; color: white; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 500;">
          Bekijk deal
        </a>
      </div>
      <p style="text-align: center; color: #7A8270; font-size: 12px; margin-top: 24px;">
        <a href="https://harkuhh.vercel.app/account" style="color: #7A8270;">E-mail voorkeuren beheren</a> · <a href="https://harkuhh.vercel.app" style="color: #7A8270;">Uitschrijven</a>
      </p>
    </div>
  `;
}

export function weeklyDigestEmailHtml(deals: { brand: string; discount: string; slug: string }[]): string {
  const dealListHtml = deals
    .map(
      (d) =>
        `<li style="padding: 8px 0; border-bottom: 1px solid #D8D3C4;">
          <a href="https://harkuhh.vercel.app/deal/${d.slug}" style="color: #1C1E18; text-decoration: none; font-weight: 500;">${d.brand}</a>
          <span style="color: #5A7A48; font-weight: bold; margin-left: 8px;">${d.discount}</span>
        </li>`
    )
    .join("");

  return `
    <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F2EFE6; padding: 32px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 24px; font-weight: bold; color: #5A7A48;">HARKUHH</span>
      </div>
      <div style="background-color: #FAF8F2; border-radius: 12px; padding: 32px; border: 1px solid #D8D3C4;">
        <h1 style="color: #1C1E18; font-size: 20px; margin: 0 0 16px;">Wekelijkse deals overzicht</h1>
        <ul style="list-style: none; padding: 0; margin: 0;">${dealListHtml}</ul>
        <a href="https://harkuhh.vercel.app/deals" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background-color: #5A7A48; color: white; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 500;">
          Bekijk alle deals
        </a>
      </div>
      <p style="text-align: center; color: #7A8270; font-size: 12px; margin-top: 24px;">
        <a href="https://harkuhh.vercel.app/account" style="color: #7A8270;">E-mail voorkeuren beheren</a> · <a href="https://harkuhh.vercel.app" style="color: #7A8270;">Uitschrijven</a>
      </p>
    </div>
  `;
}
