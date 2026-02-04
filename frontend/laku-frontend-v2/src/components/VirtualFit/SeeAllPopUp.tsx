 'use client';

 import React, { useEffect, useRef, useState } from 'react';
 import { Trash2 } from 'lucide-react';
 import { createPortal } from 'react-dom';

 type FitProduct = {
   id: string;
   src: string;
   name: string;
   variation?: string;
   price: number;
   originalPrice?: number;
 };

 interface Props {
   open: boolean;
   title: string;
   items: FitProduct[];
   onClose: () => void;
   onSelect: (id: string) => void;
   onRemove?: (id: string) => void;
   itemType?: 'shirt' | 'pant';
 }

 export default function SeeAllPopUp({ open, title, items, onClose, onSelect, onRemove }: Props) {
   const [skipTransition, setSkipTransition] = useState<boolean>(false);
   const scrollYRef = useRef<number | null>(null);

   useEffect(() => {
     if (!open) return;
     // lock body scroll
     scrollYRef.current = window.scrollY || window.pageYOffset;
     document.body.style.position = 'fixed';
     document.body.style.top = `-${scrollYRef.current}px`;
     document.body.style.left = '0';
     document.body.style.right = '0';
     document.body.style.width = '100%';
     document.body.style.overflow = 'hidden';

     return () => {
       // restore body
       document.body.style.position = '';
       document.body.style.top = '';
       document.body.style.left = '';
       document.body.style.right = '';
       document.body.style.width = '';
       document.body.style.overflow = '';
       if (scrollYRef.current !== null) {
        try {
          // temporarily disable smooth scroll (global CSS may set scroll-behavior: smooth)
          const prev = document.documentElement.style.scrollBehavior;
          document.documentElement.style.scrollBehavior = 'auto';
          window.scrollTo(0, scrollYRef.current);
          // restore previous inline style
          document.documentElement.style.scrollBehavior = prev;
        } catch {
          window.scrollTo(0, scrollYRef.current);
        } finally {
          scrollYRef.current = null;
        }
       }
     };
   }, [open]);

   if (typeof document === 'undefined') return null;
   if (!open) return null;

   function closeInstantly() {
     setSkipTransition(true);
     // allow DOM to update so transition classes are removed, then close
     setTimeout(() => onClose(), 20);
   }

   function handleSelect(id: string) {
     setSkipTransition(true);
     setTimeout(() => {
       onSelect(id);
       onClose();
     }, 20);
   }

   return createPortal(
     <div className="fixed inset-0 z-50">
       <div
         className="fixed inset-0 bg-black/40"
         onMouseDown={closeInstantly}
         onTouchStart={closeInstantly}
       />
      <div
        className={`fixed inset-x-0 bottom-0 h-1/2 bg-white z-50 shadow-xl overflow-auto transform ${skipTransition ? '' : 'transition-transform transition-opacity duration-300 ease-out'} translate-y-0 opacity-100`}
        // stop backdrop clicks
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
      >
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
           <button
             type="button"
             className="px-2 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
             onClick={closeInstantly}
             aria-label="Close"
           >
             Close
           </button>
         </div>
         <div className="p-4 space-y-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-200"
              onClick={() => handleSelect(it.id)}
            >
               <div className="w-16 h-16 rounded border p-1 flex items-center justify-center bg-white">
                 <img src={it.src} alt={it.name} className="object-contain w-full h-full" />
               </div>
               <div className="flex-1">
                 <div className="text-sm font-bold text-gray-900">{it.name}</div>
                 <div className="text-sm text-gray-600">{it.variation}</div>
               </div>
               <div className="text-red-600 font-semibold flex flex-col items-end">
                 <div>Rp{it.price?.toLocaleString()}</div>
                 {onRemove && (
                   <button
                     type="button"
                     aria-label="Delete"
                     className="mt-2 text-sm text-gray-500 hover:text-red-500"
                     onClick={(e) => {
                       e.stopPropagation();
                       onRemove(it.id);
                     }}
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 )}
               </div>
             </div>
           ))}
         </div>
       </div>
     </div>,
     document.body
   );
 }

