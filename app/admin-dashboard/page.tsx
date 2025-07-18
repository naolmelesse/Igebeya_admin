'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UsersIcon,
  ArchiveBoxIcon,
  EnvelopeIcon,
  ChartBarIcon,
  StarIcon,
  ChartPieIcon,
  CogIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// Import utilities and types
import { useTelegram } from '@/utils/telegram';
import { ApiClient } from '@/utils/api';
import { AuthUtils } from '@/utils/auth';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const { tg, user } = useTelegram();
  const { notification, showNotification } = useNotification();
  const { loading: authLoading } = useAuth(true);
  
  const [activeSection, setActiveSection] = useState<string>('users');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // Initialize and check auth
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = AuthUtils.getToken();
      if (!storedToken) {
        router.push('/admin-login');
        return;
      }
      setToken(storedToken);

      if (tg) {
        tg.ready();
        tg.BackButton.hide();
        tg.expand();
      }
    }
  }, [router, tg]);

  // Fetch users when activeSection is 'users'
  useEffect(() => {
    if (activeSection === 'users' && token) {
      fetchUsers();
    }
  }, [activeSection, token]);

  // Navigation items
  const navigationItems = [
    { id: 'users', name: 'Manage Users', icon: UsersIcon },
    { id: 'items', name: 'Manage Items', icon: ArchiveBoxIcon },
    { id: 'messages', name: 'Manage Messages', icon: EnvelopeIcon },
    { id: 'interaction', name: 'User Interaction', icon: ChartBarIcon },
    { id: 'popular', name: 'Popular Items', icon: StarIcon },
    { id: 'analytics', name: 'I-Gebeya Analytics', icon: ChartPieIcon },
    { id: 'admin-actions', name: 'Admin Actions', icon: CogIcon },
    { id: 'security', name: 'Security & Verification', icon: ShieldCheckIcon },
    { id: 'system', name: 'System Settings', icon: WrenchScrewdriverIcon },
  ];

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/get_igebeya_users?start=0&limit=50');
      const userData: User[] = await response.json();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Error fetching users', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle sending message to user
  const sendMessageToUser = async () => {
    if (!messageContent.trim() || !selectedUser || !user) return;

    try {
      const response = await ApiClient.post('/webapp_data', {
        message: messageContent,
        user_chatId: selectedUser.chat_id,
        admin_chatId: user.id,
        sender_type: 'admin',
        token: token
      });

      if (response.status === 'success') {
        showNotification('Message sent to user!', 'success');
        setMessageModalOpen(false);
        setMessageContent('');
        setSelectedUser(null);
      } else {
        showNotification('Error sending message', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('Error sending message', 'error');
    }
  };

  // Handle free boost airdrop
  const handleFreeBoost = async (chatId: number) => {
    if (!user || !token) return;

    try {
      const response = await ApiClient.post('/claim_tasks', {
        chat_id: chatId,
        type: 'adminairdrop',
        token: token,
        admin_chat_id: user.id
      });

      if (response.status === 'success') {
        showNotification('+1 free boost was airdropped to the user', 'success');
      } else {
        showNotification(response.message, 'error');
      }
    } catch (error) {
      console.error('Error sending boost:', error);
      showNotification('Error sending boost', 'error');
    }
  };

  // Get verification badge info
  const getVerificationBadge = (verified: string) => {
    switch (verified) {
      case 'blue':
        return { text: 'Verified', color: 'bg-blue-100 text-blue-800' };
      case 'pending':
        return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
      default:
        return { text: 'Not Verified', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Render users section
  const renderUsersSection = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button
          onClick={fetchUsers}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.map((userItem) => {
            const badge = getVerificationBadge(userItem.verified);
            return (
              <div
                key={userItem.id}
                className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 ${
                  userItem.reported_items > 0 ? 'ring-2 ring-red-200 bg-red-50' : ''
                }`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                      userItem.verified === 'blue' 
                        ? 'bg-blue-500' 
                        : userItem.verified === 'pending' 
                        ? 'bg-teal-500' 
                        : 'bg-gray-400'
                    }`}
                  >
                    {userItem.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{userItem.username}</h3>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${badge.color}`}>
                      {badge.text}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex justify-between">
                    <span>ID:</span>
                    <span className="font-medium">{userItem.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Boosts:</span>
                    <span className="font-medium">{userItem.boost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span className="font-medium">{userItem.total_items}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Views:</span>
                    <span className="font-medium">{userItem.total_views}</span>
                  </div>
                  {userItem.reported_items > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Reported Items:</span>
                      <span className="font-medium">{userItem.reported_items}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSelectedUser(userItem);
                      setMessageModalOpen(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-2 px-3 rounded transition-colors"
                  >
                    Message
                  </button>
                  <button
                    onClick={() => handleFreeBoost(userItem.chat_id)}
                    className="bg-green-500 hover:bg-green-600 text-white text-xs py-2 px-3 rounded transition-colors"
                  >
                    Free Boost
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return renderUsersSection();
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {navigationItems.find(item => item.id === activeSection)?.name}
            </h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        );
    }
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-500' 
              : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="bg-white p-2 rounded-lg shadow-lg"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        <main className="p-6">
          {renderContent()}
        </main>
      </div>

      {/* Message Modal */}
      {messageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Send Message to {selectedUser?.username}
              </h3>
              <textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-vertical"
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    setMessageModalOpen(false);
                    setMessageContent('');
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendMessageToUser}
                  disabled={!messageContent.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}