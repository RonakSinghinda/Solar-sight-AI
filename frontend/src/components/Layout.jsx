import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { LayoutDashboard, Image, List, Settings, LogOut, Sun } from 'lucide-react';

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-logo">
          <Sun className="icon" size={32} />
          SolarSight AI
        </div>
        <NavLink to="/dashboard" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/panel-view" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <Image size={20} /> Panel Map
        </NavLink>
        <NavLink to="/inspections" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <List size={20} /> Inspections
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}>
          <Settings size={20} /> Settings
        </NavLink>
        <div style={{ flex: 1 }}></div>
        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
