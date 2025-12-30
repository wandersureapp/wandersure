
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload, Loader2 } from "lucide-react";
import insuranceProvider from "../insurance/InsuranceProviderService";

export default function NewClaimDialog({ open, onClose, policies, trips }) {
  const queryClient = useQueryClient();
  const [claimData, setClaimData] = useState({
    policy_id: "",
    trip_id: "",
    claim_type: "",
    claim_amount: 0,
    incident_date: "",
    description: ""
  });

  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const createClaimMutation = useMutation({
    mutationFn: async (data) => {
      // Get policy details
      const policy = policies.find(p => p.id === data.policy_id);
      
      // Submit claim to insurance provider first
      const providerClaim = await insuranceProvider.submitClaim(
        {
          claim_type: data.claim_type,
          claim_amount: data.claim_amount,
          incident_date: data.incident_date,
          description: data.description,
          supporting_documents: uploadedFiles // Assuming provider can handle URLs or requires re-upload
        },
        {
          provider_policy_id: policy.provider_policy_id,
          provider_name: policy.provider_name,
          policy_number: policy.policy_number
        }
      );
      
      // Create claim record in our database with provider details
      return base44.entities.Claim.create({
        ...data,
        supporting_documents: uploadedFiles,
        provider_claim_id: providerClaim.provider_claim_id,
        status: providerClaim.status
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claims'] });
      onClose();
      resetForm();
    }
  });

  const resetForm = () => {
    setClaimData({
      policy_id: "",
      trip_id: "",
      claim_type: "",
      claim_amount: 0,
      incident_date: "",
      description: ""
    });
    setUploadedFiles([]);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setUploadedFiles(prev => [...prev, file_url]);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setUploadingFile(false);
  };

  const handleSubmit = () => {
    createClaimMutation.mutate(claimData);
  };

  const activePolicies = policies.filter(p => p.status === 'active');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="w-6 h-6" />
            File New Claim
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="policy_id">Policy *</Label>
              <Select 
                value={claimData.policy_id}
                onValueChange={(value) => {
                  const policy = policies.find(p => p.id === value);
                  setClaimData(prev => ({ 
                    ...prev, 
                    policy_id: value,
                    trip_id: policy?.trip_id || ""
                  }));
                }}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select policy" />
                </SelectTrigger>
                <SelectContent>
                  {activePolicies.map(policy => (
                    <SelectItem key={policy.id} value={policy.id}>
                      {policy.plan_name} - {policy.policy_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="claim_type">Claim Type *</Label>
              <Select 
                value={claimData.claim_type}
                onValueChange={(value) => setClaimData(prev => ({ ...prev, claim_type: value }))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select claim type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trip_cancellation">Trip Cancellation</SelectItem>
                  <SelectItem value="trip_interruption">Trip Interruption</SelectItem>
                  <SelectItem value="baggage_loss">Baggage Loss</SelectItem>
                  <SelectItem value="baggage_delay">Baggage Delay</SelectItem>
                  <SelectItem value="medical_emergency">Medical Emergency</SelectItem>
                  <SelectItem value="theft">Theft</SelectItem>
                  <SelectItem value="flight_delay">Flight Delay</SelectItem>
                  <SelectItem value="rental_car_damage">Rental Car Damage</SelectItem>
                  <SelectItem value="missed_connection">Missed Connection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="incident_date">Incident Date *</Label>
              <Input
                id="incident_date"
                type="date"
                value={claimData.incident_date}
                onChange={(e) => setClaimData(prev => ({ ...prev, incident_date: e.target.value }))}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="claim_amount">Claim Amount ($) *</Label>
              <Input
                id="claim_amount"
                type="number"
                min="0"
                step="0.01"
                value={claimData.claim_amount || ''}
                onChange={(e) => setClaimData(prev => ({ ...prev, claim_amount: parseFloat(e.target.value) || 0 }))}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what happened and why you're filing this claim..."
              value={claimData.description}
              onChange={(e) => setClaimData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1.5 h-32"
            />
          </div>

          <div>
            <Label>Supporting Documents</Label>
            <div className="mt-1.5">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label htmlFor="file-upload">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
                  {uploadingFile ? (
                    <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-600" />
                  ) : (
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  )}
                  <p className="text-sm text-gray-600">
                    {uploadingFile ? "Uploading..." : "Click to upload receipts, photos, or documents"}
                  </p>
                </div>
              </label>
              {uploadedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">
                    ✓ {uploadedFiles.length} file(s) uploaded
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !claimData.policy_id ||
              !claimData.claim_type ||
              !claimData.incident_date ||
              !claimData.description ||
              claimData.claim_amount <= 0 ||
              createClaimMutation.isPending
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createClaimMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Claim"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
