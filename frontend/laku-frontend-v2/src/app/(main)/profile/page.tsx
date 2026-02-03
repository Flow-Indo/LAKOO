'use client';

import React from 'react';
import ProfileBio from './components/ProfileBio';
import ProfileCaption from './components/ProfileCaption';
import ProfileBackground from './components/ProfileBackground';
import ProfileFeatures from './components/ProfileFeatures';
import ProfileOrder from './components/ProfileOrder';

export default function ProfilePageContent() {
  return (
    <div className="h-full">
      <ProfileBackground>
        <ProfileBio />
        <ProfileCaption />
      </ProfileBackground>

      <ProfileOrder />

      <ProfileFeatures />
    </div>
  );
}