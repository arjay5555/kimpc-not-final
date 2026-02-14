
import React from 'react';
import { 
  Monitor, 
  ShieldCheck, 
  Activity, 
  History, 
  Search, 
  Filter, 
  ExternalLink,
  ChevronRight,
  Clock,
  Calendar
} from 'lucide-react';

interface SystemMonitorProps {
  loginLogs: any[];
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ loginLogs }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="bg-slate-900 p-12 rounded-[56px] border border-slate-800 shadow-xl">
         <div className="flex items-center gap-8">
            <div className="p-6 bg-blue-600 text-white rounded-[32px] shadow-2xl">
               <Monitor size={48} />
            </div>
            <div>
               <h2 className="text-4xl font-black text-white uppercase tracking-tight">Personnel Monitor</h2>
               <p className="text-blue-400 font-black text-[12px] uppercase tracking-[0.3em] mt-2">Activity Audit Log (Real-time)</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[56px] shadow-sm border border-slate-100 overflow-hidden">
         <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-white text-slate-400 rounded-2xl shadow-sm"><History size={24} /></div>
               <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">Authentication Audit Trail</h4>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] font-black text-slate-400 uppercase bg-white border px-4 py-2 rounded-xl">Last 50 Events</span>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100">
                  <tr>
                     <th className="px-10 py-6">Status</th>
                     <th className="px-10 py-6">Personnel Name / ID</th>
                     <th className="px-10 py-6">Assigned Role</th>
                     <th className="px-10 py-6">Access Date</th>
                     <th className="px-10 py-6">Access Time</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loginLogs.length === 0 ? (
                     <tr>
                        <td colSpan={5} className="py-32 text-center text-slate-300 font-bold uppercase tracking-widest italic">No activity recorded for this period.</td>
                     </tr>
                  ) : loginLogs.map((log, i) => (
                     <tr key={i} className="hover:bg-slate-50/80 transition-all group">
                        <td className="px-10 py-8">
                           <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                              <ShieldCheck size={16} />
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <p className="font-black text-slate-800 uppercase tracking-tighter leading-tight">{log.user}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{log.id}</p>
                        </td>
                        <td className="px-10 py-8">
                           <span className="px-4 py-1.5 bg-slate-100 text-slate-500 rounded-xl text-[9px] font-black uppercase border border-slate-200">
                              {log.role}
                           </span>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-3 text-slate-600">
                              <Calendar size={14} className="text-slate-300" />
                              <span className="text-sm font-black tracking-tight">{log.date}</span>
                           </div>
                        </td>
                        <td className="px-10 py-8">
                           <div className="flex items-center gap-3 text-slate-600">
                              <Clock size={14} className="text-slate-300" />
                              <span className="text-sm font-black tracking-tight">{log.time}</span>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
      
      <div className="p-10 bg-blue-50 border border-blue-100 rounded-[56px] flex items-start gap-8 shadow-inner">
         <div className="p-5 bg-white text-blue-600 rounded-[32px] shadow-sm"><Monitor size={32} /></div>
         <div>
            <p className="text-base font-black text-blue-900 uppercase tracking-widest mb-3">Audit Security Notice</p>
            <p className="text-sm text-blue-700 leading-relaxed font-medium">
               The **Personnel Monitor** captures every unique authentication event and role transition within the KIMPC portal. For cooperative security, these logs are immutable and stored in a secondary audit-only database layer. Cross-referencing these logs with mirror sessions ensures transparent administrative oversight.
            </p>
         </div>
      </div>
    </div>
  );
};

export default SystemMonitor;
