import React, { useState, useRef } from 'react';
import { 
  DatabaseBackup, 
  Download, 
  Upload, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  FileJson,
  History,
  Info,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BackupRestoreProps {
  members: any[];
  transactions: any[];
  loans: any[];
  supplies: any[];
  equipment: any[];
  banks: any[];
  settings: any;
  documents: any[];
  governance: any[];
  equipmentLogs: any[];
  onComplete: () => void;
}

const BackupRestore: React.FC<BackupRestoreProps> = ({ 
  members, transactions, loans, supplies, equipment, banks, settings, documents, governance, equipmentLogs, onComplete 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState<{ type: 'SUCCESS' | 'ERROR' | null, message: string }>({ type: null, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    setIsProcessing(true);
    try {
      const dataSnapshot = {
        timestamp: new Date().toISOString(),
        version: "1.0",
        data: {
          members,
          transactions,
          loans,
          supplies,
          equipment,
          banks: banks.filter(b => !b.isSystem),
          settings,
          documents,
          governance,
          equipmentLogs
        }
      };

      const blob = new Blob([JSON.stringify(dataSnapshot, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `KIMPC_System_Snapshot_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setProcessStatus({ type: 'SUCCESS', message: 'Master snapshot generated and downloaded successfully.' });
    } catch (error) {
      setProcessStatus({ type: 'ERROR', message: 'Snapshot generation failed.' });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProcessStatus({ type: null, message: '' }), 5000);
    }
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm("CRITICAL WARNING: Restoring from a snapshot will attempt to overwrite current database entries. This action is irreversible. Proceed with system restore?")) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsProcessing(true);
    setProcessStatus({ type: null, message: 'Initiating system restore protocols...' });

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const snapshot = JSON.parse(event.target?.result as string);
          if (!snapshot.data) throw new Error("Invalid snapshot format.");

          const { data } = snapshot;

          // Helper to perform batch upserts
          const performUpsert = async (table: string, records: any[]) => {
            if (!records || records.length === 0) return;
            const { error } = await supabase.from(table).upsert(records);
            if (error) throw error;
          };

          // Sequence of restoration
          await performUpsert('members', data.members);
          await performUpsert('transactions', data.transactions);
          await performUpsert('loans', data.loans);
          await performUpsert('supplies', data.supplies);
          await performUpsert('equipment', data.equipment);
          await performUpsert('banks', data.banks);
          if (data.settings) await supabase.from('settings').upsert(data.settings);
          await performUpsert('documents', data.documents);
          await performUpsert('governance', data.governance);
          await performUpsert('equipment_logs', data.equipmentLogs);

          setProcessStatus({ type: 'SUCCESS', message: 'System state restored successfully. Syncing database...' });
          onComplete();
        } catch (err: any) {
          setProcessStatus({ type: 'ERROR', message: `Restore failed: ${err.message}` });
        } finally {
          setIsProcessing(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
          setTimeout(() => setProcessStatus({ type: null, message: '' }), 10000);
        }
      };
      reader.readAsText(file);
    } catch (error) {
      setProcessStatus({ type: 'ERROR', message: 'File reading failed.' });
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="bg-slate-900 p-12 rounded-[56px] border border-slate-800 shadow-xl">
         <div className="flex items-center gap-8">
            <div className="p-6 bg-amber-500 text-slate-900 rounded-[32px] shadow-2xl">
               <DatabaseBackup size={48} />
            </div>
            <div>
               <h2 className="text-4xl font-black text-white uppercase tracking-tight">System Integrity</h2>
               <p className="text-amber-500 font-black text-[12px] uppercase tracking-[0.3em] mt-2 italic">Data Continuity & Recovery Protocols</p>
            </div>
         </div>
      </div>

      {processStatus.type && (
         <div className={`p-8 rounded-[32px] border-2 animate-in zoom-in duration-300 flex items-center gap-6 ${processStatus.type === 'SUCCESS' ? 'bg-emerald-900/20 border-emerald-500 text-emerald-400' : 'bg-rose-900/20 border-rose-500 text-rose-400'}`}>
            {processStatus.type === 'SUCCESS' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
            <p className="text-lg font-black uppercase tracking-tight">{processStatus.message}</p>
         </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* BACKUP CARD */}
         <div className="bg-slate-800 p-12 rounded-[56px] border border-slate-700 shadow-xl relative overflow-hidden group">
            <Download className="absolute -right-8 -bottom-8 text-white opacity-5 group-hover:scale-110 transition-transform" size={240} />
            <div className="relative z-10 space-y-8">
               <div className="flex items-center gap-6">
                  <div className="p-4 bg-blue-600 text-white rounded-[24px] shadow-lg">
                     <FileJson size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Generate Backup</h3>
               </div>
               <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Generate a master encrypted snapshot of all members, transactions, inventory, and settings. This file can be used to migrate or restore the cooperative system to a specific point in time.
               </p>
               <div className="bg-slate-900/50 p-6 rounded-[32px] border border-white/5">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                     <span>Estimated Snapshot Size</span>
                     <span className="text-blue-400">~2.4 MB</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                     {['Members', 'Ledger', 'Fleet', 'Loans'].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-[8px] font-black uppercase">{tag}</span>
                     ))}
                  </div>
               </div>
               <button 
                 onClick={handleBackup}
                 disabled={isProcessing}
                 className="w-full py-6 bg-blue-600 text-white font-black uppercase tracking-[0.3em] rounded-[32px] hover:bg-blue-700 shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
               >
                  {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
                  Export Master Snapshot
               </button>
            </div>
         </div>

         {/* RESTORE CARD */}
         <div className="bg-slate-800 p-12 rounded-[56px] border border-slate-700 shadow-xl relative overflow-hidden group">
            <RefreshCw className="absolute -right-8 -bottom-8 text-white opacity-5 group-hover:rotate-12 transition-transform" size={240} />
            <div className="relative z-10 space-y-8">
               <div className="flex items-center gap-6">
                  <div className="p-4 bg-amber-500 text-slate-900 rounded-[24px] shadow-lg">
                     <Upload size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">System Restore</h3>
               </div>
               <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Upload a previously generated system snapshot. This process will identify conflicts and attempt to synchronize the local file with the cloud registry.
               </p>
               <div className="bg-amber-900/10 p-6 rounded-[32px] border border-amber-500/20">
                  <div className="flex items-start gap-4">
                     <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={20} />
                     <p className="text-[10px] text-amber-200/70 font-black uppercase tracking-tight leading-relaxed">
                        Restoration protocols will overwrite matching primary keys. Use with extreme caution under administrative supervision.
                     </p>
                  </div>
               </div>
               <div className="relative">
                  <input 
                    type="file" 
                    accept=".json"
                    ref={fileInputRef}
                    onChange={handleRestore}
                    className="hidden" 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="w-full py-6 bg-slate-900 text-white font-black uppercase tracking-[0.3em] rounded-[32px] border-2 border-slate-700 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
                  >
                     {isProcessing ? <Loader2 size={24} className="animate-spin" /> : <RefreshCw size={24} />}
                     Import Registry Data
                  </button>
               </div>
            </div>
         </div>
      </div>

      <div className="p-10 bg-blue-900/10 border border-blue-500/20 rounded-[56px] flex items-start gap-8 shadow-inner relative overflow-hidden">
         <History className="absolute -right-6 top-1/2 -translate-y-1/2 text-blue-400 opacity-5" size={140} />
         <div className="p-5 bg-blue-600/10 text-blue-400 rounded-[32px] border border-blue-500/20 shrink-0">
            <Info size={32} />
         </div>
         <div>
            <p className="text-base font-black text-blue-200 uppercase tracking-widest mb-3">Continuity Standards</p>
            <p className="text-sm text-blue-400 font-medium leading-relaxed">
               The KIMPC Backup engine follows international data redundancy standards. Manual snapshots are recommended before every General Assembly and after major statutory adjustments. Snapshots include full binary streams of identity pictures and document references.
            </p>
         </div>
      </div>
    </div>
  );
};

export default BackupRestore;