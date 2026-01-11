import React from 'react';
import type { Sale } from '../../types';

interface TransactionTableProps {
  sales: Sale[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ sales }) => {
  const formatDate = (date: any) => {
    if (!date) return '-';
    // Handle Firestore Timestamp
    if (date.toDate) return date.toDate().toLocaleDateString();
    // Handle Date object
    if (date instanceof Date) return date.toLocaleDateString();
    // Handle string/number
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">📋 Recent Transactions</h3>
        <p className="text-sm text-gray-500 mt-1">{sales.length} transaction(s) found</p>
      </div>
      
      {/* Mobile Card View */}
      <div className="block sm:hidden">
        {sales.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-500">
            No transactions found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {sales.map((sale) => (
              <div key={sale.id} className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{sale.bikeName}</p>
                    <p className="text-sm text-gray-500">{sale.bikeYear} Model</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    sale.profit >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    ₹{sale.profit.toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Customer</p>
                    <p className="text-gray-900">{sale.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="text-gray-900">{formatDate(sale.saleDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Sale Price</p>
                    <p className="text-gray-900">₹{sale.salePrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Purchase</p>
                    <p className="text-gray-900">₹{sale.purchasePrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bike Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prices</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold By</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(sale.saleDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{sale.bikeName}</div>
                    <div className="text-sm text-gray-500">{sale.bikeYear} Model</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{sale.customerName}</div>
                    <div className="text-sm text-gray-500">{sale.customerPhone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Sold: ₹{sale.salePrice.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Bought: ₹{sale.purchasePrice.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sale.profit >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      ₹{sale.profit.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {sale.soldBy || 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;