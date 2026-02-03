import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useSearchParams, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PullToRefreshIndicator from "../components/ui/PullToRefreshIndicator";
import { useIsMobile } from "../components/utils/useIsMobile";
import { 
  CheckCircle, 
  Circle,
  Plus,
  Sparkles,
  Bell,
  Printer,
  Crown,
  Calendar,
  AlertCircle,
  Trash2
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

const BASIC_CHECKLIST = [
  { category: "documents", title: "Valid Passport", description: "Check expiration date (6 months validity recommended)", due_days_before_departure: 30 },
  { category: "documents", title: "Visa (if required)", description: "Research visa requirements for your destination", due_days_before_departure: 30 },
  { category: "bookings", title: "Flight Confirmation", description: "Print or save digital boarding pass", due_days_before_departure: 1 },
  { category: "bookings", title: "Hotel Confirmation", description: "Print reservation details", due_days_before_departure: 1 },
  { category: "packing", title: "Clothes & Shoes", description: "Pack appropriate for weather and activities", due_days_before_departure: 2 },
  { category: "technology", title: "Phone Charger", description: "Don't forget charging cables", due_days_before_departure: 1 },
  { category: "money", title: "Credit Cards", description: "Notify bank of travel plans", due_days_before_departure: 3 },
  { category: "health", title: "Medications", description: "Bring sufficient supply for entire trip", due_days_before_departure: 2 }
];

export default function TripChecklist() {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("id");
  const queryClient = useQueryClient();
  const [newItemTitle, setNewItemTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("packing");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const isMobile = useIsMobile();

  const { data: trip, refetch: refetchTrip } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => base44.entities.Trip.list().then(trips => trips.find(t => t.id === tripId)),
    enabled: !!tripId
  });

  const { data: checklist, isLoading, refetch: refetchChecklist } = useQuery({
    queryKey: ['checklist', tripId],
    queryFn: async () => {
      const lists = await base44.entities.TravelChecklist.filter({ trip_id: tripId });
      if (lists.length > 0) return lists[0];
      
      // Create basic checklist
      const items = BASIC_CHECKLIST.map((item, idx) => ({
        id: `basic-${idx}`,
        ...item,
        completed: false,
        is_custom: false,
        ai_generated: false
      }));
      
      return base44.entities.TravelChecklist.create({
        trip_id: tripId,
        has_premium: false,
        items,
        completion_percentage: 0
      });
    },
    enabled: !!tripId
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ['checklist-purchases'],
    queryFn: () => base44.entities.ChecklistPurchase.list()
  });

  const hasPremium = purchases.some(p => 
    p.product_type === 'interactive_checklist' || p.product_type === 'travel_aide_bundle'
  );

  const handlePullToRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchTrip(), refetchChecklist()]);
    setTimeout(() => setIsRefreshing(false), 500);
  }, [refetchTrip, refetchChecklist]);

  React.useEffect(() => {
    let startY = 0;
    let startX = 0;
    let currentY = 0;
    let currentX = 0;
    let isDragging = false;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
        isDragging = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging || window.scrollY !== 0) {
        isDragging = false;
        setPullDistance(0);
        return;
      }
      
      currentY = e.touches[0].clientY;
      currentX = e.touches[0].clientX;
      
      const diffY = currentY - startY;
      const diffX = Math.abs(currentX - startX);
      
      if (diffY > 0 && diffX < 30) {
        setPullDistance(diffY);
      }
      
      if (diffY > 80 && diffX < 30 && window.scrollY === 0) {
        handlePullToRefresh();
        isDragging = false;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      setPullDistance(0);
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlePullToRefresh]);

  const updateMutation = useMutation({
    mutationFn: ({ checklistId, data }) => base44.entities.TravelChecklist.update(checklistId, data),
    onMutate: async ({ checklistId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['checklist', tripId] });
      
      // Snapshot previous value
      const previousChecklist = queryClient.getQueryData(['checklist', tripId]);
      
      // Optimistically update
      queryClient.setQueryData(['checklist', tripId], (old) => ({
        ...old,
        ...data
      }));
      
      return { previousChecklist };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(['checklist', tripId], context.previousChecklist);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['checklist', tripId] });
    }
  });

  const toggleItem = (itemId) => {
    const updatedItems = checklist.items.map(item => 
      item.id === itemId 
        ? { ...item, completed: !item.completed, completed_date: !item.completed ? new Date().toISOString() : null }
        : item
    );
    const completionPercentage = Math.round((updatedItems.filter(i => i.completed).length / updatedItems.length) * 100);
    
    updateMutation.mutate({
      checklistId: checklist.id,
      data: { items: updatedItems, completion_percentage: completionPercentage }
    });
  };

  const addCustomItem = () => {
    if (!newItemTitle.trim()) return;
    
    const newItem = {
      id: `custom-${Date.now()}`,
      category: selectedCategory,
      title: newItemTitle,
      description: "",
      completed: false,
      is_custom: true,
      ai_generated: false,
      due_days_before_departure: 7
    };

    const updatedItems = [...checklist.items, newItem];
    updateMutation.mutate({
      checklistId: checklist.id,
      data: { items: updatedItems }
    });
    setNewItemTitle("");
  };

  const deleteItem = (itemId) => {
    const updatedItems = checklist.items.filter(item => item.id !== itemId);
    const completionPercentage = updatedItems.length > 0 
      ? Math.round((updatedItems.filter(i => i.completed).length / updatedItems.length) * 100)
      : 0;
    
    updateMutation.mutate({
      checklistId: checklist.id,
      data: { items: updatedItems, completion_percentage: completionPercentage }
    });
  };

  const categories = [
    { id: "documents", label: "Documents", icon: "📄" },
    { id: "bookings", label: "Bookings", icon: "✈️" },
    { id: "packing", label: "Packing", icon: "🎒" },
    { id: "health", label: "Health", icon: "💊" },
    { id: "money", label: "Money", icon: "💰" },
    { id: "technology", label: "Technology", icon: "📱" },
    { id: "pre_departure", label: "Pre-Departure", icon: "🏠" },
    { id: "day_of", label: "Day Of Travel", icon: "🚗" }
  ];

  if (isLoading || !trip || !checklist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checklist...</p>
        </div>
      </div>
    );
  }

  const daysUntilTrip = differenceInDays(new Date(trip.start_date), new Date());
  const overdueItems = checklist.items.filter(item => 
    !item.completed && item.due_days_before_departure >= daysUntilTrip
  );

  return (
    <>
      <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isRefreshing} />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
        <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to={createPageUrl(`TripDetail?id=${tripId}`)} className="text-blue-600 hover:underline text-sm mb-2 inline-block">
            ← Back to Trip
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Travel Checklist</h1>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="font-medium">{trip.trip_name}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {daysUntilTrip > 0 ? `${daysUntilTrip} days until departure` : 'Trip in progress'}
            </span>
          </div>
        </div>

        {/* Progress Card */}
        <Card className="mb-6 border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overall Progress</p>
                <p className="text-3xl font-bold text-gray-900">{checklist.completion_percentage}%</p>
              </div>
              <div className="flex gap-2">
                {!hasPremium && (
                  <Link to={createPageUrl("TravelAides")}>
                    <Button variant="outline" className="border-yellow-400 text-yellow-700 hover:bg-yellow-50">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Checklist
                    </Button>
                  </Link>
                )}
                {!isMobile && (
                  <Button variant="outline" onClick={() => window.print()}>
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                )}
              </div>
            </div>
            <Progress value={checklist.completion_percentage} className="h-3" />
            <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
              <span>{checklist.items.filter(i => i.completed).length} of {checklist.items.length} completed</span>
              {overdueItems.length > 0 && (
                <span className="text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {overdueItems.length} overdue
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {!hasPremium && (
          <Card className="mb-6 border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Upgrade to Premium Checklist</h3>
                  <div className="grid md:grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      AI-generated custom items for your destination
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Smart timeline-based reminders
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Push notifications for overdue items
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Auto-populate from booking data
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">$4.99 <span className="text-sm text-gray-600">one-time</span></p>
                    </div>
                    <Link to={createPageUrl("TravelAides")}>
                      <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                        Upgrade Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Checklist Items by Category */}
        {categories.map(category => {
          const categoryItems = checklist.items.filter(item => item.category === category.id);
          if (categoryItems.length === 0) return null;

          return (
            <Card key={category.id} className="mb-4 border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  {category.label}
                  <Badge variant="outline" className="ml-auto">
                    {categoryItems.filter(i => i.completed).length}/{categoryItems.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {categoryItems.map(item => {
                    const isOverdue = !item.completed && item.due_days_before_departure >= daysUntilTrip;
                    
                    return (
                      <div 
                        key={item.id} 
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                          item.completed 
                            ? 'bg-green-50 border-green-200' 
                            : isOverdue 
                              ? 'bg-red-50 border-red-200'
                              : 'bg-white border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <Checkbox
                          checked={item.completed}
                          onCheckedChange={() => toggleItem(item.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {item.title}
                                {item.ai_generated && (
                                  <Badge className="ml-2 bg-purple-100 text-purple-700 text-xs">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    AI
                                  </Badge>
                                )}
                              </p>
                              {item.description && (
                                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              )}
                              {item.due_days_before_departure && (
                                <p className={`text-xs mt-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                  {isOverdue ? '⚠️ Overdue: ' : '📅 '} 
                                  Due {item.due_days_before_departure} days before departure
                                </p>
                              )}
                            </div>
                            {item.is_custom && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-gray-400 hover:text-red-600"
                                onClick={() => deleteItem(item.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add Custom Item */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add Custom Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Item title..."
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
                className="flex-1"
              />
              <Button onClick={addCustomItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </>
  );
}