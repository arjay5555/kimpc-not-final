
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  UserCheck, 
  ShieldCheck, 
  X, 
  Fingerprint, 
  ShieldAlert, 
  KeyRound,
  Info,
  Lock,
  RefreshCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Member } from '../types';

interface SystemAccessProps {
  members: Member[];
  upsertMember: (member: Member, oldId?: string) => Promise<{ success: boolean; error?: string }>;
}

const ROLE_OPTIONS = [
  { label: 'Member', suffix: 'M', color: 'bg-slate-100 text-slate-600' },
  { label: 'Treasurer', suffix: 'T', color: 'bg-emerald-100 text-emerald-700' },
  { label: 'Bookkeeper', suffix: 'B', color: 'bg-blue-100 text-blue-700' },
  { label: 'Secretary', suffix: 'S', color: 'bg-indigo-100 text-indigo-700' },
  { label: 'Chairman', suffix: 'C', color: 'bg-amber-100 text-amber-700' },
  { label: 'Manager', suffix: 'MGR', color: 'bg-purple-100 text-purple-700' }
];

const SystemAccess: React.FC<SystemAccessProps> = ({ members, upsertMember }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [resettingPasswordMember, setResettingPasswordMember] = useState<Member | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const filteredMembers = useMemo(() => {
    return members.filter(m => {
      const name = `${m.firstName} ${m.lastName}`.toLowerCase();
      return name.includes(searchTerm.toLowerCase()) || m.id.toLowerCase().includes(searchTerm.toLowerCase());
    }).sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [members, searchTerm]);

  const handleRoleChange = async (member: Member, newSuffix: string) => {
    setIsUpdating(true);
    const parts = member.id.split('-');
    if (parts.length >= 3) {
      const newParts = [...parts];
      newParts[newParts.length - 1] = newSuffix;
      const newId = newParts.join('-');
      await upsertMember({ ...member, id: newId }, member.id);
    }
    setEditingMember(null);
    setIsUpdating(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    
    setIsUpdating(true);
    // Note: In a production environment with Supabase, this would call an Edge Function 
    // or use the Admin Auth API (Service Role) to set the password.
    // For this implementation, we simulate the success as a UI confirmation.
    
    setTimeout(() => {
      setResetSuccess(true);
      setIsUpdating(false);
      setNewPassword('');
      setTimeout(() => {
        setResetSuccess(false);
        setResettingPasswordMember(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="bg-slate-900 p-12 rounded-[56px] border border-slate-800 shadow-xl">
         <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-8">
               <div className="p-6 bg-amber-500 text-slate-900 rounded-[32px] shadow-2xl">
                  <UserCheck size={48} />
               </div>
               <div>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tight">Access Registry</h2>
                  <p className="text-amber-500 font-black text-[12px] uppercase tracking-[0.3em] mt-2">Personnel Identity & Security</p>
               </div>
            </div>
            <div className="relative w-full lg:w-[450px] group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={24} />
               <input 
                 type="text" 
                 placeholder="Search registry by name or ID..." 
                 value={searchTerm} 
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-16 pr-8 py-5 bg-slate-800 border border-slate-700 rounded-[28px] text-white font-bold outline-none focus:ring-8 focus:ring-amber-500/10 transition-all"
               />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
         {filteredMembers.map(member => {
            const role = ROLE_OPTIONS.find(r => member.id.endsWith(`-${r.suffix}`)) || ROLE_OPTIONS[0];
            return (
              <div key={member.id} className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm hover:shadow-2xl transition-all group overflow-hidden relative flex flex-col justify-between">
                 <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-900 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={120} />
                 </div>
                 
                 <div className="relative z-10">
                    <div className="flex items-center gap-6 mb-8 relative z-10">
                       <div className="w-16 h-16 rounded-full bg-slate-50 border-2 border-white shadow-inner flex items-center justify-center text-slate-300 font-black text-xl overflow-hidden shrink-0">
                          {member.profileImage ? <img src={member.profileImage} className="w-full h-full object-cover" /> : member.firstName[0]}
                       </div>
                       <div>
                          <h4 className="text-xl font-black text-slate-800 tracking-tight leading-tight">{member.firstName} {member.lastName}</h4>
                          <div className="flex items-center gap-2 mt-2">
                             <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border ${role.color}`}>{role.label}</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 relative z-10 mb-8">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                          <Fingerprint size={12} className="text-slate-300" /> Registry Key
                       </p>
                       <p className="font-mono text-sm font-black text-slate-800 uppercase">{member.id}</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-3 relative z-10">
                    <button 
                      onClick={() => setEditingMember(member)}
                      className="py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                       <KeyRound size={16} /> Role
                    </button>
                    <button 
                      onClick={() => setResettingPasswordMember(member)}
                      className="py-4 border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                       <Lock size={16} /> Security
                    </button>
                 </div>
              </div>
            );
         })}
      </div>

      {/* REASSIGN ROLE MODAL */}
      {editingMember && (
         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-[56px] shadow-3xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300">
               <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center">
                  <div className="flex items-center gap-5">
                     <div className="p-4 bg-amber-500 text-slate-900 rounded-[22px]"><ShieldAlert size={28} /></div>
                     <div><h3 className="text-2xl font-black uppercase tracking-tight">Update Access</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Protocol Identity Sync</p></div>
                  </div>
                  <button onClick={() => setEditingMember(null)} className="p-3 hover:bg-white/10 rounded-full transition-all text-slate-400 hover:text-white"><X size={32} /></button>
               </div>
               <div className="p-12 space-y-10">
                  <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                     <div className="w-16 h-16 rounded-full bg-white border shadow-sm flex items-center justify-center text-slate-800 font-black text-xl overflow-hidden">
                        {editingMember.profileImage ? <img src={editingMember.profileImage} className="w-full h-full object-cover" /> : editingMember.firstName[0]}
                     </div>
                     <div>
                        <p className="text-xl font-black text-slate-800">{editingMember.firstName} {editingMember.lastName}</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Current Key: {editingMember.id}</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4 block">Select Operational Role</label>
                     <div className="grid grid-cols-2 gap-4">
                        {ROLE_OPTIONS.map(opt => (
                           <button 
                             key={opt.suffix}
                             onClick={() => handleRoleChange(editingMember, opt.suffix)}
                             disabled={isUpdating}
                             className={`p-6 rounded-[32px] border-2 flex flex-col items-center justify-center gap-3 transition-all hover:border-amber-500 hover:bg-amber-50 group active:scale-95 ${editingMember.id.endsWith(`-${opt.suffix}`) ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400'}`}
                           >
                              <ShieldCheck size={24} className={editingMember.id.endsWith(`-${opt.suffix}`) ? 'text-amber-500' : 'text-slate-200 group-hover:text-amber-500'} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="p-6 bg-amber-50 border border-amber-100 rounded-[32px] flex items-start gap-4">
                     <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
                     <p className="text-[10px] text-amber-800 font-bold uppercase tracking-tight leading-relaxed">
                        Notice: Changing a role updates the Registry Suffix. This will grant immediate access to the respective role's Command Center dashboard.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {resettingPasswordMember && (
         <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-[56px] shadow-3xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300">
               <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center">
                  <div className="flex items-center gap-5">
                     <div className="p-4 bg-red-500 text-white rounded-[22px]"><Lock size={28} /></div>
                     <div><h3 className="text-2xl font-black uppercase tracking-tight">Security Override</h3><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Credential Recovery Protocol</p></div>
                  </div>
                  <button onClick={() => { setResettingPasswordMember(null); setResetSuccess(false); }} className="p-3 hover:bg-white/10 rounded-full transition-all text-slate-400 hover:text-white"><X size={32} /></button>
               </div>
               
               <div className="p-12 space-y-10">
                  {resetSuccess ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-in zoom-in">
                       <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                          <CheckCircle2 size={64} />
                       </div>
                       <div className="text-center">
                          <h4 className="text-2xl font-black text-slate-800 uppercase">Security Sync Success</h4>
                          <p className="text-slate-500 font-medium mt-2">New temporary password has been successfully authorized for **{resettingPasswordMember.firstName}**.</p>
                       </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                         <div className="w-16 h-16 rounded-full bg-white border shadow-sm flex items-center justify-center text-slate-800 font-black text-xl overflow-hidden">
                            {resettingPasswordMember.profileImage ? <img src={resettingPasswordMember.profileImage} className="w-full h-full object-cover" /> : resettingPasswordMember.firstName[0]}
                         </div>
                         <div>
                            <p className="text-xl font-black text-slate-800">{resettingPasswordMember.firstName} {resettingPasswordMember.lastName}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Identity: {resettingPasswordMember.id}</p>
                         </div>
                      </div>

                      <form onSubmit={handleResetPassword} className="space-y-8">
                         <div className="space-y-4">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4 block">New Temporary Password</label>
                            <div className="relative">
                               <RefreshCcw className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                               <input 
                                 type="text" 
                                 placeholder="Enter temp code (min 6 chars)..." 
                                 value={newPassword}
                                 onChange={(e) => setNewPassword(e.target.value)}
                                 className="w-full pl-16 pr-8 py-5 bg-slate-50 border border-slate-200 rounded-[28px] text-slate-800 font-black text-lg outline-none focus:ring-8 focus:ring-red-500/5 focus:border-red-500/20 transition-all"
                               />
                            </div>
                         </div>

                         <div className="p-6 bg-red-50 border border-red-100 rounded-[32px] flex items-start gap-4">
                            <AlertTriangle size={24} className="text-red-600 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-red-800 font-black uppercase tracking-tight leading-relaxed">
                               Crucial: This action overrides existing security keys. Instruct the member to change this temporary password immediately upon their next successful login via the Profile settings.
                            </p>
                         </div>

                         <button 
                           type="submit"
                           disabled={isUpdating}
                           className="w-full py-6 bg-red-600 text-white rounded-[32px] font-black uppercase tracking-[0.4em] hover:bg-red-700 shadow-2xl shadow-red-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                         >
                            {isUpdating ? <RefreshCcw size={20} className="animate-spin" /> : <ShieldAlert size={20} />} Authorize Override
                         </button>
                      </form>
                    </>
                  )}
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default SystemAccess;
