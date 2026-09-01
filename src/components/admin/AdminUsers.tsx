import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserPlus,
  UserCheck,
  UserX,
  Search,
  Key,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  User,
  Phone,
  Trash2,
  Info,
  Eye,
  EyeOff,
} from 'lucide-react';
import { api } from '../../services/api';
import { UserAccount, UserRole } from '../../types';

interface AdminUsersProps {
  currentUser: UserAccount | null;
  onRefreshUser?: () => void;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ currentUser, onRefreshUser }) => {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [primaryAdminEmail, setPrimaryAdminEmail] = useState('ariyantushar44@gmail.com');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | UserRole>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Quick Assign Form
  const [assignIdentifier, setAssignIdentifier] = useState('');
  const [assignTargetRole, setAssignTargetRole] = useState<UserRole>('moderator');

  // New Staff Modal
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffRole, setStaffRole] = useState<'moderator' | 'customer'>('moderator');

  // Change Admin Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.getUsers();
      setUsers(res.users);
      if (res.primaryAdminEmail) {
        setPrimaryAdminEmail(res.primaryAdminEmail);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to load user roster.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 5000);
  };

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignIdentifier.trim()) {
      showNotification('error', 'Please enter a user email or username.');
      return;
    }

    try {
      setActionLoading(true);
      const res = await api.assignUserRole(assignIdentifier.trim(), assignTargetRole);
      showNotification('success', res.message);
      setAssignIdentifier('');
      loadUsers();
      if (onRefreshUser) onRefreshUser();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update user role.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleModerator = async (user: UserAccount) => {
    const nextRole: UserRole = user.role === 'moderator' ? 'customer' : 'moderator';
    try {
      setActionLoading(true);
      const res = await api.assignUserRole(user.email, nextRole);
      showNotification('success', res.message);
      loadUsers();
      if (onRefreshUser) onRefreshUser();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to change user role.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffEmail.trim() || !staffPassword.trim()) {
      showNotification('error', 'Name, email, and password are required.');
      return;
    }

    try {
      setActionLoading(true);
      const res = await api.createStaffUser({
        name: staffName.trim(),
        email: staffEmail.trim(),
        phone: staffPhone.trim() || undefined,
        password: staffPassword.trim(),
        role: staffRole,
      });
      showNotification('success', res.message);
      setIsAddStaffOpen(false);
      setStaffName('');
      setStaffEmail('');
      setStaffPhone('');
      setStaffPassword('');
      loadUsers();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to create staff member.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (user: UserAccount) => {
    if (!window.confirm(`Are you sure you want to remove user "${user.name}" (${user.email})?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await api.deleteUser(user.id);
      showNotification('success', res.message);
      loadUsers();
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to delete user.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      showNotification('error', 'Please enter both current and new password.');
      return;
    }
    if (newPassword.length < 5) {
      showNotification('error', 'New password must be at least 5 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showNotification('error', 'New password and confirmation do not match.');
      return;
    }

    try {
      setActionLoading(true);
      const targetEmail = currentUser?.email || primaryAdminEmail;
      const res = await api.changePassword(targetEmail, currentPassword, newPassword);
      showNotification('success', res.message);
      setIsPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showNotification('error', err.message || 'Failed to update password.');
    } finally {
      setActionLoading(false);
    }
  };

  const isPrimaryAdmin = currentUser?.isPrimaryAdmin || currentUser?.role === 'admin';

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">User & Role Management</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">
              Access Control
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage registered accounts and assign restricted <strong>Moderator</strong> privileges to team members.
          </p>
        </div>

        {isPrimaryAdmin && (
          <button
            onClick={() => setIsAddStaffOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm cursor-pointer transition-all active:scale-95 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Staff Member</span>
          </button>
        )}
      </div>

      {/* Notifications */}
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 animate-fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-amber-600 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Primary Administrator</span>
              <Shield className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-base font-bold text-slate-900 truncate">{primaryAdminEmail}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-amber-600" />
              <span>Sole primary account with full privileges</span>
            </div>
          </div>

          {isPrimaryAdmin && (
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">Master Security</span>
              <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Key className="w-3 h-3 text-amber-700" />
                <span>Change Password</span>
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Assigned Moderators</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {users.filter((u) => u.role === 'moderator').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Restricted access (Products, Orders, Flash Sales)
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Shoppers</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {users.filter((u) => u.role === 'customer').length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Storefront customers with order history
          </div>
        </div>
      </div>

      {/* Security & Role Matrix Info Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1a1f2e] to-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-2 flex-1">
            <h3 className="text-sm font-bold text-amber-300">
              Role-Based Access Control (RBAC) System
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Main Admin (Primary)</span>
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Full system control: Settings, Delivery Rates, User & Role Assignments, AI Studio tools, and Factory Resets.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-bold text-blue-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Assigned Moderator</span>
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Restricted operational suite: Manage inventory, edit prices & stock, update orders, and schedule Flash Sales.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  <span>Customer</span>
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Standard store shopper: Explore catalog, place orders with Cash on Delivery / bKash, and track live shipments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Role Assignment Bar */}
      {isPrimaryAdmin && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Key className="w-4 h-4 text-amber-600" />
            <span>Quick Moderator Role Assignment</span>
          </div>
          <p className="text-xs text-slate-500">
            Enter a registered user's email address or ID to assign them the Moderator role.
          </p>

          <form onSubmit={handleAssignRole} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={assignIdentifier}
                onChange={(e) => setAssignIdentifier(e.target.value)}
                placeholder="Enter user email (e.g. user@example.com) or username"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none"
              />
            </div>

            <select
              value={assignTargetRole}
              onChange={(e) => setAssignTargetRole(e.target.value as UserRole)}
              className="w-full sm:w-44 px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white focus:border-amber-500 outline-none"
            >
              <option value="moderator">Assign Moderator</option>
              <option value="customer">Revoke (Set Customer)</option>
            </select>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full sm:w-auto px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {actionLoading ? 'Updating...' : 'Apply Role'}
            </button>
          </form>
        </div>
      )}

      {/* User Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search & Filter Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:border-amber-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-500 font-medium">Filter:</span>
            <div className="inline-flex rounded-lg p-1 bg-slate-200/70 text-xs font-semibold">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  filterRole === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({users.length})
              </button>
              <button
                onClick={() => setFilterRole('admin')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  filterRole === 'admin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admins ({users.filter((u) => u.role === 'admin').length})
              </button>
              <button
                onClick={() => setFilterRole('moderator')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  filterRole === 'moderator' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Moderators ({users.filter((u) => u.role === 'moderator').length})
              </button>
              <button
                onClick={() => setFilterRole('customer')}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  filterRole === 'customer' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Customers ({users.filter((u) => u.role === 'customer').length})
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            <div className="inline-block w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mb-2" />
            <p>Loading user accounts...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No users found</p>
            <p className="text-slate-400 mt-0.5">Try searching with a different keyword or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role & Permissions</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const isUserPrimary = user.isPrimaryAdmin || user.role === 'admin';
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                            user.role === 'admin'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : user.role === 'moderator'
                              ? 'bg-blue-100 text-blue-900 border border-blue-300'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isUserPrimary && (
                                <span title="Primary Store Administrator">
                                  <Shield className="w-3.5 h-3.5 text-amber-600 inline fill-amber-600" />
                                </span>
                              )}
                            </div>
                            <div className="text-slate-500 text-[11px]">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300">
                            <Shield className="w-3 h-3 text-amber-600" />
                            <span>Primary Administrator</span>
                          </span>
                        ) : user.role === 'moderator' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-300">
                            <ShieldCheck className="w-3 h-3 text-blue-600" />
                            <span>Staff Moderator</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                            <User className="w-3 h-3 text-slate-500" />
                            <span>Customer</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        {user.phone || '—'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(user.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isUserPrimary ? (
                          <span className="text-[11px] font-semibold text-slate-400 italic">
                            Protected Primary
                          </span>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            {isPrimaryAdmin && (
                              <button
                                onClick={() => handleToggleModerator(user)}
                                disabled={actionLoading}
                                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                  user.role === 'moderator'
                                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                                }`}
                                title={user.role === 'moderator' ? 'Revoke Moderator Role' : 'Assign Moderator Role'}
                              >
                                {user.role === 'moderator' ? 'Revoke Mod' : 'Make Moderator'}
                              </button>
                            )}

                            {isPrimaryAdmin && (
                              <button
                                onClick={() => handleDeleteUser(user)}
                                disabled={actionLoading}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Remove User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Create Staff Member */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-amber-600" />
              <span>Create New Staff Account</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Add a team member credentials directly. They can immediately log in through the universal website portal.
            </p>

            <form onSubmit={handleCreateStaff} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. Mahir Faisal"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address (Login Username)
                </label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="mahir@velora.com"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Temporary Password
                </label>
                <input
                  type="text"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  placeholder="e.g. mod123"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role Assignment
                </label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value as 'moderator' | 'customer')}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-900 bg-white outline-none focus:border-amber-500"
                >
                  <option value="moderator">Staff Moderator (Restricted Admin Suite)</option>
                  <option value="customer">Standard Customer</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Change Admin Password */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-600" />
              <span>Change Master Admin Password</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Update the security password for primary administrator account (<code>{currentUser?.email || primaryAdminEmail}</code>).
            </p>

            <form onSubmit={handleChangeAdminPassword} className="mt-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password *
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password * (Min 5 characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    required
                    className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
