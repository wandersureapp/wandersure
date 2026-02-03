import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, MapPin } from "lucide-react";

export default function MultiDestinationManager({ destinations = [], onChange }) {
  const addDestination = () => {
    onChange([...destinations, {
      city: "",
      country: "",
      arrival_date: "",
      departure_date: "",
      purpose: "lodging",
      hotel_name: "",
      hotel_booking_number: ""
    }]);
  };

  const removeDestination = (index) => {
    const updated = destinations.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateDestination = (index, field, value) => {
    const updated = [...destinations];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            Trip Destinations
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Add all locations you'll visit - layovers, work locations, lodging destinations
          </p>
        </div>
        <Button type="button" onClick={addDestination} size="sm">
          <Plus className="w-4 h-4 mr-1" />
          Add Destination
        </Button>
      </div>

      {destinations.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="p-6 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-2">No destinations added yet</p>
            <p className="text-sm text-gray-500 mb-4">
              Add multiple stops for accurate risk assessment across your entire journey
            </p>
            <Button type="button" onClick={addDestination} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Destination
            </Button>
          </CardContent>
        </Card>
      )}

      {destinations.map((dest, index) => (
        <Card key={index} className="border-2 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">
                Stop {index + 1}
              </h4>
              {destinations.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDestination(index)}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>City</Label>
                <Input
                  placeholder="e.g., Oklahoma City"
                  value={dest.city}
                  onChange={(e) => updateDestination(index, 'city', e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Country</Label>
                <Input
                  placeholder="e.g., United States"
                  value={dest.country}
                  onChange={(e) => updateDestination(index, 'country', e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Arrival Date</Label>
                <Input
                  type="date"
                  value={dest.arrival_date}
                  onChange={(e) => updateDestination(index, 'arrival_date', e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Departure Date</Label>
                <Input
                  type="date"
                  value={dest.departure_date}
                  onChange={(e) => updateDestination(index, 'departure_date', e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="mt-4">
              <Label>Purpose of Stop</Label>
              <Select
                value={dest.purpose}
                onValueChange={(value) => updateDestination(index, 'purpose', value)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Choose stop purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lodging">Lodging/Accommodation</SelectItem>
                  <SelectItem value="work">Work/Business</SelectItem>
                  <SelectItem value="layover">Layover/Connection</SelectItem>
                  <SelectItem value="sightseeing">Sightseeing/Tourism</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(dest.purpose === 'lodging' || dest.purpose === 'sightseeing') && (
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Hotel Name (Optional)</Label>
                  <Input
                    placeholder="e.g., Marriott Downtown"
                    value={dest.hotel_name || ''}
                    onChange={(e) => updateDestination(index, 'hotel_name', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label>Booking Number (Optional)</Label>
                  <Input
                    placeholder="e.g., HT123456"
                    value={dest.hotel_booking_number || ''}
                    onChange={(e) => updateDestination(index, 'hotel_booking_number', e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}