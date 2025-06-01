import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Search,
  Plus,
  Heart,
  User,
  MessageCircle,
  Compass,
  Music,
  Bookmark,
  Settings,
  TrendingUp,
  Users,
  Video,
  Bell
} from 'lucide-react';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Accueil',
      color: '#FF0050',
      activeColor: '#FF0050'
    },
    {
      path: '/discover',
      icon: Compass,
      label: 'Découvrir',
      color: '#00F2EA',
      activeColor: '#00F2EA'
    },
    {
      path: '/search',
      icon: Search,
      label: 'Rechercher',
      color: '#9C27B0',
      activeColor: '#9C27B0'
    },
    {
      path: '/create',
      icon: Plus,
      label: 'Créer',
      color: '#FF6B35',
      activeColor: '#FF6B35',
      special: true
    },
    {
      path: '/inbox',
      icon: MessageCircle,
      label: 'Messages',
      color: '#4CAF50',
      activeColor: '#4CAF50'
    },
    {
      path: '/profile',
      icon: User,
      label: 'Profil',
      color: '#2196F3',
      activeColor: '#2196F3'
    }
  ];

  const sidebarItems = [
    {
      path: '/trending',
      icon: TrendingUp,
      label: 'Tendances',
      color: '#FF5722'
    },
    {
      path: '/following',
      icon: Users,
      label: 'Abonnements',
      color: '#E91E63'
    },
    {
      path: '/liked',
      icon: Heart,
      label: 'Aimés',
      color: '#F44336'
    },
    {
      path: '/saved',
      icon: Bookmark,
      label: 'Favoris',
      color: '#FF9800'
    },
    {
      path: '/music',
      icon: Music,
      label: 'Musiques',
      color: '#9C27B0'
    },
    {
      path: '/live',
      icon: Video,
      label: 'Live',
      color: '#F44336'
    },
    {
      path: '/notifications',
      icon: Bell,
      label: 'Notifications',
      color: '#FF5722'
    },
    {
      path: '/settings',
      icon: Settings,
      label: 'Paramètres',
      color: '#607D8B'
    }
  ];

  return (
    <>
      {/* Navigation mobile (bottom) */}
      <nav className="mobile-nav">
        <div className="nav-container">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`nav-item ${isActive ? 'active' : ''} ${item.special ? 'special' : ''}`}
                aria-label={item.label}
              >
                <div className="icon-wrapper">
                  <IconComponent
                    size={item.special ? 28 : 24}
                    color={isActive ? item.activeColor : '#666'}
                    fill={isActive && !item.special ? item.activeColor : 'none'}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.special && (
                    <div className="plus-bg"></div>
                  )}
                </div>
                {isActive && <div className="active-indicator"></div>}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Sidebar desktop */}
      <aside className="desktop-sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <Music size={32} color="#FF0050" />
            </div>
            <span className="logo-text">TikTok</span>
          </div>
        </div>

        <div className="sidebar-nav">
          {/* Navigation principale */}
          <div className="nav-section">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`sidebar-item ${isActive ? 'active' : ''} ${item.special ? 'special' : ''}`}
                >
                  <div className="sidebar-icon">
                    <IconComponent
                      size={24}
                      color={isActive ? item.activeColor : '#666'}
                      fill={isActive && !item.special ? item.activeColor : 'none'}
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                  </div>
                  <span className="sidebar-label">{item.label}</span>
                  {isActive && <div className="sidebar-indicator"></div>}
                </button>
              );
            })}
          </div>

          {/* Séparateur */}
          <div className="sidebar-divider"></div>

          {/* Navigation secondaire */}
          <div className="nav-section">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <div className="sidebar-icon">
                    <IconComponent
                      size={20}
                      color={isActive ? item.color : '#666'}
                      fill={isActive ? item.color : 'none'}
                      strokeWidth={isActive ? 2.5 : 1.5}
                    />
                  </div>
                  <span className="sidebar-label">{item.label}</span>
                  {isActive && <div className="sidebar-indicator"></div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer sidebar */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <User size={20} color="#666" />
            </div>
            <div className="user-details">
              <span className="username">@utilisateur</span>
              <span className="followers">1.2M abonnés</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default NavBar;
