import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Plus, Sparkles } from "lucide-react";

export default function UpsellModal({ 
  isOpen, 
  onClose, 
  selectedProduct, 
  suggestedProducts,
  onProceedToCheckout 
}) {
  const [selectedItems, setSelectedItems] = React.useState([selectedProduct]);

  const toggleProduct = (product) => {
    if (selectedItems.find(item => item.id === product.id)) {
      setSelectedItems(selectedItems.filter(item => item.id !== product.id));
    } else {
      setSelectedItems([...selectedItems, product]);
    }
  };

  const totalPrice = selectedItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace('$', ''));
    return sum + price;
  }, 0);

  const savings = suggestedProducts.length > 0 ? (totalPrice * 0.15).toFixed(2) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Complete Your Travel Toolkit
          </DialogTitle>
          <p className="text-gray-600 mt-2">
            Travelers who bought this also found these helpful:
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Selected Product */}
          <Card className="border-2 border-blue-500 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <selectedProduct.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{selectedProduct.title}</p>
                    <p className="text-sm text-gray-600">{selectedProduct.price}</p>
                  </div>
                </div>
                <Badge className="bg-blue-600">Selected</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Suggested Products */}
          {suggestedProducts.map((product) => {
            const isSelected = selectedItems.find(item => item.id === product.id);
            return (
              <Card 
                key={product.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'border-2 border-green-500 bg-green-50' : 'border'
                }`}
                onClick={() => toggleProduct(product)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-green-600' : 'bg-gray-200'
                      }`}>
                        <product.icon className={`w-6 h-6 ${
                          isSelected ? 'text-white' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{product.title}</p>
                        <p className="text-sm text-gray-600">{product.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{product.price}</p>
                        {isSelected ? (
                          <Badge className="bg-green-600 mt-1">
                            <Check className="w-3 h-3 mr-1" />
                            Added
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline" className="mt-1">
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>{selectedItems.length} item{selectedItems.length > 1 ? 's' : ''}</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            {selectedItems.length > 1 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Bundle Discount (15%)</span>
                <span>-${savings}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>${(totalPrice - savings).toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button 
              onClick={() => onProceedToCheckout(selectedItems)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}