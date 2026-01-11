import { useState, useEffect } from 'react';
import { UserRole, type User } from '../../types';
import { userService } from '../../services/userService';

interface UserManagementProps {
  onDataChange: () => void;
}

const UserManagement = ({ onDataChange }: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    role: 'worker' as UserRole,
    displayName: '',
    password: ''
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        // Fallback data for demo purposes if API fails
        setUsers([
          { id: '1', email: 'admin@bike.com', role: UserRole.ADMIN, displayName: 'System Admin', createdAt: new Date() },
          { id: '2', email: 'john@bike.com', role: UserRole.WORKER, displayName: 'John Mechanic', createdAt: new Date() },
          { id: '3', email: 'sarah@bike.com', role: UserRole.WORKER, displayName: 'Sarah Sales', createdAt: new Date() },
        ]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const tempUser: User = {
      id: `temp_${Date.now()}`,
      email: newUser.email,
      role: newUser.role,
      displayName: newUser.displayName,
      createdAt: new Date()
    };

    const originalUsers = users;
    setUsers(prev => [...prev, tempUser]);

    try {
      const response = await userService.createUser(newUser);
      if (response.success && response.data) {
        setUsers(prev => prev.map(u => u.id === tempUser.id ? response.data! : u));
        setShowAddModal(false);
        setNewUser({ email: '', role: UserRole.WORKER, displayName: '', password: '' });
        onDataChange();
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      setUsers(originalUsers);
      alert('Failed to add user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const originalUsers = users;
    setUsers(prev => prev.filter(u => u.id !== userId));

    try {
      const response = await userService.deleteUser(userId);
      if (!response.success) throw new Error("Failed");
      onDataChange();
    } catch (error) {
      setUsers(originalUsers);
      alert('Failed to delete user');
    }
  };

  // Helper Component for Role Badges
  const RoleBadge = ({ role }: { role: UserRole }) => {
    const isAdmin = role === UserRole.ADMIN;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        isAdmin 
          ? 'bg-purple-100 text-purple-800 border-purple-200' 
          : 'bg-blue-100 text-blue-800 border-blue-200'
      }`}>
        {role === UserRole.ADMIN ? '🛡️ Admin' : '👷 Worker'}
      </span>
    );
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6 lg:p-8">

        {/* --- Header Section --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Team Members</h2>
            <p className="text-sm text-gray-500 mt-1">Manage access and roles for your staff.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center justify-center gap-2 shadow-lg shadow-blue-200 w-full sm:w-auto"
          >
            <span className="text-xl leading-none">+</span> Add User
          </button>
        </div>

        {/* --- Content Area --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            <p className="text-gray-400 text-sm">Loading users...</p>
          </div>
        ) : (
          <>
            {/* 1. DESKTOP/TABLET VIEW (Table) - Hidden on Mobile */}
            <div className="hidden md:block overflow-hidden border border-gray-200 rounded-xl">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User Details</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                            {user.displayName.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-bold text-gray-900">{user.displayName}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => alert('Edit functionality not implemented yet')} className="text-blue-600 hover:text-blue-900 font-semibold hover:bg-blue-50 px-2 py-1 rounded transition">Edit</button>
                          {user.role !== UserRole.ADMIN && (
                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 font-semibold hover:bg-red-50 px-2 py-1 rounded transition">Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 2. MOBILE VIEW (Cards) - Hidden on Desktop */}
            <div className="md:hidden space-y-4">
              {users.map((user) => (
                <div key={user.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                       <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold">
                          {user.displayName.charAt(0).toUpperCase()}
                       </div>
                       <div>
                         <h3 className="font-bold text-gray-900">{user.displayName}</h3>
                         <p className="text-xs text-gray-500">{user.email}</p>
                       </div>
                    </div>
                    <RoleBadge role={user.role} />
                  </div>

                  {/* Card Footer / Actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                       <button 
                         onClick={() => alert('Edit functionality not implemented yet')}
                         className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg border border-blue-100"
                       >
                         Edit
                       </button>
                       {user.role !== UserRole.ADMIN && (
                         <button 
                           onClick={() => handleDeleteUser(user.id)}
                           className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-lg border border-red-100"
                         >
                           Delete
                         </button>
                       )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {users.length === 0 && (
               <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                 <p className="text-gray-500 font-medium">No team members found.</p>
               </div>
            )}
          </>
        )}
      </div>

      {/* --- ADD USER MODAL --- */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-auto border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Add New Team Member</h2>
              <p className="text-sm text-gray-500 mt-1">Create credentials for a new employee.</p>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={newUser.displayName}
                  onChange={(e) => setNewUser(prev => ({ ...prev, displayName: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. john@bike.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Assign Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  className="input-field"
                >
                  <option value={UserRole.WORKER}>Worker (Limited Access)</option>
                  <option value={UserRole.ADMIN}>Admin (Full Access)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newUser.password}
                  onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setNewUser({ email: '', role: UserRole.WORKER, displayName: '', password: '' }); }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- UTILITY STYLES --- */}
      <style>{`
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
          background-color: #f9fafb;
          font-size: 0.875rem;
          color: #111827;
          transition: all 0.2s;
        }
        .input-field:focus {
          outline: none;
          background-color: #ffffff;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .btn-primary {
          background-color: #2563eb;
          color: white;
          padding: 0.625rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.2s;
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
      `}</style>
    </div>
  );
};

export default UserManagement;