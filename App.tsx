
import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, TrendingUp, Package, ShieldCheck, 
  HandCoins, FlaskConical, Factory, Loader2, LogOut, ChevronRight, Gavel, 
  FolderOpen, BarChart3, Receipt, ClipboardList, Droplets, Truck, Wallet, 
  Activity, Database, RefreshCw, Landmark, CreditCard, Banknote, Handshake,
  ShieldAlert, Monitor, UserCheck, History, Eye, Calendar, ArrowLeft,
  X, DatabaseBackup, Settings2, Sparkles, Binary, ArrowLeftCircle,
  AlertTriangle, CheckCircle2, Wrench, Sprout, Wheat, Tractor, Shield,
  Lock, KeyRound, ShieldHalf, Save, Info, PlusCircle, ClipboardCheck, Edit3,
  Bell, Search, Radio, Megaphone, Terminal, ArrowRightLeft, MoveLeft
} from 'lucide-react';

import { supabase } from './lib/supabase';

// SHARED LAYER
import Auth from './shared/Auth';
import Profile from './shared/Profile';
import AIInsights from './shared/AIInsights';
import NotificationHub from './shared/NotificationHub';

// BOOKKEEPER DOMAIN
import BookkeeperDashboard from './bookkeeper/BookkeeperDashboard';
import GeneralLedger from './bookkeeper/GeneralLedger';
import SystemReports from './bookkeeper/SystemReports';
import Configuration from './bookkeeper/Configuration';

// TREASURER DOMAIN
import TreasurerDashboard from './treasurer/TreasurerDashboard';
import ProductionHub from './treasurer/ProductionHub';
import AgriSupplies from './treasurer/AgriSupplies';
import IrrigationHub from './treasurer/IrrigationHub';
import FleetManager from './treasurer/FleetManager';
import LoanPortfolio from './treasurer/LoanPortfolio';
import Receivables from './treasurer/Receivables';
import Disbursements from './treasurer/Disbursements';
import CashBook from './treasurer/CashBook';
import BankRegistry from './treasurer/BankRegistry';
import MemberRegistry from './treasurer/MemberRegistry';
import TreasuryReports from './treasurer/TreasuryReports';

// SECRETARY DOMAIN (Operations & Governance)
import SecretaryDashboard from './secretary/operations/SecretaryDashboard';
import SecretaryGovernance from './secretary/operations/SecretaryGovernance';
import SecretaryDocuments from './secretary/operations/SecretaryDocuments';
import SecretaryCalendar from './secretary/operations/SecretaryCalendar';

// ADMIN/CHAIRMAN DOMAIN (Systems Oversight)
import AdminDashboard from './secretary/admin_mode/AdminDashboard';
import SystemAccess from './secretary/admin_mode/SystemAccess';
import SystemMonitor from './secretary/admin_mode/SystemMonitor';
import BackupRestore from './secretary/admin_mode/BackupRestore';

import { Member, Transaction, UserRole, Loan, SupplyItem, GlobalSettings, Bank, Equipment, EquipmentLog, SystemNotification } from './types';

const INITIAL_SETTINGS: GlobalSettings = {
  systemBranding: {
    backgroundUrl: 'https://drive.google.com/uc?export=view&id=1zBwweF7VlcK2fzti1r2Zyb80c3zCKdf4',
    coopName: 'Kalilangan Irrigators Multi-Purpose Cooperative',
    logoUrl: 'https://bsuvgtotrtgktszbovgb.supabase.co/storage/v1/object/public/assets/kimpc-logo.png'
  },
  honorariums: { waterTender: 12000, chairman: 1200, viceChairman: 750, bod: 700, auditors: 600, secretary: 2000, treasurer: 5000, manager: 10000, bookkeeper: 6000, crecom: 1000, elecom: 100, cook: 300 },
  statutorySplits: { reserve: 10, education: 10, landBuilding: 5, community: 5 },
  dividendSplits: { shareCapitalInterest: 70, patronageRefund: 30 },
  interestRates: { agriSupplies: 3, fleetManager: 5, processingHub: 2, cashLoan: 12 },
  commissions: { collectorPercentage: 20, loanServiceFee: 3, riceMillOperatorPercentage: 12, cornShellerOperatorPercentage: 12, pesadorPercentage: 3 },
  chartOfAccounts: [
    { id: 'acc-1', code: '101', name: 'Petty Cash Fund', pillar: 'ASSET', category: 'Current Assets', subCategory: 'Cash on Hand' },
    { id: 'acc-2', code: '102', name: 'LBP General Fund', pillar: 'ASSET', category: 'Current Assets', subCategory: 'Cash in Bank' },
    { id: 'acc-3', code: '201', name: 'Unearned Revenue', pillar: 'LIABILITY', category: 'Current Liabilities', subCategory: 'Deferred Income' },
    { id: 'acc-4', code: '301', name: 'Paid-up Capital', pillar: 'EQUITY', category: 'Member Equity', subCategory: 'Share Capital' },
    { id: 'acc-5', code: '401', name: 'Corn Shelling Fees', pillar: 'INCOME', category: 'Service Income', subCategory: 'Processing Hub' },
    { id: 'acc-6', code: '501', name: 'Staff Honorariums', pillar: 'EXPENSE', category: 'Operating Expenses', subCategory: 'Personnel Costs' }
  ],
  coaHierarchy: {
    ASSET: [
      { name: 'Current Assets', subCategories: ['Cash on Hand', 'Cash in Bank', 'Inventory', 'Receivables'] },
      { name: 'Non-Current Assets', subCategories: ['Property & Equipment', 'Biological Assets'] }
    ],
    LIABILITY: [
      { name: 'Current Liabilities', subCategories: ['Accounts Payable', 'Loans Payable', 'Deferred Income'] }
    ],
    EQUITY: [
      { name: 'Member Equity', subCategories: ['Share Capital', 'Reserves', 'Statutory Funds'] }
    ],
    INCOME: [
      { name: 'Service Income', subCategories: ['Milling Hub', 'Processing Hub', 'Fleet Rentals'] },
      { name: 'Other Income', subCategories: ['Subsidies', 'Grants', 'Interest Income'] }
    ],
    EXPENSE: [
      { name: 'Operating Expenses', subCategories: ['Personnel Costs', 'Fuel & Oil', 'Maintenance', 'Utilities'] }
    ]
  }
};

const SidebarItem = ({ to, icon: Icon, label, end = false, activeColor = 'bg-[#10b981]', color = 'text-blue-500', isDark = false, badge = null }: any) => (
  <NavLink 
    to={to} 
    end={end}
    className={({ isActive }) => `flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-200 ${
      isActive 
        ? `${activeColor} text-white shadow-lg translate-x-1` 
        : `${isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'}`
    }`}
  >
    {({ isActive }) => (
      <>
        <div className="flex items-center space-x-3">
          <Icon size={18} className={isActive ? 'text-white' : color} />
          <span className="font-bold text-[13px] tracking-tight">{label}</span>
        </div>
        {badge && (
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${isActive ? 'bg-white/20 text-white' : 'bg-rose-500 text-white shadow-md'}`}>
            {badge}
          </span>
        )}
      </>
    )}
  </NavLink>
);

const SectionHeader = ({ label }: { label: string }) => (
  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-5 mt-6 mb-2">{label}</p>
);

const App: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.MEMBER);
  const [secretaryView, setSecretaryView] = useState<'SECRETARY' | 'ADMIN'>('SECRETARY');
  const [displayName, setDisplayName] = useState<string>(() => localStorage.getItem('kimpc_user_name') || 'Personnel Admin');
  
  const [activeMirror, setActiveMirror] = useState<UserRole | null>(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [supplies, setSupplies] = useState<SupplyItem[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [equipmentLogs, setEquipmentLogs] = useState<EquipmentLog[]>([]);
  const [settings, setSettings] = useState<GlobalSettings>(INITIAL_SETTINGS);
  const [banks, setBanks] = useState<Bank[]>([{ id: 'CASH', name: 'System Vault', isSystem: true }]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [governance, setGovernance] = useState<any[]>([]);
  
  // Notification State
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const detectRole = async () => {
      if (!session?.user?.email) return;
      const email = session.user.email.toLowerCase();
      
      if (email === 'admin@kimpc.coop') {
        setUserRole(UserRole.ADMIN);
        setDisplayName('Coop Superadmin');
        return;
      }

      let currentRole = UserRole.MEMBER;
      if (email === 'kimpc.treasurer@gmail.com') currentRole = UserRole.TREASURER;
      else if (email === 'kimpc.secretary@gmail.com') currentRole = UserRole.SECRETARY;
      else if (email === 'kimpc.bookkeeper@gmail.com') currentRole = UserRole.BOOKKEEPER;
      
      setUserRole(currentRole);

      try {
        const { data: assignedMember } = await supabase
          .from('members')
          .select('*')
          .ilike('accessEmail', email)
          .maybeSingle();

        if (assignedMember) {
          const fullName = `${assignedMember.firstName} ${assignedMember.lastName}`;
          setDisplayName(`${fullName} (${assignedMember.id})`);
          localStorage.setItem('kimpc_user_name', fullName);
        } else {
          setDisplayName(`${currentRole} Seat (Unassigned)`);
        }
      } catch (e) {
        console.warn("Role assignment pending column sync...");
      }
    };
    detectRole();
  }, [session, members]);

  const fetchData = async () => {
    if (!session) return;
    
    const fetchTable = async (table: string) => {
      try {
        const { data, error } = await supabase.from(table).select('*');
        if (error) {
           if (error.code === 'PGRST205' || error.code === '42P01') return []; 
           throw error;
        }
        return data;
      } catch (e) {
        return null;
      }
    };

    const m = await fetchTable('members');
    if (m) setMembers(m);

    const t = await supabase.from('transactions').select('*').order('date', { ascending: false });
    if (t.data) setTransactions(t.data);

    const l = await fetchTable('loans');
    if (l) setLoans(l);

    const s = await fetchTable('supplies');
    if (s) setSupplies(s);

    const e = await fetchTable('equipment');
    if (e) setEquipment(e);

    const el = await fetchTable('equipment_logs');
    if (el) setEquipmentLogs(el);

    const b = await fetchTable('banks');
    if (b) setBanks([{ id: 'CASH', name: 'System Vault', isSystem: true }, ...b]);

    const { data: stData } = await supabase.from('settings').select('*').maybeSingle();
    if (stData) {
      setSettings({
        ...INITIAL_SETTINGS,
        ...stData,
        systemBranding: { ...INITIAL_SETTINGS.systemBranding, ...(stData.systemBranding || {}) },
        interestRates: { ...INITIAL_SETTINGS.interestRates, ...(stData.interestRates || {}) },
        dividendSplits: { ...INITIAL_SETTINGS.dividendSplits, ...(stData.dividendSplits || {}) },
        statutorySplits: { ...INITIAL_SETTINGS.statutorySplits, ...(stData.statutorySplits || {}) },
        honorariums: { ...INITIAL_SETTINGS.honorariums, ...(stData.honorariums || {}) },
        commissions: { ...INITIAL_SETTINGS.commissions, ...(stData.commissions || {}) },
        chartOfAccounts: stData.chartOfAccounts || INITIAL_SETTINGS.chartOfAccounts,
        coaHierarchy: stData.coaHierarchy || INITIAL_SETTINGS.coaHierarchy
      });
    }

    const d = await fetchTable('documents');
    if (d) setDocuments(d);

    const g = await fetchTable('governance');
    if (g) setGovernance(g);
    
    const n = await fetchTable('notifications');
    if (n) setNotifications(n);
  };

  // REAL-TIME SUBSCRIPTION FOR INSTANT NOTIFICATIONS
  useEffect(() => {
    if (!session) return;
    
    fetchData();

    // Subscribe to changes in the 'notifications' table
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('Real-time notification update:', payload);
          // Re-fetch all notifications to ensure state consistency
          supabase.from('notifications').select('*').then(({ data }) => {
            if (data) setNotifications(data);
          });
        }
      )
      .subscribe();

    const interval = setInterval(fetchData, 60000); // Slower backup fetch
    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [session]);

  const sendNotification = async (notif: Partial<SystemNotification>) => {
    const { error } = await supabase.from('notifications').insert(notif);
    // Real-time listener handles the state update
    if (error) console.error("Broadcast failed:", error.message);
  };

  const markNotifRead = async (id: string) => {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
  };

  const deleteNotif = async (id: string) => {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
  };

  const handleSaveSettings = async (newSettings: GlobalSettings) => {
    const { error } = await supabase.from('settings').upsert({ id: 1, ...newSettings });
    if (error) return false;
    setSettings(newSettings);
    return true;
  };

  const upsertMember = async (member: Member, oldId?: string) => {
    try {
      if (oldId && oldId !== member.id) {
          const { error: updErr } = await supabase.from('members').update(member).eq('id', oldId);
          if (updErr) throw updErr;
          await Promise.all([
              supabase.from('transactions').update({ memberId: member.id }).eq('memberId', oldId),
              supabase.from('loans').update({ memberId: member.id }).eq('memberId', oldId),
              supabase.from('equipment_logs').update({ memberId: member.id }).eq('memberId', oldId)
          ]);
      } else {
          const { error } = await supabase.from('members').upsert(member);
          if (error) throw error;
      }
      await fetchData();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Unknown Database Error" };
    }
  };

  const deleteMember = async (id: string) => {
    try {
      const hasTransactions = transactions.some(t => t.memberId === id);
      const hasLoans = loans.some(l => l.memberId === id && l.status !== 'CLOSED');
      if (hasTransactions || hasLoans) return { success: false, error: "Historical logs exist." };
      const { error } = await supabase.from('members').delete().eq('id', id);
      if (error) throw error;
      await fetchData();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const addTransaction = async (tx: Transaction) => {
    try {
      const { error } = await supabase.from('transactions').insert(tx);
      if (error) throw error;
      await fetchData();
      return true;
    } catch (e: any) {
      return false;
    }
  };

  const upsertSupply = async (item: SupplyItem) => {
    const { error } = await supabase.from('supplies').upsert(item);
    if (!error) await fetchData();
  };

  const deleteSupply = async (id: string) => {
    const { error } = await supabase.from('supplies').delete().eq('id', id);
    if (!error) await fetchData();
  };

  const upsertEquipment = async (item: Equipment) => {
    const { error } = await supabase.from('equipment').upsert(item);
    if (!error) await fetchData();
    return { success: !error };
  };

  const deleteEquipment = async (id: string) => {
    const { error } = await supabase.from('equipment').delete().eq('id', id);
    if (!error) await fetchData();
  };

  const generateKimpcId = (joinDate: string, _classification: string): string => {
    const yearYY = (joinDate.split('-')[0] || new Date().getFullYear().toString()).slice(-2);
    const sameYearIds = members.filter(m => m.id.startsWith(yearYY)).map(m => {
        const numericPart = m.id.match(/^\d{6}/); 
        return numericPart ? parseInt(numericPart[0].substring(2)) : 0;
      });
    const nextSeq = sameYearIds.length > 0 ? Math.max(...sameYearIds) + 1 : 1001;
    return `${yearYY}${nextSeq.toString().padStart(4, '0')}`;
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col gap-4">
    <Loader2 className="animate-spin text-blue-600" size={48} />
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Establishing Secure Uplink...</p>
  </div>;

  if (!session) return <Auth />;

  const isSecretary = userRole === UserRole.SECRETARY;
  const isSuperAdmin = userRole === UserRole.ADMIN;
  const currentNavRole = activeMirror || (isSecretary && secretaryView === 'ADMIN' ? UserRole.ADMIN : userRole);
  const isAdminView = (isSecretary && secretaryView === 'ADMIN' && !activeMirror) || (isSuperAdmin && !activeMirror);
  const isMirroring = !!activeMirror;
  const staffIdentifier = `${displayName}`;

  const getRoleTheme = () => {
    switch (currentNavRole) {
      case UserRole.ADMIN: return { bg: 'bg-amber-500', text: 'text-amber-500', light: 'bg-amber-50', border: 'border-amber-100', icon: ShieldAlert };
      case UserRole.TREASURER: return { bg: 'bg-emerald-600', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-100', icon: Landmark };
      case UserRole.BOOKKEEPER: return { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-100', icon: Wallet };
      case UserRole.SECRETARY: return { bg: 'bg-indigo-600', text: 'text-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-100', icon: Users };
      default: return { bg: 'bg-slate-600', text: 'text-slate-600', light: 'bg-slate-50', border: 'border-slate-100', icon: UserCheck };
    }
  };

  const theme = getRoleTheme();
  const relevantNotifications = notifications.filter(n => (n.recipientRole === currentNavRole || n.recipientRole === 'ALL'));
  const unreadCount = relevantNotifications.filter(n => !n.read).length;

  return (
    <div className={`flex min-h-screen transition-colors duration-500 ${currentNavRole === UserRole.ADMIN ? 'bg-[#0b0f1a]' : 'bg-white'}`}>
      
      {/* SOLID FRONT NOTIFICATION HUB (Ensuring it is in absolute front) */}
      {isNotifOpen && (
        <div className="fixed left-[296px] top-6 z-[9999] animate-in zoom-in duration-300">
          <NotificationHub 
            notifications={notifications}
            currentRole={currentNavRole}
            currentName={displayName.split(' (')[0]}
            sendNotification={sendNotification}
            markAsRead={markNotifRead}
            deleteNotification={deleteNotif}
            onClose={() => setIsNotifOpen(false)}
          />
        </div>
      )}

      {/* Side-Click Closer (Transparent) */}
      {isNotifOpen && (
        <div 
          className="fixed inset-0 z-[9998] cursor-default"
          onClick={() => setIsNotifOpen(false)}
        />
      )}

      <aside className={`w-72 border-r flex flex-col fixed h-full z-10 transition-all duration-500 ${currentNavRole === UserRole.ADMIN ? 'bg-[#0f172a] border-slate-800 shadow-[20px_0_60px_rgba(0,0,0,0.4)]' : 'bg-white border-slate-100 shadow-[20px_0_40px_rgba(0,0,0,0.02)]'}`}>
        
        {/* BRANDING HEADER */}
        <div className={`p-8 border-b ${currentNavRole === UserRole.ADMIN ? 'border-slate-800 bg-slate-900/40' : 'border-slate-50'}`}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className={`rounded-2xl w-12 h-12 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0 transition-all duration-500 ${theme.bg}`}>
                <theme.icon size={20} />
              </div>
              <div className="min-w-0">
                <h1 className={`text-[11px] font-black uppercase tracking-tighter truncate ${currentNavRole === UserRole.ADMIN ? 'text-white' : 'text-slate-800'}`}>
                  {currentNavRole}
                </h1>
                <p className={`text-[8px] font-black uppercase tracking-widest ${currentNavRole === UserRole.ADMIN ? 'text-amber-500' : 'text-emerald-600'}`}>KIMPC COOP</p>
              </div>
            </div>

            {/* Personnel Hub Trigger (Bell) */}
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`relative p-3 rounded-xl border transition-all shadow-sm active:scale-90 group shrink-0 ${isNotifOpen ? 'bg-slate-900 text-white border-slate-900 z-[10000]' : `${theme.light} ${theme.border} ${theme.text} hover:${theme.bg} hover:text-white`}`}
            >
                <Megaphone size={18} />
                {unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 border-2 border-white rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-md animate-in zoom-in">{unreadCount}</span>}
            </button>
          </div>
        </div>

        <nav className="flex-1 px-6 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          
          {/* THE MASTER SWITCHBOARD (SECRETARY ROLE ONLY) */}
          {isSecretary && !activeMirror && (
            <div className="mb-10 px-1 py-1 bg-slate-100 rounded-[28px] border border-slate-200 shadow-inner flex overflow-hidden">
                <button 
                  onClick={() => { setSecretaryView('SECRETARY'); navigate('/'); }} 
                  className={`flex-1 py-3.5 text-[9px] font-black uppercase rounded-[24px] transition-all flex items-center justify-center gap-2 ${secretaryView === 'SECRETARY' ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Users size={12} /> Operations
                </button>
                <button 
                  onClick={() => { setSecretaryView('ADMIN'); navigate('/'); }} 
                  className={`flex-1 py-3.5 text-[9px] font-black uppercase rounded-[24px] transition-all flex items-center justify-center gap-2 ${secretaryView === 'ADMIN' ? 'bg-slate-900 text-amber-500 shadow-xl scale-105 border border-amber-500/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <ShieldAlert size={12} /> Command
                </button>
            </div>
          )}

          {currentNavRole === UserRole.ADMIN ? (
            <>
              <SidebarItem end to="/" icon={LayoutDashboard} label="Admin Dashboard" activeColor="bg-amber-500" isDark={true} />
              <SectionHeader label="System Mirrors" />
              <button onClick={() => setActiveMirror(UserRole.BOOKKEEPER)} className="w-full flex items-center space-x-3 px-5 py-3 rounded-2xl transition-all duration-200 text-slate-400 hover:bg-slate-800 hover:text-white">
                <Binary size={18} className="text-amber-400" />
                <span className="font-bold text-[13px] tracking-tight">Bookkeeper Hub</span>
              </button>
              <button onClick={() => setActiveMirror(UserRole.TREASURER)} className="w-full flex items-center space-x-3 px-5 py-3 rounded-2xl transition-all duration-200 text-slate-400 hover:bg-slate-800 hover:text-white">
                <Wallet size={18} className="text-amber-400" />
                <span className="font-bold text-[13px] tracking-tight">Treasurer Hub</span>
              </button>
              <SidebarItem to="/admin/access" icon={UserCheck} label="Access Registry" activeColor="bg-amber-500" color="text-amber-400" isDark={true} />
              <SidebarItem to="/admin/monitor" icon={Monitor} label="Personnel Monitor" activeColor="bg-amber-500" color="text-amber-400" isDark={true} />
              <SidebarItem to="/admin/backup-restore" icon={DatabaseBackup} label="System Recovery" activeColor="bg-amber-500" color="text-amber-400" isDark={true} />
            </>
          ) : currentNavRole === UserRole.BOOKKEEPER ? (
            <>
              <SidebarItem end to="/" icon={LayoutDashboard} label="Bookkeeper Dashboard" activeColor="bg-[#2563eb]" color="text-blue-600" />
              <SectionHeader label="Accounting Central" />
              <SidebarItem to="/ledger/create" icon={Edit3} label="Creation Terminal" activeColor="bg-[#2563eb]" color="text-blue-600" />
              <SidebarItem to="/ledger/verify" icon={ClipboardCheck} label="Verification Deck" activeColor="bg-[#2563eb]" color="text-blue-600" />
              <SidebarItem to="/ledger" icon={Receipt} label="General Ledger" activeColor="bg-[#2563eb]" color="text-blue-600" />
              <SidebarItem to="/reports" icon={BarChart3} label="Institutional Reports" activeColor="bg-[#2563eb]" color="text-blue-600" />
              <SidebarItem to="/configuration" icon={Settings2} label="Global Config" activeColor="bg-[#2563eb]" color="text-blue-600" />
            </>
          ) : currentNavRole === UserRole.TREASURER ? (
            <>
              <SidebarItem end to="/" icon={LayoutDashboard} label="Treasurer Dashboard" activeColor="bg-[#10b981]" color="text-emerald-500" />
              <SectionHeader label="Business Windows" />
              <SidebarItem to="/production" icon={Factory} label="Processing Hub" activeColor="bg-[#10b981]" color="text-emerald-500" />
              <SidebarItem to="/supplies" icon={FlaskConical} label="Agri-Supplies" activeColor="bg-[#10b981]" color="text-emerald-500" />
              <SidebarItem to="/fleet" icon={Truck} label="Fleet Manager" activeColor="bg-[#10b981]" color="text-emerald-500" />
              <SidebarItem to="/loans" icon={HandCoins} label="Cash Loans" activeColor="bg-[#10b981]" color="text-emerald-500" />
              <SectionHeader label="Irrigation Window" />
              <SidebarItem to="/irrigation" icon={Droplets} label="Irrigation Hub" activeColor="bg-[#10b981]" color="text-emerald-500" />
              <SectionHeader label="Liquidity Console" />
              <SidebarItem to="/receivables" icon={Handshake} label="Receivables" activeColor="bg-[#10b981]" color="text-emerald-500" />
              <SidebarItem to="/disbursements" icon={CreditCard} label="Disbursements" activeColor="bg-[#10b981]" color="text-emerald-500" />
              <SidebarItem to="/cashbook" icon={Banknote} label="Vault Cash Book" activeColor="bg-[#10b981]" color="text-emerald-500" />
              <SidebarItem to="/bank-registry" icon={Landmark} label="Bank Registry" activeColor="bg-[#10b981]" color="text-emerald-500" />
            </>
          ) : (
            <>
              <SidebarItem end to="/" icon={LayoutDashboard} label="Secretary Dashboard" activeColor="bg-indigo-600" color="text-indigo-500" />
              <SidebarItem to="/membership" icon={ClipboardList} label="Member Database" activeColor="bg-indigo-600" color="text-indigo-500" />
              <SidebarItem to="/governance" icon={Gavel} label="Seat Assignments" activeColor="bg-indigo-600" color="text-indigo-500" />
              <SidebarItem to="/documents" icon={FolderOpen} label="Document Vault" activeColor="bg-indigo-600" color="text-indigo-500" />
              <SidebarItem to="/calendar" icon={Calendar} label="Institutional Calendar" activeColor="bg-indigo-600" color="text-indigo-500" />
            </>
          )}
        </nav>

        <div className={`p-6 border-t ${currentNavRole === UserRole.ADMIN ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/50'}`}>
          <Link to="/profile" className={`flex items-center space-x-3 p-3 rounded-2xl shadow-sm border transition-all active:scale-95 ${currentNavRole === UserRole.ADMIN ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 hover:shadow-md'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[11px] font-black ${theme.bg}`}>{displayName[0]}</div>
            <div className="flex-1 overflow-hidden">
              <p className={`text-[10px] font-black uppercase truncate ${currentNavRole === UserRole.ADMIN ? 'text-white' : 'text-slate-800'}`}>{displayName}</p>
              <p className={`text-[9px] font-bold uppercase ${currentNavRole === UserRole.ADMIN ? 'text-amber-500/70' : 'text-slate-400'}`}>{isMirroring ? 'Mirroring' : userRole}</p>
            </div>
          </Link>
          <button onClick={() => supabase.auth.signOut()} className="w-full mt-4 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={14} /> System Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-12 relative">
        {isMirroring && (
          <div className="fixed top-0 left-72 right-0 z-[100] animate-in slide-in-from-top duration-500">
             <div className="bg-amber-500 p-4 shadow-2xl flex items-center justify-between border-b-4 border-slate-900 px-12">
                <div className="flex items-center gap-4">
                   <div className="p-2 bg-slate-900 text-amber-500 rounded-lg shadow-inner">
                      <ArrowRightLeft size={18} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none">Mirror Session Active</p>
                      <p className="text-[12px] font-black text-slate-800 uppercase tracking-widest mt-1">Simulating {activeMirror} hub Environment</p>
                   </div>
                </div>
                <button 
                  onClick={() => setActiveMirror(null)} 
                  className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 hover:bg-black transition-all active:scale-95 shadow-xl"
                >
                   <MoveLeft size={16} /> Exit Simulation
                </button>
             </div>
          </div>
        )}

        <div className={isMirroring ? 'pt-20' : ''}>
          <Routes>
            <Route path="/" element={ isAdminView ? <AdminDashboard members={members} transactions={transactions} loans={loans} loginLogs={[]} /> : currentNavRole === UserRole.TREASURER ? <TreasurerDashboard transactions={transactions} members={members} equipment={equipment} userRole={UserRole.TREASURER} banks={banks} loans={loans} session={session} /> : currentNavRole === UserRole.BOOKKEEPER ? <BookkeeperDashboard transactions={transactions} members={members} loans={loans} banks={banks} session={session} /> : isSecretary ? <SecretaryDashboard members={members} loans={loans} upsertMember={upsertMember} deleteMember={deleteMember} generateKimpcId={generateKimpcId} /> : <div className="flex items-center justify-center min-h-[60vh] text-slate-300 font-black uppercase tracking-[0.5em] italic">Dashboard Initializing...</div> } />
            <Route path="/profile" element={<Profile userRole={userRole} setUserRole={setUserRole} session={session} transactions={transactions} settings={settings} saveSettings={async()=>true} setGlobalDisplayName={setDisplayName} handleLogout={()=>{}} />} />
            <Route path="/ledger" element={<GeneralLedger transactions={transactions} addTransaction={addTransaction} userRole={UserRole.BOOKKEEPER} banks={banks} members={members} staffIdentity={staffIdentifier} readOnly={isMirroring || isAdminView} viewMode="MASTER" settings={settings} />} />
            <Route path="/ledger/create" element={<GeneralLedger transactions={transactions} addTransaction={addTransaction} userRole={UserRole.BOOKKEEPER} banks={banks} members={members} staffIdentity={staffIdentifier} readOnly={isMirroring || isAdminView} viewMode="CREATE" settings={settings} />} />
            <Route path="/ledger/verify" element={<GeneralLedger transactions={transactions} addTransaction={addTransaction} userRole={UserRole.BOOKKEEPER} banks={banks} members={members} staffIdentity={staffIdentifier} readOnly={isMirroring || isAdminView} viewMode="VERIFY" settings={settings} />} />
            <Route path="/reports" element={<SystemReports transactions={transactions} members={members} equipment={equipment} logs={equipmentLogs} globalSettings={settings} readOnly={isMirroring} />} />
            <Route path="/configuration" element={<Configuration settings={settings} saveSettings={handleSaveSettings} userRole={UserRole.BOOKKEEPER} readOnly={isMirroring} supplies={supplies} upsertSupply={upsertSupply} deleteSupply={deleteSupply} equipment={equipment} upsertEquipment={upsertEquipment} deleteEquipment={deleteEquipment} />} />
            <Route path="/production" element={<ProductionHub members={members} transactions={transactions} addTransaction={addTransaction} deleteTransaction={async()=>true} globalSettings={settings} loans={loans} upsertLoan={async()=>true} staffIdentity={staffIdentifier} readOnly={isMirroring || isAdminView} fetchData={fetchData} />} />
            <Route path="/supplies" element={<AgriSupplies members={members} supplies={supplies} upsertSupply={upsertSupply} deleteSupply={deleteSupply} addTransaction={addTransaction} deleteTransaction={async()=>true} loans={loans} upsertLoan={async()=>true} transactions={transactions} globalSettings={settings} userRole={currentNavRole} staffIdentity={staffIdentifier} readOnly={isMirroring || isAdminView} />} />
            <Route path="/fleet" element={<FleetManager members={members} equipment={equipment} upsertEquipment={upsertEquipment} deleteEquipment={deleteEquipment} addTransaction={addTransaction} deleteTransaction={async()=>true} transactions={transactions} logs={equipmentLogs} addEquipmentLog={async()=>{}} loans={loans} upsertLoan={async()=>true} globalSettings={settings} userRole={currentNavRole} staffIdentity={staffIdentifier} readOnly={isMirroring || isAdminView} />} />
            <Route path="/loans" element={<LoanPortfolio members={members} loans={loans} upsertLoan={async()=>true} deleteLoan={async()=>true} addTransaction={addTransaction} globalSettings={settings} staffIdentity={staffIdentifier} readOnly={isMirroring || isAdminView} />} />
            <Route path="/receivables" element={<Receivables members={members} loans={loans} transactions={transactions} addTransaction={addTransaction} upsertLoan={async()=>true} upsertMember={async()=>true} staffIdentity={staffIdentifier} readOnly={isMirroring || isAdminView} />} />
            <Route path="/disbursements" element={<Disbursements transactions={transactions} addTransaction={addTransaction} banks={banks} staffIdentity={staffIdentifier} readOnly={isMirroring || isAdminView} fetchData={fetchData} />} />
            <Route path="/cashbook" element={<CashBook transactions={transactions} addTransaction={addTransaction} staffIdentity={staffIdentifier} readOnly={isMirroring || isAdminView} />} />
            <Route path="/bank-registry" element={<BankRegistry transactions={transactions} banks={banks} upsertBank={async()=>{}} deleteBank={async()=>{}} readOnly={isMirroring || isAdminView} />} />
            <Route path="/irrigation" element={<IrrigationHub members={members} transactions={transactions} addTransaction={addTransaction} deleteTransaction={async()=>true} staffIdentity={staffIdentifier} readOnly={isMirroring || isAdminView} />} />
            <Route path="/membership" element={<SecretaryDashboard members={members} loans={loans} upsertMember={upsertMember} deleteMember={deleteMember} generateKimpcId={generateKimpcId} />} />
            <Route path="/governance" element={<SecretaryGovernance members={members} governance={governance} upsertGovernance={async()=>true} deleteGovernance={async()=>true} upsertMember={upsertMember} currentSession={session} fetchData={fetchData} />} />
            <Route path="/documents" element={<SecretaryDocuments members={members} documents={documents} upsertDocument={async()=>true} deleteDocument={async()=>true} />} />
            <Route path="/calendar" element={<SecretaryCalendar />} />
            <Route path="/admin/access" element={isAdminView ? <SystemAccess members={members} upsertMember={upsertMember} generateKimpcId={generateKimpcId} fetchData={fetchData} /> : <Navigate to="/" />} />
            <Route path="/admin/monitor" element={isAdminView ? <SystemMonitor loginLogs={[]} /> : <Navigate to="/" />} />
            <Route path="/admin/backup-restore" element={isAdminView ? <BackupRestore members={members} transactions={transactions} loans={loans} supplies={supplies} equipment={equipment} banks={banks} settings={settings} documents={documents} governance={governance} equipmentLogs={equipmentLogs} onComplete={fetchData} /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default App;
