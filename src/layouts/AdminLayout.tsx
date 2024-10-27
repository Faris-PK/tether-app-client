import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Outlet, useLocation, Link } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import { clearAdmin } from '../redux/slices/adminSlice';
import { 
  HomeIcon, 
  UsersIcon, 
  Image, 
  ShoppingBagIcon, 
  ChartBarIcon, 
  StarIcon, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = async () => {
    try {
      await adminApi.logout();
      dispatch(clearAdmin());
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/admin/dashboard' },
    { name: 'Users', icon: UsersIcon, path: '/admin/users' },
    { name: 'Posts', icon: Image, path: '/admin/posts' },
    { name: 'Marketplace', icon: ShoppingBagIcon, path: '/admin/marketplace' },
    { name: 'Reports', icon: ChartBarIcon, path: '/admin/reports' },
    { name: 'Premium', icon: StarIcon, path: '/admin/premium' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F3F2F7] md:flex-row">
      {/* Mobile header */}
      <header className="sticky top-0 z-50 bg-white p-4 flex justify-between items-center md:hidden shadow-sm">
        <h2 className="text-xl font-bold text-[#464255]">Admin Panel</h2>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="text-[#464255] hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar - Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <nav className={`
        fixed md:sticky top-0 h-full md:h-screen z-50 w-64 bg-white shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        <div className="p-6 hidden md:block">
          <h2 className="text-2xl font-bold text-[#464255]">Admin Panel</h2>
        </div>
        <div className="flex flex-col h-[calc(100%-80px)]">
          <ul className="space-y-2 p-4 flex-grow font-medium">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`
                      flex items-center w-full p-3 rounded-lg text-left transition-colors
                      ${isActive ? 'text-[#00B074] bg-[#D9F3EA]' : 'text-[#464255] hover:bg-gray-100'}
                    `}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#00B074]' : ''}`} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="p-4 mt-auto border-t">
            <button
              className="flex items-center w-full p-3 rounded-lg text-left text-[#464255] hover:bg-gray-100 transition-colors"
              onClick={onLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};


export default AdminLayout;
