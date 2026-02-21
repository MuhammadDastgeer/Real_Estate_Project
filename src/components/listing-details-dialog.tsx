"use client";

import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

interface ListingDetailsDialogProps {
  listing: any;
  isOpen: boolean;
  onClose: () => void;
  listingType: 'Buyer' | 'Seller';
}

export function ListingDetailsDialog({ listing, isOpen, onClose, listingType }: ListingDetailsDialogProps) {
  if (!listing) return null;

  const imageUrl = listing.Image || listing.image;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{listingType} Details</AlertDialogTitle>
          <AlertDialogDescription>
            Full information for {listing.Name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-6 text-sm text-muted-foreground py-4 max-h-[70vh] overflow-y-auto pr-2">
          {listingType === 'Seller' && imageUrl && typeof imageUrl === 'string' && (
            <div className="aspect-video relative w-full overflow-hidden rounded-lg bg-muted border">
               <Image src={imageUrl} alt={listing.Name || 'Property image'} fill className="object-cover" />
            </div>
          )}
          <div className="grid grid-cols-1 gap-y-2 gap-x-4 md:grid-cols-2">
            <div><strong className="text-foreground">Name:</strong> {listing.Name || 'N/A'}</div>
            <div><strong className="text-foreground">Email:</strong> {listing.Email || 'N/A'}</div>
            <div><strong className="text-foreground">Phone:</strong> {listing.Phone_Number || 'N/A'}</div>
            <div><strong className="text-foreground">Location:</strong> {listing.Location_ || 'N/A'}</div>
            <div><strong className="text-foreground">Price:</strong> {listing.Price_Range || 'N/A'}</div>
            <div><strong className="text-foreground">Type:</strong> {listing.Property_Type || 'N/A'}</div>
            <div><strong className="text-foreground">Area:</strong> {listing.Area || 'N/A'}</div>
            <div><strong className="text-foreground">Status:</strong> {listing.Construction_Status || 'N/A'}</div>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">Location Map</h4>
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted border">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.Location_ || '')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              ></iframe>
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
