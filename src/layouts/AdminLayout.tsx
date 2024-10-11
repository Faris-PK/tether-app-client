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
  Menu
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current path

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F3F2F7] md:flex-row">
      {/* Mobile header */}
      <header className="bg-white p-4 flex justify-between items-center md:hidden">
        <h2 className="text-xl font-bold text-[#464255]">Admin Panel</h2>
        <button onClick={toggleSidebar} className="text-[#464255]">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Sidebar */}
      <nav className={`w-full md:w-64 bg-white shadow-lg md:flex flex-col ${isSidebarOpen ? 'flex' : 'hidden'}`}>
        <div className="p-4 hidden md:block">
          <h2 className="text-2xl font-bold text-[#464255]">Admin Panel</h2>
        </div>
        <ul className="space-y-2 p-4 flex-grow font-medium">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path; // Check if the current route matches
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center w-full p-2 rounded-lg text-left
                    ${isActive ? 'text-[#00B074] bg-[#D9F3EA]' : 'text-[#464255] hover:bg-gray-100'}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className={`w-5 h-5 mr-3 ${isActive ? 'text-[#00B074]' : ''}`} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="p-4">
          <button
            className="font-medium flex items-center w-full p-2 rounded-lg text-left text-[#464255] hover:bg-gray-100"
            onClick={onLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
