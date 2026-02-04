import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import SafePageWrapper from "../components/utils/SafePageWrapper";

export default function DeleteAccount() {
  return (
    <SafePageWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Delete Your Account</h1>
                <p className="text-gray-600 mt-1">WanderSure - Travel Intelligence Platform</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-900">Important Notice</p>
                  <p className="text-red-800 text-sm mt-1">
                    Account deletion is permanent and cannot be undone. All your data will be immediately and permanently removed from our servers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Steps to Delete */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Delete Your Account</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Open the WanderSure App</h3>
                  <p className="text-gray-600">
                    Launch the WanderSure mobile app or visit the web portal at wandersure.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Log Into Your Account</h3>
                  <p className="text-gray-600">
                    Sign in using your email address and password
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Navigate to Profile Settings</h3>
                  <p className="text-gray-600">
                    Tap your profile icon in the top right corner, then select "Profile" from the dropdown menu
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Scroll to the "Danger Zone" Section</h3>
                  <p className="text-gray-600">
                    Scroll to the bottom of your profile page to find the red "Danger Zone" card
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Click "Delete My Account"</h3>
                  <p className="text-gray-600">
                    Click the red "Delete My Account" button and confirm your decision in the confirmation dialog
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Need Help?</strong> If you're unable to access your account or need assistance, contact our support team at{" "}
                <a href="mailto:support@wandersure.com" className="text-blue-600 hover:underline">
                  support@wandersure.com
                </a>
              </p>
            </div>
          </div>

          {/* Data Deletion Details */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What Data Gets Deleted</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">All Personal Information</h4>
                  <p className="text-gray-600 text-sm">Name, email, phone number, address, date of birth</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">All Travel Data</h4>
                  <p className="text-gray-600 text-sm">Trip details, destinations, flights, hotels, bookings, itineraries</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Risk Assessments & Recommendations</h4>
                  <p className="text-gray-600 text-sm">All AI-generated risk analysis, insurance recommendations, and travel alerts</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Notification Preferences</h4>
                  <p className="text-gray-600 text-sm">Alert settings, subscription tier, communication preferences</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Travel Documents & Emergency Contacts</h4>
                  <p className="text-gray-600 text-sm">Passport information, emergency contact details, travel preferences</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Payment & Subscription Information</h4>
                  <p className="text-gray-600 text-sm">Billing details, subscription history, purchase records</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Complete Data Deletion Policy</h3>
              
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <strong className="text-gray-900">Data Deleted:</strong>
                  <p className="mt-1">100% of your personal data, travel information, and account details are permanently deleted immediately upon account deletion.</p>
                </div>
                
                <div>
                  <strong className="text-gray-900">Data Retained:</strong>
                  <p className="mt-1">None. We do not retain any personal data after account deletion.</p>
                </div>
                
                <div>
                  <strong className="text-gray-900">Retention Period:</strong>
                  <p className="mt-1">No retention period. Data is permanently deleted immediately and cannot be recovered.</p>
                </div>

                <div>
                  <strong className="text-gray-900">Backup Systems:</strong>
                  <p className="mt-1">Your data is also removed from all backup systems within 30 days of account deletion, as part of our automated backup rotation cycle.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Button */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ready to Delete Your Account?</h2>
            <p className="text-gray-600 mb-6">You must be logged in to delete your account</p>
            <Link to={createPageUrl("Profile")}>
              <Button className="bg-red-600 hover:bg-red-700 text-lg px-8 py-6">
                Go to Profile Settings
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link to={createPageUrl("Home")} className="text-blue-600 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </SafePageWrapper>
  );
}