import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { airports } from "../utils/airportData";

export default function TripBasicInfo({ tripData, updateTripData, onNext, onParseEmails, isParsingEmails = false }) {
  const [airportSearch, setAirportSearch] = useState('');
  const [showAirportDropdown, setShowAirportDropdown] = useState(false);
  
  const filteredAirports = airports.filter(airport => 
    airport.code.toLowerCase().includes(airportSearch.toLowerCase()) ||
    airport.name.toLowerCase().includes(airportSearch.toLowerCase()) ||
    airport.city.toLowerCase().includes(airportSearch.toLowerCase()) ||
    (airport.state && airport.state.toLowerCase().includes(airportSearch.toLowerCase()))
  ).slice(0, 10);

  const handleAirportSelect = (airport) => {
    updateTripData('destination', `${airport.city} (${airport.code})`);
    updateTripData('destination_country', airport.country);
    setAirportSearch('');
    setShowAirportDropdown(false);
  };

  const isValid = tripData.trip_name && tripData.destination && 
                  tripData.destination_country && tripData.start_date && 
                  tripData.end_date;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Basics</h2>
        <p className="text-gray-600">Start with the essential details of your journey</p>
      </div>

      {onParseEmails && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 mb-1">Have booking confirmations in your email?</p>
                <p className="text-sm text-gray-600">We'll automatically fill in your trip details</p>
              </div>
              <Button
                onClick={onParseEmails}
                disabled={isParsingEmails}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isParsingEmails ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Parsing...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Parse Emails
                  </>
                )}
              </Button>
            </div>
            <div className="pt-3 border-t border-blue-200">
              <p className="text-sm text-gray-700 mb-2">Or enter your confirmation number manually:</p>
              <Input
                placeholder="e.g., ABC123 (we'll help extract details)"
                value={tripData.manual_confirmation || ''}
                onChange={(e) => updateTripData('manual_confirmation', e.target.value)}
                className="bg-white"
              />
              <p className="text-xs text-gray-500 mt-1">If auto-parsing doesn't work, enter it here and fill details below</p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="trip_name">Trip Name *</Label>
          <Input
            id="trip_name"
            placeholder="e.g., Summer Vacation to Paris"
            value={tripData.trip_name}
            onChange={(e) => updateTripData('trip_name', e.target.value)}
            className="mt-1.5"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Label htmlFor="airport_search">Destination Airport *</Label>
            <div className="relative mt-1.5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="airport_search"
                placeholder="Search by code or city (e.g., LAX, London)"
                value={airportSearch || tripData.destination}
                onChange={(e) => {
                  setAirportSearch(e.target.value);
                  setShowAirportDropdown(true);
                }}
                onFocus={() => setShowAirportDropdown(true)}
                className="pl-9"
              />
            </div>
            {showAirportDropdown && airportSearch && filteredAirports.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {filteredAirports.map((airport) => (
                  <button
                    key={airport.code}
                    type="button"
                    onClick={() => handleAirportSelect(airport)}
                    className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {airport.code} - {airport.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {airport.city}, {airport.state ? `${airport.state}, ` : ''}{airport.country}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="destination_country">Country / State *</Label>
            <Input
              id="destination_country"
              placeholder="Auto-filled from airport selection"
              value={tripData.destination_country}
              onChange={(e) => updateTripData('destination_country', e.target.value)}
              className="mt-1.5 bg-gray-50"
              readOnly
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start_date">Start Date *</Label>
            <Input
              id="start_date"
              type="date"
              value={tripData.start_date}
              onChange={(e) => updateTripData('start_date', e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="end_date">End Date *</Label>
            <Input
              id="end_date"
              type="date"
              value={tripData.end_date}
              onChange={(e) => updateTripData('end_date', e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="travelers_count">Number of Travelers</Label>
            <Input
              id="travelers_count"
              type="number"
              min="1"
              value={tripData.travelers_count}
              onChange={(e) => updateTripData('travelers_count', parseInt(e.target.value))}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="trip_cost">Estimated Trip Cost ($)</Label>
            <Input
              id="trip_cost"
              type="number"
              min="0"
              placeholder="Total cost of trip"
              value={tripData.trip_cost || ''}
              onChange={(e) => updateTripData('trip_cost', parseFloat(e.target.value) || 0)}
              className="mt-1.5"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={onNext}
          disabled={!isValid}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue to Travel Details
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}