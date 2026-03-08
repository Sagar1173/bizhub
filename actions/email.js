"use server";
import { Resend } from "resend";
import { capitalizeFirstLetter } from "@/helpers/capitalizeFirstLetter";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ content, title = null }) => {
  const contentArray = [];

  if (content && typeof content === "object") {
    for (const [key, value] of Object.entries(content)) {
      if (key && value) {
        contentArray.push(`${capitalizeFirstLetter(key)}: ${value}`);
      }
    }
  }

  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev", // Default while testing, should be info@homebaba.ca in production if domain is verified
    to: ["info@bizmonk.ca"],
    subject: title || "Bizmonk Inquiry",
    html: `<h1>${title || "Bizmonk Inquiry"}</h1><br/><ul>${contentArray
      .map((val) => `<li>${val}</li>`)
      .join("\n")}</ul>`,
  });

  if (error) {
    console.error("Resend Error:", error);
    return { success: false, error };
  }

  return { success: true, data };
};
