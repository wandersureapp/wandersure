import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, FileText, Info } from "lucide-react";

export default function Legal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Legal Information</h1>
          <p className="text-xl text-gray-600">Privacy, terms, and disclosures</p>
        </div>

        <Tabs defaultValue="privacy" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
            <TabsTrigger value="terms">Terms of Service</TabsTrigger>
            <TabsTrigger value="disclosure">Affiliate Disclosure</TabsTrigger>
          </TabsList>

          <TabsContent value="privacy">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-gray-600 mb-4">Last updated: December 2024</p>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Information We Collect</h3>
                <p className="text-gray-700 mb-3">
                  WanderSure collects information you provide when creating trips and managing your account, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>Trip details (destination, dates, travelers)</li>
                  <li>Contact information (email, phone for alerts)</li>
                  <li>Insurance preferences and quotes</li>
                  <li>Account settings and notification preferences</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">How We Use Your Information</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>Provide AI-powered risk assessments for your trips</li>
                  <li>Send travel alerts and notifications you've subscribed to</li>
                  <li>Connect you with insurance provider partners</li>
                  <li>Improve our service and user experience</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Data Sharing</h3>
                <p className="text-gray-700 mb-4">
                  We do not sell your personal information. We share data only with:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li><strong>Insurance partners</strong> - When you request quotes (with your consent)</li>
                  <li><strong>Service providers</strong> - For email delivery, analytics, and payment processing</li>
                  <li><strong>Legal compliance</strong> - When required by law</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Your Rights</h3>
                <p className="text-gray-700 mb-4">
                  You have the right to access, update, or delete your personal information at any time through your account settings.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Security</h3>
                <p className="text-gray-700 mb-4">
                  We use industry-standard encryption and security measures to protect your data.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Contact</h3>
                <p className="text-gray-700">
                  Questions about privacy? Contact us at <a href="mailto:privacy@wandersure.com" className="text-blue-600 hover:underline">privacy@wandersure.com</a>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="terms">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Terms of Service
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-gray-600 mb-4">Last updated: December 2024</p>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Acceptance of Terms</h3>
                <p className="text-gray-700 mb-4">
                  By using WanderSure, you agree to these terms. If you don't agree, please don't use our service.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Our Service</h3>
                <p className="text-gray-700 mb-4">
                  WanderSure provides:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>AI-powered travel risk assessment</li>
                  <li>Insurance comparison and recommendations</li>
                  <li>Travel alerts and notifications</li>
                  <li>Referrals to third-party insurance providers</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Important Disclaimers</h3>
                <p className="text-gray-700 mb-4">
                  <strong>WanderSure is NOT an insurance provider.</strong> We are a comparison and referral service. All insurance policies are provided by third-party licensed insurance companies.
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>Risk assessments are estimates based on available data</li>
                  <li>Insurance recommendations are guidance, not guarantees</li>
                  <li>Premium estimates may differ from actual quotes</li>
                  <li>You are responsible for reviewing policy terms with providers</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">User Responsibilities</h3>
                <p className="text-gray-700 mb-4">You agree to:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>Provide accurate trip information</li>
                  <li>Maintain the security of your account</li>
                  <li>Not misuse or abuse the service</li>
                  <li>Comply with all applicable laws</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Subscription Terms</h3>
                <p className="text-gray-700 mb-4">
                  Premium alert subscriptions:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>Billed monthly or annually</li>
                  <li>Cancel anytime (no refunds for partial periods)</li>
                  <li>Prices subject to change with 30 days notice</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Limitation of Liability</h3>
                <p className="text-gray-700 mb-4">
                  WanderSure is not liable for decisions you make based on our recommendations, or for issues with third-party insurance providers.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Contact</h3>
                <p className="text-gray-700">
                  Questions? Email <a href="mailto:support@wandersure.com" className="text-blue-600 hover:underline">support@wandersure.com</a>
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disclosure">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Affiliate Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p className="text-gray-600 mb-4">Last updated: December 2024</p>
                
                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">How We Make Money</h3>
                <p className="text-gray-700 mb-4">
                  WanderSure is a free service that earns revenue through affiliate partnerships with insurance providers.
                </p>

                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-4">
                  <p className="text-gray-900 font-semibold mb-2">Full Transparency</p>
                  <p className="text-gray-700">
                    When you click on provider links and purchase insurance, we may receive a commission from that provider. 
                    This does NOT increase your price - you pay the same amount you would pay going directly to the provider.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Our Commitment to You</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                  <li>
                    <strong>Unbiased recommendations:</strong> Our AI risk assessments and coverage suggestions are based purely on your trip data, 
                    not on which provider pays higher commissions.
                  </li>
                  <li>
                    <strong>Multiple options:</strong> We show you multiple providers so you can compare and choose the best fit for your needs.
                  </li>
                  <li>
                    <strong>No hidden fees:</strong> Our service is completely free for users. You only pay for insurance if you choose to purchase it from a provider.
                  </li>
                  <li>
                    <strong>Your choice:</strong> We never require you to purchase through us. You're free to search providers directly if you prefer.
                  </li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Premium Alerts</h3>
                <p className="text-gray-700 mb-4">
                  Our premium alert subscription ($4.99/month) is a separate service that provides enhanced travel notifications. 
                  This revenue helps us maintain and improve the platform.
                </p>

                <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Partner Providers</h3>
                <p className="text-gray-700 mb-4">
                  We currently work with the following insurance providers:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                  <li>World Nomads</li>
                  <li>Allianz Travel Insurance</li>
                  <li>Travel Guard</li>
                  <li>Seven Corners</li>
                </ul>
                <p className="text-gray-700 mb-4">
                  This list may be updated as we establish new partnerships.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
                  <p className="text-gray-700">
                    <strong>Questions about our affiliate relationships?</strong><br />
                    We're happy to answer! Email <a href="mailto:affiliates@wandersure.com" className="text-blue-600 hover:underline">affiliates@wandersure.com</a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}