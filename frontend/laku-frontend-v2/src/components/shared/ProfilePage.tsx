'use client';

import { useState } from 'react';
import { User } from '@/types';
import { Button } from '@/components/ui';

export function ProfilePage() {
  // TODO: Get user data from auth store/context
  const [user, setUser] = useState<Partial<User>>({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+62 812 3456 7890',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // TODO: Save user data
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile</h1>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {user.name?.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={user.name || ''}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{user.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={user.email || ''}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{user.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={user.phone || ''}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{user.phone || 'Not set'}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            {isEditing ? (
              <>
                <Button onClick={handleSave}>Save Changes</Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </div>

        {/* Order History Section */}
        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <p className="text-gray-600">No orders yet. Start shopping to see your order history!</p>
          {/* TODO: Add order history component */}
        </div>
      </div>
    </div>
  );
}