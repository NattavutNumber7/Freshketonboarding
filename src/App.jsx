import React, { useState, useEffect } from 'react';
import { User, Mail, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

// Import Components
import Navbar from './components/shared/Navbar';
import AdminDashboard from './components/admin/AdminDashboard';
import CreateJoiner from './components/admin/CreateJoiner';
import JoinerWizard from './components/joiner/JoinerWizard';

// Mock Admin Login Component (Internal)
const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in">
      <div className="fkt-card max-w-sm w-full text-center p-8 border-t-4 border-t-slate-800">
        <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Admin Portal</h2>
        <p className="text-slate-400 text-sm mb-8 font-inter">Enter password to manage employees</p>
        <div className="space-y-4">
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="fkt-input text-center tracking-widest"
            placeholder="Password (1234)"
          />
          <button 
            onClick={() => password === '1234' ? onLogin() : alert('Wrong Password')}
            className="w-full py-3.5 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:bg-slate-900 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Login <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Import Mock Data
import { MOCK_DB_INITIAL, generateId } from './utils/mockData';

const App = () => {
  // State
  const [view, setView] = useState('LOGIN'); // 'LOGIN', 'ADMIN_LOGIN', 'ADMIN', 'CREATE', 'JOINER'
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Data State (Mock with LocalStorage)
  const [employees, setEmployees] = useState(() => {
      const saved = localStorage.getItem('freshket_mock_db');
      return saved ? JSON.parse(saved) : MOCK_DB_INITIAL;
  });

  // Save data on change
  useEffect(() => {
      localStorage.setItem('freshket_mock_db', JSON.stringify(employees));
  }, [employees]);

  // Routing Logic (Handle URL Links)
  useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      const token = params.get('token');

      if (viewParam === 'JOINER' && token) {
          const emp = employees.find(e => e.accessToken === token);
          if (emp) {
              const now = new Date();
              const expire = new Date(emp.tokenExpiresAt);
              
              if (now > expire) {
                  alert("Link Expired");
                  window.history.replaceState({}, document.title, "/");
              } else if (emp.status === 'COMPLETED') {
                  alert("Process Completed");
                  window.history.replaceState({}, document.title, "/");
              } else {
                  setCurrentUser(emp);
                  setView('JOINER');
              }
          }
      }
  }, []);

  // --- Handlers ---
  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setView('ADMIN');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setView('LOGIN');
  };

  const handleAdminAction = async (type, emp) => {
    try {
      if (type === 'SEND_OTP' || type === 'RESEND_OTP') {
        const token = generateId();
        const sentTime = new Date().toISOString();
        const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
        
        setEmployees(prev => prev.map(e => e.id === emp.id ? {
            ...e, status: 'SENT', accessToken: token, tokenExpiresAt: expiresAt, sentAt: sentTime
        } : e));

        const link = `${window.location.origin}/?view=JOINER&token=${token}`;
        navigator.clipboard.writeText(link);
        alert(`Link Copied!\n${link}`);
      }
      else if (type === 'COPY_LINK') {
         const link = `${window.location.origin}/?view=JOINER&token=${emp.accessToken}`;
         navigator.clipboard.writeText(link);
         alert("Link Copied!");
      }
      else if (type === 'VERIFY') {
        if(confirm("Verify documents?")) {
          setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: 'VERIFIED', verifiedAt: new Date().toISOString() } : e));
        }
      }
      else if (type === 'SEND_WELCOME') {
        setEmployees(prev => prev.map(e => e.id === emp.id ? { ...e, status: 'COMPLETED', welcomeSentAt: new Date().toISOString() } : e));
        alert("Welcome email sent!");
      }
      else if (type === 'DELETE') {
        if(confirm(`Delete ${emp.employee.name}?`)) {
            setEmployees(prev => prev.filter(e => e.id !== emp.id));
        }
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleCreateEmployee = (data) => {
      const newEmp = {
        id: 'emp-' + generateId(),
        employee: { ...data },
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        submission: {}
      };
      setEmployees(prev => [newEmp, ...prev]);
      setView('ADMIN');
  };

  const handleJoinerLogin = (email) => {
    const emp = employees.find(e => e.employee.email === email);
    if (!emp) return alert("Not found");
    if (emp.status === 'DRAFT') return alert("Link not sent yet");
    
    if (['SENT', 'INCOMPLETE'].includes(emp.status)) {
        if (new Date() > new Date(emp.tokenExpiresAt)) return alert("Link expired");
    }

    setCurrentUser(emp);
    setView('JOINER');
  };
  
  const handleJoinerSubmit = (data, isComplete) => {
      setEmployees(prev => prev.map(e => e.id === currentUser.id ? {
          ...e,
          status: isComplete ? 'SUBMITTED' : 'INCOMPLETE',
          submission: { ...data, submittedAt: new Date().toISOString(), isDocsComplete: isComplete }
      } : e));
      
      alert("Submitted!");
      setCurrentUser(null);
      setView('LOGIN');
      window.history.replaceState({}, document.title, "/");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-20">
      <Navbar 
        isLoggedIn={isAdminLoggedIn} 
        onLogout={handleLogout}
        setView={setView}
        isAdmin={isAdminLoggedIn} // Compatible prop
        setIsAdmin={setIsAdminLoggedIn} // Compatible prop
        adminTab={view === 'ADMIN' ? 'dashboard' : 'create'} // Compatible prop
        setAdminTab={(tab) => setView(tab === 'dashboard' ? 'ADMIN' : 'CREATE')} // Compatible prop
        setStep={() => {}} // Compatible prop
      />

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        
        {view === 'ADMIN' && isAdminLoggedIn && (
          <AdminDashboard employees={employees} onCreate={() => setView('CREATE')} onAction={handleAdminAction} />
        )}

        {view === 'ADMIN_LOGIN' && (
           <AdminLogin onLogin={handleAdminLogin} />
        )}

        {view === 'CREATE' && isAdminLoggedIn && (
          <CreateJoiner onMockSubmit={handleCreateEmployee} isMock={true} onCreated={() => setView('ADMIN')} />
        )}

        {view === 'LOGIN' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in">
             <div className="fkt-card max-w-md w-full text-center p-8">
                <div className="w-16 h-16 bg-freshket-green/10 text-freshket-green rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <User size={32} />
                </div>
                <h1 className="text-2xl font-black text-slate-800 mb-2">Welcome to Freshket!</h1>
                <p className="text-slate-400 text-sm mb-8">New Employee Onboarding</p>
                
                <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 mb-6 max-h-32 overflow-y-auto">
                  <p className="font-bold mb-2 uppercase tracking-wider text-slate-400">👇 Click email to test (Mock)</p>
                  <ul className="space-y-1.5">
                    {employees.map(e => (
                      <li key={e.id} className="cursor-pointer hover:text-freshket-green hover:underline flex justify-between" onClick={() => handleJoinerLogin(e.employee.email)}>
                        <span>{e.employee.email}</span>
                        <span className="text-[10px] bg-white border px-1.5 rounded">{e.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-400" size={18}/>
                  <input id="login-email" type="email" placeholder="name@freshket.com" className="fkt-input pl-12" />
                </div>
                <button 
                  onClick={() => handleJoinerLogin(document.getElementById('login-email').value)}
                  className="w-full mt-4 fkt-btn flex items-center justify-center gap-2"
                >
                  Login <ArrowRight size={18}/>
                </button>
             </div>
          </div>
        )}

        {view === 'JOINER' && currentUser && (
          <JoinerWizard 
            employeeData={currentUser} 
            onSubmit={handleJoinerSubmit}
            onExit={() => { setView('LOGIN'); setCurrentUser(null); window.history.replaceState({}, document.title, "/"); }}
          />
        )}

      </main>
    </div>
  );
};

export default App;