import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Camera, Trash2, Receipt, TrendingUp, DollarSign, AlertCircle, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { createCheckoutSession } from "@/functions/createCheckoutSession";

export default function BudgetPlanner() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedTripId, setSelectedTripId] = useState("");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [receiptFile, setReceiptFile] = useState(null);
  
  const [expenseData, setExpenseData] = useState({
    amount: "",
    category: "food",
    description: "",
    expense_date: format(new Date(), 'yyyy-MM-dd')
  });

  const { data: trips = [] } = useQuery({
    queryKey: ['trips'],
    queryFn: () => base44.entities.Trip.list('-created_date')
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses', selectedTripId],
    queryFn: () => base44.entities.BudgetExpense.filter({ trip_id: selectedTripId }),
    enabled: !!selectedTripId
  });

  const { data: purchases = [] } = useQuery({
    queryKey: ['checklist-purchases'],
    queryFn: () => base44.entities.ChecklistPurchase.list()
  });

  const hasPurchased = purchases.some(p => 
    p.product_id === 'budget-planner' || 
    p.product_type === 'travel_aide_bundle'
  );

  const selectedTrip = trips.find(t => t.id === selectedTripId);

  const addExpenseMutation = useMutation({
    mutationFn: async (data) => {
      let receiptUrl = null;
      if (receiptFile) {
        const uploadResponse = await base44.integrations.Core.UploadFile({ file: receiptFile });
        receiptUrl = uploadResponse.file_url;
      }

      return base44.entities.BudgetExpense.create({
        ...data,
        trip_id: selectedTripId,
        amount: parseFloat(data.amount),
        receipt_photo_url: receiptUrl
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setShowAddExpense(false);
      setExpenseData({
        amount: "",
        category: "food",
        description: "",
        expense_date: format(new Date(), 'yyyy-MM-dd')
      });
      setReceiptFile(null);
    }
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId) => base44.entities.BudgetExpense.delete(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    }
  });

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const categoryColors = {
    accommodation: "bg-blue-100 text-blue-800",
    food: "bg-orange-100 text-orange-800",
    transportation: "bg-green-100 text-green-800",
    activities: "bg-purple-100 text-purple-800",
    shopping: "bg-pink-100 text-pink-800",
    other: "bg-gray-100 text-gray-800"
  };

  const handleAddExpense = () => {
    addExpenseMutation.mutate(expenseData);
  };

  const handlePurchase = async () => {
    try {
      const response = await createCheckoutSession({ 
        priceId: 'price_1Sku1yDAiWHJZCc7iERsDN69',
        productId: 'budget-planner'
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-6">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-4">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-green-700 text-sm font-medium">Track Every Penny</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Budget Planner</h1>
          <p className="text-xl text-gray-600">Interactive expense tracking with receipt scanning</p>
        </div>

        {!hasPurchased && (
          <Card className="mb-8 border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-yellow-600" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Purchase Required</h3>
              <p className="text-gray-600 mb-4">
                This feature requires a one-time purchase of $2.99
              </p>
              <Button 
                onClick={handlePurchase}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              >
                Purchase Now - $2.99
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${totalExpenses.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${selectedTrip?.trip_cost?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Receipt className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Select Trip</CardTitle>
                  {selectedTripId && hasPurchased && (
                    <Button onClick={() => setShowAddExpense(!showAddExpense)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Expense
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

            {showAddExpense && (
              <Card className="border-2 border-green-300 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg">Add New Expense</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Amount ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={expenseData.amount}
                        onChange={(e) => setExpenseData({...expenseData, amount: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select value={expenseData.category} onValueChange={(val) => setExpenseData({...expenseData, category: val})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accommodation">Accommodation</SelectItem>
                          <SelectItem value="food">Food & Drink</SelectItem>
                          <SelectItem value="transportation">Transportation</SelectItem>
                          <SelectItem value="activities">Activities</SelectItem>
                          <SelectItem value="shopping">Shopping</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Input
                      value={expenseData.description}
                      onChange={(e) => setExpenseData({...expenseData, description: e.target.value})}
                      placeholder="What did you spend on?"
                    />
                  </div>

                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={expenseData.expense_date}
                      onChange={(e) => setExpenseData({...expenseData, expense_date: e.target.value})}
                    />
                  </div>

                  <div>
                    <Label>Receipt Photo (Optional)</Label>
                    <div className="mt-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setReceiptFile(e.target.files[0])}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleAddExpense}
                      disabled={!expenseData.amount || addExpenseMutation.isPending}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      {addExpenseMutation.isPending ? "Saving..." : "Save Expense"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddExpense(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Expense History</CardTitle>
              </CardHeader>
              <CardContent>
                {expenses.length > 0 ? (
                  <div className="space-y-3">
                    {expenses.map(expense => (
                      <div key={expense.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={categoryColors[expense.category]}>
                              {expense.category}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {format(new Date(expense.expense_date), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900">{expense.description || 'No description'}</p>
                          {expense.receipt_photo_url && (
                            <a href={expense.receipt_photo_url} target="_blank" className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
                              <Camera className="w-3 h-3" />
                              View Receipt
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-bold text-gray-900">${expense.amount.toFixed(2)}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteExpenseMutation.mutate(expense.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Receipt className="w-16 h-16 mx-auto mb-3 opacity-30" />
                    <p>No expenses tracked yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Breakdown by Category</CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(categoryTotals).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(categoryTotals).map(([category, total]) => (
                      <div key={category}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium capitalize">{category}</span>
                          <span className="text-sm font-bold">${total.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${(total / totalExpenses) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No data yet</p>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-6 text-center">
                <Download className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <h3 className="font-bold text-gray-900 mb-2">Export Report</h3>
                <p className="text-sm text-gray-600 mb-4">Download your expense report as PDF or CSV</p>
                <Button variant="outline" className="w-full" disabled={expenses.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}