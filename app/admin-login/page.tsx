'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  EnvelopeIcon, 
  UserIcon, 
  LockClosedIcon, 
  KeyIcon,
  EyeIcon,
  EyeSlashIcon 
} from '@heroicons/react/24/outline';

// Import our custom utilities and types
import { useTelegram, TelegramUtils } from '@/utils/telegram';
import { AdminAPI } from '@/utils/api';
import { AuthUtils } from '@/utils/auth';
import { ValidationUtils } from '@/utils/validation';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/hooks/useAuth';
import { LoginFormData } from '@/types';

export default function AdminLogin() {
  const router = useRouter();
  const { tg, user } = useTelegram();
  const { notification, showNotification } = useNotification();
  const { loading: authLoading } = useAuth(false);
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    username: '',
    password: '',
    twofa: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Initialize Telegram WebApp
  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.BackButton.hide();
      tg.expand();
    }
  }, [tg]);

  // Handle input changes with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear form errors when user starts typing
    if (formErrors.length > 0) {
      setFormErrors([]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validation = ValidationUtils.validateLoginForm(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      showNotification(validation.errors[0], 'error');
      return;
    }

    // Get user data (real or mock for development)
    const userData = TelegramUtils.getUserData();
    if (!userData?.id) {
      showNotification('Unable to get user data. Please ensure you\'re accessing through Telegram or in development mode.', 'error');
      return;
    }

    setLoading(true);
    setFormErrors([]);

    const requestData = {
      email: formData.email.trim().toLowerCase(),
      chat_id: userData.id,
      username: formData.username.trim().toLowerCase(),
      password: formData.password.trim(),
      twofa: formData.twofa.trim()
    };

    try {
      const response : any = await AdminAPI.login(requestData);

      if (response.status !== 'success') {
        showNotification(response.message, 'error');
      } else {
        showNotification(response.message, 'success');
        console.log('Login successful:', response);
        if (response.jwt_token) {
          AuthUtils.setToken(response.jwt_token);
          // Small delay to show success message before redirect
          setTimeout(() => {
            router.push('/admin-dashboard');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      showNotification('Something went wrong, please try again!', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transform transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-500' 
              : notification.type === 'error'
              ? 'bg-red-500'
              : notification.type === 'warning'
              ? 'bg-yellow-500'
              : 'bg-blue-500'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-indigo-100 rounded-xl flex items-center justify-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">IG</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Access your I-Gebeya admin dashboard</p>
            {user && (
              <p className="text-sm text-indigo-600 mt-2">
                Welcome, {user.first_name || user.username || 'Admin'}
              </p>
            )}
          </div>

          {/* Form Errors */}
          {formErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <ul className="text-sm text-red-600 space-y-1">
                {formErrors.map((error, index) => (
                  <li key={index} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-2"></span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400"
              />
            </div>

            {/* Username Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Username"
                maxLength={10}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>

            {/* 2FA Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="twofa"
                value={formData.twofa}
                onChange={handleInputChange}
                placeholder="Enter 6-digit code"
                maxLength={6}
                pattern="\d{6}"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-md transform hover:-translate-y-0.5 disabled:transform-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Secure admin access for I-Gebeya platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}