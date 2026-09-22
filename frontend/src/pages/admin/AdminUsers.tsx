import { useState, useMemo } from 'react';
import { Search, ShieldAlert } from 'lucide-react';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import type { User, UserRole, AccountStatus } from '../../types';
import { formatDate } from '../../utils/format';

export function AdminUsers() {
  const { addToast } = useToast();
  const [users, setUsers] = useState<User[]>(() => userService.getAllUsers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AccountStatus>('all');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [confirmSuspendUser, setConfirmSuspendUser] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const handleToggleStatus = (user: User) => {
    const newStatus: AccountStatus = user.status === 'active' ? 'suspended' : 'active';
    userService.updateUserStatus(user.id, newStatus);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
    addToast(
      newStatus === 'active' ? 'success' : 'warning',
      `Account ${newStatus === 'active' ? 'Activated' : 'Suspended'}`,
      `${user.name}'s account has been ${newStatus}.`
    );
    setConfirmSuspendUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-midnight">User Management</h1>
        <p className="text-sm text-slate-text mt-1">
          Review, moderate, and manage access privileges for all registered portal accounts.
        </p>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-xl border border-light-slate/50 p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-text absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email address..."
            className="w-full pl-10 pr-4 py-2.5 bg-off-white border border-light-slate rounded-lg text-sm outline-none focus:border-primary focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 bg-off-white border border-light-slate rounded-lg text-xs font-medium text-midnight outline-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="recruiter">Recruiters</option>
            <option value="admin">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-off-white border border-light-slate rounded-lg text-xs font-medium text-midnight outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-light-slate/50 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-off-white border-b border-light-slate text-xs font-semibold text-slate-text uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Joined</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-light-slate/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-text">
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-midnight">{user.name}</p>
                          <p className="text-xs text-slate-text">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        user.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        user.role === 'recruiter' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`} />
                        {user.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-text">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-3 py-1.5 rounded-lg border border-light-slate text-xs font-semibold text-slate-text hover:text-midnight hover:bg-gray-50 transition-colors"
                        >
                          View Details
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => {
                              if (user.status === 'active') {
                                setConfirmSuspendUser(user);
                              } else {
                                handleToggleStatus(user);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              user.status === 'active'
                                ? 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200'
                                : 'text-green-700 bg-green-50 hover:bg-green-100 border border-green-200'
                            }`}
                          >
                            {user.status === 'active' ? 'Suspend' : 'Reactivate'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-modal animate-scale-in max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                  {selectedUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-midnight text-lg">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-text">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-text hover:text-midnight p-1">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-light-slate text-xs">
              <div>
                <span className="text-slate-text block">Account Role</span>
                <span className="font-semibold text-midnight capitalize">{selectedUser.role}</span>
              </div>
              <div>
                <span className="text-slate-text block">Account Status</span>
                <span className="font-semibold text-midnight capitalize">{selectedUser.status}</span>
              </div>
              <div>
                <span className="text-slate-text block">Joined Portal</span>
                <span className="font-semibold text-midnight">{formatDate(selectedUser.createdAt)}</span>
              </div>
              {selectedUser.phone && (
                <div>
                  <span className="text-slate-text block">Contact Phone</span>
                  <span className="font-semibold text-midnight">{selectedUser.phone}</span>
                </div>
              )}
            </div>

            {/* Student specifics */}
            {selectedUser.role === 'student' && (
              <div className="space-y-3 pt-3 border-t border-light-slate">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-text">Student Details</h4>
                <div className="space-y-1.5 text-xs">
                  {selectedUser.college && <p><span className="text-slate-text">Institution:</span> <strong className="text-midnight">{selectedUser.college}</strong></p>}
                  {selectedUser.degree && <p><span className="text-slate-text">Degree:</span> <strong className="text-midnight">{selectedUser.degree}</strong> ({selectedUser.graduationYear})</p>}
                </div>
                {selectedUser.skills && selectedUser.skills.length > 0 && (
                  <div className="pt-2">
                    <span className="text-slate-text text-xs block mb-1.5">Skills Tagged:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedUser.skills.map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded bg-gray-100 text-slate-text text-[11px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recruiter specifics */}
            {selectedUser.role === 'recruiter' && (
              <div className="space-y-2 pt-3 border-t border-light-slate text-xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-text">Recruiter Details</h4>
                {selectedUser.position && <p><span className="text-slate-text">Position:</span> <strong className="text-midnight">{selectedUser.position}</strong></p>}
                {selectedUser.department && <p><span className="text-slate-text">Department:</span> <strong className="text-midnight">{selectedUser.department}</strong></p>}
                <p><span className="text-slate-text">Company Ref:</span> <strong className="text-midnight">{selectedUser.companyId}</strong></p>
              </div>
            )}

            <div className="pt-4 border-t border-light-slate flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-midnight text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmSuspendUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-modal animate-scale-in text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-error flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-midnight text-lg">Suspend Account?</h3>
            <p className="text-xs text-slate-text">
              Are you sure you want to suspend <strong>{confirmSuspendUser.name}</strong>? They will immediately lose login access to the portal.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setConfirmSuspendUser(null)}
                className="px-4 py-2 border border-light-slate rounded-lg text-xs font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleStatus(confirmSuspendUser)}
                className="px-4 py-2 bg-error text-white rounded-lg text-xs font-semibold hover:bg-red-700"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
