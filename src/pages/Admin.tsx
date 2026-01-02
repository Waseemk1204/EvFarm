import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    Package,
    MessageSquare,
    LogOut,
    Plus,
    Trash2,
    Edit3,
    Save,
    X,
    Lock,
    Clock,
    Mail,
    Phone,
    MapPin,
    Upload,
    Loader2,
    Menu
} from 'lucide-react';
import { Blog, GolfCartModel as Product, Inquiry } from '../types';

const API_URL = '/api';
const BASE_URL = '';

export function Admin() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    // React Router hooks for URL-based navigation
    const location = useLocation();
    const navigate = useNavigate();

    // Valid tabs for URL routing
    const validTabs = ['dashboard', 'inquiries', 'blogs', 'products'] as const;
    type TabType = typeof validTabs[number];

    // Get initial tab from URL path or default to 'dashboard'
    const getTabFromPath = (): TabType => {
        const pathParts = location.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        if (validTabs.includes(lastPart as TabType)) {
            return lastPart as TabType;
        }
        return 'dashboard';
    };

    const [activeTab, setActiveTab] = useState<TabType>(getTabFromPath);

    // Sync activeTab with URL when location changes
    useEffect(() => {
        const tabFromPath = getTabFromPath();
        if (tabFromPath !== activeTab && isAuthenticated) {
            setActiveTab(tabFromPath);
        }
    }, [location.pathname]);

    // Navigate to URL when tab changes
    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        navigate(`/admin/${tab}`);
    };

    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [siteContent, setSiteContent] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Inquiry filter
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const [isEditing, setIsEditing] = useState(false);
    const [editType, setEditType] = useState<'blog' | 'product' | null>(null);
    const [formData, setFormData] = useState<any>({});

    // Modal state
    const [confirmModal, setConfirmModal] = useState<{
        show: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ show: false, title: '', message: '', onConfirm: () => { } });

    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false, message: '', type: 'success'
    });

    // Helper functions for modals
    const showConfirm = (title: string, message: string, onConfirm: () => void) => {
        setConfirmModal({ show: true, title, message, onConfirm });
    };

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    // Session management - 24 hour expiry
    const SESSION_DURATION = 24 * 60 * 60 * 1000;

    // Check for existing session on mount
    useEffect(() => {
        const sessionData = localStorage.getItem('adminSession');
        if (sessionData) {
            const { loginTime } = JSON.parse(sessionData);
            const elapsed = Date.now() - loginTime;
            if (elapsed < SESSION_DURATION) {
                setIsAuthenticated(true);
                if (location.pathname === '/admin' || location.pathname === '/admin/') {
                    navigate('/admin/dashboard', { replace: true });
                }
            } else {
                handleLogout();
            }
        }
    }, []);

    // Auto-logout timer
    useEffect(() => {
        if (isAuthenticated) {
            const sessionData = localStorage.getItem('adminSession');
            if (sessionData) {
                const { loginTime } = JSON.parse(sessionData);
                const remaining = SESSION_DURATION - (Date.now() - loginTime);

                if (remaining > 0) {
                    const timer = setTimeout(() => {
                        handleLogout();
                        showToast('Session expired. Please login again.', 'error');
                    }, remaining);
                    return () => clearTimeout(timer);
                }
            }
        }
    }, [isAuthenticated]);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('adminSession');
        setIsAuthenticated(false);
        setPassword('');
    };

    // Fetch data from API
    const fetchData = async () => {
        setLoading(true);
        try {
            const [blogsRes, productsRes, inquiriesRes, siteContentRes] = await Promise.all([
                fetch(`${API_URL}/blogs?all=true`),
                fetch(`${API_URL}/products`),
                fetch(`${API_URL}/inquiries`),
                fetch(`${API_URL}/site-content`)
            ]);

            if (blogsRes.ok) setBlogs(await blogsRes.json());
            if (productsRes.ok) setProducts(await productsRes.json());
            if (inquiriesRes.ok) setInquiries(await inquiriesRes.json());
            if (siteContentRes.ok) setSiteContent(await siteContentRes.json());
        } catch (err) {
            console.error('Failed to fetch data:', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    // Auto-refresh data every 2 seconds for Dashboard and Inquiries
    useEffect(() => {
        if (!isAuthenticated) return;

        let intervalId: NodeJS.Timeout;

        if (activeTab === 'dashboard' || activeTab === 'inquiries') {
            intervalId = setInterval(() => {
                // Only fetch inquiries if on inquiries tab to save bandwidth
                // But fetch all if on dashboard for stats
                if (activeTab === 'dashboard') {
                    fetchData();
                } else if (activeTab === 'inquiries') {
                    fetch(`${API_URL}/inquiries`)
                        .then(res => res.json())
                        .then(data => setInquiries(data))
                        .catch(err => console.error('Auto-refresh error:', err));
                }
            }, 2000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isAuthenticated, activeTab]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password.trim()) {
            setError('Please enter a password');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem('adminSession', JSON.stringify({
                    loginTime: Date.now()
                }));
                setIsAuthenticated(true);
                navigate('/admin/dashboard');
                setError('');
            } else {
                setError(data.error || 'Invalid password');
                setPassword('');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        }
    };

    const handleAddBlog = () => {
        setEditType('blog');
        setFormData({ title: '', content: '', author: 'EVFARM Team', isPublished: true });
        setIsEditing(true);
    };

    const handleAddProduct = () => {
        setEditType('product');
        setFormData({
            name: '', seating: 2, tagline: '', image: '', speed: '', range: '',
            batteryType: 'Lithium-ion', batteryCapacity: '', motorPower: '',
            chargingTime: '', dimensions: '', groundClearance: '', features: []
        });
        setIsEditing(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string = 'image') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (limit to 2MB for database storage)
        if (file.size > 2 * 1024 * 1024) {
            showToast('Image too large. Please use an image under 2MB.', 'error');
            return;
        }

        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, [fieldName]: reader.result as string });
            setUploading(false);
        };
        reader.onerror = () => {
            showToast('Failed to process image', 'error');
            setUploading(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = async () => {
        try {
            const endpoint = editType === 'blog' ? 'blogs' : 'products';
            const method = formData._id ? 'PUT' : 'POST';
            const url = formData._id ? `${API_URL}/${endpoint}/${formData._id}` : `${API_URL}/${endpoint}`;

            // For blogs, always set isPublished to true
            const dataToSave = editType === 'blog' ? { ...formData, isPublished: true } : formData;

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave)
            });

            fetchData();
            setIsEditing(false);
            setEditType(null);
            showToast(`${editType === 'blog' ? 'Blog' : 'Product'} saved successfully!`, 'success');
        } catch (err) {
            console.error('Save failed:', err);
            showToast('Failed to save', 'error');
        }
    };



    const handleDelete = async (type: 'blog' | 'product', id: string) => {
        showConfirm(
            'Delete Item',
            'Are you sure you want to delete this item? This action cannot be undone.',
            async () => {
                try {
                    const endpoint = type === 'blog' ? 'blogs' : 'products';
                    await fetch(`${API_URL}/${endpoint}/${id}`, { method: 'DELETE' });
                    fetchData();
                    showToast('Item deleted successfully', 'success');
                } catch (err) {
                    console.error('Delete failed:', err);
                    showToast('Failed to delete item', 'error');
                }
            }
        );
    };

    const updateInquiryStatus = async (id: string, status: string) => {
        // Update local state immediately for instant UI feedback
        setInquiries(prev => prev.map(inq =>
            inq._id === id ? { ...inq, status: status as any } : inq
        ));
        try {
            await fetch(`${API_URL}/inquiries/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            showToast('Status updated', 'success');
        } catch (err) {
            console.error('Status update failed:', err);
            fetchData(); // Revert on error
            showToast('Failed to update status', 'error');
        }
    };

    // Filter inquiries by status
    const filteredInquiries = inquiries
        .filter(inq => statusFilter === 'all' || inq.status === statusFilter)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const [isRecoveryMode, setIsRecoveryMode] = useState(false);
    const [recoveryKey, setRecoveryKey] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!recoveryKey.trim() || !newPassword.trim()) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/admin/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ recoveryKey, newPassword })
            });

            const data = await res.json();

            if (data.success) {
                showToast('Password reset successfully! Please login.', 'success');
                setIsRecoveryMode(false);
                setRecoveryKey('');
                setNewPassword('');
                setPassword('');
                setError('');
            } else {
                setError(data.error || 'Invalid recovery key');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#14211A] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white p-10 rounded-sm shadow-2xl relative overflow-hidden"
                >
                    {/* Toast Notification */}
                    <AnimatePresence>
                        {toast.show && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`absolute top-4 left-4 right-4 p-4 rounded-sm text-white text-sm font-bold flex items-center gap-3 shadow-lg z-50 ${toast.type === 'success' ? 'bg-[#14211A]' : 'bg-red-500'}`}
                            >
                                {toast.type === 'success' ? <Save className="w-4 h-4 text-[#D4AF37]" /> : <X className="w-4 h-4" />}
                                {toast.message}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col items-center mb-10">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-xl bg-gradient-to-br from-[#14211A] to-[#1D3126]">
                            <Lock className="w-7 h-7 text-[#D4AF37]" />
                        </div>
                        <h1 className="font-display text-3xl font-bold text-[#14211A]">Admin Portal</h1>
                        <p className="text-[#14211A]/40 text-sm mt-1">{isRecoveryMode ? 'Password Recovery' : 'Secure access only'}</p>
                    </div>

                    {!isRecoveryMode ? (
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-5 py-4 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all"
                                    placeholder="Enter admin password"
                                />
                                {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-[#14211A] text-white font-bold tracking-wider rounded-sm hover:bg-[#D4AF37] transition-all shadow-lg"
                            >
                                ACCESS ADMIN
                            </button>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => { setIsRecoveryMode(true); setError(''); }}
                                    className="text-xs text-[#14211A]/40 hover:text-[#D4AF37] transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handlePasswordReset} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Recovery Key</label>
                                <input
                                    type="password"
                                    value={recoveryKey}
                                    onChange={(e) => setRecoveryKey(e.target.value)}
                                    className="w-full px-5 py-4 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all"
                                    placeholder="Enter recovery key"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-5 py-4 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 transition-all"
                                    placeholder="Enter new password"
                                />
                                {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-[#14211A] text-white font-bold tracking-wider rounded-sm hover:bg-[#D4AF37] transition-all shadow-lg"
                            >
                                RESET PASSWORD
                            </button>
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => { setIsRecoveryMode(false); setError(''); }}
                                    className="text-xs text-[#14211A]/40 hover:text-[#D4AF37] transition-colors"
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9F8] flex" id="admin">
            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`w-72 bg-[#14211A] text-white flex flex-col fixed h-full z-50 transition-transform duration-300 
                ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0`}>
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-12">
                        <img src={siteContent?.siteLogo || "/logo.png"} alt="EVFARM" className="h-16 w-16 object-contain rounded-full overflow-hidden" />
                        <span className="font-display text-xl font-bold tracking-wide text-white">EV Farm</span>
                    </div>

                    <nav className="space-y-2">
                        {[
                            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                            { id: 'inquiries', icon: MessageSquare, label: 'Inquiries', badge: inquiries.filter(i => i.status === 'new').length },
                            { id: 'blogs', icon: FileText, label: 'Blogs' },
                            { id: 'products', icon: Package, label: 'Products' },

                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleTabChange(item.id as TabType)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-sm text-sm font-medium transition-all ${activeTab === item.id
                                    ? 'bg-[#D4AF37] text-[#14211A]'
                                    : 'text-white/50 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </div>
                                {item.badge ? (
                                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                ) : null}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-auto p-8 border-t border-white/5">
                    <button
                        onClick={() => setConfirmModal({
                            show: true,
                            title: 'Confirm Logout',
                            message: 'Are you sure you want to logout? You will need to login again to access the dashboard.',
                            onConfirm: handleLogout
                        })}
                        className="flex items-center gap-3 text-white/40 hover:text-red-400 text-sm font-medium transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 ml-0 p-6 lg:p-12 transition-all duration-300">
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-[#14211A] hover:bg-[#14211A]/5 rounded-sm"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="font-display text-3xl lg:text-4xl font-bold text-[#14211A]">
                                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                            </h1>
                            <p className="text-[#14211A]/40 mt-1 text-sm lg:text-base">
                                {loading ? 'Loading...' : `Manage your ${activeTab} here.`}
                            </p>
                        </div>
                    </div>

                    {(activeTab === 'blogs' || activeTab === 'products') && (
                        <button
                            onClick={activeTab === 'blogs' ? handleAddBlog : handleAddProduct}
                            className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#14211A] font-bold rounded-sm hover:bg-[#14211A] hover:text-white transition-all shadow-lg"
                        >
                            <Plus className="w-4 h-4" />
                            Add {activeTab === 'blogs' ? 'Blog' : 'Product'}
                        </button>
                    )}
                </header>

                {/* Dashboard Stats */}
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Inquiries', value: inquiries.length },
                            { label: 'New Inquiries', value: inquiries.filter(i => i.status === 'new').length },
                            { label: 'Total Blogs', value: blogs.length },
                            { label: 'Total Products', value: products.length },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white p-8 rounded-sm shadow-sm border border-[#14211A]/5">
                                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/30 mb-2">{stat.label}</h3>
                                <p className="text-4xl font-display font-medium text-[#14211A]">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Inquiries List */}
                {activeTab === 'inquiries' && (
                    <div className="space-y-4">
                        <div className="bg-white p-4 rounded-sm shadow-sm border border-[#14211A]/5 mb-6">
                            <div className="flex flex-wrap justify-between items-center gap-4">
                                <h2 className="text-lg font-bold text-[#14211A]">
                                    {statusFilter === 'all' ? 'All Inquiries' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Inquiries`} ({filteredInquiries.length})
                                </h2>
                                <div className="flex items-center gap-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#14211A]/40">Filter:</label>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-3 py-2 text-sm bg-[#F8F9F8] border border-[#14211A]/10 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/30"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="converted">Converted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {filteredInquiries.length === 0 ? (
                            <div className="bg-white p-12 rounded-sm text-center border border-[#14211A]/5">
                                <MessageSquare className="w-12 h-12 text-[#14211A]/10 mx-auto mb-4" />
                                <p className="text-[#14211A]/40">{inquiries.length === 0 ? 'No inquiries yet' : 'No inquiries match this filter'}</p>
                            </div>
                        ) : (
                            filteredInquiries.map(inquiry => (
                                <motion.div
                                    key={inquiry._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white p-6 rounded-sm shadow-sm border border-[#14211A]/5"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-[#14211A]">{inquiry.name}</h3>
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-[#14211A]/50 mt-1">
                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {inquiry.email}</span>
                                                <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {inquiry.phone}</span>
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {inquiry.city}</span>
                                            </div>
                                        </div>
                                        <select
                                            value={inquiry.status}
                                            onChange={(e) => updateInquiryStatus(inquiry._id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold border-0 cursor-pointer ${inquiry.status === 'new' ? 'bg-red-100 text-red-700' :
                                                inquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                                                    inquiry.status === 'converted' ? 'bg-green-100 text-green-700' :
                                                        'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="converted">Converted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>

                                    {inquiry.message && (
                                        <p className="text-[#14211A]/60 text-sm mb-4 bg-[#F8F9F8] p-4 rounded-sm italic">
                                            "{inquiry.message}"
                                        </p>
                                    )}

                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#14211A]/30">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(inquiry.createdAt)}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}

                {/* Blogs List */}
                {activeTab === 'blogs' && (
                    <div className="grid gap-4">
                        {blogs.length === 0 ? (
                            <div className="bg-white p-12 rounded-sm text-center border border-[#14211A]/5">
                                <FileText className="w-12 h-12 text-[#14211A]/10 mx-auto mb-4" />
                                <p className="text-[#14211A]/40">No blogs yet. Click "Add Blog" to create one.</p>
                            </div>
                        ) : (
                            blogs.map(blog => (
                                <div key={blog._id} className="bg-white p-6 rounded-sm shadow-sm border border-[#14211A]/5 flex justify-between items-center group">
                                    <div>
                                        <h3 className="font-bold text-lg text-[#14211A]">{blog.title}</h3>
                                        <p className="text-[#14211A]/40 text-sm">{formatDate(blog.createdAt)} • {blog.author}</p>
                                    </div>
                                    <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => { setEditType('blog'); setFormData({ ...blog, isPublished: true }); setIsEditing(true); }}
                                            className="p-2 hover:bg-gray-100 rounded-sm text-[#14211A]/60 transition-all"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete('blog', blog._id)}
                                            className="p-2 hover:bg-red-50 rounded-sm text-red-500 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Products List */}
                {activeTab === 'products' && (
                    <div className="grid gap-4">
                        {products.length === 0 ? (
                            <div className="bg-white p-12 rounded-sm text-center border border-[#14211A]/5">
                                <Package className="w-12 h-12 text-[#14211A]/10 mx-auto mb-4" />
                                <p className="text-[#14211A]/40">No products yet. Click "Add Product" to create one.</p>
                            </div>
                        ) : (
                            products.map((product, index) => (
                                <div key={product._id} className="bg-white p-6 rounded-sm shadow-sm border border-[#14211A]/5 flex justify-between items-center group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 bg-[#F8F9F8] rounded-sm overflow-hidden relative">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            {index < 3 && (
                                                <div className="absolute top-1 right-1 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center" title="Shown on homepage">
                                                    <span className="text-white text-[8px] font-bold">{index + 1}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-lg text-[#14211A]">{product.name}</h3>
                                                {index < 3 && (
                                                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] rounded">
                                                        Homepage
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[#D4AF37] text-sm font-medium">{product.seating} Seater</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                                        <button
                                            onClick={() => { setEditType('product'); setFormData(product); setIsEditing(true); }}
                                            className="p-2 hover:bg-gray-100 rounded-sm text-[#14211A]/60 transition-all"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete('product', product._id)}
                                            className="p-2 hover:bg-red-50 rounded-sm text-red-500 transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                        <p className="text-sm text-[#14211A]/40 mt-4 bg-blue-50 p-4 rounded-sm border border-blue-200">
                            💡 <strong>Note:</strong> The first 3 products (by creation date) are automatically displayed on the homepage.
                        </p>
                    </div>
                )}
            </main>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-4 right-4 p-4 rounded-sm text-white text-sm font-bold flex items-center gap-3 shadow-lg z-[100] ${toast.type === 'success' ? 'bg-[#14211A]' : 'bg-red-500'}`}
                    >
                        {toast.type === 'success' ? <Save className="w-4 h-4 text-[#D4AF37]" /> : <X className="w-4 h-4" />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Confirm Modal */}
            <AnimatePresence>
                {confirmModal.show && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white p-8 rounded-sm shadow-xl w-full max-w-sm relative z-10"
                        >
                            <h3 className="font-display text-xl font-bold text-[#14211A] mb-2">{confirmModal.title}</h3>
                            <p className="text-[#14211A]/60 text-sm mb-6 leading-relaxed">{confirmModal.message}</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                                    className="flex-1 px-4 py-3 border border-[#14211A]/10 text-[#14211A] font-bold text-xs tracking-wider uppercase rounded-sm hover:bg-[#F8F9F8] transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { confirmModal.onConfirm(); setConfirmModal({ ...confirmModal, show: false }); }}
                                    className="flex-1 px-4 py-3 bg-red-500 text-white font-bold text-xs tracking-wider uppercase rounded-sm hover:bg-red-600 transition-all shadow-lg"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit/Add Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditing(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl relative z-10 flex flex-col"
                        >
                            <div className="p-6 border-b border-[#14211A]/5 flex justify-between items-center sticky top-0 bg-white z-20">
                                <h3 className="font-display text-xl font-bold text-[#14211A]">
                                    {formData._id ? 'Edit' : 'Add'} {editType === 'blog' ? 'Blog' : 'Product'}
                                </h3>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 hover:bg-[#F8F9F8] rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#14211A]/40" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {editType === 'blog' ? (
                                    <>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Title</label>
                                            <input
                                                type="text"
                                                value={formData.title || ''}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#14211A]/10"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Author</label>
                                            <input
                                                type="text"
                                                value={formData.author || ''}
                                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#14211A]/10"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Content</label>
                                            <textarea
                                                rows={10}
                                                value={formData.content || ''}
                                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#14211A]/10"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.name || ''}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#14211A]/10"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Tagline</label>
                                                <input
                                                    type="text"
                                                    value={formData.tagline || ''}
                                                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                                    className="w-full px-4 py-3 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#14211A]/10"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Product Image</label>
                                            <div className="flex items-center gap-4">
                                                {formData.image && (
                                                    <img src={formData.image} alt="Preview" className="w-16 h-16 object-cover rounded-sm bg-[#F8F9F8]" />
                                                )}
                                                <label className="flex-1 cursor-pointer">
                                                    <input
                                                        type="file"
                                                        onChange={(e) => handleImageUpload(e, 'image')}
                                                        className="hidden"
                                                    />
                                                    <div className="w-full px-4 py-3 bg-[#F8F9F8] border border-dashed border-[#14211A]/20 rounded-sm text-[#14211A]/40 text-sm text-center hover:bg-[#14211A]/5 transition-colors">
                                                        {uploading ? (
                                                            <span className="flex items-center justify-center gap-2">
                                                                <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
                                                            </span>
                                                        ) : (
                                                            'Click to upload image'
                                                        )}
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Seating</label>
                                                <input
                                                    type="number"
                                                    value={formData.seating || 2}
                                                    onChange={(e) => setFormData({ ...formData, seating: parseInt(e.target.value) })}
                                                    className="w-full px-4 py-3 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#14211A]/10"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Speed</label>
                                                <input
                                                    type="text"
                                                    value={formData.speed || ''}
                                                    onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
                                                    className="w-full px-4 py-3 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#14211A]/10"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Range</label>
                                                <input
                                                    type="text"
                                                    value={formData.range || ''}
                                                    onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                                                    className="w-full px-4 py-3 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#14211A]/10"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Charging</label>
                                                <input
                                                    type="text"
                                                    value={formData.chargingTime || ''}
                                                    onChange={(e) => setFormData({ ...formData, chargingTime: e.target.value })}
                                                    className="w-full px-4 py-3 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#14211A]/10"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Battery Type</label>
                                                <select
                                                    value={formData.batteryType || 'Lithium-ion'}
                                                    onChange={(e) => setFormData({ ...formData, batteryType: e.target.value })}
                                                    className="w-full px-4 py-3 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#14211A]/10"
                                                >
                                                    <option value="Lithium-ion">Lithium-ion</option>
                                                    <option value="Lead-acid">Lead-acid</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Battery Capacity</label>
                                                <input
                                                    type="text"
                                                    value={formData.batteryCapacity || ''}
                                                    onChange={(e) => setFormData({ ...formData, batteryCapacity: e.target.value })}
                                                    className="w-full px-4 py-3 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#14211A]/10"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Motor Power</label>
                                                <input
                                                    type="text"
                                                    value={formData.motorPower || ''}
                                                    onChange={(e) => setFormData({ ...formData, motorPower: e.target.value })}
                                                    className="w-full px-4 py-3 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#14211A]/10"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Ground Clearance</label>
                                                <input
                                                    type="text"
                                                    value={formData.groundClearance || ''}
                                                    onChange={(e) => setFormData({ ...formData, groundClearance: e.target.value })}
                                                    className="w-full px-4 py-3 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#14211A]/10"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#14211A]/40 mb-3">Dimensions</label>
                                            <input
                                                type="text"
                                                value={formData.dimensions || ''}
                                                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                                                className="w-full px-4 py-3 bg-[#F8F9F8] border border-[#14211A]/5 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#14211A]/10"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="p-6 border-t border-[#14211A]/5 flex justify-end gap-3 sticky bottom-0 bg-white z-20">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 border border-[#14211A]/10 text-[#14211A] font-bold text-xs tracking-wider uppercase rounded-sm hover:bg-[#F8F9F8] transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-3 bg-[#14211A] text-white font-bold text-xs tracking-wider uppercase rounded-sm hover:bg-[#D4AF37] transition-all shadow-lg flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save {editType === 'blog' ? 'Blog' : 'Product'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
}

