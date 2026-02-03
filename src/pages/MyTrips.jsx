import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaneTakeoff, Plus, Search, RefreshCw } from "lucide-react";

import TripCard from "../components/trips/TripCard";
import AuthGuard from "../components/AuthGuard";
import PullToRefreshIndicator from "../components/ui/PullToRefreshIndicator";

export default function MyTrips() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const queryClient = useQueryClient();

  const { data: trips = [], isLoading, error, refetch: refetchTrips } = useQuery({
    queryKey: ['trips'],
    queryFn: () => base44.entities.Trip.list('-created_date'),
    retry: 1
  });

  const handlePullToRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    await refetchTrips();
    setTimeout(() => setIsRefreshing(false), 500);
  }, [refetchTrips]);

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
      
      // Update pull distance for visual feedback
      if (diffY > 0 && diffX < 30) {
        setPullDistance(diffY);
      }
      
      // Only trigger if predominantly vertical movement
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

  if (error) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading trips: {error.message}</p>
            <Button onClick={() => window.location.reload()}>Reload Page</Button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const deleteMutation = useMutation({
    mutationFn: (tripId) => base44.entities.Trip.delete(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    }
  });

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.trip_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || trip.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <AuthGuard>
      <PullToRefreshIndicator pullDistance={pullDistance} isRefreshing={isRefreshing} />
    <div className="min-h-screen py-8 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
            <p className="text-gray-600 mt-1">Manage all your travel plans in one place</p>
          </div>
          <Link to={createPageUrl("NewTrip")}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5 mr-2" />
              Add New Trip
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search trips by name or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs value={filterStatus} onValueChange={setFilterStatus}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="booked">Booked</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Trips Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : filteredTrips.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map(trip => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <PlaneTakeoff className="w-20 h-20 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== "all" 
                ? "Try adjusting your search or filters"
                : "Start planning your next adventure!"
              }
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Link to={createPageUrl("NewTrip")}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Trip
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
    </AuthGuard>
  );
}