import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Sparkles, Loader2, Plus, Trash2 } from "lucide-react";

export default function TripTravelDetails({ tripData, updateTripData, onBack, onSubmit, isSubmitting }) {
  const airlines = [
    "Delta Air Lines",
    "American Airlines",
    "United Airlines",
    "Southwest Airlines",
    "JetBlue Airways",
    "Alaska Airlines",
    "Hawaiian Airlines",
    "Spirit Airlines",
    "Frontier Airlines",
    "Allegiant Air",
    "Sun Country Airlines",
    "Breeze Airways",
    "Air Canada",
    "WestJet",
    "British Airways",
    "Virgin Atlantic",
    "Lufthansa",
    "Air France",
    "KLM Royal Dutch Airlines",
    "Swiss International Air Lines",
    "Austrian Airlines",
    "Brussels Airlines",
    "Iberia",
    "Aer Lingus",
    "Scandinavian Airlines (SAS)",
    "Finnair",
    "Turkish Airlines",
    "LOT Polish Airlines",
    "TAP Air Portugal",
    "Alitalia",
    "Emirates",
    "Qatar Airways",
    "Etihad Airways",
    "Singapore Airlines",
    "Cathay Pacific",
    "Japan Airlines",
    "All Nippon Airways (ANA)",
    "Korean Air",
    "Asiana Airlines",
    "China Eastern Airlines",
    "China Southern Airlines",
    "Air China",
    "Hainan Airlines",
    "EVA Air",
    "Thai Airways",
    "Malaysia Airlines",
    "Air India",
    "IndiGo",
    "Qantas",
    "Virgin Australia",
    "Air New Zealand",
    "LATAM Airlines",
    "Aeromexico",
    "Copa Airlines",
    "Avianca",
    "Volaris",
    "Interjet",
    "GOL Linhas Aéreas",
    "Azul Brazilian Airlines",
    "Air France-KLM",
    "Ryanair",
    "EasyJet",
    "Wizz Air",
    "Norwegian Air",
    "Vueling",
    "Pegasus Airlines",
    "Eurowings",
    "Transavia",
    "Condor",
    "TUI Airways",
    "Icelandair",
    "El Al",
    "South African Airways",
    "Ethiopian Airlines",
    "Kenya Airways",
    "EgyptAir",
    "Royal Air Maroc"
  ].sort();

  const hotelChains = [
    "Marriott International",
    "Hilton Hotels & Resorts",
    "Hyatt Hotels",
    "InterContinental Hotels Group (IHG)",
    "Wyndham Hotels & Resorts",
    "Accor Hotels",
    "Best Western",
    "Radisson Hotels",
    "Choice Hotels",
    "Sheraton Hotels",
    "Westin Hotels & Resorts",
    "Courtyard by Marriott",
    "Hampton Inn",
    "Holiday Inn",
    "DoubleTree by Hilton",
    "Fairmont Hotels",
    "Four Seasons Hotels",
    "Ritz-Carlton",
    "St. Regis Hotels",
    "Waldorf Astoria",
    "W Hotels",
    "Kimpton Hotels",
    "Omni Hotels",
    "Loews Hotels",
    "Mandarin Oriental",
    "Peninsula Hotels",
    "Rosewood Hotels",
    "Sofitel",
    "Novotel",
    "Ibis Hotels",
    "Motel 6",
    "Days Inn",
    "La Quinta",
    "Red Roof Inn",
    "Extended Stay America"
  ].sort();

  const carRentalCompanies = [
    "Enterprise Rent-A-Car",
    "Hertz",
    "Avis",
    "Budget",
    "National Car Rental",
    "Alamo Rent A Car",
    "Dollar Rent A Car",
    "Thrifty Car Rental",
    "Sixt",
    "Europcar",
    "Payless Car Rental",
    "Fox Rent A Car",
    "Advantage Rent A Car",
    "E-Z Rent-A-Car",
    "Ace Rent A Car",
    "Zipcar",
    "Turo",
    "Getaround"
  ].sort();

  const cruiseLines = [
    "Carnival Cruise Line",
    "Royal Caribbean International",
    "Norwegian Cruise Line",
    "Princess Cruises",
    "Celebrity Cruises",
    "Holland America Line",
    "MSC Cruises",
    "Disney Cruise Line",
    "Costa Cruises",
    "Cunard Line",
    "P&O Cruises",
    "Viking Ocean Cruises",
    "Oceania Cruises",
    "Azamara",
    "Regent Seven Seas Cruises",
    "Seabourn Cruise Line",
    "Silversea Cruises",
    "Crystal Cruises",
    "Fred. Olsen Cruise Lines",
    "Marella Cruises",
    "Paul Gauguin Cruises",
    "Windstar Cruises",
    "Ponant",
    "Hurtigruten",
    "UnCruise Adventures"
  ].sort();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Travel Details</h2>
        <p className="text-gray-600">Add your bookings for more accurate risk assessment (optional)</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Tip:</strong> Adding your airline, hotel, and rental car info helps us provide 
            more accurate risk assessments and tailored insurance recommendations.
          </p>
        </div>

        {/* Flight Information */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              ✈️ Flight Information
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const flights = tripData.flights || [];
                updateTripData('flights', [...flights, { 
                  airline: '', 
                  flight_number: '', 
                  departure_airport: '', 
                  arrival_airport: '',
                  departure_date: '',
                  departure_time: ''
                }]);
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Flight
            </Button>
          </div>

          {(!tripData.flights || tripData.flights.length === 0) && (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">No flights added. Click "Add Flight" to add your flight details.</p>
            </div>
          )}

          {(tripData.flights || []).map((flight, index) => (
            <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Flight {index + 1}</h4>
                {(tripData.flights?.length || 0) > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const flights = [...(tripData.flights || [])];
                      flights.splice(index, 1);
                      updateTripData('flights', flights);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                )}
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Airline</Label>
                  <Select
                    value={flight.airline}
                    onValueChange={(value) => {
                      const flights = [...(tripData.flights || [])];
                      flights[index].airline = value;
                      updateTripData('flights', flights);
                    }}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select airline" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {airlines.map(airline => (
                        <SelectItem key={airline} value={airline}>
                          {airline}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Flight Number</Label>
                  <Input
                    placeholder="e.g., DL1234"
                    value={flight.flight_number}
                    onChange={(e) => {
                      const flights = [...(tripData.flights || [])];
                      flights[index].flight_number = e.target.value;
                      updateTripData('flights', flights);
                    }}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Departure Airport</Label>
                  <Input
                    placeholder="e.g., JFK"
                    value={flight.departure_airport}
                    onChange={(e) => {
                      const flights = [...(tripData.flights || [])];
                      flights[index].departure_airport = e.target.value;
                      updateTripData('flights', flights);
                    }}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Arrival Airport</Label>
                  <Input
                    placeholder="e.g., LAX"
                    value={flight.arrival_airport}
                    onChange={(e) => {
                      const flights = [...(tripData.flights || [])];
                      flights[index].arrival_airport = e.target.value;
                      updateTripData('flights', flights);
                    }}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Departure Date</Label>
                  <Input
                    type="date"
                    value={flight.departure_date}
                    onChange={(e) => {
                      const flights = [...(tripData.flights || [])];
                      flights[index].departure_date = e.target.value;
                      updateTripData('flights', flights);
                    }}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Departure Time</Label>
                  <Input
                    type="time"
                    value={flight.departure_time}
                    onChange={(e) => {
                      const flights = [...(tripData.flights || [])];
                      flights[index].departure_time = e.target.value;
                      updateTripData('flights', flights);
                    }}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          ))}

          <a 
            href="https://www.kqzyfj.com/click-101622714-17112391" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Search for flights
          </a>
          <img src="https://www.tqlkg.com/image-101622714-17112391" width="1" height="1" border="0" alt="" className="hidden" />
        </div>

        {/* Hotel Information */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            🏨 Hotel Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hotel_name">Hotel Chain</Label>
              <Select
                value={tripData.hotel_name}
                onValueChange={(value) => updateTripData('hotel_name', value)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select hotel chain" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {hotelChains.map(hotel => (
                    <SelectItem key={hotel} value={hotel}>
                      {hotel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hotel_booking_number">Booking/Confirmation Number</Label>
              <Input
                id="hotel_booking_number"
                placeholder="e.g., HT123456789"
                value={tripData.hotel_booking_number || ''}
                onChange={(e) => updateTripData('hotel_booking_number', e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
        </div>

        {/* Car Rental Information */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            🚗 Car Rental Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="car_rental_company">Car Rental Company</Label>
              <Select
                value={tripData.car_rental_company}
                onValueChange={(value) => updateTripData('car_rental_company', value)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select car rental company" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {carRentalCompanies.map(company => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="car_rental_booking_number">Reservation Number</Label>
              <Input
                id="car_rental_booking_number"
                placeholder="e.g., CR987654321"
                value={tripData.car_rental_booking_number || ''}
                onChange={(e) => updateTripData('car_rental_booking_number', e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
        </div>

        {/* Cruise Information */}
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            🚢 Cruise Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cruise_line">Cruise Line</Label>
              <Select
                value={tripData.cruise_line}
                onValueChange={(value) => updateTripData('cruise_line', value)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select cruise line" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {cruiseLines.map(cruise => (
                    <SelectItem key={cruise} value={cruise}>
                      {cruise}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cruise_booking_number">Booking Number</Label>
              <Input
                id="cruise_booking_number"
                placeholder="e.g., CS555666777"
                value={tripData.cruise_booking_number || ''}
                onChange={(e) => updateTripData('cruise_booking_number', e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Trip...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze Trip & Get Recommendations
            </>
          )}
        </Button>
      </div>
    </div>
  );
}