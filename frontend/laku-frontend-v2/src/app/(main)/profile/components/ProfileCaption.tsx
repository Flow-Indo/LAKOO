 'use client';
 
import React from 'react';
import ProfileEditButton from './ProfileEditButton';
import ProfileSettings from './ProfileSettings';
 
 export default function ProfileCaption() {
  return (
  <div className="mt-4">
    

    <p className="text-sm text-white mt-4 py-2.5 px-4 w-[350px]">Style is a way to say who you are without having to speak. Hari ini, pilih outfit yang bercerita. ✨ #OOTD #FashionIndonesia #StyleDaily</p>
      <div className="relative px-4 pb-0 overflow-visible">
        <div className="relative z-10 flex flex-col">
          <div className="mt-[12px]">
            <div className="mt-[20px] w-full">
             <div className="flex items-center justify-between pt-2.5 pb-2.5 mb-2.5">
               <div className="w-[111px] flex items-center justify-start gap-2">
                  <div className="flex flex-col items-center px-0">
                    <span className="text-sm font-semibold text-white">89K</span>
                    <span className="text-xs text-white">Followers</span>
                  </div>

                  <div className="flex flex-col items-center px-0">
                    <span className="text-sm font-semibold text-white">120</span>
                    <span className="text-xs text-white">Following</span>
                  </div>

                  <div className="flex flex-col items-center px-0">
                    <span className="text-sm font-semibold text-white">3.4K</span>
                    <span className="text-xs text-white">Likes</span>
                  </div>
                 </div>

                 <div className="ml-4 flex items-center gap-2">
                   <ProfileEditButton />
                   <ProfileSettings />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
);
 }

