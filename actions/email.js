"use server";
import { Resend } from "resend";
import { capitalizeFirstLetter } from "@/helpers/capitalizeFirstLetter";

const resend = new Resend(process.env.RESEND_API_KEY);

const CRM_LEAD_URL =
  process.env.CRM_LEAD_URL ||
  "https://api.workmonk.io/api/people-api/create-from-homebaba/";
const CRM_SENDER_EMAIL = process.env.CRM_SENDER_EMAIL || "info@bizmonk.ca";

function splitFullName(fullName) {
  if (!fullName || typeof fullName !== "string") {
    return { firstName: "", lastName: "" };
  }
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

async function sendLeadToCrm({ content, title, contentArray }) {
  try {
    const safeContent = content && typeof content === "object" ? content : {};

    const email = safeContent.email || "";
    const phone = safeContent.phone || "";

    const { firstName, lastName } =
      safeContent.first_name || safeContent.last_name
        ? {
            firstName: safeContent.first_name || "",
            lastName: safeContent.last_name || "",
          }
        : splitFullName(safeContent.name || "");

    const message =
      safeContent.message ||
      [title ? `Title: ${title}` : null, ...contentArray]
        .filter(Boolean)
        .join("\n");

    if (!email && !phone && !firstName && !lastName) {
      return { success: false, skipped: true, reason: "empty_lead" };
    }

    const crmData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      message,
      sender_email: CRM_SENDER_EMAIL,
    };

    const response = await fetch(CRM_LEAD_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(crmData),
      signal: AbortSignal.timeout(30_000),
    });

    if (response.ok) {
      return { success: true, status: response.status };
    }

    const responseText = await response.text().catch(() => "");
    console.error("CRM lead send failed:", response.status, responseText);
    return { success: false, status: response.status };
  } catch (err) {
    console.error("CRM lead send error:", err);
    return { success: false, error: err?.message || "crm_send_failed" };
  }
}

export const sendEmail = async ({ content, title = null }) => {
  const contentArray = [];

  if (content && typeof content === "object") {
    for (const [key, value] of Object.entries(content)) {
      if (key && value) {
        contentArray.push(`${capitalizeFirstLetter(key)}: ${value}`);
      }
    }
  }

  const crmPromise = sendLeadToCrm({ content, title, contentArray });

  const { data, error } = await resend.emails.send({
    from: "info@homebaba.ca",
    to: ["info@bizmonk.ca"],
    subject: title || "Bizmonk Inquiry",
    html: `<h1>${title || "Bizmonk Inquiry"}</h1><br/><ul>${contentArray
      .map((val) => `<li>${val}</li>`)
      .join("\n")}</ul>`,
  });

  const crmResult = await crmPromise;

  if (error) {
    console.error("Resend Error:", error);
    return { success: false, error, crm: crmResult };
  }

  return { success: true, data, crm: crmResult };
};
