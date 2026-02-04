import React from "react";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check } from "lucide-react";
import { toast } from "sonner";
import { trackCustomEvent } from "../analytics/MetaPixel";
import { openExternalLink } from "../utils/openExternalLink";

export default function SocialShare({ trip, variant = "default" }) {
  const [copied, setCopied] = React.useState(false);
  
  const shareUrl = `${window.location.origin}/TripDetail?id=${trip.id}`;
  const shareText = `Check out my trip to ${trip.destination}! Planning with WanderSure for smart travel risk monitoring.`;
  
  const handleFacebookShare = () => {
    trackCustomEvent('ShareTrip', { 
      platform: 'facebook',
      destination: trip.destination,
      trip_id: trip.id
    });
    openExternalLink(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
  };

  const handleTwitterShare = () => {
    trackCustomEvent('ShareTrip', { 
      platform: 'twitter',
      destination: trip.destination,
      trip_id: trip.id
    });
    openExternalLink(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
  };

  const handleLinkedInShare = () => {
    trackCustomEvent('ShareTrip', { 
      platform: 'linkedin',
      destination: trip.destination,
      trip_id: trip.id
    });
    openExternalLink(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      trackCustomEvent('ShareTrip', { 
        platform: 'copy_link',
        destination: trip.destination,
        trip_id: trip.id
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  if (variant === "compact") {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleFacebookShare}
          className="hover:bg-blue-50"
        >
          <Facebook className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleTwitterShare}
          className="hover:bg-sky-50"
        >
          <Twitter className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleCopyLink}
          className="hover:bg-gray-50"
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <LinkIcon className="w-4 h-4" />}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">Share your trip:</p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={handleFacebookShare}
          className="gap-2 hover:bg-blue-50 hover:border-blue-300"
        >
          <Facebook className="w-4 h-4 text-blue-600" />
          Facebook
        </Button>
        <Button
          variant="outline"
          onClick={handleTwitterShare}
          className="gap-2 hover:bg-sky-50 hover:border-sky-300"
        >
          <Twitter className="w-4 h-4 text-sky-600" />
          Twitter
        </Button>
        <Button
          variant="outline"
          onClick={handleLinkedInShare}
          className="gap-2 hover:bg-blue-50 hover:border-blue-300"
        >
          <Linkedin className="w-4 h-4 text-blue-700" />
          LinkedIn
        </Button>
        <Button
          variant="outline"
          onClick={handleCopyLink}
          className="gap-2 hover:bg-gray-50"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4" />
              Copy Link
            </>
          )}
        </Button>
      </div>
    </div>
  );
}