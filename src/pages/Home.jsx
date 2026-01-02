import React from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Shield, Sparkles, Bell, Brain, CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (isAuth) {
      navigate(createPageUrl("Dashboard"));
    } else {
      base44.auth.redirectToLogin(createPageUrl("Dashboard"));
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Photo Background */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80"
            alt="Travel Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/85 to-teal-900/90"></div>
        </div>

        {/* Animated Overlays */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center justify-center px-4">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Logo */}
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center shadow-2xl">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f24e9d50db61a8178058b4/b6c0bc4b2_ChatGPTImageOct17202512_05_29PM.png"
                    alt="WanderSure"
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>

              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                WanderSure
              </h1>
              
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400/90 backdrop-blur-sm rounded-full mb-8">
                <Sparkles className="w-5 h-5 text-yellow-900" />
                <span className="text-yellow-900 font-bold text-lg">AI-Powered Travel Intelligence</span>
              </div>

              <p className="text-2xl md:text-3xl text-blue-100 mb-4 max-w-3xl mx-auto leading-relaxed">
                Real-time flight tracking, smart alerts, and AI risk analysis. 
                Travel confidently with instant updates that matter.
              </p>
              
              <p className="text-lg text-blue-200 mb-12 max-w-2xl mx-auto">
                WanderSure monitors your trips 24/7, delivering critical alerts for flight delays, weather changes, and safety updates. 
                Our AI analyzes travel risks and recommends personalized insurance coverage to protect your journey.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="bg-white text-blue-600 hover:bg-blue-50 text-xl px-12 py-8 shadow-2xl group"
                >
                  Get Started Free
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
                <Link to={createPageUrl("Legal")}>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-3 border-white text-white hover:bg-white/10 text-xl px-12 py-8 backdrop-blur-sm"
                  >
                    Privacy Policy
                  </Button>
                </Link>
              </div>

              {/* Feature Highlights */}
              <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                  <Brain className="w-10 h-10 text-cyan-300 mb-3 mx-auto" />
                  <p className="text-white font-semibold">AI Risk Analysis</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                  <Bell className="w-10 h-10 text-yellow-300 mb-3 mx-auto" />
                  <p className="text-white font-semibold">Real-Time Alerts</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                  <Shield className="w-10 h-10 text-green-300 mb-3 mx-auto" />
                  <p className="text-white font-semibold">Smart Coverage</p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                  <Sparkles className="w-10 h-10 text-purple-300 mb-3 mx-auto" />
                  <p className="text-white font-semibold">Travel Aides</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Why WanderSure?</h2>
            <p className="text-xl text-gray-600">The only travel platform you'll ever need</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Live Intelligence</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Real-time flight delays & gate changes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Live TSA wait times</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Hour-by-hour weather tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Safety & political updates</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Risk Analysis</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Analyze every trip automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Personalized risk scores</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Smart insurance recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Dynamic coverage pricing</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Travel Aides</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Interactive smart checklists</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Timeline-based reminders</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Destination playbooks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Expert travel guides</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80"
            alt="Start Your Journey"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 to-purple-900/95"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Travel Smarter?
          </h2>
          <p className="text-2xl text-blue-100 mb-8">
            Join thousands of travelers who never miss an update
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-blue-600 hover:bg-blue-50 text-2xl px-16 py-10 shadow-2xl group"
            >
              Start Free Today
              <ArrowRight className="w-7 h-7 ml-4 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Link to={createPageUrl("Legal")} className="text-blue-200 hover:text-white underline">
              Privacy Policy & Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}