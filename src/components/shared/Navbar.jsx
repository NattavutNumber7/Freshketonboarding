import React from 'react';
import { ShieldCheck, XCircle, LogOut } from 'lucide-react';

const Navbar = ({ isLoggedIn, onLogout, setView }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-100 px-4 md:px-8 py-4 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Area */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('LOGIN')}>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-black shadow-lg transition-colors ${isLoggedIn ? 'bg-slate-800 shadow-slate-200' : 'bg-freshket-green shadow-emerald-200'}`}>
            FK
          </div>
          <span className={`font-black text-xl tracking-tighter uppercase transition-colors hidden md:block ${isLoggedIn ? 'text-slate-800' : 'text-freshket-green'}`}>
            Freshket {isLoggedIn ? 'Admin' : 'Onboarding'}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-3">
           {!isLoggedIn ? (
             <button 
                onClick={() => setView('ADMIN_LOGIN')} 
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 font-bold hover:bg-slate-100 transition-all text-xs md:text-sm"
             >
                <ShieldCheck size={16} /> <span className="hidden md:inline">Admin Login</span>
             </button>
           ) : (
             <>
               <div className="hidden md:flex items-center gap-1 mr-4">
                  <button onClick={() => setView('ADMIN')} className="px-4 py-2 rounded-lg font-bold text-xs text-slate-600 hover:bg-slate-50">Dashboard</button>
               </div>
               <button 
                  onClick={onLogout} 
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 border border-red-100 rounded-lg font-bold hover:bg-red-100 transition-all text-xs md:text-sm"
               >
                  <LogOut size={16} /> <span className="hidden md:inline">Logout</span>
               </button>
             </>
           )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;