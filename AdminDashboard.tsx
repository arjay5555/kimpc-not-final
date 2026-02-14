
import React, { useMemo } from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  Users, 
  Database, 
  Activity, 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  ShieldCheck, 
  Landmark, 
  Monitor,
  Zap,
  Lock
} from 'lucide-react';
import { Member, Transaction, Loan } from '../types';

interface AdminDashboardProps {
  members: Member[];
  transactions: Transaction[];
  loans: Loan[];
  loginLogs: any[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ members, transactions, loans, loginLogs }) => {
  const stats = useMemo(() => {
    const approved = transactions.filter(t => t.status === 'APPROVED');
    const totalEquity = members.reduce((s, m) => s + (m.shareCapital || 0) + (m.savingsBalance || 0), 0);
    const activePersonnel = members.filter(m => !m.id.endsWith('-M')).length;
    return { totalEquity, activePersonnel, registrySize: members.length, transactionCount: transactions.length };
  }, [members, transactions]);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-500">
      {/* 1. ADMIN HEADER */}
      <div className="bg-slate-900 p-12 rounded-[56px] border-4 border-slate-800 shadow-2xl relative overflow-hidden">
         <div className="absolute right-0 top-0 p-12 text-white opacity-5">
            <ShieldAlert size={280} />
         </div>
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8">
               <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-amber-500 text-slate-900 rounded-[24px] shadow-xl">
                     <Lock size={32} />
                  </div>
                  <div>
                     <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Command Control</h2>
                     <p className="text-amber-500 text-[11px] font-black uppercase tracking-[0.4em] mt-2 italic">Superuser Master Interface</p>
                  </div>
               </div>
               <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-xl">
                  Authorized access only. System mirror protocols are active. All mirror sessions are audited and recorded for regulatory compliance.
               </p>
            </div>
            <div className="lg:col-span-4 bg-white/5 backdrop-blur-md p-8 rounded-[40px] border border-white/10">
               <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none">Global Consolidated Equity</span>
               <p className="text-4xl font-black text-white mt-4 tracking-tighter">₱{stats.totalEquity.toLocaleString()}</p>
               <div className="mt-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Real-time DB Sync</span>
               </div>
            </div>
         </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-slate-800 p-10 rounded-[48px] border border-slate-700 shadow-sm flex items-center gap-8">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-3xl flex items-center justify-center border border-blue-500/20">
               <Users size={32} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">Registry Size</p>
               <p className="text-3xl font-black text-white">{stats.registrySize}</p>
            </div>
         </div>
         <div className="bg-slate-800 p-10 rounded-[48px] border border-slate-700 shadow-sm flex items-center gap-8">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center border border-amber-500/20">
               <History size={32} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">Audit Trail Entries</p>
               <p className="text-3xl font-black text-white">{stats.transactionCount}</p>
            </div>
         </div>
         <div className="bg-slate-800 p-10 rounded-[48px] border border-slate-700 shadow-sm flex items-center gap-8">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-3xl flex items-center justify-center border border-emerald-500/20">
               <ShieldCheck size={32} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1.5">Active Staff</p>
               <p className="text-3xl font-black text-white">{stats.activePersonnel}</p>
            </div>
         </div>
      </div>

      {/* 3. RECENT ACTIVITY PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-slate-800 rounded-[56px] p-12 border border-slate-700 shadow-xl overflow-hidden relative">
            <Monitor size={150} className="absolute -right-10 -bottom-10 text-white opacity-5" />
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-10 flex items-center gap-4">
               <Activity className="text-amber-500" /> Recent Personnel Access
            </h3>
            <div className="space-y-6">
               {loginLogs.slice(0, 5).map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-900/50 rounded-[32px] border border-white/5">
                     <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-700 flex items-center justify-center text-white font-black">{log.user[0]}</div>
                        <div>
                           <p className="text-sm font-black text-white">{log.user}</p>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{log.role} Access</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-amber-500 uppercase">{log.date}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{log.time}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="bg-slate-800 rounded-[56px] p-12 border border-slate-700 shadow-xl">
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-10 flex items-center gap-4">
               <Zap className="text-blue-400" /> Mirror Connectivity
            </h3>
            <div className="grid grid-cols-1 gap-6">
               {[
                  { label: 'Treasurer Hub', status: 'ONLINE', users: 1 },
                  { label: 'Bookkeeping Hub', status: 'ONLINE', users: 1 },
                  { label: 'Member Registry', status: 'SYNCHRONIZED', users: 0 }
               ].map((mod, i) => (
                  <div key={i} className="p-8 bg-slate-900/50 rounded-[32px] border border-white/5 flex items-center justify-between">
                     <div>
                        <h4 className="text-lg font-black text-white tracking-tight">{mod.label}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Personnel Session Active</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{mod.status}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
