import React from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Shield, Sparkles, Bell, Brain, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const handleLoginToPortal = async () => {
    const isAuth = await base44.auth.isAuthenticated();
    if (isAuth) {
      window.location.href = createPageUrl("Dashboard");
    } else {
      base44.auth.redirectToLogin(createPageUrl("Dashboard"));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f24e9d50db61a8178058b4/1c7001d0e_Untitleddesign.png" 
                alt="WanderSure"
                className="w-28 h-28 object-contain"
              />
              <span className="text-2xl font-bold text-white">WanderSure</span>
            </div>
            <Button 
              onClick={handleLoginToPortal}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
            >
              Log Into Portal
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Photo */}
      <div className="relative h-screen">
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=80"
          alt="Travel Adventure"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-cyan-900/80 to-transparent"></div>
        
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-white font-medium">AI-Powered Travel Intelligence</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Travel Smarter,
                <br />
                <span className="text-cyan-300">Stay Protected</span>
              </h1>
              
              <p className="text-2xl text-blue-100 mb-8 leading-relaxed">
                Real-time alerts for your trips. AI-powered risk analysis. 
                Never miss a flight change, weather update, or safety warning again.
              </p>
              
              <Button 
                onClick={handleLoginToPortal}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 text-2xl px-12 py-8 shadow-2xl group"
              >
                Get Started Free
                <ArrowRight className="w-7 h-7 ml-4 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* What We Do Section */}
      <div className="py-24 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">What is WanderSure?</h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Your AI travel companion that monitors your trips 24/7 and keeps you informed with instant, personalized alerts
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Bell className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Alerts</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Get instant notifications for flight delays, gate changes, TSA wait times, and weather updates. Never be caught off guard.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">AI Risk Analysis</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our AI analyzes your destination's safety, weather patterns, and travel disruptions to assess risks and recommend protection.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Travel Aides & Tools</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Access expert-crafted checklists, destination playbooks, safety guides, and budget planners to make every trip stress-free.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Photo Grid Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Travel with Confidence</h2>
            <p className="text-2xl text-gray-600">From beaches to mountains, cities to countryside - we've got you covered</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
              "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800",
              "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800",
              "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800",
              "https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=800",
              "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800",
              "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800"
            ].map((src, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative h-64 rounded-2xl overflow-hidden group"
              >
                <img 
                  src={src}
                  alt={`Travel destination ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">How WanderSure Helps You</h2>
            <p className="text-2xl text-gray-600">Three simple steps to worry-free travel</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Add Your Trip",
                description: "Enter your travel details - flights, hotels, destinations. Or let us parse your confirmation emails automatically.",
                icon: "✈️"
              },
              {
                step: "2",
                title: "Get Smart Monitoring",
                description: "Our AI tracks your trip 24/7, monitoring flights, weather, safety alerts, and local conditions in real-time.",
                icon: "🤖"
              },
              {
                step: "3",
                title: "Receive Instant Alerts",
                description: "Get personalized notifications for delays, changes, and risks. Stay informed and travel confidently.",
                icon: "🔔"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="text-8xl mb-6">{item.icon}</div>
                <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative py-32 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80"
          alt="Start your journey"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-cyan-900/90 to-blue-900/95"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Travel Smarter?
          </h2>
          <p className="text-2xl text-blue-100 mb-8">
            Join thousands of travelers who never miss an update
          </p>
          <div className="flex flex-col items-center gap-4">
            <Button 
              size="lg"
              onClick={handleLoginToPortal}
              className="bg-white text-blue-600 hover:bg-blue-50 text-2xl px-16 py-10 shadow-2xl group"
            >
              Start Free Today
              <ArrowRight className="w-7 h-7 ml-4 group-hover:translate-x-2 transition-transform" />
            </Button>
            <div className="flex gap-6 text-blue-200">
              <Link to={createPageUrl("PrivacyPolicy")} className="hover:text-white underline">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to={createPageUrl("TermsOfService")} className="hover:text-white underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68f24e9d50db61a8178058b4/1c7001d0e_Untitleddesign.png" 
                alt="WanderSure"
                className="w-16 h-16 object-contain"
              />
              <span className="text-xl font-bold">WanderSure</span>
            </div>
            <p className="text-gray-400">© 2026 WanderSure. Your journey, protected.</p>
            <div className="flex gap-6">
              <Link to={createPageUrl("PrivacyPolicy")} className="text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link to={createPageUrl("TermsOfService")} className="text-gray-400 hover:text-white">
                Terms
              </Link>
              <a href="mailto:support@wandersure.com" className="text-gray-400 hover:text-white">
                Support
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}