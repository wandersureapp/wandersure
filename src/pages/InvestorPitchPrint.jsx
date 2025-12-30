import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Shield, 
  Sparkles, 
  Users, 
  DollarSign, 
  Target,
  Zap,
  Globe,
  Brain,
  Award,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Rocket,
  Lock,
  Clock
} from "lucide-react";

export default function InvestorPitchPrint() {
  return (
    <div className="bg-white">
      <style>{`
        @media print {
          .page-break {
            page-break-before: always;
            break-before: page;
          }
          .no-print {
            display: none;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
        
        @media screen {
          .page-break {
            margin-top: 3rem;
            padding-top: 3rem;
            border-top: 2px dashed #e5e7eb;
          }
        }
      `}</style>

      {/* Print Instructions */}
      <div className="no-print bg-blue-600 text-white p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">📄 Printer-Optimized Investor Pitch</h2>
        <p className="mb-4">Press Ctrl+P (Windows) or Cmd+P (Mac) and select "Save as PDF"</p>
        <p className="text-sm text-blue-100">Optimized for A4/Letter paper size</p>
      </div>

      {/* Cover Page */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-teal-500 p-12">
        <div className="text-center text-white">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f24e9d50db61a8178058b4/b6c0bc4b2_ChatGPTImageOct17202512_05_29PM.png" 
            alt="WanderSure Logo"
            className="w-32 h-32 object-contain mx-auto mb-8 drop-shadow-2xl"
          />
          <h1 className="text-7xl font-bold mb-6">WanderSure</h1>
          <p className="text-3xl mb-12 font-light">
            AI-Powered Travel Protection<br/>That Pays Only for What You Need
          </p>
          
          <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30">
              <p className="text-5xl font-bold mb-2">40%</p>
              <p className="text-lg">Average Customer Savings</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30">
              <p className="text-5xl font-bold mb-2">98%</p>
              <p className="text-lg">Risk Prediction Accuracy</p>
            </div>
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30">
              <p className="text-5xl font-bold mb-2">$39B</p>
              <p className="text-lg">Market Opportunity</p>
            </div>
          </div>

          <div className="text-xl text-white/90">
            <p>Investor Presentation</p>
            <p className="mt-2">December 2025</p>
          </div>
        </div>
      </div>

      {/* Page 1: Executive Summary */}
      <div className="page-break p-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Globe className="w-10 h-10 text-blue-600" />
            <h2 className="text-5xl font-bold text-gray-900">Executive Summary</h2>
          </div>

          <Card className="mb-8 border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">The Opportunity</h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                Travel insurance is broken. Travelers are forced to buy expensive, one-size-fits-all packages 
                that include coverage they don't need, while lacking protection where it matters most. The global 
                travel insurance market is projected to reach <strong>$39 billion by 2030</strong>, yet remains 
                largely untouched by AI and personalization technology.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8 border-2 border-teal-200 bg-teal-50">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Innovation</h3>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                WanderSure uses proprietary AI-powered risk analysis to create personalized insurance policies, 
                ensuring travelers pay only for the coverage they actually need based on their specific trip risks. 
                Our platform provides real-time risk intelligence and dynamic pricing, delivering an average of 
                <strong> 40% cost savings</strong> while offering superior protection.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="text-blue-600 font-bold text-4xl mb-2">$5M</div>
                  <div className="text-gray-700">Series A Raise</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="text-green-600 font-bold text-4xl mb-2">2-5%</div>
                  <div className="text-gray-700">Target Market Share (5 Years)</div>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <div className="text-purple-600 font-bold text-4xl mb-2">$325M</div>
                  <div className="text-gray-700">Projected Revenue (Year 5)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Total Addressable Market</h4>
                <div className="text-5xl font-bold text-blue-600 mb-2">$39B</div>
                <p className="text-gray-700">Global travel insurance market by 2030 (9.2% CAGR)</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Revenue Model</h4>
                <div className="text-5xl font-bold text-green-600 mb-2">15-20%</div>
                <p className="text-gray-700">Commission on policies + B2B partnerships + data licensing</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Page 2: The Problem */}
      <div className="page-break p-12 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="w-10 h-10 text-orange-600" />
            <h2 className="text-5xl font-bold text-gray-900">The Problem</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-l-4 border-red-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <DollarSign className="w-8 h-8 text-red-600 flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-gray-900">Overpaying for Coverage</h3>
                </div>
                <p className="text-lg text-gray-700 mb-4">
                  Traditional insurance forces travelers to buy bundled packages with coverage they'll never use. 
                  A low-risk beach vacation pays the same as a high-risk adventure trip.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-bold text-2xl">$85</p>
                  <p className="text-red-700 text-sm">Average waste per policy</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-orange-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Shield className="w-8 h-8 text-orange-600 flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-gray-900">Under-Protected</h3>
                </div>
                <p className="text-lg text-gray-700 mb-4">
                  Standard policies don't account for destination-specific risks. Travelers to high-risk areas 
                  often lack adequate coverage for the threats they'll actually face.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800 font-bold text-2xl">67%</p>
                  <p className="text-orange-700 text-sm">Inadequately covered</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Clock className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-gray-900">No Real-Time Risk Data</h3>
                </div>
                <p className="text-lg text-gray-700 mb-4">
                  Existing platforms don't provide travelers with current risk information about their destination, 
                  leaving them unprepared for evolving threats.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-bold text-2xl">Static</p>
                  <p className="text-yellow-700 text-sm">Outdated models</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Users className="w-8 h-8 text-purple-600 flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-gray-900">Complex Options</h3>
                </div>
                <p className="text-lg text-gray-700 mb-4">
                  The average traveler spends hours comparing policies, reading fine print, and still ends up 
                  unsure if they have the right coverage.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-800 font-bold text-2xl">3.5 hrs</p>
                  <p className="text-purple-700 text-sm">Average research time</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-3xl font-bold mb-4">The Bottom Line</h3>
              <p className="text-xl leading-relaxed">
                The travel insurance industry hasn't evolved with technology. Travelers waste billions 
                annually on unnecessary coverage while remaining under-protected for real risks.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Page 3: Our Solution */}
      <div className="page-break p-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-10 h-10 text-yellow-500" />
            <h2 className="text-5xl font-bold text-gray-900">The WanderSure Solution</h2>
          </div>

          <Card className="mb-8 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
            <CardContent className="p-8 text-center">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                AI-Driven Travel Insurance That Makes Sense
              </h3>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                WanderSure analyzes your specific trip and uses AI to assess real-time risks, 
                then builds a custom insurance policy with only the coverage you need, 
                priced dynamically based on actual risk.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Risk Analysis</h3>
                <p className="text-gray-700 mb-4">
                  Analyzes 50+ risk factors including destination safety, weather patterns, 
                  airline reliability, and political stability.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Real-time data</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">98% accuracy</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Historical analysis</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-10 h-10 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Custom Builder</h3>
                <p className="text-gray-700 mb-4">
                  Build your perfect policy by selecting only the coverage you need. 
                  AI recommends what's essential based on your trip's risk profile.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">À la carte coverage</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Smart recommendations</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Transparent pricing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Dynamic Pricing</h3>
                <p className="text-gray-700 mb-4">
                  Pay based on actual risk, not generic pricing. Low-risk trips save money, 
                  high-risk trips get needed protection at fair prices.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Risk-adjusted</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">No hidden fees</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Instant quotes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-green-600 to-teal-600 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-6 text-center">How It Works</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold">1</span>
                  </div>
                  <h4 className="font-bold text-xl mb-2">Enter Trip Details</h4>
                  <p className="text-sm text-white/90">Destination, dates, travelers</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold">2</span>
                  </div>
                  <h4 className="font-bold text-xl mb-2">AI Analysis</h4>
                  <p className="text-sm text-white/90">Real-time risk assessment</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold">3</span>
                  </div>
                  <h4 className="font-bold text-xl mb-2">Build Policy</h4>
                  <p className="text-sm text-white/90">Select coverage you need</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold">4</span>
                  </div>
                  <h4 className="font-bold text-xl mb-2">Travel Protected</h4>
                  <p className="text-sm text-white/90">Real-time alerts & support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Page 4: Market & Traction */}
      <div className="page-break p-12 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-10 h-10 text-green-600" />
            <h2 className="text-5xl font-bold text-gray-900">Market & Traction</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Market Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Current Market (2025)</span>
                      <span className="text-3xl font-bold text-blue-600">$28B</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Projected (2030)</span>
                      <span className="text-3xl font-bold text-green-600">$39B</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-gray-700">
                      <strong className="text-xl text-gray-900">CAGR: 9.2%</strong>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Driven by increased travel and digital adoption
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Early Traction</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                  <p className="text-4xl font-bold text-blue-600 mb-1">12K</p>
                  <p className="text-sm text-gray-700">Beta waitlist signups</p>
                </div>
                
                <div className="p-4 bg-green-50 border-l-4 border-green-600 rounded">
                  <p className="text-4xl font-bold text-green-600 mb-1">94%</p>
                  <p className="text-sm text-gray-700">User satisfaction score</p>
                </div>
                
                <div className="p-4 bg-purple-50 border-l-4 border-purple-600 rounded">
                  <p className="text-4xl font-bold text-purple-600 mb-1">3</p>
                  <p className="text-sm text-gray-700">Insurance partner LOIs</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-green-600 to-teal-600 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-6 text-center">5-Year Revenue Projection</h3>
              <div className="grid grid-cols-5 gap-4">
                <div className="text-center bg-white/10 rounded-lg p-4">
                  <p className="text-sm mb-2">Year 1</p>
                  <p className="text-3xl font-bold">$2.5M</p>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-4">
                  <p className="text-sm mb-2">Year 2</p>
                  <p className="text-3xl font-bold">$8.5M</p>
                </div>
                <div className="text-center bg-white/20 rounded-lg p-4 border-2 border-white">
                  <p className="text-sm mb-2">Year 3</p>
                  <p className="text-4xl font-bold">$50M</p>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-4">
                  <p className="text-sm mb-2">Year 4</p>
                  <p className="text-3xl font-bold">$150M</p>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-4">
                  <p className="text-sm mb-2">Year 5</p>
                  <p className="text-3xl font-bold">$325M</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Page 5: Investment Ask */}
      <div className="page-break p-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Rocket className="w-10 h-10 text-orange-500" />
            <h2 className="text-5xl font-bold text-gray-900">The Investment</h2>
          </div>

          <Card className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white border-0 mb-8">
            <CardContent className="p-12 text-center">
              <h3 className="text-5xl font-bold mb-6">Raising $5M Series A</h3>
              <p className="text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
                To scale our platform, secure additional insurance partnerships, and capture 
                2-5% market share within 5 years
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30">
                  <h4 className="text-xl font-bold mb-3">Use of Funds</h4>
                  <ul className="text-left space-y-2">
                    <li>• 40% Technology & AI</li>
                    <li>• 30% Marketing</li>
                    <li>• 20% Team</li>
                    <li>• 10% Operations</li>
                  </ul>
                </div>

                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30">
                  <h4 className="text-xl font-bold mb-3">Year 2 Targets</h4>
                  <ul className="text-left space-y-2">
                    <li>• 65K policies sold</li>
                    <li>• $8.5M revenue</li>
                    <li>• 5+ partners</li>
                    <li>• 2-3 B2B deals</li>
                  </ul>
                </div>

                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30">
                  <h4 className="text-xl font-bold mb-3">Exit Strategy</h4>
                  <ul className="text-left space-y-2">
                    <li>• Acquisition target</li>
                    <li>• Major insurer</li>
                    <li>• Travel platform</li>
                    <li>• IPO (5-7 years)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Why Invest?</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                  <TrendingUp className="w-10 h-10 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Massive Market</h4>
                    <p className="text-gray-700">
                      $39B market with 9.2% CAGR and minimal AI disruption
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                  <Sparkles className="w-10 h-10 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Unique Technology</h4>
                    <p className="text-gray-700">
                      Proprietary AI with 98% accuracy—defensible moat
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                  <Users className="w-10 h-10 text-purple-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Proven Fit</h4>
                    <p className="text-gray-700">
                      12K users, 94% satisfaction, validated savings
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
                  <DollarSign className="w-10 h-10 text-orange-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Multiple Streams</h4>
                    <p className="text-gray-700">
                      Commissions, B2B, data licensing, subscriptions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Contact Page */}
      <div className="page-break min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 p-12">
        <div className="text-center text-white max-w-3xl">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f24e9d50db61a8178058b4/b6c0bc4b2_ChatGPTImageOct17202512_05_29PM.png" 
            alt="WanderSure"
            className="w-32 h-32 object-contain mx-auto mb-8"
          />
          
          <h2 className="text-6xl font-bold mb-6">Let's Transform Travel Insurance</h2>
          
          <p className="text-3xl mb-12 leading-relaxed">
            Join us in capturing a multi-billion dollar opportunity
          </p>

          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 border border-white/30 mb-8">
            <h3 className="text-2xl font-bold mb-6">Contact</h3>
            <div className="space-y-4 text-xl">
              <p><strong>Email:</strong> investors@wandersure.com</p>
              <p><strong>Website:</strong> www.wandersure.com</p>
              <p><strong>Date:</strong> December 2025</p>
            </div>
          </div>

          <p className="text-lg text-white/90">
            Thank you for considering WanderSure.
            <br />
            We look forward to partnering with you.
          </p>
        </div>
      </div>
    </div>
  );
}