import React from 'react';

export const InputLabel = ({ label, required }) => (
  <label className="text-sm font-bold text-slate-500 mb-1.5 block">
    {label} {required && <span className="text-red-500">*</span>}
  </label>
);

export const SectionHeader = ({ icon: Icon, title, sub }) => (
  <div className="flex items-center gap-3 mb-2 border-b border-slate-50 pb-4">
    <div className="w-8 h-8 rounded-lg bg-[#00ce7c]/10 flex items-center justify-center text-[#00ce7c]">
      <Icon size={18} />
    </div>
    <div>
      <h3 className="font-bold text-slate-800 leading-tight">{title}</h3>
      {sub && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{sub}</p>}
    </div>
  </div>
);

export const Badge = ({ status }) => {
  const styles = {
    DRAFT: 'bg-slate-100 text-slate-600 border-slate-200',
    SENT: 'bg-blue-50 text-blue-600 border-blue-100',
    SUBMITTED: 'bg-purple-50 text-purple-600 border-purple-100',
    INCOMPLETE: 'bg-orange-50 text-orange-600 border-orange-100',
    VERIFIED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    COMPLETED: 'bg-slate-800 text-white border-slate-800',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles[status] || styles.DRAFT}`}>
      {status}
    </span>
  );
};