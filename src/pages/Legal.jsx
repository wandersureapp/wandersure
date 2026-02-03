import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileText } from "lucide-react";
import SafePageWrapper from "../components/utils/SafePageWrapper";

export default function Legal() {
  return (
    <SafePageWrapper>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Legal</h1>
          <p className="text-gray-600">Privacy Policy & Terms of Service</p>
        </div>

        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy Policy
            </TabsTrigger>
            <TabsTrigger value="terms" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Terms of Service
            </TabsTrigger>
          </TabsList>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
                <p className="text-sm text-gray-600">Last updated: January 2, 2026</p>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h3>1. Information We Collect</h3>
                <p>
                  WanderSure collects information you provide directly to us, including:
                </p>
                <ul>
                  <li>Account information (name, email address)</li>
                  <li>Trip details (destinations, dates, booking information)</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Email confirmations (when you authorize Gmail access)</li>
                </ul>

                <h3>2. How We Use Your Information</h3>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide and improve our travel monitoring services</li>
                  <li>Send you real-time travel alerts and notifications</li>
                  <li>Analyze travel risks and provide insurance recommendations</li>
                  <li>Process payments for premium features</li>
                  <li>Communicate with you about your account and services</li>
                </ul>

                <h3>3. Information Sharing</h3>
                <p>
                  We do not sell your personal information. We may share your information with:
                </p>
                <ul>
                  <li>Service providers who assist in operating our platform</li>
                  <li>Insurance providers when you request quotes (with your consent)</li>
                  <li>Law enforcement when required by law</li>
                </ul>

                <h3>4. Gmail Access</h3>
                <p>
                  When you authorize Gmail access, we only read travel confirmation emails to automatically extract booking details. We do not:
                </p>
                <ul>
                  <li>Access or read non-travel related emails</li>
                  <li>Store email contents beyond what's needed for parsing</li>
                  <li>Share your email data with third parties</li>
                  <li>Send emails on your behalf</li>
                </ul>

                <h3>5. Data Security</h3>
                <p>
                  We implement industry-standard security measures to protect your information, including encryption, secure servers, and regular security audits.
                </p>

                <h3>6. Your Rights</h3>
                <p>You have the right to:</p>
                <ul>
                  <li>Access and download your data</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your account and data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Revoke Gmail authorization at any time</li>
                </ul>

                <h3>7. Data Retention</h3>
                <p>
                  We retain your information for as long as your account is active or as needed to provide services. You may delete your account at any time.
                </p>

                <h3>8. Cookies and Tracking</h3>
                <p>
                  We use cookies and similar technologies to improve user experience, analyze usage, and provide personalized content.
                </p>

                <h3>9. Children's Privacy</h3>
                <p>
                  Our services are not intended for children under 13. We do not knowingly collect information from children.
                </p>

                <h3>10. Changes to This Policy</h3>
                <p>
                  We may update this Privacy Policy periodically. We will notify you of significant changes via email or through the app.
                </p>

                <h3>11. Contact Us</h3>
                <p>
                  For privacy-related questions or concerns, contact us at:{" "}
                  <a href="mailto:privacy@wandersure.com">privacy@wandersure.com</a>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terms">
            <Card>
              <CardHeader>
                <CardTitle>Terms of Service</CardTitle>
                <p className="text-sm text-gray-600">Last updated: January 2, 2026</p>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <h3>1. Acceptance of Terms</h3>
                <p>
                  By accessing or using WanderSure, you agree to be bound by these Terms of Service. If you do not agree, do not use our services.
                </p>

                <h3>2. Description of Service</h3>
                <p>
                  WanderSure provides AI-powered travel monitoring, risk assessment, and insurance recommendations. Our services include:
                </p>
                <ul>
                  <li>Real-time travel alerts and notifications</li>
                  <li>Risk analysis for destinations and trips</li>
                  <li>Travel planning tools and checklists</li>
                  <li>Insurance provider referrals (affiliate relationships)</li>
                </ul>

                <h3>3. User Accounts</h3>
                <p>You are responsible for:</p>
                <ul>
                  <li>Maintaining the confidentiality of your account</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and current information</li>
                  <li>Notifying us of unauthorized account use</li>
                </ul>

                <h3>4. Acceptable Use</h3>
                <p>You agree not to:</p>
                <ul>
                  <li>Use the service for illegal purposes</li>
                  <li>Interfere with or disrupt the service</li>
                  <li>Attempt to gain unauthorized access</li>
                  <li>Misuse or abuse our AI systems</li>
                  <li>Share your account with others</li>
                </ul>

                <h3>5. Payment Terms</h3>
                <ul>
                  <li>Premium features require payment as specified</li>
                  <li>Payments are processed securely through Stripe</li>
                  <li>Subscriptions renew automatically unless cancelled</li>
                  <li>Refunds are handled on a case-by-case basis</li>
                </ul>

                <h3>6. Disclaimers</h3>
                <p><strong>IMPORTANT:</strong></p>
                <ul>
                  <li>WanderSure provides <strong>information only</strong>, not insurance coverage</li>
                  <li>Risk assessments are estimates and may not be accurate</li>
                  <li>We are not liable for travel disruptions or losses</li>
                  <li>Always verify information with official sources</li>
                  <li>We do not guarantee alert delivery or accuracy</li>
                </ul>

                <h3>7. Insurance Referrals</h3>
                <p>
                  WanderSure may receive commissions from insurance providers when you purchase through our referral links. We are not an insurance provider or broker.
                </p>

                <h3>8. Intellectual Property</h3>
                <p>
                  All content, features, and functionality are owned by WanderSure and protected by copyright, trademark, and other laws.
                </p>

                <h3>9. Limitation of Liability</h3>
                <p>
                  To the maximum extent permitted by law, WanderSure shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.
                </p>

                <h3>10. Indemnification</h3>
                <p>
                  You agree to indemnify and hold WanderSure harmless from any claims arising from your use of the service or violation of these terms.
                </p>

                <h3>11. Third-Party Services</h3>
                <p>
                  Our service may integrate with third-party services (Gmail, Stripe, etc.). Your use of these services is subject to their own terms and policies.
                </p>

                <h3>12. Termination</h3>
                <p>
                  We may suspend or terminate your account for violation of these terms. You may cancel your account at any time.
                </p>

                <h3>13. Changes to Terms</h3>
                <p>
                  We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance.
                </p>

                <h3>14. Governing Law</h3>
                <p>
                  These terms are governed by the laws of the United States. Disputes will be resolved in the courts of [Your State/Country].
                </p>

                <h3>15. Contact Information</h3>
                <p>
                  For questions about these Terms of Service, contact:{" "}
                  <a href="mailto:support@wandersure.com">support@wandersure.com</a>
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </SafePageWrapper>
  );
}