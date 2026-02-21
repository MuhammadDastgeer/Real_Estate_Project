'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

const TelegramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.57c-.28 1.1-.86 1.32-1.78.82l-4.76-3.52-2.24 2.14c-.24.24-.44.44-.88.44l.26-4.4z"/>
    </svg>
);

export function TelegramButton() {
    return (
        <div className="fixed bottom-24 right-4 z-50">
            <Button asChild size="icon" className="rounded-full h-14 w-14 shadow-lg bg-[#2AABEE] hover:bg-[#2297d3] text-white">
                <Link href="http://t.me/Dastgeerbot" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                   <TelegramIcon />
                </Link>
            </Button>
        </div>
    );
}
