'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Heart, 
  Package, 
  Bell, 
  Settings, 
  CreditCard, 
  Shield,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '../../../components/ui/button';

const AccountDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'orders', name: 'My Orders', icon: <Package className="w-5 h-5" /> },
    { id: 'wishlist', name: 'Wishlist', icon: <Heart className="w-5 h-5" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> }
  ];

  const profileData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 98765 43210',
    address: '123 Fashion Street, Hyderabad, Telangana 500001',
    memberSince: 'March 2023',
    totalOrders: 12,
    wishlistItems: 8
  };

  const recentOrders = [
    {
      id: 'ORD001',
      date: '2024-02-15',
      items: 2,
      total: 4500,
      status: 'completed'
    },
    {
      id: 'ORD002',
      date: '2024-01-28',
      items: 1,
      total: 1800,
      status: 'active'
    },
    {
      id: 'ORD003',
      date: '2023-12-10',
      items: 3,
      total: 6200,
      status: 'completed'
    }
  ];

  const notifications = [
    {
      id: 1,
      title: 'Order Confirmation',
      message: 'Your order #ORD001 has been confirmed and is being processed.',
      date: '2 hours ago',
      read: false
    },
    {
      id: 2,
      title: 'Special Offer',
      message: 'Get 20% off on your next rental. Use code: WELCOME20',
      date: '1 day ago',
      read: true
    },
    {
      id: 3,
      title: 'Order Shipped',
      message: 'Your order #ORD002 has been shipped and is on its way.',
      date: '2 days ago',
      read: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderProfileTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key="profile"
    >
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
          <Button variant="outline" className="flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{profileData.name}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{profileData.email}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{profileData.phone}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Address</label>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                <span className="text-gray-900">{profileData.address}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{profileData.memberSince}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">{profileData.totalOrders}</div>
                <div className="text-sm text-blue-700">Total Orders</div>
              </div>
              <div className="bg-pink-50 p-4 rounded-lg text-center">
                <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-pink-900">{profileData.wishlistItems}</div>
                <div className="text-sm text-pink-700">Wishlist Items</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderOrdersTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key="orders"
    >
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h2>
        
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-gray-900">Order #{order.id}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">Placed on {new Date(order.date).toLocaleDateString()}</p>
                  <p className="text-gray-600 text-sm">{order.items} item{order.items !== 1 ? 's' : ''}</p>
                </div>
                
                <div className="text-right">
                  <div className="text-xl font-bold text-brand-rose mb-2">₹{order.total.toLocaleString()}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button size="sm" className="bg-brand-rose hover:bg-brand-rose/90">Track Order</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => router.push('/dashboard/bookings')}
            className="flex items-center gap-2 mx-auto"
          >
            <Package className="w-4 h-4" />
            View All Orders
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderWishlistTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key="wishlist"
    >
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
          <Button 
            onClick={() => router.push('/wishlist')}
            className="bg-brand-rose hover:bg-brand-rose/90"
          >
            View All Items
          </Button>
        </div>
        
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your Wishlist</h3>
          <p className="text-gray-600 mb-6">You have {profileData.wishlistItems} items saved to your wishlist</p>
          <Button 
            onClick={() => router.push('/catalog/dresses')}
            variant="outline"
          >
            Browse Collection
          </Button>
        </div>
      </div>
    </motion.div>
  );

  const renderNotificationsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key="notifications"
    >
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <Button variant="outline">Mark All as Read</Button>
        </div>
        
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
                !notification.read ? 'bg-blue-50 border-blue-200' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  notification.read ? 'bg-gray-300' : 'bg-blue-500'
                }`}></div>
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-900 mb-1">{notification.title}</h3>
                  <p className="text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-sm text-gray-500">{notification.date}</p>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderSettingsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      key="settings"
    >
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
        
        <div className="space-y-6">
          {/* Change Password */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-gold" />
              Security
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
                  placeholder="Enter new password"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <Button className="bg-brand-rose hover:bg-brand-rose/90">Update Password</Button>
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-brand-gold" />
              Payment Methods
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 1234</p>
                    <p className="text-sm text-gray-600">Expires 12/25</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
              
              <Button variant="outline" className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Add New Payment Method
              </Button>
            </div>
          </div>
          
          {/* Account Actions */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-4">Account Actions</h3>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Download Personal Data
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                Deactivate Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'orders': return renderOrdersTab();
      case 'wishlist': return renderWishlistTab();
      case 'notifications': return renderNotificationsTab();
      case 'settings': return renderSettingsTab();
      default: return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-brand-ivory">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-brand-rose font-heading">My Account</h1>
          <p className="text-gray-600">Manage your profile, orders, and preferences</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-brand-rose/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-brand-rose" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{profileData.name}</h3>
                  <p className="text-sm text-gray-600">Premium Member</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-brand-rose/10 text-brand-rose font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-grow">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;