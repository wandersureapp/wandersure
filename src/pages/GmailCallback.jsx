import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { exchangeGmailCode } from "@/functions/exchangeGmailCode";

export default function GmailCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        setStatus('error');
        setTimeout(() => navigate(createPageUrl("Dashboard")), 3000);
        return;
      }

      if (!code) {
        setStatus('error');
        setTimeout(() => navigate(createPageUrl("Dashboard")), 3000);
        return;
      }

      try {
        await exchangeGmailCode({ code });
        setStatus('success');
        setTimeout(() => navigate(createPageUrl("Dashboard")), 2000);
      } catch (error) {
        console.error('Gmail auth error:', error);
        setStatus('error');
        setTimeout(() => navigate(createPageUrl("Dashboard")), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {status === 'processing' && (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Connecting Gmail...</h2>
              <p className="text-gray-600">Please wait while we complete the authorization</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Gmail Connected!</h2>
              <p className="text-gray-600">Redirecting you back...</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Failed</h2>
              <p className="text-gray-600">Redirecting you back...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}