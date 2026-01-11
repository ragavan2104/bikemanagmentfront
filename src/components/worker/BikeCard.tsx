import { useState } from 'react';
import type { Bike, Sale } from '../../types';
import { BikeStatus } from '../../types';
import SellBikeModal from './SellBikeModal';
import { saleService } from '../../services/bikeService';

interface BikeCardProps {
  bike: Bike;
  onSold: () => void;
}

interface SoldBikeDetailsModalProps {
  sale: Sale;
  onClose: () => void;
}

const SoldBikeDetailsModal = ({ sale, onClose }: SoldBikeDetailsModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Sale Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Bike Information</h3>
            <p><span className="font-medium">Name:</span> {sale.bikeName} ({sale.bikeYear})</p>
            <p><span className="font-medium">Sale Date:</span> {sale.saleDate?.toDate ? new Date(sale.saleDate.toDate()).toLocaleDateString() : 'N/A'}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Customer Information</h3>
            <p><span className="font-medium">Name:</span> {sale.customerName}</p>
            <p><span className="font-medium">Email:</span> {sale.customerEmail}</p>
            <p><span className="font-medium">Phone:</span> {sale.customerPhone}</p>
            <p><span className="font-medium">Aadhar:</span> {sale.customerAadhar}</p>
            <p><span className="font-medium">Address:</span> {sale.customerAddress}</p>
          </div>

          <div className="border-b pb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Financial Details</h3>
            <p><span className="font-medium">Purchase Price:</span> ₹{sale.purchasePrice.toLocaleString()}</p>
            <p><span className="font-medium">Sale Price:</span> ₹{sale.salePrice.toLocaleString()}</p>
            <p><span className="font-medium text-green-600">Profit:</span> ₹{sale.profit.toLocaleString()}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Sold By</h3>
            <p>{sale.soldBy}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const BikeCard = ({ bike, onSold }: BikeCardProps) => {
  const [showSellModal, setShowSellModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [saleData, setSaleData] = useState<Sale | null>(null);

  const fetchSaleData = async () => {
    if (bike.status === BikeStatus.SOLD) {
      try {
        const response = await saleService.getSaleByBikeId(bike.id);
        if (response.success && response.data) {
          setSaleData(response.data);
          setShowDetailsModal(true);
        }
      } catch (error) {
        console.error('Error fetching sale data:', error);
      }
    }
  };

  const handleCardClick = () => {
    if (bike.status === BikeStatus.SOLD) {
      fetchSaleData();
    }
  };

  return (
    <>
      <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
        bike.status === BikeStatus.SOLD ? 'cursor-pointer' : ''
      }`} onClick={handleCardClick}>
        <div className="relative h-48 bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <div className="text-4xl mb-2">🏍️</div>
            <div className="text-sm">{bike.bikeName}</div>
          </div>
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
            bike.status === BikeStatus.AVAILABLE 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {bike.status}
          </div>
          {bike.status === BikeStatus.SOLD && (
            <div className="absolute bottom-2 right-2 text-blue-600 text-sm font-medium">
              Click for details
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {bike.bikeName}
          </h3>
          <p className="text-gray-600 mb-1">Year: {bike.year}</p>
          <p className="text-gray-600 mb-3">Reg: {bike.registrationNumber}</p>
          
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm text-gray-500">Purchase Price</p>
              <p className="text-lg font-bold text-gray-800">
                ₹{bike.purchasePrice.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Selling Price</p>
              <p className="text-lg font-bold text-blue-600">
                ₹{bike.sellingPrice.toLocaleString()}
              </p>
            </div>
          </div>

          {bike.status === BikeStatus.AVAILABLE && (
            <div className="mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSellModal(true);
                }}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Mark as Sold
              </button>
            </div>
          )}
        </div>
      </div>

      {showSellModal && (
        <SellBikeModal
          bike={bike}
          onClose={() => setShowSellModal(false)}
          onSold={() => {
            onSold();
            setShowSellModal(false);
          }}
        />
      )}

      {showDetailsModal && saleData && (
        <SoldBikeDetailsModal
          sale={saleData}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </>
  );
};

export default BikeCard;
