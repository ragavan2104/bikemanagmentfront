import { useState, useEffect } from 'react';
import { bikeService } from '../services/bikeService';
import type { Bike } from '../types';
import { BikeStatus } from '../types';
import AddBikeForm from '../components/worker/AddBikeForm';
import Navbar from '../components/shared/Navbar';

const WorkerDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentBikes, setRecentBikes] = useState<Bike[]>([]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await bikeService.getAllBikes();
      if (response.success && response.data) {
        const bikes = response.data;
        setStats({
          total: bikes.length,
          available: bikes.filter(bike => bike.status === BikeStatus.AVAILABLE).length,
          sold: bikes.filter(bike => bike.status === BikeStatus.SOLD).length
        });
        // Get the 5 most recently added bikes
        setRecentBikes(bikes.slice(-5).reverse());
      }
    } catch (error) {
      console.error('Error fetching bike stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Welcome to Worker Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">Manage your bike inventory efficiently</p>
        </div>

        {/* Add Bike Form */}
        <div className="mb-6 sm:mb-8">
          <AddBikeForm onBikeAdded={fetchStats} />
        </div>

        {/* Dashboard Stats */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Inventory Overview</h2>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <div className="bg-blue-50 p-3 sm:p-6 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-xs sm:text-sm font-semibold">Total Bikes</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-800">{stats.total}</p>
                  </div>
                  <div className="text-blue-500">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-3 sm:p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-xs sm:text-sm font-semibold">Available</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-800">{stats.available}</p>
                  </div>
                  <div className="text-green-500">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 sm:p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm font-semibold">Sold</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.sold}</p>
                  </div>
                  <div className="text-gray-500">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 sm:p-6 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-xs sm:text-sm font-semibold">Sales Rate</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-800">
                      {stats.total > 0 ? Math.round((stats.sold / stats.total) * 100) : 0}%
                    </p>
                  </div>
                  <div className="text-yellow-500">
                    <svg className="w-8 h-8 sm:w-12 sm:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Bikes */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Recently Added Bikes</h2>
          
          {recentBikes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm sm:text-base">No bikes added yet. Start by adding your first bike above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-700 text-sm">Bike Name</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-700 text-sm">Year</th>
                    <th className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-700 text-sm">Registration</th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-700 text-sm">Purchase Price</th>
                    <th className="text-right py-3 px-2 sm:px-4 font-semibold text-gray-700 text-sm">Selling Price</th>
                    <th className="text-center py-3 px-2 sm:px-4 font-semibold text-gray-700 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBikes.map((bike) => (
                    <tr key={bike.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                      <td className="py-3 px-2 sm:px-4 font-medium text-gray-800 text-sm">{bike.bikeName}</td>
                      <td className="py-3 px-2 sm:px-4 text-gray-600 text-sm">{bike.year}</td>
                      <td className="py-3 px-2 sm:px-4 text-gray-600 text-sm">{bike.registrationNumber}</td>
                      <td className="py-3 px-2 sm:px-4 text-right text-gray-600 text-sm">
                        ₹{bike.purchasePrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 sm:px-4 text-right text-gray-600 text-sm">
                        ₹{bike.sellingPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 sm:px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          bike.status === BikeStatus.AVAILABLE 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {bike.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDashboard;
