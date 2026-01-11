import React, { useState, useEffect } from 'react';
import { bikeService, saleService } from '../../services/bikeService';
import type { Bike } from '../../types';
import { BikeStatus } from '../../types';

/* ---------------- INTERFACES ---------------- */

interface BikeManagementProps {
  onDataChange: () => void;
}

interface BikeFormData {
  bikeName: string;
  year: number;
  registrationNumber: string;
  ownerPhone: string;
  ownerAadhar: string;
  ownerAddress: string;
  purchasePrice: number;
  sellingPrice: number;
}

interface EditBikeModalProps {
  bike: Bike | null;
  onClose: () => void;
  onSave: (bikeData: Partial<Bike>) => void;
}

interface SellBikeModalProps {
  bike: Bike;
  onClose: () => void;
  onSold: () => void;
}

/* ---------------- SELL MODAL ---------------- */

const SellBikeModal = ({ bike, onClose, onSold }: SellBikeModalProps) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAadhar, setCustomerAadhar] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [salePrice, setSalePrice] = useState(bike.sellingPrice);
  const [loading, setLoading] = useState(false);
  const [aadharError, setAadharError] = useState('');

  const validateAadhar = (aadhar: string) => /^\d{12}$/.test(aadhar);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAadhar(customerAadhar)) {
      setAadharError('Aadhar must be exactly 12 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await saleService.markAsSold(bike.id, {
        salePrice,
        customerName,
        customerEmail,
        customerPhone,
        customerAadhar,
        customerAddress
      });
      if (response.success) onSold();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg my-auto relative">
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">
          Sell Bike: <span className="text-blue-600">{bike.bikeName}</span>
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input-field" placeholder="Customer Name" required onChange={(e) => setCustomerName(e.target.value)} />
            <input className="input-field" placeholder="Customer Phone" required type="tel" onChange={(e) => setCustomerPhone(e.target.value)} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input-field" type="email" placeholder="Customer Email" required onChange={(e) => setCustomerEmail(e.target.value)} />
            <div>
              <input
                className={`input-field ${aadharError ? 'border-red-500 ring-1 ring-red-500' : ''}`}
                placeholder="Aadhar Number (12 Digits)"
                maxLength={12}
                onChange={(e) => { setCustomerAadhar(e.target.value); setAadharError(''); }}
                required
              />
              {aadharError && <p className="text-red-500 text-xs mt-1">{aadharError}</p>}
            </div>
          </div>

          <textarea className="input-field" rows={2} placeholder="Customer Address" required onChange={(e) => setCustomerAddress(e.target.value)} />
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <label className="block text-xs font-bold text-green-700 uppercase mb-1">Final Sale Price (₹)</label>
            <input 
              className="w-full bg-white border border-green-300 rounded px-3 py-2 text-green-800 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-green-500" 
              type="number" 
              value={salePrice} 
              onChange={(e) => setSalePrice(Number(e.target.value))} 
              required 
            />
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary w-full md:w-auto md:flex-1">
              Cancel
            </button>
            <button disabled={loading} className="btn-success w-full md:w-auto md:flex-1">
              {loading ? 'Processing...' : 'Confirm Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------------- EDIT / ADD MODAL ---------------- */

const EditBikeModal = ({ bike, onClose, onSave }: EditBikeModalProps) => {
  const [formData, setFormData] = useState<BikeFormData>({
    bikeName: bike?.bikeName || '',
    year: bike?.year || new Date().getFullYear(),
    registrationNumber: bike?.registrationNumber || '',
    ownerPhone: bike?.ownerPhone || '',
    ownerAadhar: bike?.ownerAadhar || '',
    ownerAddress: bike?.ownerAddress || '',
    purchasePrice: bike?.purchasePrice || 0,
    sellingPrice: bike?.sellingPrice || 0
  });

  const [loading, setLoading] = useState(false);
  const [aadharError, setAadharError] = useState('');

  const validateAadhar = (aadhar: string) => /^\d{12}$/.test(aadhar);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAadhar(formData.ownerAadhar)) {
      setAadharError('Aadhar must be exactly 12 digits');
      return;
    }

    setLoading(true);
    try {
      const response = bike
        ? await bikeService.updateBike(bike.id, formData)
        : await bikeService.addBike(formData);
      if (response.success) onSave(response.data!);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg my-auto relative">
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">
          {bike ? 'Edit Bike Details' : 'Add New Inventory'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <input className="input-field w-full" placeholder="Bike Name (e.g. Royal Enfield Classic)" required value={formData.bikeName} onChange={(e) => setFormData({ ...formData, bikeName: e.target.value })} />
            
            <div className="grid grid-cols-2 gap-4">
              <input className="input-field" type="number" placeholder="Year" required value={formData.year} onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })} />
              <input className="input-field" placeholder="Reg Number" required value={formData.registrationNumber} onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })} />
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="input-field" placeholder="Owner Phone" required value={formData.ownerPhone} onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })} />
                <input className={`input-field ${aadharError ? 'border-red-500' : ''}`} placeholder="Owner Aadhar" value={formData.ownerAadhar} onChange={(e) => { setFormData({ ...formData, ownerAadhar: e.target.value }); setAadharError(''); }} required />
             </div>
             <textarea className="input-field" rows={2} placeholder="Owner Address" required value={formData.ownerAddress} onChange={(e) => setFormData({ ...formData, ownerAddress: e.target.value })} />
          </div>

          <hr className="border-gray-100" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Purchase Price</label>
              <input className="input-field" type="number" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Selling Price</label>
              <input className="input-field" type="number" value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })} />
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-3 pt-6">
            <button type="button" onClick={onClose} className="btn-secondary w-full md:w-auto md:flex-1">Cancel</button>
            <button disabled={loading} className="btn-primary w-full md:w-auto md:flex-1">
              {loading ? 'Saving...' : bike ? 'Update Details' : 'Add Bike'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */

const BikeManagement = ({ onDataChange }: BikeManagementProps) => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [allBikes, setAllBikes] = useState<Bike[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);

  const fetchBikes = async () => {
    setLoading(true);
    const response = await bikeService.getAllBikes();
    if (response.success && response.data) {
      setAllBikes(response.data);
      setBikes(response.data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchBikes(); }, []);

  useEffect(() => {
    let filtered = allBikes;
    if (filter !== 'all') filtered = filtered.filter(b => b.status === filter);
    if (searchQuery) {
      filtered = filtered.filter(b =>
        b.bikeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setBikes(filtered);
  }, [filter, searchQuery, allBikes]);

  const handleDelete = async (bike: Bike) => {
    if (!window.confirm(`Are you sure you want to delete ${bike.bikeName}?`)) return;
    await bikeService.deleteBike(bike.id);
    fetchBikes();
    onDataChange();
  };

  // Helper for status badge (Reused in both views)
  const StatusBadge = ({ status }: { status: string }) => (
    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border tracking-wider ${
      status === BikeStatus.AVAILABLE 
        ? 'bg-green-100 text-green-700 border-green-200' 
        : 'bg-gray-100 text-gray-500 border-gray-200'
    }`}>
      {status}
    </span>
  );

  return (
    <div className="w-full">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 md:p-6 lg:p-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">Bike Inventory</h2>
            <p className="text-sm text-gray-500 mt-1">Manage stock, track sales, and edit details.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:items-center w-full lg:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <input
                placeholder="Search..."
                className="input-field pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">🔍</span>
            </div>

            {/* Filters */}
            <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
              {['all', 'available', 'sold'].map(f => (
                <button key={f}
                  onClick={() => setFilter(f as any)}
                  className={`flex-1 md:flex-none px-4 py-2 rounded-md text-xs font-bold uppercase transition-all whitespace-nowrap ${
                    filter === f ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {f}
                </button>
              ))}
            </div>

            {/* Add Button */}
            <button 
              onClick={() => { setSelectedBike(null); setShowEditModal(true); }} 
              className="btn-primary w-full md:w-auto whitespace-nowrap flex justify-center items-center gap-2"
            >
              <span className="text-lg leading-none">+</span> Add Bike
            </button>
          </div>
        </div>

        {/* --- CONTENT AREA --- */}
        {loading ? (
          <div className="text-center py-12 bg-gray-50 animate-pulse rounded-lg">
            <p className="text-gray-400 text-sm">Loading inventory data...</p>
          </div>
        ) : bikes.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="text-gray-400 italic">No bikes found matching your criteria.</p>
          </div>
        ) : (
          <>
            {/* 1. MOBILE/TABLET CARD VIEW (Visible below MD breakpoint) */}
            <div className="md:hidden space-y-4">
              {bikes.map(bike => (
                <div key={bike.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{bike.bikeName}</h3>
                      <div className="text-xs text-gray-500 mt-0.5">{bike.year} • {bike.registrationNumber}</div>
                    </div>
                    <StatusBadge status={bike.status} />
                  </div>
                  
                  {/* Card Details Grid */}
                  <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                     <div className="text-gray-500">Purchase Price:</div>
                     <div className="text-right font-medium text-gray-700">₹{bike.purchasePrice.toLocaleString()}</div>
                     
                     <div className="text-gray-500">Selling Price:</div>
                     <div className="text-right font-bold text-blue-600">₹{bike.sellingPrice.toLocaleString()}</div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => { setSelectedBike(bike); setShowEditModal(true); }} className="btn-action-edit flex-1 text-center justify-center flex">Edit</button>
                    {bike.status === BikeStatus.AVAILABLE && (
                       <button onClick={() => { setSelectedBike(bike); setShowSellModal(true); }} className="btn-action-sell flex-1 text-center justify-center flex">Sell</button>
                    )}
                    <button onClick={() => handleDelete(bike)} className="btn-action-delete flex-1 text-center justify-center flex">Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. DESKTOP TABLE VIEW (Visible MD and up) */}
            <div className="hidden md:block w-full border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bike Details</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Year</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Reg No</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Purchase</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Selling</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Status</th>
                    <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {bikes.map(bike => (
                    <tr key={bike.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-4 font-bold text-gray-800">{bike.bikeName}</td>
                      <td className="p-4 text-center text-gray-600">{bike.year}</td>
                      <td className="p-4 text-center">
                        <span className="font-mono text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600 border border-gray-200">
                          {bike.registrationNumber}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-500">₹{bike.purchasePrice.toLocaleString()}</td>
                      <td className="p-4 text-right font-bold text-blue-600">₹{bike.sellingPrice.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <StatusBadge status={bike.status} />
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button onClick={() => { setSelectedBike(bike); setShowEditModal(true); }} className="btn-action-edit">Edit</button>
                          {bike.status === BikeStatus.AVAILABLE ? (
                            <button onClick={() => { setSelectedBike(bike); setShowSellModal(true); }} className="btn-action-sell">Sell</button>
                          ) : (
                            <span className="w-[45px]"></span> 
                          )}
                          <button onClick={() => handleDelete(bike)} className="btn-action-delete">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showEditModal && (
        <EditBikeModal
          bike={selectedBike}
          onClose={() => { setShowEditModal(false); setSelectedBike(null); }}
          onSave={() => { fetchBikes(); setShowEditModal(false); onDataChange(); }}
        />
      )}

      {showSellModal && selectedBike && (
        <SellBikeModal
          bike={selectedBike}
          onClose={() => { setShowSellModal(false); setSelectedBike(null); }}
          onSold={() => { fetchBikes(); setShowSellModal(false); onDataChange(); }}
        />
      )}

      {/* STYLES */}
      <style>{`
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          background-color: #f9fafb;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .input-field:focus {
          outline: none;
          background-color: #ffffff;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .btn-primary {
          background-color: #2563eb;
          color: white;
          padding: 0.625rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        }
        .btn-primary:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background-color: white;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 0.625rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .btn-secondary:hover {
          background-color: #f3f4f6;
          border-color: #9ca3af;
        }

        .btn-success {
          background-color: #10b981;
          color: white;
          padding: 0.625rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
        }
        .btn-success:hover {
          background-color: #059669;
          transform: translateY(-1px);
        }

        /* --- TABLE BUTTON STYLES --- */
        .btn-action-edit {
          padding: 0.35rem 0.8rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #2563eb;
          background-color: white;
          border: 1px solid #bfdbfe;
          border-radius: 0.375rem;
          transition: all 0.15s;
        }
        .btn-action-edit:hover {
          background-color: #eff6ff;
          border-color: #2563eb;
        }

        .btn-action-sell {
          padding: 0.35rem 0.8rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: white;
          background-color: #10b981; /* Green */
          border: 1px solid #10b981;
          border-radius: 0.375rem;
          transition: all 0.15s;
          box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
        }
        .btn-action-sell:hover {
          background-color: #059669;
          border-color: #059669;
        }

        .btn-action-delete {
          padding: 0.35rem 0.8rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #dc2626; /* Red */
          background-color: white;
          border: 1px solid #fecaca;
          border-radius: 0.375rem;
          transition: all 0.15s;
        }
        .btn-action-delete:hover {
          background-color: #fef2f2;
          border-color: #dc2626;
        }
      `}</style>
    </div>
  );
};

export default BikeManagement;