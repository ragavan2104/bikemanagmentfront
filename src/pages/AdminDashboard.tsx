import React, { useState, useEffect } from 'react';
import { analyticsService, saleService } from '../services/bikeService';
import type { KPIData, MonthlySalesData, Sale } from '../types';
import KPICard from '../components/admin/KPICard';
import SalesChart from '../components/admin/SalesChart';
import TransactionTable from '../components/admin/TransactionTable';
import BikeManagement from '../components/admin/BikeManagement';
import UserManagement from '../components/admin/UserManagement';
import Navbar from '../components/shared/Navbar';

const AdminDashboard = () => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [chartData, setChartData] = useState<MonthlySalesData[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearingData, setClearingData] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bikes' | 'users'>('dashboard');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchData();
    }
  }, [selectedYear, selectedMonth, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const filters = {
        year: selectedYear,
        ...(selectedMonth !== null && { month: selectedMonth })
      };
      
      const [kpiResponse, chartResponse, salesResponse] = await Promise.all([
        analyticsService.getKPIData(filters),
        analyticsService.getMonthlySalesData(selectedYear),
        saleService.getAllSales()
      ]);

      if (kpiResponse.success && kpiResponse.data) {
        setKpiData(kpiResponse.data);
      }

      if (chartResponse.success && chartResponse.data) {
        setChartData(chartResponse.data);
      }

      if (salesResponse.success && salesResponse.data) {
        // Filter sales data to match KPI filter settings
        let filteredSales = salesResponse.data;
        
        if (selectedYear || selectedMonth !== null) {
          filteredSales = salesResponse.data.filter((sale: Sale) => {
            if (sale.saleDate) {
              // Handle both timestamp and date formats
              const saleDate = sale.saleDate instanceof Date 
                ? sale.saleDate 
                : sale.saleDate.toDate ? sale.saleDate.toDate() 
                : new Date(sale.saleDate);
              
              const yearMatch = saleDate.getFullYear() === selectedYear;
              const monthMatch = selectedMonth === null || saleDate.getMonth() === selectedMonth;
              
              return yearMatch && monthMatch;
            }
            return false;
          });
        }
        
        setSales(filteredSales);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only refetch dashboard data, not necessarily the current tab data
  const handleDataChange = () => {
    if (activeTab === 'dashboard') {
      fetchData();
    }
    // For other tabs, we'll handle updates locally in their components
  };

  const handleClearAllData = async () => {
    const confirmMessage = `⚠️ WARNING: This will permanently delete ALL sales data and transaction history!

This action will:
• Delete all sales records
• Clear transaction history
• Reset analytics and graphs
• Reset all bikes to "available" status

Are you absolutely sure you want to proceed?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    // Second confirmation
    if (!confirm('This action cannot be undone. Type "DELETE" in the next prompt to confirm.')) {
      return;
    }

    const userInput = prompt('Type "DELETE" to confirm data deletion:');
    if (userInput !== 'DELETE') {
      alert('Data deletion cancelled. You must type "DELETE" exactly to confirm.');
      return;
    }

    try {
      setClearingData(true);

      // Clear all sales data
      const response = await saleService.clearAllData();
      
      if (response.success) {
        // Reset local state to empty
        setKpiData({
          totalProfit: 0,
          totalRevenue: 0,
          totalExpenses: 0,
          totalBikesSold: 0,
          totalBikesAvailable: 0
        });
        setChartData([]);
        setSales([]);
        
        alert('✅ All sales data and transaction history have been cleared successfully.');
        
        // Refresh data to ensure consistency
        fetchData();
      } else {
        alert('❌ Failed to clear data. Please try again.');
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('❌ An error occurred while clearing data. Please try again.');
    } finally {
      setClearingData(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Tab Navigation - Mobile Responsive */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm text-center sm:text-left ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('bikes')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm text-center sm:text-left ${
                  activeTab === 'bikes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🏍️ Bike Management
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm text-center sm:text-left ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                👥 User Management
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <React.Fragment>
            {/* Dashboard Header with Clear Data Button - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
              <button
                onClick={handleClearAllData}
                disabled={clearingData}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {clearingData ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Clearing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear All Data
                  </>
                )}
              </button>
            </div>

            {/* Date Filter Controls - Mobile Responsive */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📅 Filter Analytics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="year-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <select
                    id="year-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  >
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = new Date().getFullYear() - i;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Month
                  </label>
                  <select
                    id="month-select"
                    value={selectedMonth || ''}
                    onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                  >
                    <option value="">All Months</option>
                    {Array.from({ length: 12 }, (_, i) => {
                      const monthName = new Date(0, i).toLocaleString('default', { month: 'long' });
                      return (
                        <option key={i} value={i}>
                          {monthName}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedYear(new Date().getFullYear());
                      setSelectedMonth(null);
                    }}
                    className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition duration-200 text-sm"
                  >
                    🔄 Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Filter State Indicator */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Showing data for:</span> {selectedYear}
                    {selectedMonth !== null && ` - ${new Date(0, selectedMonth).toLocaleString('default', { month: 'long' })}`}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {selectedMonth !== null 
                      ? 'Monthly filtered view - Charts still show full year data' 
                      : 'Yearly view - All data for the selected year'}
                  </p>
                </div>
              </div>
            </div>

            {/* KPI Cards - Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <KPICard
                title="Total Profit"
                value={`₹${kpiData?.totalProfit.toLocaleString() || '0'}`}
                icon="💰"
                color="bg-green-100"
              />
              <KPICard
                title="Total Revenue"
                value={`₹${kpiData?.totalRevenue.toLocaleString() || '0'}`}
                icon="💵"
                color="bg-blue-100"
              />
              <KPICard
                title="Total Expenses"
                value={`₹${kpiData?.totalExpenses.toLocaleString() || '0'}`}
                icon="📊"
                color="bg-purple-100"
              />
              <KPICard
                title="Bikes Sold"
                value={`${kpiData?.totalBikesSold || '0'}`}
                icon="🏍️"
                color="bg-orange-100"
              />
            </div>

            {/* Sales Chart - Mobile Responsive */}
            <div className="mb-6 sm:mb-8">
              <SalesChart data={chartData} />
            </div>

            {/* Transaction Table - Mobile Responsive */}
            <TransactionTable sales={sales} />
          </React.Fragment>
        )}

        {activeTab === 'bikes' && (
          <BikeManagement onDataChange={handleDataChange} />
        )}

        {activeTab === 'users' && (
          <UserManagement onDataChange={handleDataChange} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
