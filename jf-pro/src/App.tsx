import { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import PlatformPage from './pages/PlatformPage';
import HelplinePage from './pages/HelplinePage';
import DashboardPage from './pages/DashboardPage';
import CompanionDashboard from './pages/CompanionDashboard';
import RewardsPage from './pages/RewardsPage';
import type { Page, Platform, User } from './types';

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [user, setUser] = useState<User | null>(null);

  function goHome() { setPage('home'); setPlatform(null); }
  function goAuth() { setPage('auth'); }
  function goHelpline() { setPage('helpline'); }
  function goDashboard() { if (user) setPage('dashboard'); else goAuth(); }
  function goCompanionDashboard() { setPage('companion-dashboard'); }
  function goRewards() { setPage('rewards'); }

  function handleSelectPlatform(p: Platform) {
    setPlatform(p);
    setPage('platform');
  }

  function handleLogin(u: User) {
    setUser(u);
    setPage('home');
  }

  function handleLogout() {
    setUser(null);
    setPage('home');
  }

  function handleNeedAuth() {
    setPage('auth');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Navbar
        onHome={goHome}
        onHelpline={goHelpline}
        onAuth={goAuth}
        user={user}
        onLogout={handleLogout}
        onDashboard={goDashboard}
        onCompanionDashboard={goCompanionDashboard}
        onRewards={goRewards}
      />

      {page === 'home' && (
        <HomePage onSelectPlatform={handleSelectPlatform} onHelpline={goHelpline} />
      )}

      {page === 'auth' && (
        <AuthPage onSuccess={handleLogin} />
      )}

      {page === 'platform' && platform && (
        <PlatformPage
          platform={platform}
          user={user}
          onBack={goHome}
          onNeedAuth={handleNeedAuth}
        />
      )}

      {page === 'helpline' && (
        <HelplinePage onBack={goHome} />
      )}

      {page === 'dashboard' && user && (
        <DashboardPage user={user} onBack={goHome} />
      )}

      {page === 'companion-dashboard' && (
        <CompanionDashboard onBack={goHome} />
      )}

      {page === 'rewards' && (
        <RewardsPage user={user} onBack={goHome} onNeedAuth={goAuth} />
      )}
    </div>
  );
}
