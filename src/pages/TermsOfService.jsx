import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, ArrowLeft } from "lucide-react";
import SafePageWrapper from "../components/utils/SafePageWrapper";

export default function TermsOfService() {
  return (
    <SafePageWrapper>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to={createPageUrl("Home")}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8" />
              <div>
                <CardTitle className="text-3xl">Terms of Service</CardTitle>
                <p className="text-purple-100 mt-2">Last updated: January 2, 2026</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 prose prose-lg max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using WanderSure, you agree to be bound by these Terms of Service. If you do not agree, do not use our services.
            </p>

            <h2>2. Description of Service</h2>
            <p className="bg-blue-50 border-l-4 border-blue-600 p-4 my-4">
              <strong>Core Positioning Statement:</strong> WanderSure provides <strong>informational risk intelligence and situational awareness</strong>. 
              It does not provide emergency services, security guarantees, medical advice, or insurance coverage.
            </p>
            <p>
              WanderSure is an <strong>informational technology platform</strong> and <strong>decision-support tool</strong> that provides:
            </p>
            <ul>
              <li>Real-time travel alerts and notifications (for awareness and guidance)</li>
              <li>Risk analysis for destinations and trips (estimates, not guarantees)</li>
              <li>Travel planning tools and checklists</li>
              <li>Insurance provider referrals (affiliate relationships)</li>
            </ul>

            <h2>3. What WanderSure Is — and Is Not</h2>
            <div className="my-6">
              <p className="font-semibold mb-2">✓ WanderSure IS:</p>
              <ul>
                <li>An informational technology platform</li>
                <li>A decision-support tool</li>
                <li>A situational awareness service</li>
              </ul>
              
              <p className="font-semibold mb-2 mt-4">✗ WanderSure IS NOT:</p>
              <ul>
                <li>A travel insurance provider</li>
                <li>A security service provider</li>
                <li>A medical or health authority</li>
                <li>An emergency response service</li>
                <li>A government advisory issuer</li>
              </ul>
            </div>

            <h2>4. User Accounts</h2>
            <p>You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and current information</li>
              <li>Notifying us of unauthorized account use</li>
            </ul>

            <h2>5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the service for illegal purposes</li>
              <li>Interfere with or disrupt the service</li>
              <li>Attempt to gain unauthorized access</li>
              <li>Misuse or abuse our AI systems</li>
              <li>Share your account with others</li>
            </ul>

            <h2>6. Subscription Tiers & Payment Terms</h2>
            <p>
              Subscription tiers provide <strong>enhanced access to information and alert delivery options</strong>. Paid subscriptions do not imply:
            </p>
            <ul>
              <li>Increased duty of care</li>
              <li>Guarantee of protection</li>
              <li>Real-time monitoring obligation</li>
            </ul>
            <p>Payment Terms:</p>
            <ul>
              <li>Premium features require payment as specified</li>
              <li>Payments are processed securely through Stripe</li>
              <li>Subscriptions renew automatically unless cancelled</li>
              <li>Refunds are handled on a case-by-case basis</li>
            </ul>

            <h2>7. Disclaimers & Liability Containment</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 my-4">
              <p className="font-semibold mb-2">⚠️ CRITICAL DISCLAIMERS:</p>
              <ul>
                <li>WanderSure provides <strong>information only</strong>, not insurance coverage or protection</li>
                <li>Risk assessments are estimates based on available data and may not be accurate</li>
                <li>We are not liable for travel disruptions, losses, or any damages</li>
                <li>Always verify information with official sources (government advisories, local authorities)</li>
                <li>We do not guarantee alert delivery, timeliness, or accuracy</li>
              </ul>
            </div>

            <h2>8. Alert Framework & User Agency</h2>
            <p>All alerts are framed as <strong>awareness, guidance, and recommendations</strong>, never as commands, guarantees, or assurances of safety.</p>
            <ul>
              <li><strong>Explainable AI:</strong> Every alert includes why it triggered, what changed, and recommended actions</li>
              <li><strong>User Controls:</strong> You choose which alerts to receive and can pause/disable at any time</li>
              <li><strong>Alert Fatigue Protection:</strong> Severity gating, cooldown periods, and duplicate suppression prevent information overload</li>
              <li><strong>User Agency:</strong> You are responsible for all travel decisions and actions taken based on our information</li>
            </ul>

            <h2>9. Emergency Escalation Boundaries</h2>
            <p className="bg-red-50 border-l-4 border-red-600 p-4 my-4">
              <strong>If you are in immediate danger, contact local emergency services immediately (911 in US, 112 in EU, or your local emergency number).</strong>
              <br /><br />
              WanderSure does not provide emergency response services and should not be relied upon in emergency situations.
            </p>

            <h2>10. Insurance Referrals</h2>
            <p>
              WanderSure may receive commissions from insurance providers when you purchase through our referral links. We are not an insurance provider or broker.
            </p>

            <h2>11. Intellectual Property</h2>
            <p>
              All content, features, and functionality are owned by WanderSure and protected by copyright, trademark, and other laws.
            </p>

            <h2>12. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, WanderSure shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.
            </p>

            <h2>13. Indemnification</h2>
            <p>
              You agree to indemnify and hold WanderSure harmless from any claims arising from your use of the service or violation of these terms.
            </p>

            <h2>14. Third-Party Services & Source Attribution</h2>
            <p>
              Our alerts reference publicly available sources and verified reports. We do not claim exclusive or authoritative knowledge. All risk intelligence is derived from external data sources including:
            </p>
            <ul>
              <li>Government advisories (State Department, CDC, etc.)</li>
              <li>Weather and environmental feeds</li>
              <li>Transportation and airline data</li>
              <li>Security intelligence feeds</li>
              <li>Local news and event signals</li>
            </ul>

            <h2>15. Third-Party Service Integration</h2>
            <p>
              Our service may integrate with third-party services (Gmail, Stripe, etc.). Your use of these services is subject to their own terms and policies.
            </p>

            <h2>16. Termination</h2>
            <p>
              We may suspend or terminate your account for violation of these terms. You may cancel your account at any time.
            </p>

            <h2>17. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use after changes constitutes acceptance.
            </p>

            <h2>18. Governing Law</h2>
            <p>
              These terms are governed by the laws of the United States. Disputes will be resolved in the courts of Delaware.
            </p>

            <h2>19. Contact Information</h2>
            <p>
              For questions about these Terms of Service, contact:{" "}
              <a href="mailto:support@wandersure.com" className="text-blue-600 hover:underline">
                support@wandersure.com
              </a>
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Link to={createPageUrl("PrivacyPolicy")}>
            <Button variant="outline" size="lg">
              View Privacy Policy
            </Button>
          </Link>
        </div>
      </div>
    </div>
    </SafePageWrapper>
  );
}