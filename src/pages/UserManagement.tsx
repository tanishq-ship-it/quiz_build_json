import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, UserCheck, UserX, X, Users } from 'lucide-react';
import Lottie from 'lottie-react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import type { UserDto } from '../services/api';
import loadingAnimation from '../assests/Loding.json';

type DialogMode = 'create' | 'edit' | null;

function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load users';
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateDialog = () => {
    setEditingUser(null);
    setFormName('');
    setFormEmail('');
    setFormPassword('');
    setFormIsActive(true);
    setDialogError(null);
    setDialogMode('create');
  };

  const openEditDialog = (user: UserDto) => {
    setEditingUser(user);
    setFormName(user.name);
    setFormEmail(user.email);
    setFormPassword('');
    setFormIsActive(user.isActive);
    setDialogError(null);
    setDialogMode('edit');
  };

  const closeDialog = () => {
    if (isSaving) return;
    setDialogMode(null);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDialogError(null);

    const name = formName.trim();
    const email = formEmail.trim();
    const password = formPassword.trim();

    if (!name || !email) {
      setDialogError('Name and email are required');
      return;
    }

    if (dialogMode === 'create' && !password) {
      setDialogError('Password is required for new users');
      return;
    }

    try {
      setIsSaving(true);

      if (dialogMode === 'create') {
        const newUser = await createUser({ name, email, password });
        setUsers((prev) => [newUser, ...prev]);
      } else if (editingUser) {
        const updates: { name?: string; email?: string; password?: string; isActive?: boolean } = {};
        if (name !== editingUser.name) updates.name = name;
        if (email !== editingUser.email) updates.email = email;
        if (password) updates.password = password;
        if (formIsActive !== editingUser.isActive) updates.isActive = formIsActive;

        const updatedUser = await updateUser(editingUser.id, updates);
        setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      }

      closeDialog();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save user';
      setDialogError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (user: UserDto) => {
    try {
      setTogglingId(user.id);
      const updated = await updateUser(user.id, { isActive: !user.isActive });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user';
      setLoadError(message);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      setDeletingId(userId);
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user';
      setLoadError(message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f9fafb] via-[#eef2ff] to-[#e0f2fe]">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-sky-400/35 blur-3xl" />
        <div className="absolute -bottom-40 -right-16 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-5 md:px-8 py-8 flex flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/70 border border-white/80 backdrop-blur-xl shadow-sm hover:bg-white/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </button>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white/70 border border-white/80 backdrop-blur-xl shadow-sm shadow-violet-500/20">
              <Users className="w-4 h-4 text-violet-600" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base md:text-lg font-inter-semibold tracking-[-0.01em] text-slate-900">
                User Management
              </h1>
              <p className="text-[11px] md:text-xs text-slate-500 mt-0.5">
                Manage admin users who can access the portal.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCreateDialog}
            className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-md text-sm font-inter-medium bg-violet-600 text-white shadow-sm shadow-violet-500/40 hover:bg-violet-500 hover:shadow-md hover:shadow-violet-500/40 transition-all w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </header>

        {/* Glass panel */}
        <section className="rounded-2xl bg-white/70 border border-white/80 backdrop-blur-2xl shadow-[0_24px_80px_rgba(15,23,42,0.16)] p-5 md:p-7 flex flex-col gap-6">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm md:text-base font-inter-medium text-slate-800">
                Admin Users
              </h2>
              <p className="text-xs md:text-sm text-slate-500 mt-1">
                Users with access to the quiz builder admin portal.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium bg-violet-50/80 text-violet-800/80 border border-violet-100">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {users.length} {users.length === 1 ? 'user' : 'users'}
            </span>
          </div>

          {/* User List */}
          <div className="flex flex-col gap-3">
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <div className="w-52 h-52 sm:w-80 sm:h-80">
                  <Lottie animationData={loadingAnimation} loop autoplay />
                </div>
              </div>
            )}

            {loadError && !isLoading && (
              <div className="text-xs text-rose-500">{loadError}</div>
            )}

            {!isLoading &&
              !loadError &&
              users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white/80 border border-white/80 rounded-xl px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 hover:border-violet-100 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-all"
                >
                  {/* User Info */}
                  <div className="flex flex-col gap-1">
                    <span className="font-inter-medium text-slate-900 text-sm md:text-base">
                      {user.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{user.email}</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${
                          user.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-slate-50 text-slate-600 border-slate-100'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            user.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-start gap-2">
                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => openEditDialog(user)}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors px-2.5"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="hidden md:inline text-[11px]">Edit</span>
                    </button>

                    {/* Toggle Active */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(user)}
                      disabled={togglingId === user.id}
                      className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-[11px] font-inter-medium transition-colors ${
                        user.isActive
                          ? 'border-amber-100 bg-amber-50/90 text-amber-700 hover:bg-amber-100 hover:border-amber-200'
                          : 'border-emerald-100 bg-emerald-50/90 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-200'
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                      title={user.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {user.isActive ? (
                        <UserX className="w-4 h-4" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
                      <span className="hidden md:inline text-[11px]">
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </span>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-rose-100 bg-rose-50/90 text-rose-600 hover:bg-rose-100 hover:border-rose-200 transition-colors px-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
                      title="Delete user"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden md:inline text-[11px]">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Empty State */}
          {!isLoading && !loadError && users.length === 0 && (
            <div className="mt-6 text-center py-14 bg-white/70 border border-dashed border-slate-300/80 rounded-xl backdrop-blur-xl">
              <p className="text-slate-500 mb-4 text-sm">
                No users yet. Add your first admin user.
              </p>
              <button
                type="button"
                onClick={openCreateDialog}
                className="inline-flex items-center gap-2 bg-violet-600 text-white px-5 py-2.5 rounded-lg font-inter-medium text-sm hover:bg-violet-500 shadow-sm shadow-violet-500/40 hover:shadow-md hover:shadow-violet-500/40 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add first user
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Create/Edit Dialog */}
      {dialogMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-inter-medium text-slate-900">
                {dialogMode === 'create' ? 'Add New User' : 'Edit User'}
              </h2>
              <button
                type="button"
                onClick={closeDialog}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <label className="text-xs font-inter-medium text-slate-700">
                Name
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-violet-400/70"
                />
              </label>

              {/* Email */}
              <label className="text-xs font-inter-medium text-slate-700">
                Email
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-violet-400/70"
                />
              </label>

              {/* Password */}
              <label className="text-xs font-inter-medium text-slate-700">
                {dialogMode === 'create' ? 'Password' : 'New Password (leave blank to keep current)'}
                <input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder={dialogMode === 'create' ? 'Enter password' : 'Enter new password'}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-violet-400/70"
                />
              </label>

              {/* Active Status (edit only) */}
              {dialogMode === 'edit' && (
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      formIsActive ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                    onClick={() => setFormIsActive(!formIsActive)}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                        formIsActive ? 'left-5' : 'left-1'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-inter-medium text-slate-700">
                    {formIsActive ? 'Active' : 'Inactive'}
                  </span>
                </label>
              )}

              {/* Error */}
              {dialogError && (
                <div className="rounded-lg bg-rose-50 border border-rose-100 px-4 py-3">
                  <p className="text-xs text-rose-600">{dialogError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="inline-flex items-center justify-center h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-inter-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center h-8 px-4 rounded-lg bg-violet-600 text-xs font-inter-medium text-white shadow-sm shadow-violet-500/40 hover:bg-violet-500 hover:shadow-md hover:shadow-violet-500/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : dialogMode === 'create' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
