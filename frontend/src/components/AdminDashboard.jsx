import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import api, { getImageUrl } from '../api';
import { 
  ShoppingBag, Calendar, User, Phone, MapPin, 
  CheckCircle, Clock, ArrowLeft, Package, Plus, Trash2, Edit2, X, Settings, Save, 
  Upload, Search, Clipboard, Image as ImageIcon, Check, Filter, AlertCircle, RefreshCw, TrendingUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CATEGORIES = ['Honey', 'For Men', 'Dry Fruits', 'Zamzam Water', 'Olive Oil', 'Dates', 'Jam', 'Desi Ghee'];

const DEFAULT_CURRENCIES = {
  PKR: { label: 'PKR (₨)', symbol: '₨ ', rate: 1 },
  USD: { label: 'USD ($)', symbol: '$', rate: 0.0036 },
  AED: { label: 'AED', symbol: 'AED ', rate: 0.013 },
  SAR: { label: 'SAR', symbol: 'SAR ', rate: 0.0135 },
};

const AdminDashboard = ({ onBackToShop }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); // for mutations
  const [actionMessage, setActionMessage] = useState(null); // toast feedback

  // Pagination States
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotalPages, setProductsTotalPages] = useState(1);

  // Search and status filter for orders
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Manual Currency Exchange Rates State
  const [currencies, setCurrencies] = useState(() => {
    const saved = localStorage.getItem('admin_currency_rates');
    return saved ? JSON.parse(saved) : DEFAULT_CURRENCIES;
  });
  const [successCurrencyMsg, setSuccessCurrencyMsg] = useState(false);

  // Revenue Analytics State
  const [allOrdersForRevenue, setAllOrdersForRevenue] = useState([]);
  const [fetchingRevenue, setFetchingRevenue] = useState(false);

  // Product Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pasteNotice, setPasteNotice] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const modalRef = useRef(null);
  
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Honey',
    image: '',
    description: '',
    variants: [
      { weight: '500g', price: '' },
      { weight: '1000g', price: '' }
    ]
  });

  const showToast = (text, type = 'success') => {
    setActionMessage({ text, type });
    setTimeout(() => setActionMessage(null), 3500);
  };

  const checkAuth = async () => {
    try {
      await api.get('/api/admin/me');
      setIsAuthenticated(true);
    } catch (err) {
      setIsAuthenticated(false);
    } finally {
      setAuthChecking(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await api.post('/api/admin/login', { password: loginPassword });
      if (res.data && res.data.token) {
        localStorage.setItem('admin_token', res.data.token);
      }
      setIsAuthenticated(true);
      showToast('Login successful!');
    } catch (err) {
      alert('Invalid password');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/admin/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('admin_token');
      setIsAuthenticated(false);
      showToast('Logged out successfully');
      setOrders([]);
      setProducts([]);
    }
  };

  const fetchOrders = async (page = 1) => {
    try {
      const response = await api.get(`/api/orders?page=${page}&limit=10`);
      if (response.data.data) {
        setOrders(response.data.data);
        setOrdersTotalPages(response.data.pagination.pages);
      } else {
        setOrders(response.data); // fallback
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchAllOrdersForRevenue = async () => {
    setFetchingRevenue(true);
    try {
      const response = await api.get('/api/orders?limit=0');
      // Set empty array if nothing is returned
      setAllOrdersForRevenue(response.data || []);
    } catch (err) {
      console.error('Error fetching all orders for revenue:', err);
    } finally {
      setFetchingRevenue(false);
    }
  };

  const fetchProducts = async (page = 1) => {
    try {
      const response = await api.get(`/api/products?page=${page}&limit=12`);
      if (response.data.data) {
        setProducts(response.data.data);
        setProductsTotalPages(response.data.pagination.pages);
      } else {
        setProducts(response.data); // fallback
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchOrders(ordersPage), fetchProducts(productsPage)]);
        setLoading(false);
      };
      loadData();
    }
  }, [isAuthenticated, ordersPage, productsPage]);

  useEffect(() => {
    if (activeTab === 'revenue' && allOrdersForRevenue.length === 0) {
      fetchAllOrdersForRevenue();
    }
  }, [activeTab]);

  const revenueData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize 12 buckets to ensure all months show on the chart
    const dataMap = {};
    monthNames.forEach(m => dataMap[m] = 0);

    const arrayToProcess = Array.isArray(allOrdersForRevenue) ? allOrdersForRevenue : [];
    
    arrayToProcess.forEach(order => {
      const date = new Date(order.createdAt);
      if (isNaN(date.getTime())) return;

      const monthName = monthNames[date.getMonth()];
      dataMap[monthName] += Number(order.totalAmount || 0);
    });
    
    return monthNames.map(month => ({
      name: month,
      revenue: dataMap[month]
    }));
  }, [allOrdersForRevenue]);

  const handleCurrencyRateChange = (code, value) => {
    setCurrencies(prev => ({
      ...prev,
      [code]: {
        ...prev[code],
        rate: parseFloat(value) || 0
      }
    }));
  };

  const handleSaveCurrencies = (e) => {
    e.preventDefault();
    localStorage.setItem('admin_currency_rates', JSON.stringify(currencies));
    setSuccessCurrencyMsg(true);
    showToast('Currency exchange rates saved globally!');
    setTimeout(() => setSuccessCurrencyMsg(false), 3000);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setActionLoading(true);
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      showToast(`Order #${orderId.slice(-6).toUpperCase()} status updated to ${newStatus}`);
      fetchOrders(ordersPage);
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete an order with confirmation
  const handleDeleteOrder = async (orderId) => {
    const shortId = orderId.slice(-6).toUpperCase();
    if (window.confirm(`Are you absolutely sure you want to delete order #${shortId}? This cannot be undone.`)) {
      setActionLoading(true);
      try {
        await api.delete(`/api/orders/${orderId}`);
        showToast(`Order #${shortId} permanently deleted`);
        fetchOrders(ordersPage);
      } catch (err) {
        console.error('Delete order error:', err);
        alert('Failed to delete order. Please try again.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setPasteNotice('');
    setProductForm({ 
      name: '', 
      category: 'Honey', 
      image: '', 
      imageFile: null,
      description: '', 
      variants: [
        { weight: '500g', price: '' },
        { weight: '1000g', price: '' }
      ] 
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingId(product._id);
    setPasteNotice('');
    
    const matchedCategory = CATEGORIES.find(
      (cat) => {
        const pCat = (product.category || '').trim().toLowerCase();
        if (pCat === 'olives' && cat === 'Olive Oil') return true;
        if (pCat === 'dryfruits' && cat === 'Dry Fruits') return true;
        return cat.toLowerCase() === pCat;
      }
    ) || 'Honey';

    let formattedVariants = product.variants && product.variants.length > 0 
      ? product.variants.map(v => ({
          weight: v.weight,
          price: v.price ?? ''
        }))
      : [{ 
          weight: product.weight || 'Standard', 
          price: product.price ?? '' 
        }];

    setProductForm({
      name: product.name,
      category: matchedCategory,
      image: product.image,
      imageFile: null,
      description: product.description,
      variants: formattedVariants,
    });
    setIsModalOpen(true);
  };

  // Helper function to set image preview from File / Blob
  const setFilePreview = useCallback((file, sourceLabel = 'Uploaded') => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please provide a valid image (PNG, JPG, WEBP, GIF)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size must be less than 5MB. Please compress the image.');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setProductForm(prev => ({ ...prev, imageFile: file, image: previewUrl }));
    setPasteNotice(`✓ Image ${sourceLabel} successfully`);
    setTimeout(() => setPasteNotice(''), 4000);
  }, []);

  // Handle standard file picker
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFilePreview(file, 'uploaded');
    }
  };

  // Handle Clipboard Paste Event (Ctrl+V) anywhere when modal is open
  const handlePasteEvent = useCallback((e) => {
    if (!isModalOpen) return;

    // Check if clipboard contains image file items (e.g. Right Click -> Copy Image in browser)
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            e.preventDefault();
            setFilePreview(blob, 'pasted from browser/clipboard');
            return;
          }
        }
      }
    }

    // Check if plain text clipboard has an image URL
    const pastedText = e.clipboardData?.getData('text');
    if (pastedText && pastedText.trim().match(/^https?:\/\/.*\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i)) {
      setProductForm(prev => ({ ...prev, image: pastedText.trim(), imageFile: null }));
      setPasteNotice('✓ Image URL pasted from clipboard');
      setTimeout(() => setPasteNotice(''), 4000);
    }
  }, [isModalOpen, setFilePreview]);

  // Attach global paste listener when modal is open
  useEffect(() => {
    if (isModalOpen) {
      window.addEventListener('paste', handlePasteEvent);
      return () => {
        window.removeEventListener('paste', handlePasteEvent);
      };
    }
  }, [isModalOpen, handlePasteEvent]);

  // Drag & Drop handlers for image box
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFilePreview(file, 'dropped');
    }
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...productForm.variants];
    newVariants[index][field] = value;
    setProductForm({ ...productForm, variants: newVariants });
  };

  const addVariantField = () => {
    setProductForm({
      ...productForm,
      variants: [...productForm.variants, { weight: '', price: '' }]
    });
  };

  const removeVariantField = (index) => {
    const newVariants = productForm.variants.filter((_, i) => i !== index);
    setProductForm({ ...productForm, variants: newVariants });
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete product "${name || 'item'}"?`)) {
      try {
        await api.delete(`/api/products/${id}`);
        showToast('Product deleted from inventory');
        fetchProducts();
      } catch (err) {
        console.error('Delete product error:', err);
        alert('Failed to delete product');
      }
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.image && !productForm.imageFile) {
      alert('Please provide, upload, or paste a product image!');
      return;
    }
    setActionLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('category', productForm.category);
      formData.append('description', productForm.description);
      formData.append('variants', JSON.stringify(productForm.variants.map(v => ({
        weight: v.weight,
        price: Number(v.price)
      }))));

      if (productForm.imageFile) {
        formData.append('imageFile', productForm.imageFile);
      } else if (productForm.image) {
        formData.append('image', productForm.image);
      }

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (editingId) {
        await api.put(`/api/products/${editingId}`, formData, config);
        showToast('Product updated successfully!');
      } else {
        await api.post('/api/products', formData, config);
        showToast('New product added to inventory!');
      }
      setIsModalOpen(false);
      fetchProducts(productsPage);
    } catch (err) {
      console.error('Save product error:', err);
      alert('Failed to save product. Please check connection and try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered orders list by search query (Order ID, short ID, customer name, phone, city, product names)
  const filteredOrders = orders.filter(order => {
    const query = orderSearchQuery.trim().toLowerCase();
    const cleanQuery = query.startsWith('#') ? query.slice(1) : query;

    // Status filter
    if (orderStatusFilter !== 'All' && order.status !== orderStatusFilter) {
      return false;
    }

    if (!query) return true;

    const shortId = order._id.slice(-6).toLowerCase();
    const fullId = order._id.toLowerCase();
    const orderIdMatch = fullId.includes(cleanQuery) || shortId.includes(cleanQuery);
    
    const nameMatch = order.customer?.fullName?.toLowerCase().includes(query);
    const phoneMatch = order.customer?.phone?.toLowerCase().includes(query);
    const cityMatch = order.customer?.city?.toLowerCase().includes(query);
    const addressMatch = order.customer?.address?.toLowerCase().includes(query);

    const itemsMatch = order.items?.some(item => item.name?.toLowerCase().includes(query));

    return orderIdMatch || nameMatch || phoneMatch || cityMatch || addressMatch || itemsMatch;
  });

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-amber-800 flex items-center gap-2">
          <RefreshCw className="animate-spin" size={24} /> Verifying session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-xl max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-[#3c2415]">Admin Portal</h1>
            <p className="text-amber-800 mt-2">Secure access required</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#3c2415] mb-2">Admin Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Enter password..."
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[#3c2415] hover:bg-[#2b1c12] text-amber-100 font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loginLoading ? <RefreshCw className="animate-spin" size={18} /> : 'Login to Dashboard'}
            </button>
          </form>
          <button onClick={onBackToShop} className="mt-6 text-sm text-gray-500 hover:text-amber-800 w-full flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Return to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Toast Notification Banner */}
      {actionMessage && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl border text-sm font-semibold transition-all animate-bounce ${
          actionMessage.type === 'success' 
            ? 'bg-emerald-800 text-white border-emerald-600' 
            : 'bg-red-800 text-white border-red-600'
        }`}>
          <CheckCircle size={18} />
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#3c2415]">Store Owner Management Panel</h1>
          <p className="text-amber-800 text-xs sm:text-sm mt-1">
            Manage incoming orders, search by order number, update inventory, and paste pictures directly from browser.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-800 rounded-xl font-bold transition text-xs sm:text-sm shadow-sm"
          >
             Logout
          </button>
          <button 
            onClick={onBackToShop}
            className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-[#3c2415] rounded-xl font-bold transition text-xs sm:text-sm cursor-pointer shadow-sm"
          >
            <ArrowLeft size={16} /> Back to Store
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#3c2415] text-amber-100 shadow-md'
              : 'bg-white text-gray-700 hover:bg-amber-50 border border-amber-100'
          }`}
        >
          <ShoppingBag size={18} /> Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
            activeTab === 'products'
              ? 'bg-[#3c2415] text-amber-100 shadow-md'
              : 'bg-white text-gray-700 hover:bg-amber-50 border border-amber-100'
          }`}
        >
          <Package size={18} /> Product Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('currencies')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
            activeTab === 'currencies'
              ? 'bg-[#3c2415] text-amber-100 shadow-md'
              : 'bg-white text-gray-700 hover:bg-amber-50 border border-amber-100'
          }`}
        >
          <Settings size={18} /> Currency Rates
        </button>
        <button
          onClick={() => setActiveTab('revenue')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
            activeTab === 'revenue'
              ? 'bg-[#3c2415] text-amber-100 shadow-md'
              : 'bg-white text-gray-700 hover:bg-amber-50 border border-amber-100'
          }`}
        >
          <TrendingUp size={18} /> Revenue
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-amber-800 font-medium flex items-center justify-center gap-2">
          <RefreshCw className="animate-spin text-amber-700" size={20} /> Loading panel data...
        </div>
      ) : activeTab === 'orders' ? (
        <div>
          {/* SEARCH & FILTER CONTROLS FOR ORDERS */}
          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="flex-1 flex items-center bg-[#faf8f5] border border-amber-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-amber-500">
              <Search size={18} className="text-amber-700 mr-2 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search by Order # (e.g. #A05AEA), Name, Phone, City, Product..."
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                className="w-full text-xs sm:text-sm focus:outline-none bg-transparent text-[#3c2415]"
              />
              {orderSearchQuery && (
                <button 
                  onClick={() => setOrderSearchQuery('')} 
                  className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                  title="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <span className="text-xs font-bold text-gray-500 flex items-center gap-1">
                <Filter size={14} /> Status:
              </span>
              {['All', 'Pending', 'Processing', 'Delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    orderStatusFilter === status
                      ? 'bg-[#3c2415] text-amber-100'
                      : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-amber-900 font-semibold mb-4 px-1">
            <span>Showing {filteredOrders.length} of {orders.length} orders</span>
            {(orderSearchQuery || orderStatusFilter !== 'All') && (
              <button 
                onClick={() => { setOrderSearchQuery(''); setOrderStatusFilter('All'); }}
                className="text-amber-700 underline hover:text-amber-900 cursor-pointer"
              >
                Reset filters
              </button>
            )}
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-amber-100 shadow-sm">
              <ShoppingBag size={48} className="mx-auto text-amber-300 mb-3" />
              <h3 className="text-lg font-bold text-[#3c2415]">No matching orders found</h3>
              <p className="text-xs text-gray-500 mt-1">Try a different order number, phone, or customer name</p>
            </div>
          ) : (
            <div className="grid gap-5">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-100 shadow-md relative hover:border-amber-300 transition">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-50">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono hidden sm:inline">
                          ID: {order._id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                        <Calendar size={14} className="text-amber-700" />
                        {new Date(order.createdAt).toLocaleString('en-US', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${
                        order.status === 'Delivered' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : order.status === 'Processing'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status === 'Delivered' ? <CheckCircle size={14} /> : <Clock size={14} />}
                        {order.status}
                      </span>

                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={actionLoading}
                        className="text-xs font-bold bg-[#faf8f5] border border-amber-200 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer text-[#3c2415] disabled:opacity-50"
                      >
                        <option value="Pending">Mark Pending</option>
                        <option value="Processing">Mark Processing</option>
                        <option value="Delivered">Mark Delivered</option>
                      </select>

                      {/* DELETE ORDER BUTTON */}
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        disabled={actionLoading}
                        className="p-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition cursor-pointer border border-transparent hover:border-red-200 disabled:opacity-50"
                        title="Delete Order Permanently"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                    <div className="space-y-2 bg-amber-50/40 p-4 rounded-xl text-xs sm:text-sm border border-amber-100/60">
                      <h4 className="font-bold text-[#3c2415] mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <User size={15} className="text-amber-700" /> Customer Information
                      </h4>
                      <p className="font-semibold text-gray-800">{order.customer?.fullName}</p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Phone size={14} className="text-amber-700" /> {order.customer?.phone}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <MapPin size={14} className="text-amber-700 flex-shrink-0" /> 
                        <span>{order.customer?.address}, {order.customer?.city}</span>
                      </p>
                    </div>

                    <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100/60 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-[#3c2415] mb-2 text-xs uppercase tracking-wider">Ordered Products</h4>
                        <div className="space-y-1.5">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-xs sm:text-sm">
                              <span className="text-gray-700 font-medium">
                                {item.quantity}x {item.name} {item.weight ? `(${item.weight})` : ''}
                              </span>
                              <span className="font-semibold text-amber-950">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-amber-200 flex justify-between font-bold text-sm sm:text-base text-[#3c2415]">
                        <span>Total Due (COD):</span>
                        <span className="text-amber-700">Rs. {Number(order.totalAmount || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls for Orders */}
          {ordersTotalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                disabled={ordersPage === 1}
                onClick={() => setOrdersPage(p => p - 1)}
                className="px-4 py-2 bg-white border border-amber-200 rounded-xl disabled:opacity-50 text-sm font-bold text-[#3c2415] hover:bg-amber-50 transition cursor-pointer"
              >
                Previous
              </button>
              <span className="px-4 py-2 font-bold text-amber-900 text-sm flex items-center">
                Page {ordersPage} of {ordersTotalPages}
              </span>
              <button
                disabled={ordersPage === ordersTotalPages}
                onClick={() => setOrdersPage(p => p + 1)}
                className="px-4 py-2 bg-white border border-amber-200 rounded-xl disabled:opacity-50 text-sm font-bold text-[#3c2415] hover:bg-amber-50 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : activeTab === 'currencies' ? (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-sm max-w-2xl mx-auto">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#3c2415]">Manual Global Currency Settings</h3>
            <p className="text-xs text-amber-900/70 mt-1">
              Define exact fixed conversion values relative to PKR (Base: ₨1). Once saved here, all product cards and prices update automatically across the storefront.
            </p>
          </div>

          {successCurrencyMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold">
              ✓ Currency rates saved and applied globally to the storefront!
            </div>
          )}

          <form onSubmit={handleSaveCurrencies} className="space-y-4">
            {Object.entries(currencies).map(([code, data]) => (
              <div key={code} className="flex items-center justify-between gap-4 p-4 bg-[#faf8f5] rounded-2xl border border-amber-100">
                <div>
                  <span className="font-serif font-bold text-[#3c2415] block">{data.label}</span>
                  <span className="text-[10px] text-amber-900/60">Symbol: {data.symbol}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-900/60">1 PKR =</span>
                  <input
                    type="number"
                    step="any"
                    value={data.rate}
                    onChange={(e) => handleCurrencyRateChange(code, e.target.value)}
                    disabled={code === 'PKR'}
                    className={`w-32 px-3 py-2 bg-white rounded-xl border border-amber-200 text-xs font-medium text-[#3c2415] focus:outline-none focus:ring-2 focus:ring-[#3c2415] ${code === 'PKR' ? 'opacity-60 cursor-not-allowed' : ''}`}
                  />
                </div>
              </div>
            ))}

            <button
              type="submit"
              className="w-full mt-6 py-3.5 bg-[#3c2415] hover:bg-[#2b1c12] text-amber-100 rounded-2xl transition flex items-center justify-center gap-2 text-xs font-semibold shadow-md cursor-pointer"
            >
              <Save size={16} /> Save & Apply Globally
            </button>
          </form>
        </div>
      ) : activeTab === 'revenue' ? (
        <div className="bg-white/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-black/10 shadow-sm max-w-5xl mx-auto">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#3c2415]">Revenue Statistics</h3>
            <p className="text-xs text-amber-900/70 mt-1">
              View your store's total revenue by month.
            </p>
          </div>
          
          {fetchingRevenue ? (
            <div className="text-center py-20 text-amber-800 font-medium flex items-center justify-center gap-2">
              <RefreshCw className="animate-spin text-amber-700" size={20} /> Loading revenue data...
            </div>
          ) : revenueData.length === 0 ? (
            <div className="text-center py-16 bg-[#faf8f5] rounded-2xl border border-amber-100 shadow-sm">
              <TrendingUp size={48} className="mx-auto text-amber-300 mb-3" />
              <h3 className="text-lg font-bold text-[#3c2415]">No Revenue Data Available</h3>
              <p className="text-xs text-gray-500 mt-1">There are no orders to display yet.</p>
            </div>
          ) : (
            <div className="h-[400px] w-full mt-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#6b7280', fontSize: 12, fontWeight: 500}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#6b7280', fontSize: 12, fontWeight: 500}}
                    tickFormatter={(value) => `Rs ${(value/1000).toFixed(0)}k`}
                    width={60}
                    dx={-10}
                  />
                  <Tooltip 
                    formatter={(value) => [`Rs ${value.toLocaleString()}`, 'Total Revenue']}
                    cursor={{fill: '#000000', opacity: 0.05}}
                    contentStyle={{
                      borderRadius: '8px', 
                      border: '1px solid rgba(0,0,0,0.1)', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      padding: '12px'
                    }}
                    itemStyle={{ color: '#2563eb', fontWeight: 600 }}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="#2563eb" 
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      ) : (
        /* PRODUCT INVENTORY TAB */
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#3c2415]">All Store Products</h3>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm transition cursor-pointer shadow-md"
            >
              <Plus size={18} /> Add New Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl p-4 border border-amber-100 shadow-md flex gap-4 hover:border-amber-300 transition">
                <img src={getImageUrl(p.image)} alt={p.name} className="w-24 h-24 object-cover rounded-xl border border-amber-100 flex-shrink-0 bg-amber-50" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-[#3c2415] line-clamp-1">{p.name}</h4>
                    <span className="inline-block text-[11px] text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded mt-1">
                      {p.category || 'Honey'}
                    </span>
                    
                    <div className="mt-2 text-xs space-y-0.5">
                      {p.variants && p.variants.length > 0 ? (
                        p.variants.map((v, i) => (
                          <div key={i} className="text-amber-900 font-medium flex justify-between">
                            <span>{v.weight}:</span>
                            <span className="font-bold text-amber-700">Rs. {Number(v.price || 0).toLocaleString()}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-amber-900 font-medium flex justify-between">
                          <span>{p.weight || 'Standard'}:</span>
                          <span className="font-bold text-amber-700">Rs. {Number(p.price || 0).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                      title="Edit Product"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p._id, p.name)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls for Products */}
          {productsTotalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                disabled={productsPage === 1}
                onClick={() => setProductsPage(p => p - 1)}
                className="px-4 py-2 bg-white border border-amber-200 rounded-xl disabled:opacity-50 text-sm font-bold text-[#3c2415] hover:bg-amber-50 transition cursor-pointer"
              >
                Previous
              </button>
              <span className="px-4 py-2 font-bold text-amber-900 text-sm flex items-center">
                Page {productsPage} of {productsTotalPages}
              </span>
              <button
                disabled={productsPage === productsTotalPages}
                onClick={() => setProductsPage(p => p + 1)}
                className="px-4 py-2 bg-white border border-amber-200 rounded-xl disabled:opacity-50 text-sm font-bold text-[#3c2415] hover:bg-amber-50 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* ADD/EDIT INVENTORY MODAL WITH BROWSER IMAGE PASTE SUPPORT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div 
            ref={modalRef}
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative border border-amber-900/20 max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-serif font-bold text-[#3c2415] mb-2">
              {editingId ? 'Edit Product Item' : 'Add Item to Inventory'}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Tip: You can press <kbd className="px-1.5 py-0.5 bg-amber-100 border border-amber-200 rounded text-[11px] font-mono text-amber-900">Ctrl+V</kbd> anywhere on this modal to paste an image copied from browser or clipboard!
            </p>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3c2415] uppercase mb-1">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Pure Sidr Honey"
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3c2415] uppercase mb-1">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white cursor-pointer font-medium text-amber-950"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* IMAGE SECTION WITH BROWSER PASTE & DROPZONE */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#3c2415] uppercase">
                    Product Picture (Paste from Browser / Upload)
                  </label>
                  {pasteNotice && (
                    <span className="text-[11px] font-bold text-emerald-700 animate-pulse">
                      {pasteNotice}
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  {/* Interactive Drop & Paste Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-xl transition ${
                      isDragging 
                        ? 'border-amber-600 bg-amber-100/60 scale-[1.01]' 
                        : 'border-amber-300 bg-[#faf8f5] hover:bg-amber-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-4 text-center">
                      <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-bold text-[#3c2415] hover:bg-amber-50 shadow-sm">
                        <Upload size={14} className="text-amber-700" /> Browse File
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                      </label>

                      <div className="flex items-center gap-1 text-xs text-amber-900 font-semibold bg-amber-100/70 px-3 py-1.5 rounded-lg border border-amber-200">
                        <Clipboard size={14} className="text-amber-800" />
                        <span>Press <kbd className="font-mono bg-white px-1 py-0.5 rounded border text-[10px]">Ctrl+V</kbd> to Paste</span>
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-400 mt-2">
                      Supports: Right-click image on website &rarr; "Copy Image" &rarr; Paste here, or drag & drop.
                    </p>
                  </div>

                  {/* Or direct URL Input */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-500 font-medium">Or Paste URL:</span>
                    <input 
                      type="text" 
                      value={productForm.image.startsWith('data:') ? '' : productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-amber-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Image Preview Box */}
                  {productForm.image && (
                    <div className="flex items-center gap-4 p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-amber-300 bg-white flex-shrink-0">
                        <img 
                          src={getImageUrl(productForm.image)} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      <div className="flex-1 text-xs">
                        <p className="font-bold text-[#3c2415] flex items-center gap-1">
                          <Check size={14} className="text-emerald-600" /> Picture Attached Ready
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5">
                          {productForm.image.startsWith('data:') 
                            ? 'Optimized Base64 image' 
                            : 'Remote image URL'}
                        </p>
                        <button
                          type="button"
                          onClick={() => setProductForm({ ...productForm, image: '' })}
                          className="mt-2 text-xs font-bold text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={12} /> Remove Picture
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* WEIGHTS & PRICES VARIANTS */}
              <div className="border-t border-amber-200 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-[#3c2415] uppercase">Weights & Prices Options (PKR)</label>
                  <button 
                    type="button" 
                    onClick={addVariantField} 
                    className="text-xs font-bold text-amber-700 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Weight Option
                  </button>
                </div>

                <div className="space-y-3">
                  {productForm.variants.map((v, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        placeholder="Weight (e.g. 500g)"
                        value={v.weight}
                        onChange={(e) => handleVariantChange(index, 'weight', e.target.value)}
                        required
                        className="flex-1 px-3 py-2 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <input
                        type="number"
                        step="any"
                        placeholder="Price (PKR)"
                        value={v.price}
                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                        required
                        className="flex-1 px-3 py-2 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      {productForm.variants.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeVariantField(index)} 
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                          title="Remove variant"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="block text-xs font-bold text-[#3c2415] uppercase mb-1">Description</label>
                <textarea 
                  rows="3"
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Brief description of the product..."
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-amber-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-bold text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md cursor-pointer disabled:opacity-50"
                >
                  {actionLoading && <RefreshCw size={14} className="animate-spin" />}
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;