import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Plus, Mail, Phone, Plane, Hotel, Trash2, AlertCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function GroupTravelCoordinator() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedTripId, setSelectedTripId] = useState("");
  const [showAddMember, setShowAddMember] = useState(false);
  
  const [memberData, setMemberData] = useState({
    member_name: "",
    email: "",
    phone: "",
    linked_user_email: "",
    flight_info: { airline: "", flight_number: "", departure_time: "", arrival_time: "" },
    hotel_info: { hotel_name: "", booking_number: "", room_number: "" },
    special_notes: "",
    role: "member"
  });

  const { data: trips = [] } = useQuery({
    queryKey: ['trips'],
    queryFn: () => base44.entities.Trip.list('-created_date')
  });

  const { data: members = [] } = useQuery({
    queryKey: ['group-members', selectedTripId],
    queryFn: () => base44.entities.GroupTravelMember.filter({ trip_id: selectedTripId }),
    enabled: !!selectedTripId
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ['checklist-purchases'],
    queryFn: () => base44.entities.ChecklistPurchase.list()
  });

  const hasPurchased = purchases.some(p => 
    p.product_id === 'group-coordinator' || 
    p.product_type === 'travel_aide_bundle'
  );

  const addMemberMutation = useMutation({
    mutationFn: (data) => base44.entities.GroupTravelMember.create({
      ...data,
      trip_id: selectedTripId
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members'] });
      setShowAddMember(false);
      setMemberData({
        member_name: "",
        email: "",
        phone: "",
        linked_user_email: "",
        flight_info: { airline: "", flight_number: "", departure_time: "", arrival_time: "" },
        hotel_info: { hotel_name: "", booking_number: "", room_number: "" },
        special_notes: "",
        role: "member"
      });
    }
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (memberId) => base44.entities.GroupTravelMember.delete(memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members'] });
    }
  });

  const handleAddMember = () => {
    addMemberMutation.mutate(memberData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("TravelAides"))}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Travel Aides
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-full mb-4">
            <Users className="w-4 h-4 text-yellow-600" />
            <span className="text-yellow-700 text-sm font-medium">Coordinate Group Travel</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Group Travel Coordinator</h1>
          <p className="text-xl text-gray-600">Manage group members, bookings, and coordination</p>
        </div>

        {!hasPurchased && (
          <Card className="mb-8 border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Purchase Required</h3>
              <p className="text-gray-600 mb-4">
                This feature requires a one-time purchase of $5.99
              </p>
              <Button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
                Purchase Now - $5.99
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 border-none shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Select Trip</CardTitle>
              {selectedTripId && hasPurchased && (
                <Button onClick={() => setShowAddMember(!showAddMember)} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Select value={selectedTripId} onValueChange={setSelectedTripId} disabled={!hasPurchased}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a trip..." />
              </SelectTrigger>
              <SelectContent>
                {trips.map(trip => (
                  <SelectItem key={trip.id} value={trip.id}>
                    {trip.trip_name} - {trip.destination}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {showAddMember && (
          <Card className="mb-6 border-2 border-yellow-300 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-lg">Add Group Member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input
                    value={memberData.member_name}
                    onChange={(e) => setMemberData({...memberData, member_name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select value={memberData.role} onValueChange={(val) => setMemberData({...memberData, role: val})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organizer">Organizer</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={memberData.email}
                    onChange={(e) => setMemberData({...memberData, email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={memberData.phone}
                    onChange={(e) => setMemberData({...memberData, phone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Plane className="w-4 h-4" />
                  Flight Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Airline</Label>
                    <Input
                      value={memberData.flight_info.airline}
                      onChange={(e) => setMemberData({
                        ...memberData,
                        flight_info: {...memberData.flight_info, airline: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label>Flight Number</Label>
                    <Input
                      value={memberData.flight_info.flight_number}
                      onChange={(e) => setMemberData({
                        ...memberData,
                        flight_info: {...memberData.flight_info, flight_number: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Hotel className="w-4 h-4" />
                  Hotel Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Hotel Name</Label>
                    <Input
                      value={memberData.hotel_info.hotel_name}
                      onChange={(e) => setMemberData({
                        ...memberData,
                        hotel_info: {...memberData.hotel_info, hotel_name: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label>Booking Number</Label>
                    <Input
                      value={memberData.hotel_info.booking_number}
                      onChange={(e) => setMemberData({
                        ...memberData,
                        hotel_info: {...memberData.hotel_info, booking_number: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Special Notes (dietary, medical, etc.)</Label>
                <Textarea
                  value={memberData.special_notes}
                  onChange={(e) => setMemberData({...memberData, special_notes: e.target.value})}
                  placeholder="Any special requirements or notes..."
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleAddMember}
                  disabled={!memberData.member_name || addMemberMutation.isPending}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                >
                  {addMemberMutation.isPending ? "Adding..." : "Add Member"}
                </Button>
                <Button variant="outline" onClick={() => setShowAddMember(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map(member => (
            <Card key={member.id} className="border-none shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white relative">
                {member.role === 'organizer' && (
                  <Badge className="absolute top-3 right-3 bg-white text-yellow-600">
                    <Star className="w-3 h-3 mr-1" />
                    Organizer
                  </Badge>
                )}
                <CardTitle className="text-xl">{member.member_name}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {member.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                      {member.email}
                    </a>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">
                      {member.phone}
                    </a>
                  </div>
                )}

                {member.flight_info?.airline && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Plane className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-sm">Flight</span>
                    </div>
                    <p className="text-sm text-gray-700">{member.flight_info.airline} {member.flight_info.flight_number}</p>
                  </div>
                )}

                {member.hotel_info?.hotel_name && (
                  <div className="pt-3 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Hotel className="w-4 h-4 text-purple-600" />
                      <span className="font-bold text-sm">Hotel</span>
                    </div>
                    <p className="text-sm text-gray-700">{member.hotel_info.hotel_name}</p>
                    {member.hotel_info.room_number && (
                      <p className="text-xs text-gray-500">Room {member.hotel_info.room_number}</p>
                    )}
                  </div>
                )}

                {member.special_notes && (
                  <div className="pt-3 border-t">
                    <p className="text-sm font-bold text-gray-900 mb-1">Special Notes:</p>
                    <p className="text-sm text-gray-600">{member.special_notes}</p>
                  </div>
                )}

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => deleteMemberMutation.mutate(member.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Member
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedTripId && members.length === 0 && (
          <Card className="border-none shadow-lg">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Members Yet</h3>
              <p className="text-gray-600">Add group members to start coordinating</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}