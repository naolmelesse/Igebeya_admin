'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminAPI } from '@/utils/api';
import { useNotification } from '@/hooks/useNotification';
import { Item, ReportMessage } from '@/types';
import { 
  EyeIcon, 
  TrashIcon, 
  ExclamationTriangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon 
} from '@heroicons/react/24/outline';

export default function ItemManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showNotification } = useNotification();
  
  const userChatId = searchParams.get('userChatId');
  const username = searchParams.get('username');
  
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [reports, setReports] = useState<ReportMessage[]>([]);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (userChatId) {
      fetchUserItems();
    }
  }, [userChatId, currentPage]);

  const fetchUserItems = async () => {
    if (!userChatId) return;
    
    setLoading(true);
    try {
      const itemsData = await AdminAPI.getSellerItems(
        parseInt(userChatId), 
        currentPage * 20, 
        20
      );
      
      if (currentPage === 0) {
        setItems(itemsData);
      } else {
        setItems(prev => [...prev, ...itemsData]);
      }
      
      setHasMore(itemsData.length === 20);
    } catch (error) {
      console.error('Error fetching items:', error);
      showNotification('Error fetching items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReports = async (item: Item) => {
    setSelectedItem(item);
    try {
      const reportsData = await AdminAPI.getReportMessages(item.id, item.seller_chat_id);
      setReports(reportsData);
      setShowReportsModal(true);
    } catch (error) {
      console.error('Error fetching reports:', error);
      showNotification('Error fetching reports', 'error');
    }
  };

  const handleUnlistItem = async (item: Item, reportIds?: string) => {
    try {
      await AdminAPI.adminUnlistItem({
        itemId: item.id.toString(),
        chat_id: parseInt(userChatId!),
        seller_chat_id: item.seller_chat_id,
        reports: reportIds
      });
      
      showNotification('Item unlisted successfully', 'success');
      
      // Remove item from local state
      setItems(prev => prev.filter(i => i.id !== item.id));
      setShowReportsModal(false);
    } catch (error) {
      console.error('Error unlisting item:', error);
      showNotification('Error unlisting item', 'error');
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Item Management</h1>
            <p className="text-gray-600">Managing items for {username} (ID: {userChatId})</p>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {loading && currentPage === 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-48 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                {/* Item Image */}
                <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                  {item.images && item.images.length > 0 ? (
                    <img 
                      src={item.images[0]} 
                      alt={item.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="text-gray-400">No Image</div>
                  )}
                </div>

                {/* Item Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-green-600">
                      ${item.price}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'sold'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    <div>Views: {item.views}</div>
                    <div>Created: {new Date(item.created_at).toLocaleDateString()}</div>
                    {item.is_boosted && (
                      <div className="text-purple-600 font-medium">🚀 Boosted</div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewReports(item)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-2 px-3 rounded transition-colors flex items-center justify-center"
                    >
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      Reports
                    </button>
                    <button
                      onClick={() => handleUnlistItem(item)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 px-3 rounded transition-colors flex items-center justify-center"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Unlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {loading ? 'Loading...' : 'Load More Items'}
              </button>
            </div>
          )}
        </>
      )}

      {/* Reports Modal */}
      {showReportsModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Reports for: {selectedItem.title}
              </h3>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              {reports.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No reports found for this item.</p>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-gray-900">
                            @{report.reporter_username}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            ID: {report.reporter_chat_id}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(report.reported_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          {report.reason}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{report.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowReportsModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                Close
              </button>
              {reports.length > 0 && (
                <button
                  onClick={() => {
                    const reportIds = reports.map(r => r.id).join(',');
                    handleUnlistItem(selectedItem, reportIds);
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Unlist Item (Process Reports)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Items Found</h3>
          <p className="text-gray-500">This user hasn't posted any items yet.</p>
        </div>
      )}
    </div>
  );
}
            