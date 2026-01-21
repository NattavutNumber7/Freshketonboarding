import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // รหัสผ่านจำลอง: 1234
    if (password === '1234') {
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in">
      <div className="fkt-card max-w-sm w-full text-center p-8 border-t-4 border-t-slate-800">
        <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShieldCheck size={32} />
        </div>
        
        <h2 className="text-2xl font-black text-slate-800 mb-2">Admin Portal</h2>
        <p className="text-slate-400 text-sm mb-8 font-inter">เข้าสู่ระบบเพื่อจัดการข้อมูลพนักงาน</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
            <input 
              type="password" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className={`fkt-input pl-12 font-inter tracking-widest ${error ? 'border-red-300 bg-red-50' : ''}`}
              placeholder="Enter Password (1234)"
              autoFocus
            />
          </div>
          
          {error && <p className="text-red-500 text-xs font-bold text-left pl-1">รหัสผ่านไม่ถูกต้อง (ลองใช้ 1234)</p>}

          <button 
            type="submit" 
            className="w-full py-3.5 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            เข้าสู่ระบบ <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;