import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { User, Mail, MapPin, Phone, Calendar, Save, Crown, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AuthGuard from "../components/AuthGuard";
import { airports } from "../components/utils/airportData";

export default function Profile() {
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: preferences } = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      if (!user?.email) return null;
      const prefs = await base44.entities.UserNotificationPreferences.list();
      return prefs.find(p => p.user_email === user?.email) || null;
    },
    enabled: !!user?.email,
  });

  const [formData, setFormData] = useState({
    full_name: "",
    street_address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    home_airport: "",
    phone_number: "",
    date_of_birth: "",
    passport_number: "",
    passport_expiry: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    preferred_airline: "",
    frequent_flyer_numbers: "",
    preferred_hotel_chain: "",
    hotel_loyalty_numbers: "",
    dietary_restrictions: "",
    medical_conditions: "",
  });

  React.useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        street_address: user.street_address || "",
        city: user.city || "",
        state: user.state || "",
        zip_code: user.zip_code || "",
        country: user.country || "",
        home_airport: user.home_airport || "",
        phone_number: user.phone_number || "",
        date_of_birth: user.date_of_birth || "",
        passport_number: user.passport_number || "",
        passport_expiry: user.passport_expiry || "",
        emergency_contact_name: user.emergency_contact_name || "",
        emergency_contact_phone: user.emergency_contact_phone || "",
        preferred_airline: user.preferred_airline || "",
        frequent_flyer_numbers: user.frequent_flyer_numbers || "",
        preferred_hotel_chain: user.preferred_hotel_chain || "",
        hotel_loyalty_numbers: user.hotel_loyalty_numbers || "",
        dietary_restrictions: user.dietary_restrictions || "",
        medical_conditions: user.medical_conditions || "",
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (data) => base44.auth.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    }
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  if (userLoading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const subscriptionTier = preferences?.subscription_tier || 'free';

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-600 mt-1">Manage your personal information and travel preferences</p>
              </div>
              <div className="text-right">
                <Badge className={`${
                  subscriptionTier === 'elite' 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                    : subscriptionTier === 'premium' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                    : 'bg-gray-200 text-gray-800'
                } text-white`}>
                  {subscriptionTier === 'elite' ? (
                    <><Crown className="w-3 h-3 mr-1" /> Globetrotter</>
                  ) : subscriptionTier === 'premium' ? (
                    <><Sparkles className="w-3 h-3 mr-1" /> Explorer</>
                  ) : (
                    'Basic'
                  )}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="street_address">Street Address</Label>
                  <Input
                    id="street_address"
                    value={formData.street_address}
                    onChange={(e) => setFormData({...formData, street_address: e.target.value})}
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip_code">ZIP/Postal Code</Label>
                    <Input
                      id="zip_code"
                      value={formData.zip_code}
                      onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                      placeholder="ZIP"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    placeholder="United States"
                  />
                </div>
                <div>
                  <Label htmlFor="home_airport">Home or Preferred Airport</Label>
                  <Select
                    value={formData.home_airport}
                    onValueChange={(value) => setFormData({...formData, home_airport: value})}
                  >
                    <SelectTrigger id="home_airport">
                      <SelectValue placeholder="Select your home airport" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {airports.map((airport) => (
                        <SelectItem key={airport.code} value={airport.code}>
                          {airport.code} - {airport.name} ({airport.city})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Travel Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Travel Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="passport_number">Passport Number</Label>
                    <Input
                      id="passport_number"
                      value={formData.passport_number}
                      onChange={(e) => setFormData({...formData, passport_number: e.target.value})}
                      placeholder="X12345678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="passport_expiry">Passport Expiry Date</Label>
                    <Input
                      id="passport_expiry"
                      type="date"
                      value={formData.passport_expiry}
                      onChange={(e) => setFormData({...formData, passport_expiry: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergency_contact_name">Contact Name</Label>
                    <Input
                      id="emergency_contact_name"
                      value={formData.emergency_contact_name}
                      onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                      placeholder="Jane Smith"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergency_contact_phone">Contact Phone</Label>
                    <Input
                      id="emergency_contact_phone"
                      type="tel"
                      value={formData.emergency_contact_phone}
                      onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
                      placeholder="+1 (555) 987-6543"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Travel Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferred_airline">Preferred Airline</Label>
                    <Input
                      id="preferred_airline"
                      value={formData.preferred_airline}
                      onChange={(e) => setFormData({...formData, preferred_airline: e.target.value})}
                      placeholder="Delta, United, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="frequent_flyer_numbers">Frequent Flyer Numbers</Label>
                    <Input
                      id="frequent_flyer_numbers"
                      value={formData.frequent_flyer_numbers}
                      onChange={(e) => setFormData({...formData, frequent_flyer_numbers: e.target.value})}
                      placeholder="Delta: 123456789"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="preferred_hotel_chain">Preferred Hotel Chain</Label>
                    <Input
                      id="preferred_hotel_chain"
                      value={formData.preferred_hotel_chain}
                      onChange={(e) => setFormData({...formData, preferred_hotel_chain: e.target.value})}
                      placeholder="Marriott, Hilton, etc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="hotel_loyalty_numbers">Hotel Loyalty Numbers</Label>
                    <Input
                      id="hotel_loyalty_numbers"
                      value={formData.hotel_loyalty_numbers}
                      onChange={(e) => setFormData({...formData, hotel_loyalty_numbers: e.target.value})}
                      placeholder="Marriott: 987654321"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health & Dietary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Health & Dietary Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="dietary_restrictions">Dietary Restrictions</Label>
                  <Input
                    id="dietary_restrictions"
                    value={formData.dietary_restrictions}
                    onChange={(e) => setFormData({...formData, dietary_restrictions: e.target.value})}
                    placeholder="Vegetarian, Gluten-free, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="medical_conditions">Medical Conditions / Allergies</Label>
                  <Input
                    id="medical_conditions"
                    value={formData.medical_conditions}
                    onChange={(e) => setFormData({...formData, medical_conditions: e.target.value})}
                    placeholder="Allergies, medications, etc."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateMutation.isPending ? "Saving..." : "Save Profile"}
              </Button>
            </div>

            {updateMutation.isSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <Save className="w-5 h-5 text-green-600" />
                <p className="text-green-800">Profile updated successfully!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}