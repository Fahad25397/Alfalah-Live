import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingBag, Calendar, User, Phone, MapPin, 
  CheckCircle, Clock, ArrowLeft, Package, Plus, Trash2, Edit2, X, Settings, Save 
} from 'lucide-react';

const CATEGORIES = ['Honey', 'Dates', 'Desi Ghee', 'Jam', 'Olives', 'Zamzam Water', 'Dry Fruits'];

const DEFAULT_CURRENCIES = {
  PKR: { label: 'PKR (₨)', symbol: '₨ ', rate: 1 },
  USD: { label: 'USD ($)', symbol: '$', rate: 0.0036 },
  AED: { label: 'AED', symbol: 'AED ', rate: 0.013 },
  SAR: { label: 'SAR', symbol: 'SAR ', rate: 0.0135 },
};

const AdminDashboard = ({ onBackToShop }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Manual Currency Exchange Rates State (Loaded from localStorage or defaults)
  const [currencies, setCurrencies] = useState(() => {
    const saved = localStorage.getItem('admin_currency_rates');
    return saved ? JSON.parse(saved) : DEFAULT_CURRENCIES;
  });
  const [successCurrencyMsg, setSuccessCurrencyMsg] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
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

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/orders`);
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || ''}/api/products`);
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchOrders(), fetchProducts()]);
      setLoading(false);
    };
    loadData();
  }, []);

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
    setTimeout(() => setSuccessCurrencyMsg(false), 3000);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setProductForm({ 
      name: '', 
      category: 'Honey', 
      image: '', 
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
    
    const matchedCategory = CATEGORIES.find(
      (cat) => cat.toLowerCase() === (product.category || '').trim().toLowerCase()
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
      description: product.description,
      variants: formattedVariants,
    });
    setIsModalOpen(true);
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

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL || ''}/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        variants: productForm.variants.map(v => ({
          weight: v.weight,
          price: Number(v.price)
        }))
      };

      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL || ''}/api/products/${editingId}`, payload);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/products`, payload);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert('Failed to save product');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-amber-200">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#3c2415]">Store Owner Management Panel</h1>
          <p className="text-amber-800 text-sm mt-1">
            Manage incoming orders, inventory, and manual global currency configurations.
          </p>
        </div>
        <button 
          onClick={onBackToShop}
          className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-[#3c2415] rounded-xl font-bold transition text-sm cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Store
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-[#3c2415] text-amber-100 shadow-md'
              : 'bg-white text-gray-700 hover:bg-amber-50 border border-amber-100'
          }`}
        >
          <ShoppingBag size={18} /> Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
            activeTab === 'products'
              ? 'bg-[#3c2415] text-amber-100 shadow-md'
              : 'bg-white text-gray-700 hover:bg-amber-50 border border-amber-100'
          }`}
        >
          <Package size={18} /> Product Inventory ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('currencies')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
            activeTab === 'currencies'
              ? 'bg-[#3c2415] text-amber-100 shadow-md'
              : 'bg-white text-gray-700 hover:bg-amber-50 border border-amber-100'
          }`}
        >
          <Settings size={18} /> Currency Rates
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-amber-800 font-medium">Loading panel data...</div>
      ) : activeTab === 'orders' ? (
        orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-amber-100 shadow-sm">
            <ShoppingBag size={48} className="mx-auto text-amber-400 mb-3" />
            <h3 className="text-xl font-bold text-[#3c2415]">No orders placed yet!</h3>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl p-6 border border-amber-100 shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-amber-50">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
                      Order ID: #{order._id.slice(-6)}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                      <Calendar size={14} />
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                      order.status === 'Delivered' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status === 'Delivered' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {order.status}
                    </span>

                    <select 
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="text-xs font-bold bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer"
                    >
                      <option value="Pending">Mark Pending</option>
                      <option value="Processing">Mark Processing</option>
                      <option value="Delivered">Mark Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2 bg-amber-50/50 p-4 rounded-xl text-sm border border-amber-100/60">
                    <h4 className="font-bold text-[#3c2415] mb-2 flex items-center gap-1.5">
                      <User size={16} className="text-amber-700" /> Customer Details
                    </h4>
                    <p className="font-semibold text-gray-800">{order.customer.fullName}</p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Phone size={14} className="text-amber-700" /> {order.customer.phone}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <MapPin size={14} className="text-amber-700" /> {order.customer.address}, {order.customer.city}
                    </p>
                  </div>

                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/60">
                    <h4 className="font-bold text-[#3c2415] mb-2">Ordered Products</h4>
                    <div className="space-y-1.5">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700 font-medium">
                            {item.quantity}x {item.name} {item.weight ? `(${item.weight})` : ''}
                          </span>
                          <span className="font-semibold text-amber-950">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-2 border-t border-amber-200 flex justify-between font-bold text-base text-[#3c2415]">
                      <span>Total Amount:</span>
                      <span className="text-amber-700">Rs. {order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'currencies' ? (
        <div className="bg-white p-8 rounded-3xl border border-amber-200 shadow-sm max-w-2xl mx-auto">
          <div className="mb-6">
            <h3 className="text-2xl font-serif font-bold text-[#3c2415]">Manual Global Currency Settings</h3>
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
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#3c2415]">All Store Products</h3>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition cursor-pointer shadow-md"
            >
              <Plus size={18} /> Add New Product
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl p-4 border border-amber-100 shadow-md flex gap-4">
                <img src={p.image} alt={p.name} className="w-24 h-24 object-cover rounded-xl border" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-[#3c2415]">{p.name}</h4>
                    <span className="inline-block text-xs text-amber-900 font-bold bg-amber-100 px-2 py-0.5 rounded mt-1">
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
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative border border-amber-900/20 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-serif font-bold text-[#3c2415] mb-4">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h3>

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
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3c2415] uppercase mb-1">Image URL</label>
                <input 
                  type="url" 
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2 rounded-xl border border-amber-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

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
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md cursor-pointer"
                >
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