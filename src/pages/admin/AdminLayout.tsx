// src/pages/admin/AdminLayout.tsx
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, FolderKanban, LogOut, ListOrdered } from 'lucide-react'; // Added ListOrdered
import { useAdminAuth } from '../../hooks/useAdminAuth';

interface AdminLayoutProps { children: React.ReactNode; }
const activeClassName = "flex items-center px-3 py-2 rounded bg-teal-600 text-white transition-colors";
const inactiveClassName = "flex items-center px-3 py-2 rounded hover:bg-gray-700 transition-colors";

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { logout } = useAdminAuth();
    const navigate = useNavigate();
    const handleLogout = () => { logout(); navigate('/admin/login'); };

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-gray-800 text-gray-200 flex flex-col flex-shrink-0">
                <div className="p-4 text-xl font-semibold text-white border-b border-gray-700 flex items-center">Admin Panel</div>
                <nav className="flex-grow p-4 space-y-1">
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? activeClassName : inactiveClassName}><LayoutDashboard className="h-5 w-5 mr-3 flex-shrink-0" /> Dashboard</NavLink>
                    <NavLink to="/admin/products" className={({ isActive }) => isActive ? activeClassName : inactiveClassName}><Package className="h-5 w-5 mr-3 flex-shrink-0" /> Products</NavLink>
                    <NavLink to="/admin/categories" className={({ isActive }) => isActive ? activeClassName : inactiveClassName}><FolderKanban className="h-5 w-5 mr-3 flex-shrink-0" /> Categories</NavLink>
                    {/* *** ADDED Orders Link *** */}
                    <NavLink to="/admin/orders" className={({ isActive }) => isActive ? activeClassName : inactiveClassName}><ListOrdered className="h-5 w-5 mr-3 flex-shrink-0" /> Orders</NavLink>
                    {/* *** END Orders Link *** */}
                </nav>
                <div className="p-4 border-t border-gray-700 mt-auto">
                    <button onClick={handleLogout} className="w-full flex items-center justify-center px-3 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors text-white text-sm font-medium"><LogOut className="h-5 w-5 mr-2" /> Logout</button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">{children}</main>
        </div>
    );
};
export default AdminLayout;