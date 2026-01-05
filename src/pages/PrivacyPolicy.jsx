import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to={createPageUrl("Home")}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <CardTitle className="text-3xl">Privacy Policy</CardTitle>
                <p className="text-blue-100 mt-2">Last updated: January 2, 2026</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 prose prose-lg max-w-none">
            <h2>1. Information We Collect</h2>
            <p>
              WanderSure collects information you provide directly to us, including:
            </p>
            <ul>
              <li>Account information (name, email address)</li>
              <li>Trip details (destinations, dates, booking information)</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Email confirmations (when you authorize Gmail access)</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and improve our travel monitoring services</li>
              <li>Send you real-time travel alerts and notifications</li>
              <li>Analyze travel risks and provide insurance recommendations</li>
              <li>Process payments for premium features</li>
              <li>Communicate with you about your account and services</li>
            </ul>

            <h2>3. Data Privacy Principles</h2>
            <p>WanderSure is committed to the following privacy principles:</p>
            <ul>
              <li><strong>Data Minimization:</strong> We collect only the data necessary to provide our services</li>
              <li><strong>Purpose Limitation:</strong> Your data is used solely for the purposes stated in this policy</li>
              <li><strong>Active-Trip Location Use Only:</strong> Location data is only used during active trips for risk monitoring</li>
              <li><strong>No Data Resale:</strong> We never sell your personal information to third parties</li>
              <li><strong>Transparent Processing:</strong> All risk assessments are explainable with clear reasoning</li>
            </ul>

            <h2>4. Information Sharing</h2>
            <p>
              We do not sell your personal information. We may share your information with:
            </p>
            <ul>
              <li>Service providers who assist in operating our platform</li>
              <li>Insurance providers when you request quotes (with your consent)</li>
              <li>Law enforcement when required by law</li>
            </ul>

            <h2>5. Gmail Access</h2>
            <p>
              When you authorize Gmail access, we only read travel confirmation emails to automatically extract booking details. We do not:
            </p>
            <ul>
              <li>Access or read non-travel related emails</li>
              <li>Store email contents beyond what's needed for parsing</li>
              <li>Share your email data with third parties</li>
              <li>Send emails on your behalf</li>
            </ul>

            <h2>6. Data Security & Integrity Controls</h2>
            <p>
              We implement industry-standard security measures to protect your information, including encryption, secure servers, and regular security audits. Additionally, our alert system incorporates:
            </p>
            <ul>
              <li><strong>Source Reliability Scoring:</strong> All data sources are evaluated for credibility</li>
              <li><strong>Multi-Source Confirmation:</strong> Critical alerts require confirmation from multiple sources</li>
              <li><strong>Confidence Thresholds:</strong> Alerts are only sent when confidence exceeds 60%</li>
              <li><strong>Deduplication:</strong> Prevents sending the same alert multiple times</li>
            </ul>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and download your data</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Opt-out of marketing communications</li>
              <li>Revoke Gmail authorization at any time</li>
            </ul>

            <h2>8. Data Retention</h2>
            <p>
              We retain your information for as long as your account is active or as needed to provide services. You may delete your account at any time.
            </p>

            <h2>9. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to improve user experience, analyze usage, and provide personalized content.
            </p>

            <h2>10. Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13. We do not knowingly collect information from children.
            </p>

            <h2>11. GDPR & CCPA Compliance</h2>
            <p>
              WanderSure is designed to comply with GDPR and CCPA requirements. For EU and California residents, additional rights may apply. Contact us for more information.
            </p>

            <h2>12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of significant changes via email or through the app.
            </p>

            <h2>13. Contact Us</h2>
            <p>
              For privacy-related questions or concerns, contact us at:{" "}
              <a href="mailto:privacy@wandersure.com" className="text-blue-600 hover:underline">
                privacy@wandersure.com
              </a>
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link to={createPageUrl("TermsOfService")}>
            <Button variant="outline" size="lg">
              View Terms of Service
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}