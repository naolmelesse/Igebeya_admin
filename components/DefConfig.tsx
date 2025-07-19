'use client';

import { useState } from 'react';
import { CogIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DevConfigProps {
  isDevelopment: boolean;
}

export default function DevConfig({ isDevelopment }: DevConfigProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mockUserId, setMockUserId] = useState('12345');

  if (!isDevelopment) return null;

  const updateMockUser = () => {
    // Update the mock user in localStorage for testing
    localStorage.setItem('mockTelegramUser', JSON.stringify({
      id: parseInt(mockUserId),
      first_name: 'Test',
      last_name: 'Admin',
      username: 'testadmin',
    }));
    
    // Reload the page to apply changes
    window.location.reload();
  };

  return (
    <>
      {/* Development Mode Indicator */}
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-1 text-sm font-medium z-50">
        🔧 DEVELOPMENT MODE - Mock Telegram WebApp Active
      </div>

      {/* Dev Config Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-black p-3 rounded-full shadow-lg z-40"
        title="Development Configuration"
      >
        <CogIcon className="h-5 w-5" />
      </button>

      {/* Dev Config Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Development Configuration
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mock User ID (for testing login)
                </label>
                <input
                  type="number"
                  value={mockUserId}
                  onChange={(e) => setMockUserId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 bg-white"
                  placeholder="Enter mock user ID"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Development Mode:</strong> The app is using a mock Telegram WebApp since you're running locally. 
                  This allows you to test the admin panel without needing to access it through Telegram.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Production Note:</strong> When deployed and accessed through Telegram, the real WebApp data will be used automatically.
                </p>
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateMockUser}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-colors"
              >
                Apply & Reload
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}