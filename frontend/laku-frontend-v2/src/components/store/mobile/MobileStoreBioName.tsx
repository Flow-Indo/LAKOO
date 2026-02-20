 'use client';
 
 import { useRouter } from 'next/navigation';
 import { ArrowLeft, Share, Search } from 'lucide-react';
 import { Store } from '@/types/store';
 import { StoreLogo } from './StoreLogo';
 import { StoreInfo } from './StoreInfo';
 
 interface MobileStoreBioNameProps {
   store: Store;
   onSearchClick?: () => void;
 }
 
 export function MobileStoreBioName({ store, onSearchClick }: MobileStoreBioNameProps) {
   const router = useRouter();
 
   const handleBack = () => router.back();
 
   const handleSearchClick = () => {
     if (onSearchClick) return onSearchClick();
     // TODO: Wire up store search action
     console.log('Open store search');
   };
 
   const handleShare = async () => {
     if (typeof window === 'undefined') return;
 
     if (navigator.share) {
       try {
         await navigator.share({
           title: store.name,
           text: store.description,
           url: window.location.href,
         });
       } catch {
         console.log('Share cancelled');
       }
     } else {
       navigator.clipboard.writeText(window.location.href);
       // TODO: Show toast notification
     }
   };
 
   return (
     <div
       className="sticky top-0 z-40 w-full"
       style={{
         background: 'transparent',
         paddingTop: 10,
         paddingBottom: 10,
       }}
     >
       <div className="flex items-center justify-between mb-[8px]">
         <button
           onClick={handleBack}
           className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
         >
           <ArrowLeft className="w-5 h-5 text-white" />
         </button>

         <div className="flex-1 mx-3" />

         <div className="flex items-center gap-2">
           <button
             onClick={handleSearchClick}
             aria-label="Search store"
             className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors mr-2"
           >
             <Search className="w-5 h-5 text-white" />
           </button>

           <button
             onClick={handleShare}
             className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
           >
             <Share className="w-5 h-5 text-white" />
           </button>
         </div>
       </div>

       <div className="flex items-start gap-4">
         <StoreLogo store={store} />
         <div className="flex-1 pt-1">
           <StoreInfo store={store} />
         </div>
       </div>
     </div>
   );
 }
