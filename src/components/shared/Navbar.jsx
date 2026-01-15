import React from 'react';
import { ShieldCheck, XCircle } from 'lucide-react';

const Navbar = ({ isAdmin, setIsAdmin, adminTab, setAdminTab, setStep }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => !isAdmin && setStep(1)}>
          <div className={`w-9 h-9 ${isAdmin ? 'bg-slate-800' : 'bg-[#00ce7c]'} rounded-lg flex items-center justify-center text-white font-black shadow-lg shadow-emerald-200 transition-colors`}>FK</div>
          <span className={`${isAdmin ? 'text-slate-800' : 'text-[#00ce7c]'} font-black text-xl tracking-tighter uppercase transition-colors hidden md:block`}>
            Freshket {isAdmin ? 'Admin' : 'Joiner'}
          </span>
        </div>
        
        <div className="flex items-center gap-3">
           {!isAdmin ? (
             <button onClick={() => setIsAdmin(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 font-bold hover:bg-slate-100 transition-all text-xs md:text-sm">
                <ShieldCheck size={16} /> <span className="hidden md:inline">Admin Panel</span>
             </button>
           ) : (
             <>
               <div className="hidden md:flex items-center gap-1 mr-4">
                  <button onClick={() => setAdminTab('dashboard')} className={`px-4 py-2 rounded-lg font-bold text-xs ${adminTab === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Dashboard</button>
                  <button onClick={() => setAdminTab('create')} className={`px-4 py-2 rounded-lg font-bold text-xs ${adminTab === 'create' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Create OTP</button>
               </div>
               <button onClick={() => setIsAdmin(false)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-lg font-bold hover:bg-red-100 transition-all text-xs md:text-sm">
                  <XCircle size={16} /> <span className="hidden md:inline">Logout Admin</span>
               </button>
             </>
           )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
