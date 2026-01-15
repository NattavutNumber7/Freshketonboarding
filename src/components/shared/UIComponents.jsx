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
