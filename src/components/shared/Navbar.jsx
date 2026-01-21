import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from './UIComponents';

const Navbar = ({ isLoggedIn, onLogout, setView, currentView }) => (
  <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
    <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
      <div 
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={() => setView(isLoggedIn ? 'ADMIN' : 'LOGIN')}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[#00ce7c] blur-lg opacity-20 rounded-lg group-hover:opacity-40 transition-opacity"></div>
          <div className={`relative w-10 h-10 rounded-xl flex items-center justify-center text-white font-black shadow-lg transition-transform group-hover:scale-105 ${isLoggedIn ? 'bg-slate-800' : 'bg-gradient-to-br from-[#00ce7c] to-[#00b56d]'}`}>
            FK
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 leading-none">Freshket</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{isLoggedIn ? 'Admin Portal' : 'Onboarding'}</span>
        </div>
      </div>
      
      {isLoggedIn && (
        <div className="flex items-center gap-2">
          <div className="hidden md:flex bg-slate-100 p-1 rounded-xl mr-2">
             <button onClick={() => setView('ADMIN')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${currentView === 'ADMIN' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Dashboard</button>
             <button onClick={() => setView('CREATE')} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${currentView === 'CREATE' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>New Hire</button>
          </div>
          <Button variant="ghost" onClick={onLogout} className="!px-3 !py-2">
            <LogOut size={18} />
          </Button>
        </div>
      )}
    </div>
  </nav>
);

export default Navbar;