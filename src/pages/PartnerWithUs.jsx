import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  TrendingUp, 
  Users, 
  Sparkles, 
  Shield,
  BarChart3,
  CheckCircle,
  Mail
} from "lucide-react";

export default function PartnerWithUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-blue-800 mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Partnership Opportunity
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Partner with WanderSure
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us in revolutionizing travel insurance with AI-powered risk assessment 
            and personalized coverage recommendations
          </p>
        </div>

        {/* What We Do */}
        <Card className="border-none shadow-xl mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-600 text-white">
            <CardTitle className="text-2xl">What Makes WanderSure Different</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">The Problem We Solve</h3>
              <p className="text-gray-700 mb-4">
                Traditional travel insurance is one-size-fits-all, overpriced, and disconnected from real-time risk data. 
                Travelers either overpay for coverage they don't need or remain under-protected for their specific destination risks.
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Unique AI-Powered Solution</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">🎯 Personalized Risk Analysis</h4>
                  <p className="text-sm text-gray-700">
                    AI analyzes real-time data on flight delays, weather patterns, crime rates, and health risks 
                    specific to each destination, creating a unique risk profile for every trip.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">💰 Smart Coverage Recommendations</h4>
                  <p className="text-sm text-gray-700">
                    Instead of generic packages, we recommend only the coverage types travelers actually need 
                    based on their destination risks—saving money while maximizing protection.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">🔔 Real-Time Travel Alerts</h4>
                  <p className="text-sm text-gray-700">
                    Continuous monitoring with proactive notifications about flight delays, weather changes, 
                    and destination safety updates throughout their trip.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">🤝 Trusted Comparison</h4>
                  <p className="text-sm text-gray-700">
                    Side-by-side provider comparisons with transparent pricing, helping travelers make 
                    informed decisions without the pressure of single-provider sales tactics.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Partner With Us */}
        <Card className="border-none shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Why Partner with WanderSure
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">High-Intent Traffic</h4>
                  <p className="text-gray-700">
                    Our users actively plan trips and seek insurance coverage. They're not browsing—they're ready to buy. 
                    By the time they click through to your site, they've already received personalized recommendations 
                    tailored to their needs, resulting in higher conversion rates.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">AI-Enhanced Matching</h4>
                  <p className="text-gray-700">
                    We don't just send traffic—we send <em>qualified</em> traffic. Our AI identifies which providers 
                    best match each traveler's risk profile and coverage needs, increasing the likelihood of policy purchase.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Early Mover Advantage</h4>
                  <p className="text-gray-700">
                    Partner with us now during our launch phase and grow with us. Early partners receive preferential 
                    placement, collaborative marketing opportunities, and input into product features that benefit 
                    mutual customer acquisition goals.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Premium Demographics</h4>
                  <p className="text-gray-700">
                    Our users are tech-savvy travelers who value data-driven decisions and comprehensive protection. 
                    They're willing to invest in quality coverage and appreciate transparency—ideal customers for 
                    established insurance providers.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Target Audience */}
        <Card className="border-none shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              Our Target Audience
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
                <div className="text-4xl mb-3">🎒</div>
                <h4 className="font-bold text-gray-900 mb-2">Adventure Travelers</h4>
                <p className="text-sm text-gray-700">
                  Backpackers, digital nomads, and experience seekers traveling to diverse international destinations
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
                <h4 className="font-bold text-gray-900 mb-2">Family Vacationers</h4>
                <p className="text-sm text-gray-700">
                  Parents planning trips with children who want comprehensive protection and peace of mind
                </p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
                <div className="text-4xl mb-3">💼</div>
                <h4 className="font-bold text-gray-900 mb-2">Business Travelers</h4>
                <p className="text-sm text-gray-700">
                  Professionals seeking reliable coverage for frequent domestic and international business trips
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-gray-900 mb-3">Key Demographics</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <strong>Age Range:</strong> 25-55 years old (primary)
                </div>
                <div>
                  <strong>Income Level:</strong> Middle to upper-middle class
                </div>
                <div>
                  <strong>Tech Adoption:</strong> Early adopters, comfortable with AI/automation
                </div>
                <div>
                  <strong>Travel Frequency:</strong> 2-6+ international trips per year
                </div>
                <div>
                  <strong>Purchase Behavior:</strong> Research-driven, value-conscious
                </div>
                <div>
                  <strong>Device Usage:</strong> Mobile-first, cross-platform access
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Model & Growth */}
        <Card className="border-none shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Our Business Model & Growth Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Dual Revenue Streams</h4>
                <div className="pl-4 border-l-4 border-blue-600 mb-4">
                  <p className="text-gray-700 mb-2">
                    <strong>1. Affiliate Commissions (Primary):</strong> Revenue share from partner insurance providers 
                    when users purchase policies through our referral links
                  </p>
                  <p className="text-gray-700">
                    <strong>2. Premium Subscriptions:</strong> $4.99/month premium alert service providing real-time 
                    flight, weather, and safety notifications
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Current Stage</h4>
                <p className="text-gray-700 mb-4">
                  We're in active launch phase, building our initial user base and establishing foundational partnerships. 
                  This is the ideal time for forward-thinking providers to join as early partners.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Growth Trajectory</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <p className="font-semibold text-gray-900">Phase 1 (Months 1-3): Foundation</p>
                    <p className="text-sm text-gray-700">Build core user base, establish 3-5 key partnerships, optimize conversion funnel</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="font-semibold text-gray-900">Phase 2 (Months 4-9): Scaling</p>
                    <p className="text-sm text-gray-700">Expand partner network, launch premium subscriptions, invest in content marketing and SEO</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <p className="font-semibold text-gray-900">Phase 3 (Months 10-18): Market Leadership</p>
                    <p className="text-sm text-gray-700">Establish WanderSure as the go-to AI-powered travel insurance comparison platform, expand internationally</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Competitive Advantages</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>AI differentiation:</strong> No other platform offers real-time, destination-specific risk analysis at this level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>User-first design:</strong> Clean, mobile-optimized interface vs. cluttered legacy comparison sites</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Continuous engagement:</strong> Alert subscriptions keep users returning, increasing lifetime value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Transparent model:</strong> Full disclosure of affiliate relationships builds trust with users</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Traffic & Metrics */}
        <Card className="border-none shadow-xl mb-8">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Platform Metrics & Transparency
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <p className="text-gray-900 font-semibold mb-2">🚀 We're Just Getting Started</p>
              <p className="text-gray-700 text-sm">
                As a newly launched platform, we're transparent about our current stage. We believe in building 
                partnerships based on shared vision and growth potential, not inflated numbers.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Current Status</h4>
                <p className="text-sm text-gray-700">
                  <strong>Launch Phase:</strong> Active user acquisition and onboarding<br />
                  <strong>Focus:</strong> Quality over quantity—building an engaged user base who value our unique AI approach<br />
                  <strong>Geographic Reach:</strong> Initially US-based users, expanding internationally
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">What We Can Offer Partners Now</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✅ Highly qualified leads with completed trip profiles and risk assessments</li>
                  <li>✅ Detailed user intent data (destination, dates, coverage preferences)</li>
                  <li>✅ Premium placement opportunities in a clean, conversion-optimized interface</li>
                  <li>✅ Transparent tracking with affiliate link attribution</li>
                  <li>✅ Partnership input into platform features and user experience</li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">💡 Why This is a Great Time to Partner</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Early partners gain significant advantages as we scale:
                </p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Preferential placement in comparison results</li>
                  <li>• Co-marketing and PR opportunities as we grow</li>
                  <li>• Input into product roadmap and feature development</li>
                  <li>• Negotiated commission rates locked in for longer terms</li>
                  <li>• First access to new user segments as we expand</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="border-none shadow-2xl bg-gradient-to-r from-blue-600 to-teal-600 text-white">
          <CardContent className="p-10 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Let's Build the Future of Travel Insurance Together</h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              We're seeking forward-thinking insurance partners who share our vision of transparent, 
              AI-powered travel protection. Join us in creating something truly unique.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 min-h-[44px]"
                onClick={() => window.location.href = 'mailto:partnerships@wandersure.com?subject=Partnership%20Inquiry'}
              >
                <Mail className="w-5 h-5 mr-2" />
                partnerships@wandersure.com
              </Button>
            </div>
            <p className="text-blue-100 text-sm mt-6">
              Let's discuss how we can create a mutually beneficial partnership
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}