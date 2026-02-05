import React from 'react';

export const Badge = ({ status }) => {
  const styles = {
    DRAFT: 'bg-slate-100 text-slate-600 border-slate-200',
    SENT: 'bg-blue-50 text-blue-600 border-blue-200',
    SUBMITTED: 'bg-purple-50 text-purple-600 border-purple-200',
    INCOMPLETE: 'bg-orange-50 text-orange-600 border-orange-200',
    VERIFIED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    COMPLETED: 'bg-slate-800 text-white border-slate-700 shadow-sm',
  };
  
  const labels = {
    DRAFT: 'Draft',
    SENT: 'Sent',
    SUBMITTED: 'Submitted',
    INCOMPLETE: 'Incomplete',
    VERIFIED: 'Verified',
    COMPLETED: 'Completed'
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 w-fit ${styles[status] || styles.DRAFT}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'COMPLETED' ? 'bg-white' : 'bg-current'}`}></span>
      {labels[status] || status}
    </span>
  );
};

export const InputGroup = ({ label, required, children, error }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, variant = 'primary', className = "", ...props }) => {
  const variants = {
    primary: "bg-[#00ce7c] hover:bg-[#00b56d] text-white shadow-lg shadow-emerald-100",
    secondary: "bg-slate-800 hover:bg-slate-900 text-white shadow-lg shadow-slate-200",
    outline: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    ghost: "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
  };
  
  return (
    <button 
      className={`px-4 py-2.5 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};