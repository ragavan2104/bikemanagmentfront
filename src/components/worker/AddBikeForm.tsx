import { useState, type ChangeEvent } from 'react';
import { bikeService } from '../../services/bikeService';

const AddBikeForm = ({ onBikeAdded }: { onBikeAdded: () => void }) => {
  const [formData, setFormData] = useState({
    bikeName: '',
    year: new Date().getFullYear(),
    registrationNumber: '',
    ownerPhone: '',
    ownerAadhar: '',
    ownerAddress: '',
    purchasePrice: '',
    sellingPrice: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aadharError, setAadharError] = useState('');

  const validateAadhar = (aadhar: string) => {
    const aadharRegex = /^\d{12}$/;
    return aadharRegex.test(aadhar);
  };

  const handleAadharChange = (value: string) => {
    setFormData(prev => ({ ...prev, ownerAadhar: value }));
    if (value && !validateAadhar(value)) {
      setAadharError('Aadhar number must be exactly 12 digits');
    } else {
      setAadharError('');
    }
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate Aadhar before submission
    if (!validateAadhar(formData.ownerAadhar)) {
      setAadharError('Aadhar number must be exactly 12 digits');
      return;
    }
    
    setLoading(true);

    try {
      await bikeService.addBike({
        bikeName: formData.bikeName,
        year: Number(formData.year),
        registrationNumber: formData.registrationNumber,
        ownerPhone: formData.ownerPhone,
        ownerAadhar: formData.ownerAadhar,
        ownerAddress: formData.ownerAddress,
        purchasePrice: parseFloat(formData.purchasePrice),
        sellingPrice: parseFloat(formData.sellingPrice)
      });

      // Reset form
      setFormData({ 
        bikeName: '', 
        year: new Date().getFullYear(), 
        registrationNumber: '', 
        ownerPhone: '',
        ownerAadhar: '',
        ownerAddress: '', 
        purchasePrice: '', 
        sellingPrice: '' 
      });
      setAadharError('');

      onBikeAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to add bike');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Add New Bike</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label htmlFor="bikeName" className="block text-sm font-medium text-gray-700 mb-2">
              Bike Name
            </label>
            <input
              id="bikeName"
              name="bikeName"
              type="text"
              value={formData.bikeName}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
              placeholder="e.g., Royal Enfield Classic 350"
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <input
              id="year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              required
              min="1900"
              max={new Date().getFullYear() + 1}
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
            />
          </div>

          <div>
            <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Registration Number
            </label>
            <input
              id="registrationNumber"
              name="registrationNumber"
              type="text"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
              placeholder="e.g., TN01AB1234"
            />
          </div>

          <div>
            <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              id="ownerPhone"
              name="ownerPhone"
              type="tel"
              value={formData.ownerPhone}
              onChange={handleChange}
              required
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
              placeholder="e.g., +91 9876543210"
            />
          </div>

          <div>
            <label htmlFor="ownerAadhar" className="block text-sm font-medium text-gray-700 mb-2">
              Owner Aadhar Number
            </label>
            <input
              id="ownerAadhar"
              name="ownerAadhar"
              type="text"
              value={formData.ownerAadhar}
              onChange={(e) => handleAadharChange(e.target.value)}
              required
              maxLength={12}
              pattern="\\d{12}"
              className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent outline-none text-sm sm:text-base ${
                aadharError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="123456789012"
            />
            {aadharError && (
              <p className="text-red-500 text-xs mt-1">{aadharError}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="ownerAddress" className="block text-sm font-medium text-gray-700 mb-2">
            Owner Address
          </label>
          <textarea
            id="ownerAddress"
            name="ownerAddress"
            value={formData.ownerAddress}
            onChange={(e) => setFormData(prev => ({ ...prev, ownerAddress: e.target.value }))}
            required
            rows={3}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm sm:text-base"
            placeholder="123 Main Street, City, State, PIN Code"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-2">
              Bought Price (₹)
            </label>
            <input
              id="purchasePrice"
              name="purchasePrice"
              type="number"
              step="0.01"
              value={formData.purchasePrice}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="sellingPrice" className="block text-sm font-medium text-gray-700 mb-2">
              Selling Price (₹)
            </label>
            <input
              id="sellingPrice"
              name="sellingPrice"
              type="number"
              step="0.01"
              value={formData.sellingPrice}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
              placeholder="0.00"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? 'Adding Bike...' : 'Add Bike'}
        </button>
      </form>
    </div>
  );
};

export default AddBikeForm;
