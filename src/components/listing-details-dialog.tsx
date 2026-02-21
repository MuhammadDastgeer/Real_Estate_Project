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

  let imageSrc: string | null = null;
  if (listing.image && typeof listing.image === 'string') {
    imageSrc = listing.image.startsWith('data:image') ? listing.image : `data:image/jpeg;base64,${listing.image}`;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{listingType} Details</AlertDialogTitle>
          <AlertDialogDescription>
            Full information for {listing.Name}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground py-4">
          {listingType === 'Seller' && imageSrc && (
            <div className="aspect-video relative w-full overflow-hidden rounded-lg bg-muted border">
               <Image src={imageSrc} alt={listing.Name || 'Property image'} fill className="object-cover" />
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p><strong>Name:</strong> {listing.Name || 'N/A'}</p>
            <p><strong>Email:</strong> {listing.Email || 'N/A'}</p>
            <p><strong>Phone:</strong> {listing.Phone_Number || 'N/A'}</p>
            <p><strong>Location:</strong> {listing.Location_ || 'N/A'}</p>
            <p><strong>Price:</strong> {listing.Price_Range || 'N/A'}</p>
            <p><strong>Type:</strong> {listing.Property_Type || 'N/A'}</p>
            <p><strong>Area:</strong> {listing.Area || 'N/A'}</p>
            <p><strong>Status:</strong> {listing.Construction_Status || 'N/A'}</p>
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
