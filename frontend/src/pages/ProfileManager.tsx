import React from 'react';
import { useAuthContext } from '../context/AuthContext';

const ProfileManager = () => {
  const { user, logout } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
          {user ? (
            <div className="space-y-3">
              <div>
                <span className="text-sm text-gray-600">Name</span>
                <div className="font-medium">{user.name}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email</span>
                <div className="font-medium">{user.email}</div>
              </div>
              <button onClick={logout} className="mt-4 btn-secondary">Log out</button>
            </div>
          ) : (
            <p className="text-gray-600">No user logged in.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileManager;


