import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, CheckCircle, Star } from "lucide-react";
import insuranceProvider from "./InsuranceProviderService";

export default function ProviderComparison({ trip, coverageTypes, onSelectQuote }) {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, [trip, coverageTypes]);

  const loadQuotes = async () => {
    if (!trip || !coverageTypes || coverageTypes.length === 0) return;
    
    setLoading(true);
    try {
      const providerQuotes = await insuranceProvider.compareProviders(trip, coverageTypes);
      setQuotes(providerQuotes);
    } catch (error) {
      console.error("Error loading provider quotes:", error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="p-12 text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
          <p className="text-gray-600">Comparing quotes from multiple providers...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Compare Providers
      </h3>
      
      {quotes.map((quote, index) => (
        <Card 
          key={index}
          className={`border-2 hover:border-blue-300 transition-all ${
            index === 0 ? 'border-blue-500 ring-2 ring-blue-200' : ''
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-lg">{quote.provider_name}</h4>
                  {index === 0 && (
                    <Badge className="bg-green-100 text-green-800">
                      <Star className="w-3 h-3 mr-1" />
                      Best Value
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">Quote ID: {quote.quote_id}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-600">
                  ${quote.premium_amount}
                </p>
                <p className="text-xs text-gray-500">one-time</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Coverage Limit</span>
                <span className="font-medium">${quote.coverage_limit.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">24/7 Support</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Claims Phone</span>
                <span className="font-medium">{quote.provider_contact.claims_phone}</span>
              </div>
            </div>

            <Button
              className="w-full"
              variant={index === 0 ? "default" : "outline"}
              onClick={() => onSelectQuote(quote)}
            >
              <Shield className="w-4 h-4 mr-2" />
              Select {quote.provider_name}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}