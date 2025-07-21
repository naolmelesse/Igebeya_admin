'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminAPI } from '@/utils/api';
import { useNotification } from '@/hooks/useNotification';
import { useTelegram } from '@/utils/telegram';
import { VerificationDetails } from '@/types';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  ChevronLeftIcon
} from '@heroicons/react/24/outline';

export default function VerificationManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showNotification } = useNotification();
  const { user } = useTelegram();
  
  const userChatId = searchParams.get('userChatId');
  const username = searchParams.get('username');
  
  const [verificationDetails, setVerificationDetails] = useState<VerificationDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  useEffect(() => {
    if (userChatId && user) {
      fetchVerificationDetails();
    }
  }, [userChatId, user]);

  const fetchVerificationDetails = async () => {
    if (!userChatId || !user) return;
    
    setLoading(true);
    try {
      const details = await AdminAPI.getUserVerificationDetails({
        chat_id: userChatId,
        admin_chat_id: user.id
      });
      setVerificationDetails(details as VerificationDetails);
    } catch (error) {
      console.error('Error fetching verification details:', error);
      showNotification('Error fetching verification details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationAction = async (status: string) => {
    if (!userChatId || !user || !verificationDetails) return;
    
    setProcessing(true);
    try {
      await AdminAPI.adminActionVerification({
        chat_id: userChatId,
        admin_chat_id: user.id,
        status: status,
        identification_number: verificationDetails.identification_number
      });
      
      showNotification(`Verification ${status.toLowerCase()} successfully`, 'success');
      
      // Update local state
      setVerificationDetails(prev => prev ? {
        ...prev,
        status: status.toLowerCase() as 'pending' | 'approved' | 'rejected'
      } : null);
      
    } catch (error) {
      console.error('Error processing verification:', error);
      showNotification('Error processing verification', 'error');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading verification details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Verification</h1>
            <p className="text-gray-600">Managing verification for {username} (ID: {userChatId})</p>
          </div>
        </div>
      </div>

      {verificationDetails ? (
        <div className="max-w-4xl mx-auto">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Verification Status</h2>
              <div className="flex items-center space-x-2">
                {getStatusIcon(verificationDetails.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(verificationDetails.status)}`}>
                  {verificationDetails.status.charAt(0).toUpperCase() + verificationDetails.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Full Name:</span>
                <p className="text-gray-900">{verificationDetails.full_name}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Document Type:</span>
                <p className="text-gray-900">{verificationDetails.document_type}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">ID Number:</span>
                <p className="text-gray-900">{verificationDetails.identification_number}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Submitted:</span>
                <p className="text-gray-900">{new Date(verificationDetails.submitted_at).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Document Images */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              Verification Documents
            </h3>
            
            {verificationDetails.document_images && verificationDetails.document_images.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {verificationDetails.document_images.map((image, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <img 
                      src={image} 
                      alt={`Document ${index + 1}`}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => window.open(image, '_blank')}
                    />
                    <div className="p-2 bg-gray-50">
                      <p className="text-xs text-gray-600">Document {index + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No document images found.</p>
            )}
          </div>

          {/* Action Buttons */}
          {verificationDetails.status === 'pending' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Actions</h3>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleVerificationAction('approved')}
                  disabled={processing}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  {processing ? 'Processing...' : 'Approve Verification'}
                </button>
                
                <button
                  onClick={() => handleVerificationAction('rejected')}
                  disabled={processing}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
                >
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  {processing ? 'Processing...' : 'Reject Verification'}
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mt-4 text-center">
                Review the documents carefully before making a decision. This action will notify the user.
              </p>
            </div>
          )}
          
          {verificationDetails.status !== 'pending' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center">
                <div className="text-4xl mb-4">
                  {verificationDetails.status === 'approved' ? '✅' : '❌'}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Verification {verificationDetails.status === 'approved' ? 'Approved' : 'Rejected'}
                </h3>
                <p className="text-gray-600">
                  This verification request has already been processed.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* No Verification Found */
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <UserIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Verification Request</h3>
            <p className="text-gray-600 mb-6">
              This user hasn't submitted any verification documents yet.
            </p>
            <button
              onClick={() => router.back()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}