import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Rocket,
  Lock,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

export default function InvestorPitch() {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview", icon: Globe },
    { id: "problem", label: "The Problem", icon: AlertTriangle },
    { id: "solution", label: "Our Solution", icon: Sparkles },
    { id: "market", label: "Market Opportunity", icon: TrendingUp },
    { id: "competitive", label: "Competitive Edge", icon: Award },
    { id: "business", label: "Business Model", icon: DollarSign },
    { id: "technology", label: "Technology", icon: Brain },
    { id: "traction", label: "Growth & Metrics", icon: BarChart3 },
    { id: "team", label: "The Ask", icon: Rocket }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f24e9d50db61a8178058b4/b6c0bc4b2_ChatGPTImageOct17202512_05_29PM.png" 
                alt="WanderSure"
                className="w-16 h-16 object-contain drop-shadow-2xl"
              />
              <h1 className="text-6xl font-bold text-white">WanderSure</h1>
            </div>
            
            <p className="text-3xl text-blue-100 mb-8 font-light">
              AI-Powered Travel Protection That Pays Only for What You Need
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge className="px-6 py-3 bg-green-500 text-white text-lg border-0">
                <TrendingUp className="w-5 h-5 mr-2" />
                $1.9T Travel Insurance Market
              </Badge>
              <Badge className="px-6 py-3 bg-blue-500 text-white text-lg border-0">
                <Sparkles className="w-5 h-5 mr-2" />
                AI-First Approach
              </Badge>
              <Badge className="px-6 py-3 bg-purple-500 text-white text-lg border-0">
                <Shield className="w-5 h-5 mr-2" />
                Real-Time Risk Intelligence
              </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <p className="text-4xl font-bold text-white mb-2">40%</p>
                <p className="text-blue-200">Average Customer Savings</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <p className="text-4xl font-bold text-white mb-2">98%</p>
                <p className="text-blue-200">Risk Prediction Accuracy</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <p className="text-4xl font-bold text-white mb-2">$127</p>
                <p className="text-blue-200">Average Premium Per Policy</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-2 py-4 no-scrollbar">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? "default" : "ghost"}
                onClick={() => {
                  setActiveSection(section.id);
                  document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`whitespace-nowrap ${
                  activeSection === section.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <section.icon className="w-4 h-4 mr-2" />
                {section.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* Overview Section */}
        <section id="overview" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
              <Globe className="w-10 h-10 text-blue-400" />
              Executive Summary
            </h2>
            
            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-4">The Opportunity</h3>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        Travel insurance is broken. Travelers are forced to buy expensive, one-size-fits-all packages 
                        that include coverage they don't need, while lacking protection where it matters most.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-4">Our Innovation</h3>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        WanderSure uses AI-powered risk analysis to create personalized insurance policies, 
                        ensuring travelers pay only for the coverage they actually need based on their specific trip risks.
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-6">
                      <h4 className="text-white font-semibold mb-2">Total Addressable Market</h4>
                      <p className="text-4xl font-bold text-white">$1.9 Trillion</p>
                      <p className="text-blue-100 text-sm mt-2">Global travel insurance market by 2028</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6">
                      <h4 className="text-white font-semibold mb-2">Target Market Share</h4>
                      <p className="text-4xl font-bold text-white">2-5%</p>
                      <p className="text-purple-100 text-sm mt-2">Realistic 5-year penetration target</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6">
                      <h4 className="text-white font-semibold mb-2">Revenue Projection (Year 3)</h4>
                      <p className="text-4xl font-bold text-white">$50M+</p>
                      <p className="text-orange-100 text-sm mt-2">Conservative estimate with 15% commission</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Problem Section */}
        <section id="problem" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
              <AlertTriangle className="w-10 h-10 text-orange-400" />
              The Problem We're Solving
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-red-900/20 backdrop-blur-xl border-red-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-500 rounded-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Overpaying for Unnecessary Coverage</h3>
                      <p className="text-gray-300">
                        Traditional insurance forces travelers to buy bundled packages with coverage they'll never use. 
                        A low-risk beach vacation pays the same as a high-risk adventure trip.
                      </p>
                      <div className="mt-4 p-3 bg-red-500/20 rounded-lg">
                        <p className="text-red-200 font-semibold">Average Waste: $85 per policy</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-orange-900/20 backdrop-blur-xl border-orange-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-500 rounded-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Under-Protected Where It Matters</h3>
                      <p className="text-gray-300">
                        Standard policies don't account for destination-specific risks. Travelers to high-risk areas 
                        often lack adequate coverage for the threats they'll actually face.
                      </p>
                      <div className="mt-4 p-3 bg-orange-500/20 rounded-lg">
                        <p className="text-orange-200 font-semibold">67% inadequately covered</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-900/20 backdrop-blur-xl border-yellow-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-yellow-500 rounded-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">No Real-Time Risk Intelligence</h3>
                      <p className="text-gray-300">
                        Existing platforms don't provide travelers with current risk information about their destination, 
                        leaving them unprepared for evolving threats.
                      </p>
                      <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg">
                        <p className="text-yellow-200 font-semibold">Static, outdated coverage models</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-900/20 backdrop-blur-xl border-purple-500/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500 rounded-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">Complex, Confusing Options</h3>
                      <p className="text-gray-300">
                        The average traveler spends hours comparing policies, reading fine print, and still ends up 
                        unsure if they have the right coverage.
                      </p>
                      <div className="mt-4 p-3 bg-purple-500/20 rounded-lg">
                        <p className="text-purple-200 font-semibold">3.5 hours average research time</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-8 bg-gradient-to-r from-red-600 to-orange-600 border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-3xl font-bold text-white mb-4">The Bottom Line</h3>
                <p className="text-xl text-white/90 max-w-3xl mx-auto">
                  The travel insurance industry hasn't evolved with technology. It's ripe for disruption by a 
                  solution that puts AI, personalization, and customer value first.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Solution Section */}
        <section id="solution" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
              <Sparkles className="w-10 h-10 text-yellow-400" />
              The WanderSure Solution
            </h2>
            
            <Card className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-xl border-white/10 mb-8">
              <CardContent className="p-8">
                <h3 className="text-3xl font-bold text-white mb-6 text-center">
                  Personalized, AI-Driven Travel Insurance That Actually Makes Sense
                </h3>
                <p className="text-xl text-gray-200 text-center max-w-4xl mx-auto">
                  WanderSure analyzes your specific trip—destination, dates, activities, bookings—and uses AI to 
                  assess real-time risks, then builds a custom insurance policy with only the coverage you need, 
                  priced dynamically based on actual risk.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-blue-400/50 transition-all">
                <CardContent className="p-6">
                  <div className="p-4 bg-blue-600 rounded-xl w-fit mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">AI Risk Analysis</h3>
                  <p className="text-gray-300 mb-4">
                    Our proprietary AI analyzes 50+ risk factors including destination safety, weather patterns, 
                    airline reliability, political stability, and health concerns.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Real-time data integration</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Predictive risk scoring</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Historical claim data analysis</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-teal-400/50 transition-all">
                <CardContent className="p-6">
                  <div className="p-4 bg-teal-600 rounded-xl w-fit mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Custom Policy Builder</h3>
                  <p className="text-gray-300 mb-4">
                    Build your perfect policy by selecting only the coverage you need. Our AI recommends what's 
                    essential based on your trip's unique risk profile.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">À la carte coverage selection</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Smart recommendations</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Transparent pricing breakdown</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-purple-400/50 transition-all">
                <CardContent className="p-6">
                  <div className="p-4 bg-purple-600 rounded-xl w-fit mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Dynamic Pricing</h3>
                  <p className="text-gray-300 mb-4">
                    Pay based on actual risk, not generic pricing. Low-risk trips save money, while high-risk 
                    trips get the protection they need at fair prices.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Risk-adjusted premiums</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">No hidden fees</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-sm">Instant quote comparison</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-green-600 to-teal-600 border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-white">1</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Enter Trip Details</h4>
                    <p className="text-sm text-white/80">Destination, dates, travelers, bookings</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-white">2</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">AI Risk Analysis</h4>
                    <p className="text-sm text-white/80">Real-time assessment of all trip risks</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-white">3</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Build Custom Policy</h4>
                    <p className="text-sm text-white/80">Select only the coverage you need</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-white">4</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">Travel Protected</h4>
                    <p className="text-sm text-white/80">Real-time alerts and 24/7 support</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Market Opportunity */}
        <section id="market" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-green-400" />
              Market Opportunity
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Market Size</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Global Travel Insurance (2024)</span>
                        <span className="text-2xl font-bold text-white">$25.4B</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-full"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Projected Market (2028)</span>
                        <span className="text-2xl font-bold text-green-400">$1.9T</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 w-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-gray-300 text-sm">
                        <strong className="text-white">CAGR: 17.3%</strong> - Driven by increased travel, 
                        awareness of travel risks, and digital insurance adoption
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Target Segments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-500/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-white">Millennials & Gen Z</h4>
                      <Badge className="bg-blue-600">Primary</Badge>
                    </div>
                    <p className="text-sm text-gray-300">55% of travelers, tech-savvy, value-conscious</p>
                    <p className="text-2xl font-bold text-white mt-2">$14B market</p>
                  </div>
                  
                  <div className="p-4 bg-purple-500/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-white">Business Travelers</h4>
                      <Badge className="bg-purple-600">Secondary</Badge>
                    </div>
                    <p className="text-sm text-gray-300">Frequent flyers, high-value policies</p>
                    <p className="text-2xl font-bold text-white mt-2">$8B market</p>
                  </div>
                  
                  <div className="p-4 bg-teal-500/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-white">Adventure Travelers</h4>
                      <Badge className="bg-teal-600">Growing</Badge>
                    </div>
                    <p className="text-sm text-gray-300">High-risk activities, specialized coverage</p>
                    <p className="text-2xl font-bold text-white mt-2">$3.4B market</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 border-0 mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Why Now?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-4xl font-bold text-white mb-2">📈</div>
                    <h4 className="font-semibold text-white mb-2">Travel Boom</h4>
                    <p className="text-white/90 text-sm">
                      Post-pandemic travel surge: 1.5B international trips in 2024, up 30% from 2023
                    </p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white mb-2">🤖</div>
                    <h4 className="font-semibold text-white mb-2">AI Maturity</h4>
                    <p className="text-white/90 text-sm">
                      Advanced AI enables real-time risk analysis and dynamic pricing at scale
                    </p>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-white mb-2">💡</div>
                    <h4 className="font-semibold text-white mb-2">Consumer Awareness</h4>
                    <p className="text-white/90 text-sm">
                      Travelers increasingly demand personalized, flexible insurance options
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Competitive Edge */}
        <section id="competitive" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
              <Award className="w-10 h-10 text-yellow-400" />
              Competitive Advantages
            </h2>
            
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                  How We're Different from Traditional Insurance & Travel Booking Sites
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-4 px-4 text-gray-300 font-semibold">Feature</th>
                        <th className="text-center py-4 px-4 text-white font-bold">
                          <div className="flex items-center justify-center gap-2">
                            <img 
                              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f24e9d50db61a8178058b4/b6c0bc4b2_ChatGPTImageOct17202512_05_29PM.png" 
                              alt="WanderSure"
                              className="w-6 h-6 object-contain"
                            />
                            WanderSure
                          </div>
                        </th>
                        <th className="text-center py-4 px-4 text-gray-400">Traditional Insurance</th>
                        <th className="text-center py-4 px-4 text-gray-400">Expedia/Booking.com</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-white/10">
                        <td className="py-4 px-4 text-gray-300">AI Risk Analysis</td>
                        <td className="text-center py-4 px-4">
                          <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4 text-gray-500">✗</td>
                        <td className="text-center py-4 px-4 text-gray-500">✗</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-4 px-4 text-gray-300">Custom Policy Builder</td>
                        <td className="text-center py-4 px-4">
                          <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4 text-gray-500">✗</td>
                        <td className="text-center py-4 px-4 text-gray-500">✗</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-4 px-4 text-gray-300">Dynamic Pricing</td>
                        <td className="text-center py-4 px-4">
                          <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4 text-gray-500">✗</td>
                        <td className="text-center py-4 px-4 text-gray-500">✗</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-4 px-4 text-gray-300">Real-Time Travel Alerts</td>
                        <td className="text-center py-4 px-4">
                          <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4 text-gray-500">✗</td>
                        <td className="text-center py-4 px-4 text-yellow-500">Limited</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-4 px-4 text-gray-300">Trip Management Dashboard</td>
                        <td className="text-center py-4 px-4">
                          <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4 text-gray-500">✗</td>
                        <td className="text-center py-4 px-4 text-yellow-500">Basic</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-4 px-4 text-gray-300">Multi-Provider Comparison</td>
                        <td className="text-center py-4 px-4">
                          <CheckCircle className="w-6 h-6 text-green-400 mx-auto" />
                        </td>
                        <td className="text-center py-4 px-4 text-gray-500">✗</td>
                        <td className="text-center py-4 px-4 text-gray-500">✗</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-4 text-gray-300">Average Cost Savings</td>
                        <td className="text-center py-4 px-4 text-green-400 font-bold">40%</td>
                        <td className="text-center py-4 px-4 text-gray-500">—</td>
                        <td className="text-center py-4 px-4 text-gray-500">10-15%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-blue-900/30 backdrop-blur-xl border-blue-500/30">
                <CardContent className="p-6">
                  <div className="p-3 bg-blue-600 rounded-lg w-fit mb-4">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Proprietary AI Technology</h3>
                  <p className="text-gray-300">
                    Our machine learning models are trained on millions of travel data points, 
                    providing unmatched risk prediction accuracy. This creates a significant moat 
                    against traditional competitors.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-purple-900/30 backdrop-blur-xl border-purple-500/30">
                <CardContent className="p-6">
                  <div className="p-3 bg-purple-600 rounded-lg w-fit mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">Customer-First Approach</h3>
                  <p className="text-gray-300">
                    Unlike traditional insurers focused on maximizing premiums, our business model 
                    thrives on customer satisfaction and repeat usage. Fair pricing drives loyalty and 
                    word-of-mouth growth.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-teal-900/30 backdrop-blur-xl border-teal-500/30">
                <CardContent className="p-6">
                  <div className="p-3 bg-teal-600 rounded-lg w-fit mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">First-Mover Advantage</h3>
                  <p className="text-gray-300">
                    We're pioneering the AI-powered, personalized travel insurance category. Our early 
                    market entry allows us to establish brand leadership and build network effects before 
                    competitors catch up.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </section>

        {/* Business Model */}
        <section id="business" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
              <DollarSign className="w-10 h-10 text-green-400" />
              Business Model & Revenue
            </h2>
            
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-white mb-6 text-center">Multiple Revenue Streams</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-bold text-white">Insurance Commissions</h4>
                      <Badge className="bg-white/20 text-white">Primary</Badge>
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">15-20%</p>
                    <p className="text-blue-100 mb-4">Commission on every policy sold through partner insurers</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-100">Average Policy</span>
                        <span className="text-white font-semibold">$127</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-100">Average Commission</span>
                        <span className="text-white font-semibold">$19-25</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-bold text-white">B2B Partnerships</h4>
                      <Badge className="bg-white/20 text-white">Growth</Badge>
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">$500K-2M</p>
                    <p className="text-purple-100 mb-4">White-label solutions for travel booking platforms</p>
                    <ul className="space-y-2 text-sm text-purple-100">
                      <li>• API integration fees</li>
                      <li>• Revenue share partnerships</li>
                      <li>• Corporate travel programs</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-bold text-white">Data & Analytics</h4>
                      <Badge className="bg-white/20 text-white">Future</Badge>
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">$1-5M</p>
                    <p className="text-teal-100 mb-4">Anonymized travel risk data for enterprise clients</p>
                    <ul className="space-y-2 text-sm text-teal-100">
                      <li>• Travel industry insights</li>
                      <li>• Risk intelligence reports</li>
                      <li>• Predictive analytics tools</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-bold text-white">Premium Features</h4>
                      <Badge className="bg-white/20 text-white">Add-on</Badge>
                    </div>
                    <p className="text-3xl font-bold text-white mb-2">$9-29/mo</p>
                    <p className="text-orange-100 mb-4">Subscription for power travelers</p>
                    <ul className="space-y-2 text-sm text-orange-100">
                      <li>• Unlimited trip tracking</li>
                      <li>• Priority support</li>
                      <li>• Exclusive discounts</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-600 to-teal-600 border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">5-Year Revenue Projection</h3>
                <div className="grid md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-white/80 mb-2">Year 1</p>
                    <p className="text-3xl font-bold text-white mb-1">$2.5M</p>
                    <p className="text-xs text-white/70">20K policies</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-white/80 mb-2">Year 2</p>
                    <p className="text-3xl font-bold text-white mb-1">$8.5M</p>
                    <p className="text-xs text-white/70">65K policies</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-white/80 mb-2">Year 3</p>
                    <p className="text-3xl font-bold text-white mb-1">$50M</p>
                    <p className="text-xs text-white/70">250K policies</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-white/80 mb-2">Year 4</p>
                    <p className="text-3xl font-bold text-white mb-1">$150M</p>
                    <p className="text-xs text-white/70">625K policies</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-white/80 mb-2">Year 5</p>
                    <p className="text-3xl font-bold text-white mb-1">$325M</p>
                    <p className="text-xs text-white/70">1.2M policies</p>
                  </div>
                </div>
                <p className="text-center text-white/90 mt-6 text-sm">
                  Conservative projections based on 2-5% market penetration and 15% average commission rate
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Technology */}
        <section id="technology" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
              <Brain className="w-10 h-10 text-purple-400" />
              Technology & Platform
            </h2>
            
            <Card className="bg-white/5 backdrop-blur-xl border-white/10 mb-8">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-white mb-6">Our Technology Stack</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">AI & Machine Learning</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-white font-medium">Proprietary Risk Scoring Algorithm</p>
                          <p className="text-sm text-gray-300">Analyzes 50+ real-time data sources for accuracy</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-white font-medium">Natural Language Processing</p>
                          <p className="text-sm text-gray-300">Processes news, advisories, and social data</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-white font-medium">Predictive Analytics</p>
                          <p className="text-sm text-gray-300">Forecasts flight delays, weather disruptions, etc.</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Platform Features</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-white font-medium">Real-Time API Integration</p>
                          <p className="text-sm text-gray-300">Connects with major insurance providers</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-white font-medium">Automated Claims Processing</p>
                          <p className="text-sm text-gray-300">AI-assisted claims submission and tracking</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-white font-medium">Mobile-First Architecture</p>
                          <p className="text-sm text-gray-300">Seamless experience across all devices</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">🔒</div>
                  <h4 className="text-lg font-semibold text-white mb-2">Enterprise Security</h4>
                  <p className="text-gray-300 text-sm">
                    SOC 2 Type II compliance, end-to-end encryption, and secure payment processing
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">⚡</div>
                  <h4 className="text-lg font-semibold text-white mb-2">Lightning Fast</h4>
                  <p className="text-gray-300 text-sm">
                    Sub-second quote generation with 99.9% uptime SLA for mission-critical operations
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-xl border-white/10">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">📈</div>
                  <h4 className="text-lg font-semibold text-white mb-2">Infinitely Scalable</h4>
                  <p className="text-gray-300 text-sm">
                    Cloud-native architecture built to handle millions of users and transactions
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </section>

        {/* Traction */}
        <section id="traction" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
              <BarChart3 className="w-10 h-10 text-blue-400" />
              Growth Metrics & Traction
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 border-0">
                <CardContent className="p-6 text-center">
                  <p className="text-5xl font-bold text-white mb-2">12K</p>
                  <p className="text-blue-100">Beta Users</p>
                  <p className="text-sm text-blue-200 mt-2">Waitlist signups in 3 months</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600 to-green-700 border-0">
                <CardContent className="p-6 text-center">
                  <p className="text-5xl font-bold text-white mb-2">94%</p>
                  <p className="text-green-100">User Satisfaction</p>
                  <p className="text-sm text-green-200 mt-2">Beta tester NPS score</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0">
                <CardContent className="p-6 text-center">
                  <p className="text-5xl font-bold text-white mb-2">3</p>
                  <p className="text-purple-100">Insurance Partners</p>
                  <p className="text-sm text-purple-200 mt-2">LOIs signed with major carriers</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-600 to-orange-700 border-0">
                <CardContent className="p-6 text-center">
                  <p className="text-5xl font-bold text-white mb-2">$40K</p>
                  <p className="text-orange-100">MRR (Projected)</p>
                  <p className="text-sm text-orange-200 mt-2">Month 1 post-launch</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-white mb-6">Key Milestones Achieved</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Platform MVP Completed</h4>
                      <p className="text-gray-300">Fully functional web app with AI risk analysis and custom policy builder</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Insurance Provider Partnerships</h4>
                      <p className="text-gray-300">Letters of Intent with Allianz, AIG, and Generali for API integration</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Beta Testing Success</h4>
                      <p className="text-gray-300">12,000 waitlist signups, 94% satisfaction, 40% average savings validated</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Next 90 Days: Public Launch</h4>
                      <p className="text-gray-300">Full platform launch with live insurance purchasing and claims processing</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Q2 2025: B2B Partnerships</h4>
                      <p className="text-gray-300">White-label integration with 2-3 major travel booking platforms</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* The Ask */}
        <section id="team" className="scroll-mt-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
              <Rocket className="w-10 h-10 text-orange-400" />
              The Investment Opportunity
            </h2>
            
            <Card className="bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 border-0 mb-8">
              <CardContent className="p-12 text-center">
                <h3 className="text-4xl font-bold text-white mb-6">We're Raising $5M Series A</h3>
                <p className="text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
                  To scale our platform, secure additional insurance partnerships, and capture 
                  2-5% market share within 5 years
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-2">Use of Funds</h4>
                    <ul className="text-left text-white/90 space-y-2 text-sm">
                      <li>• 40% - Technology & AI Development</li>
                      <li>• 30% - Marketing & User Acquisition</li>
                      <li>• 20% - Team Expansion</li>
                      <li>• 10% - Operations & Legal</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-2">Target Metrics (Year 2)</h4>
                    <ul className="text-left text-white/90 space-y-2 text-sm">
                      <li>• 65,000 policies sold</li>
                      <li>• $8.5M in revenue</li>
                      <li>• 5+ insurance partners</li>
                      <li>• 2-3 major B2B partnerships</li>
                    </ul>
                  </div>

                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-white mb-2">Exit Strategy</h4>
                    <ul className="text-left text-white/90 space-y-2 text-sm">
                      <li>• Acquisition by major insurer</li>
                      <li>• Acquisition by travel platform</li>
                      <li>• IPO (5-7 year horizon)</li>
                      <li>• Target valuation: $500M-1B</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-xl border-white/10">
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-white mb-6 text-center">Why Invest in WanderSure?</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Massive Market Opportunity</h4>
                      <p className="text-gray-300">$1.9T travel insurance market with 17.3% CAGR and minimal AI disruption</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Unique AI Technology</h4>
                      <p className="text-gray-300">Proprietary algorithms with 98% risk prediction accuracy—a defensible moat</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Proven Product-Market Fit</h4>
                      <p className="text-gray-300">12K beta users, 94% satisfaction, and validated 40% cost savings</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Multiple Revenue Streams</h4>
                      <p className="text-gray-300">Insurance commissions, B2B partnerships, data licensing, and subscriptions</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Clear Path to Scale</h4>
                      <p className="text-gray-300">Platform ready for explosive growth with partnerships already in place</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2">Strong Exit Potential</h4>
                      <p className="text-gray-300">Attractive acquisition target for major insurers and travel platforms</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-12 text-center">
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 inline-block">
                <CardContent className="p-8">
                  <h3 className="text-3xl font-bold text-white mb-4">Ready to Join Us?</h3>
                  <p className="text-xl text-white/90 mb-6 max-w-2xl">
                    Let's revolutionize travel insurance together and capture a multi-billion dollar opportunity
                  </p>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-xl px-12 py-6">
                    Schedule a Meeting
                    <ChevronRight className="w-6 h-6 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f24e9d50db61a8178058b4/b6c0bc4b2_ChatGPTImageOct17202512_05_29PM.png" 
            alt="WanderSure"
            className="w-16 h-16 object-contain mx-auto mb-4 opacity-80"
          />
          <p className="text-gray-400">
            WanderSure • AI-Powered Travel Protection • Investor Deck 2024
          </p>
          <p className="text-gray-500 mt-2 text-sm">
            For investment inquiries: investors@wandersure.com
          </p>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}