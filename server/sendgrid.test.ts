import { describe, it, expect } from "vitest";
import sgMail from "@sendgrid/mail";

describe("SendGrid Configuration", () => {
  it("should have SENDGRID_API_KEY configured", () => {
    const apiKey = process.env.SENDGRID_API_KEY;
    expect(apiKey).toBeDefined();
    expect(apiKey).toMatch(/^SG\./);
  });

  it("should validate SendGrid API key format", () => {
    const apiKey = process.env.SENDGRID_API_KEY;
    // SendGrid API keys start with "SG." and are followed by base64 characters
    const isValidFormat = /^SG\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(
      apiKey || ""
    );
    expect(isValidFormat).toBe(true);
  });

  it("should set API key without errors", () => {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (apiKey) {
      expect(() => {
        sgMail.setApiKey(apiKey);
      }).not.toThrow();
    }
  });
});
