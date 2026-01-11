import { useState, useEffect } from 'react';
import { bikeService } from '../services/bikeService';
import type { Bike } from '../types';
import BikeCard from '../components/worker/BikeCard';
import Navbar from '../components/shared/Navbar';

const InventoryPage = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [allBikes, setAllBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('available');
  const [searchQuery, setSearchQuery] = useState('');

  const filterBikes = (bikesData: Bike[], statusFilter: string, search: string) => {
    let filtered = bikesData;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(bike => bike.status === statusFilter);
    }
    
    // Apply search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(bike => 
        bike.bikeName.toLowerCase().includes(query) ||
        bike.registrationNumber.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const response = await bikeService.getAllBikes();
      if (response.success && response.data) {
        setAllBikes(response.data);
        setBikes(filterBikes(response.data, filter, searchQuery));
      }
    } catch (error) {
      console.error('Error fetching bikes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  useEffect(() => {
    setBikes(filterBikes(allBikes, filter, searchQuery));
  }, [filter, searchQuery, allBikes]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Bike Inventory</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search bikes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="flex gap-2 overflow-x-auto">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-2 rounded-lg font-medium transition text-sm whitespace-nowrap ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('available')}
                  className={`px-3 py-2 rounded-lg font-medium transition text-sm whitespace-nowrap ${
                    filter === 'available'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Available
                </button>
                <button
                  onClick={() => setFilter('sold')}
                  className={`px-3 py-2 rounded-lg font-medium transition text-sm whitespace-nowrap ${
                    filter === 'sold'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Sold
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">
              Showing {bikes.length} of {allBikes.length} bikes
              {searchQuery && ` matching "${searchQuery}"`}
              {filter !== 'all' && ` (${filter})`}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : bikes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                {searchQuery ? `No bikes found matching "${searchQuery}"` : 'No bikes found'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {bikes.map((bike) => (
                <BikeCard key={bike.id} bike={bike} onSold={fetchBikes} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;