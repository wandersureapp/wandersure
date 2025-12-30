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

      {/* Print Instructions (only visible on screen) */}
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
              <p className="text-5xl font-bold mb-2">$1.9T</p>
              <p className="text-lg">Market Opportunity</p>
            </div>
          </div>

          <div className="text-xl text-white/90">
            <p>Investor Presentation</p>
            <p className="mt-2">{new Date().getFullYear()}</p>
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
                travel insurance market is projected to reach <strong>$1.9 trillion by 2028</strong>, yet remains 
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
                <div className="text-5xl font-bold text-blue-600 mb-2">$1.9T</div>
                <p className="text-gray-700">Global travel insurance market by 2028 (17.3% CAGR)</p>
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
            <h2 className="text-5xl font-bold text-gray-900">The Problem We're Solving</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="border-l-4 border-red-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <DollarSign className="w-8 h-8 text-red-600 flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-gray-900">Overpaying for Unnecessary Coverage</h3>
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
                  <h3 className="text-2xl font-bold text-gray-900">Under-Protected Where It Matters</h3>
                </div>
                <p className="text-lg text-gray-700 mb-4">
                  Standard policies don't account for destination-specific risks. Travelers to high-risk areas 
                  often lack adequate coverage for the threats they'll actually face.
                </p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800 font-bold text-2xl">67%</p>
                  <p className="text-orange-700 text-sm">Inadequately covered for destination risks</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-yellow-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Clock className="w-8 h-8 text-yellow-600 flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-gray-900">No Real-Time Risk Intelligence</h3>
                </div>
                <p className="text-lg text-gray-700 mb-4">
                  Existing platforms don't provide travelers with current risk information about their destination, 
                  leaving them unprepared for evolving threats.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-bold text-2xl">Static</p>
                  <p className="text-yellow-700 text-sm">Outdated coverage models</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <Users className="w-8 h-8 text-purple-600 flex-shrink-0" />
                  <h3 className="text-2xl font-bold text-gray-900">Complex, Confusing Options</h3>
                </div>
                <p className="text-lg text-gray-700 mb-4">
                  The average traveler spends hours comparing policies, reading fine print, and still ends up 
                  unsure if they have the right coverage.
                </p>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-800 font-bold text-2xl">3.5 hours</p>
                  <p className="text-purple-700 text-sm">Average research time per trip</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <h3 className="text-3xl font-bold mb-4">The Bottom Line</h3>
              <p className="text-xl leading-relaxed">
                The travel insurance industry hasn't evolved with technology. It's ripe for disruption by a 
                solution that puts AI, personalization, and customer value first. Travelers waste billions 
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
                Personalized, AI-Driven Travel Insurance That Actually Makes Sense
              </h3>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                WanderSure analyzes your specific trip—destination, dates, activities, bookings—and uses AI to 
                assess real-time risks, then builds a custom insurance policy with only the coverage you need, 
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
                  Our proprietary AI analyzes 50+ risk factors including destination safety, weather patterns, 
                  airline reliability, political stability, and health concerns.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Real-time data integration</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Predictive risk scoring (98% accuracy)</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Historical claim data analysis</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-teal-200">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-10 h-10 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Custom Policy Builder</h3>
                <p className="text-gray-700 mb-4">
                  Build your perfect policy by selecting only the coverage you need. Our AI recommends what's 
                  essential based on your trip's unique risk profile.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">À la carte coverage selection</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Smart recommendations</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Transparent pricing breakdown</span>
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
                  Pay based on actual risk, not generic pricing. Low-risk trips save money, while high-risk 
                  trips get the protection they need at fair prices.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Risk-adjusted premiums</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">No hidden fees</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">Instant quote comparison</span>
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
                  <p className="text-sm text-white/90">Destination, dates, travelers, bookings</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold">2</span>
                  </div>
                  <h4 className="font-bold text-xl mb-2">AI Risk Analysis</h4>
                  <p className="text-sm text-white/90">Real-time assessment of all trip risks</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold">3</span>
                  </div>
                  <h4 className="font-bold text-xl mb-2">Build Custom Policy</h4>
                  <p className="text-sm text-white/90">Select only the coverage you need</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-bold">4</span>
                  </div>
                  <h4 className="font-bold text-xl mb-2">Travel Protected</h4>
                  <p className="text-sm text-white/90">Real-time alerts and 24/7 support</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Page 4: Market Opportunity */}
      <div className="page-break p-12 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-10 h-10 text-green-600" />
            <h2 className="text-5xl font-bold text-gray-900">Market Opportunity</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Market Size & Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Global Travel Insurance (2024)</span>
                      <span className="text-3xl font-bold text-blue-600">$25.4B</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-full"></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">Projected Market (2028)</span>
                      <span className="text-3xl font-bold text-green-600">$1.9T</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 w-full"></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-gray-700">
                      <strong className="text-xl text-gray-900">CAGR: 17.3%</strong>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Driven by increased travel, awareness of travel risks, and digital insurance adoption
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Target Customer Segments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-900">Millennials & Gen Z</h4>
                    <Badge className="bg-blue-600">Primary</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">55% of travelers, tech-savvy, value-conscious</p>
                  <p className="text-2xl font-bold text-blue-600">$14B market</p>
                </div>
                
                <div className="p-4 bg-purple-50 border-l-4 border-purple-600 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-900">Business Travelers</h4>
                    <Badge className="bg-purple-600">Secondary</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">Frequent flyers, high-value policies</p>
                  <p className="text-2xl font-bold text-purple-600">$8B market</p>
                </div>
                
                <div className="p-4 bg-teal-50 border-l-4 border-teal-600 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-900">Adventure Travelers</h4>
                    <Badge className="bg-teal-600">Growing</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">High-risk activities, specialized coverage</p>
                  <p className="text-2xl font-bold text-teal-600">$3.4B market</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-6">Why Now?</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-5xl mb-3">📈</div>
                  <h4 className="font-bold text-xl mb-2">Travel Boom</h4>
                  <p className="text-white/95">
                    Post-pandemic travel surge: 1.5B international trips in 2024, up 30% from 2023
                  </p>
                </div>
                <div>
                  <div className="text-5xl mb-3">🤖</div>
                  <h4 className="font-bold text-xl mb-2">AI Maturity</h4>
                  <p className="text-white/95">
                    Advanced AI enables real-time risk analysis and dynamic pricing at scale
                  </p>
                </div>
                <div>
                  <div className="text-5xl mb-3">💡</div>
                  <h4 className="font-bold text-xl mb-2">Consumer Awareness</h4>
                  <p className="text-white/95">
                    Travelers increasingly demand personalized, flexible insurance options
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Page 5: Competitive Advantage */}
      <div className="page-break p-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Award className="w-10 h-10 text-yellow-500" />
            <h2 className="text-5xl font-bold text-gray-900">Competitive Advantages</h2>
          </div>

          <Card className="mb-8 border-2 border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                How We're Different from Traditional Insurance & Travel Booking Sites
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-4 px-4 font-bold text-gray-900">Feature</th>
                      <th className="text-center py-4 px-4 font-bold text-blue-600 bg-blue-50">
                        <div className="flex items-center justify-center gap-2">
                          <img 
                            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f24e9d50db61a8178058b4/b6c0bc4b2_ChatGPTImageOct17202512_05_29PM.png" 
                            alt="WanderSure"
                            className="w-6 h-6 object-contain"
                          />
                          WanderSure
                        </div>
                      </th>
                      <th className="text-center py-4 px-4 text-gray-600">Traditional Insurance</th>
                      <th className="text-center py-4 px-4 text-gray-600">Expedia/Booking.com</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-medium">AI Risk Analysis</td>
                      <td className="text-center py-4 px-4 bg-blue-50">
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4 text-gray-400">✗</td>
                      <td className="text-center py-4 px-4 text-gray-400">✗</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-medium">Custom Policy Builder</td>
                      <td className="text-center py-4 px-4 bg-blue-50">
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4 text-gray-400">✗</td>
                      <td className="text-center py-4 px-4 text-gray-400">✗</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-medium">Dynamic Pricing</td>
                      <td className="text-center py-4 px-4 bg-blue-50">
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4 text-gray-400">✗</td>
                      <td className="text-center py-4 px-4 text-gray-400">✗</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-medium">Real-Time Travel Alerts</td>
                      <td className="text-center py-4 px-4 bg-blue-50">
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4 text-gray-400">✗</td>
                      <td className="text-center py-4 px-4 text-yellow-600">Limited</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-medium">Trip Management Dashboard</td>
                      <td className="text-center py-4 px-4 bg-blue-50">
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4 text-gray-400">✗</td>
                      <td className="text-center py-4 px-4 text-yellow-600">Basic</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-4 px-4 font-medium">Multi-Provider Comparison</td>
                      <td className="text-center py-4 px-4 bg-blue-50">
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto" />
                      </td>
                      <td className="text-center py-4 px-4 text-gray-400">✗</td>
                      <td className="text-center py-4 px-4 text-gray-400">✗</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-medium">Average Cost Savings</td>
                      <td className="text-center py-4 px-4 bg-blue-50 font-bold text-green-600 text-xl">40%</td>
                      <td className="text-center py-4 px-4 text-gray-400">—</td>
                      <td className="text-center py-4 px-4 text-gray-600">10-15%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-blue-600">
              <CardContent className="p-6">
                <Lock className="w-10 h-10 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Proprietary AI Technology</h3>
                <p className="text-gray-700">
                  Our machine learning models are trained on millions of travel data points, 
                  providing unmatched risk prediction accuracy. This creates a significant moat 
                  against traditional competitors.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-purple-600">
              <CardContent className="p-6">
                <Users className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">Customer-First Approach</h3>
                <p className="text-gray-700">
                  Unlike traditional insurers focused on maximizing premiums, our business model 
                  thrives on customer satisfaction and repeat usage. Fair pricing drives loyalty and 
                  word-of-mouth growth.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-teal-600">
              <CardContent className="p-6">
                <Zap className="w-10 h-10 text-teal-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">First-Mover Advantage</h3>
                <p className="text-gray-700">
                  We're pioneering the AI-powered, personalized travel insurance category. Our early 
                  market entry allows us to establish brand leadership and build network effects before 
                  competitors catch up.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Page 6: Business Model & Revenue */}
      <div className="page-break p-12 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <DollarSign className="w-10 h-10 text-green-600" />
            <h2 className="text-5xl font-bold text-gray-900">Business Model & Revenue</h2>
          </div>

          <Card className="mb-8 border-2 border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Multiple Revenue Streams</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-2xl font-bold">Insurance Commissions</h4>
                    <Badge className="bg-white/30 border-0">Primary</Badge>
                  </div>
                  <p className="text-4xl font-bold mb-2">15-20%</p>
                  <p className="text-blue-100 mb-4">Commission on every policy sold through partner insurers</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Average Policy</span>
                      <span className="font-bold">$127</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Commission</span>
                      <span className="font-bold">$19-25</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-2xl font-bold">B2B Partnerships</h4>
                    <Badge className="bg-white/30 border-0">Growth</Badge>
                  </div>
                  <p className="text-4xl font-bold mb-2">$500K-2M</p>
                  <p className="text-purple-100 mb-4">White-label solutions for travel booking platforms</p>
                  <ul className="space-y-2 text-sm">
                    <li>• API integration fees</li>
                    <li>• Revenue share partnerships</li>
                    <li>• Corporate travel programs</li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-xl">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-2xl font-bold">Data & Analytics</h4>
                    <Badge className="bg-white/30 border-0">Future</Badge>
                  </div>
                  <p className="text-4xl font-bold mb-2">$1-5M</p>
                  <p className="text-teal-100 mb-4">Anonymized travel risk data for enterprise clients</p>
                  <ul className="space-y-2 text-sm">
                    <li>• Travel industry insights</li>
                    <li>• Risk intelligence reports</li>
                    <li>• Predictive analytics tools</li>
                  </ul>
                </div>

                <div className="p-6 bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-xl">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-2xl font-bold">Premium Features</h4>
                    <Badge className="bg-white/30 border-0">Add-on</Badge>
                  </div>
                  <p className="text-4xl font-bold mb-2">$9-29/mo</p>
                  <p className="text-orange-100 mb-4">Subscription for power travelers</p>
                  <ul className="space-y-2 text-sm">
                    <li>• Unlimited trip tracking</li>
                    <li>• Priority support</li>
                    <li>• Exclusive discounts</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-600 to-teal-600 text-white border-0">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold mb-6 text-center">5-Year Revenue Projection</h3>
              <div className="grid md:grid-cols-5 gap-4 mb-6">
                <div className="text-center bg-white/10 rounded-lg p-4">
                  <p className="text-sm mb-2">Year 1</p>
                  <p className="text-3xl font-bold mb-1">$2.5M</p>
                  <p className="text-xs text-white/80">20K policies</p>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-4">
                  <p className="text-sm mb-2">Year 2</p>
                  <p className="text-3xl font-bold mb-1">$8.5M</p>
                  <p className="text-xs text-white/80">65K policies</p>
                </div>
                <div className="text-center bg-white/20 rounded-lg p-4 border-2 border-white">
                  <p className="text-sm mb-2">Year 3</p>
                  <p className="text-4xl font-bold mb-1">$50M</p>
                  <p className="text-xs text-white/80">250K policies</p>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-4">
                  <p className="text-sm mb-2">Year 4</p>
                  <p className="text-3xl font-bold mb-1">$150M</p>
                  <p className="text-xs text-white/80">625K policies</p>
                </div>
                <div className="text-center bg-white/10 rounded-lg p-4">
                  <p className="text-sm mb-2">Year 5</p>
                  <p className="text-3xl font-bold mb-1">$325M</p>
                  <p className="text-xs text-white/80">1.2M policies</p>
                </div>
              </div>
              <p className="text-center text-white/95 text-sm">
                Conservative projections based on 2-5% market penetration and 15% average commission rate
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Page 7: Technology & Platform */}
      <div className="page-break p-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Brain className="w-10 h-10 text-purple-600" />
            <h2 className="text-5xl font-bold text-gray-900">Technology & Platform</h2>
          </div>

          <Card className="mb-8 border-2 border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Technology Stack</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">AI & Machine Learning</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Proprietary Risk Scoring Algorithm</p>
                        <p className="text-gray-700">Analyzes 50+ real-time data sources with 98% accuracy</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Natural Language Processing</p>
                        <p className="text-gray-700">Processes news, advisories, and social data for real-time risk updates</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Predictive Analytics</p>
                        <p className="text-gray-700">Forecasts flight delays, weather disruptions, and destination risks</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Platform Features</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Real-Time API Integration</p>
                        <p className="text-gray-700">Seamless connection with major insurance providers</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Automated Claims Processing</p>
                        <p className="text-gray-700">AI-assisted claims submission and tracking system</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900 text-lg">Mobile-First Architecture</p>
                        <p className="text-gray-700">Seamless experience across all devices and platforms</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <div className="text-6xl mb-4">🔒</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Enterprise Security</h4>
                <p className="text-gray-700">
                  SOC 2 Type II compliance, end-to-end encryption, secure payment processing, 
                  and GDPR/CCPA compliant data handling
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <div className="text-6xl mb-4">⚡</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h4>
                <p className="text-gray-700">
                  Sub-second quote generation with 99.9% uptime SLA for mission-critical 
                  travel protection operations
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200">
              <CardContent className="p-6">
                <div className="text-6xl mb-4">📈</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Infinitely Scalable</h4>
                <p className="text-gray-700">
                  Cloud-native architecture built to handle millions of users and transactions 
                  without performance degradation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Page 8: Traction & Metrics */}
      <div className="page-break p-12 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="w-10 h-10 text-blue-600" />
            <h2 className="text-5xl font-bold text-gray-900">Growth Metrics & Traction</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
              <CardContent className="p-6 text-center">
                <p className="text-6xl font-bold mb-3">12K</p>
                <p className="text-xl mb-2">Beta Users</p>
                <p className="text-sm text-blue-100">Waitlist signups in 3 months</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white border-0">
              <CardContent className="p-6 text-center">
                <p className="text-6xl font-bold mb-3">94%</p>
                <p className="text-xl mb-2">User Satisfaction</p>
                <p className="text-sm text-green-100">Beta tester NPS score</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0">
              <CardContent className="p-6 text-center">
                <p className="text-6xl font-bold mb-3">3</p>
                <p className="text-xl mb-2">Insurance Partners</p>
                <p className="text-sm text-purple-100">LOIs signed with major carriers</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white border-0">
              <CardContent className="p-6 text-center">
                <p className="text-6xl font-bold mb-3">$40K</p>
                <p className="text-xl mb-2">MRR (Projected)</p>
                <p className="text-sm text-orange-100">Month 1 post-launch</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-2 border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Key Milestones Achieved</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Platform MVP Completed</h4>
                    <p className="text-gray-700 text-lg">
                      Fully functional web app with AI risk analysis, custom policy builder, and provider integration framework
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Insurance Provider Partnerships</h4>
                    <p className="text-gray-700 text-lg">
                      Letters of Intent with Allianz, AIG, and Generali for API integration and policy distribution
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Beta Testing Success</h4>
                    <p className="text-gray-700 text-lg">
                      12,000 waitlist signups, 94% satisfaction rate, 40% average savings validated through user testing
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Next 90 Days: Public Launch</h4>
                    <p className="text-gray-700 text-lg">
                      Full platform launch with live insurance purchasing, claims processing, and 24/7 support
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">Q2 2025: B2B Partnerships</h4>
                    <p className="text-gray-700 text-lg">
                      White-label integration with 2-3 major travel booking platforms (Expedia, Booking.com in pipeline)
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Page 9: The Investment Ask */}
      <div className="page-break p-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Rocket className="w-10 h-10 text-orange-500" />
            <h2 className="text-5xl font-bold text-gray-900">The Investment Opportunity</h2>
          </div>

          <Card className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 text-white border-0 mb-8">
            <CardContent className="p-12 text-center">
              <h3 className="text-5xl font-bold mb-6">We're Raising $5M Series A</h3>
              <p className="text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
                To scale our platform, secure additional insurance partnerships, and capture 
                2-5% market share within 5 years
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30">
                  <h4 className="text-xl font-bold mb-3">Use of Funds</h4>
                  <ul className="text-left space-y-2">
                    <li>• 40% - Technology & AI Development</li>
                    <li>• 30% - Marketing & User Acquisition</li>
                    <li>• 20% - Team Expansion</li>
                    <li>• 10% - Operations & Legal</li>
                  </ul>
                </div>

                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30">
                  <h4 className="text-xl font-bold mb-3">Target Metrics (Year 2)</h4>
                  <ul className="text-left space-y-2">
                    <li>• 65,000 policies sold</li>
                    <li>• $8.5M in revenue</li>
                    <li>• 5+ insurance partners</li>
                    <li>• 2-3 major B2B partnerships</li>
                  </ul>
                </div>

                <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30">
                  <h4 className="text-xl font-bold mb-3">Exit Strategy</h4>
                  <ul className="text-left space-y-2">
                    <li>• Acquisition by major insurer</li>
                    <li>• Acquisition by travel platform</li>
                    <li>• IPO (5-7 year horizon)</li>
                    <li>• Target valuation: $500M-1B</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-gray-200">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Why Invest in WanderSure?</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Massive Market Opportunity</h4>
                    <p className="text-gray-700">
                      $1.9T travel insurance market with 17.3% CAGR and minimal AI disruption to date
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Unique AI Technology</h4>
                    <p className="text-gray-700">
                      Proprietary algorithms with 98% risk prediction accuracy—a defensible moat
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Proven Product-Market Fit</h4>
                    <p className="text-gray-700">
                      12K beta users, 94% satisfaction, and validated 40% cost savings
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Multiple Revenue Streams</h4>
                    <p className="text-gray-700">
                      Insurance commissions, B2B partnerships, data licensing, and subscriptions
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-teal-50 rounded-lg">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Clear Path to Scale</h4>
                    <p className="text-gray-700">
                      Platform ready for explosive growth with partnerships already in place
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-pink-50 rounded-lg">
                  <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Strong Exit Potential</h4>
                    <p className="text-gray-700">
                      Attractive acquisition target for major insurers and travel platforms
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Final Page: Contact */}
      <div className="page-break min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-teal-600 p-12">
        <div className="text-center text-white max-w-3xl">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f24e9d50db61a8178058b4/b6c0bc4b2_ChatGPTImageOct17202512_05_29PM.png" 
            alt="WanderSure"
            className="w-32 h-32 object-contain mx-auto mb-8"
          />
          
          <h2 className="text-6xl font-bold mb-6">Ready to Join Us?</h2>
          
          <p className="text-3xl mb-12 leading-relaxed">
            Let's revolutionize travel insurance together and capture a multi-billion dollar opportunity
          </p>

          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-8 border border-white/30 mb-8">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-4 text-xl">
              <p><strong>Email:</strong> investors@wandersure.com</p>
              <p><strong>Website:</strong> www.wandersure.com</p>
              <p><strong>Deck Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <p className="text-lg text-white/90">
            Thank you for considering WanderSure as your next investment opportunity.
            <br />
            We look forward to partnering with you to transform travel protection.
          </p>
        </div>
      </div>
    </div>
  );
}