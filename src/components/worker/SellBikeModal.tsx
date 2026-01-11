import { useState } from 'react';
import type { Bike } from '../../types';
import { saleService } from '../../services/bikeService';

interface SellBikeModalProps {
  bike: Bike;
  onClose: () => void;
  onSold: () => void;
}

const SellBikeModal = ({ bike, onClose, onSold }: SellBikeModalProps) => {
  const [formData, setFormData] = useState({
    salePrice: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAadhar: '',
    customerAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aadharError, setAadharError] = useState('');

  const validateAadhar = (aadhar: string) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };

  const handleAadharChange = (value: string) => {
    setFormData({ ...formData, customerAadhar: value });
    if (value && !validateAadhar(value)) {
      setAadharError('Aadhar number must be exactly 12 digits');
    } else {
      setAadharError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate Aadhar before submission
    if (!validateAadhar(formData.customerAadhar)) {
      setAadharError('Aadhar number must be exactly 12 digits');
      return;
    }
    
    setLoading(true);

    try {
      await saleService.markAsSold(bike.id, {
        salePrice: parseFloat(formData.salePrice),
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        customerAadhar: formData.customerAadhar,
        customerAddress: formData.customerAddress
      });

      onSold();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to mark bike as sold');
    } finally {
      setLoading(false);
    }
  };

  const profit = formData.salePrice 
    ? parseFloat(formData.salePrice) - bike.purchasePrice 
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Mark as Sold
        </h2>
        
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            {bike.bikeName} ({bike.year})
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Registration: <span className="font-semibold">{bike.registrationNumber}</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Purchase Price: <span className="font-semibold">₹{bike.purchasePrice.toLocaleString()}</span>
          </p>
          {formData.salePrice && (
            <p className={`text-sm mt-1 font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Profit: ₹{profit.toLocaleString()}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-2">
              Sale Price (₹)
            </label>
            <input
              id="salePrice"
              type="number"
              step="0.01"
              value={formData.salePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value }))}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name
            </label>
            <input
              id="customerName"
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Customer Email
            </label>
            <input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="customer@example.com"
            />
          </div>

          <div>
            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Customer Phone
            </label>
            <input
              id="customerPhone"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label htmlFor="customerAadhar" className="block text-sm font-medium text-gray-700 mb-2">
              Aadhar Number
            </label>
            <input
              id="customerAadhar"
              type="text"
              value={formData.customerAadhar}
              onChange={(e) => handleAadharChange(e.target.value)}
              required
              maxLength={12}
              pattern="\\d{12}"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none ${
                aadharError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="123456789012"
            />
            {aadharError && (
              <p className="text-red-500 text-xs mt-1">{aadharError}</p>
            )}
          </div>

          <div>
            <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-700 mb-2">
              Customer Address
            </label>
            <textarea
              id="customerAddress"
              value={formData.customerAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, customerAddress: e.target.value }))}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="123 Main Street, City, State, PIN Code"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellBikeModal;
