import React, { useState, useEffect } from 'react';
import { User, Mail, ArrowRight, Loader2 } from 'lucide-react';

// Firebase Imports
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';

// Component Imports
import Navbar from './components/shared/Navbar';
import AdminDashboard from './components/admin/AdminDashboard';
import CreateJoiner from './components/admin/CreateJoiner';
import JoinerWizard from './components/joiner/JoinerWizard';
import AdminLogin from './components/admin/AdminLogin'; // ใช้ Component แยกแทนตัวเขียนสด

const App = () => {
  // --- State ---
  const [view, setView] = useState('LOGIN'); // 'LOGIN', 'ADMIN_LOGIN', 'ADMIN', 'CREATE', 'JOINER'
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // --- Helpers ---
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const generateToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  };

  // --- Real-time Data Sync ---
  useEffect(() => {
    const q = query(collection(db, 'onboardings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmployees(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching data:", error);
      showToast("Error connecting to database", "error");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Routing Logic (Handle URL Links) ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const token = params.get('token');

    if (viewParam === 'JOINER' && token) {
        // ต้องรอให้ employees โหลดเสร็จก่อนถึงจะเช็คได้
        if (!loading && employees.length > 0) {
            const emp = employees.find(e => e.accessToken === token);
            if (emp) {
                const now = new Date();
                const expire = new Date(emp.tokenExpiresAt);
                
                if (now > expire) {
                    showToast("Link Expired", "error");
                    window.history.replaceState({}, document.title, "/");
                } else if (emp.status === 'COMPLETED') {
                    showToast("Process Already Completed", "success");
                    window.history.replaceState({}, document.title, "/");
                } else {
                    setCurrentUser(emp);
                    setView('JOINER');
                }
            }
        }
    }
  }, [loading, employees]); // Re-run when data loads

  // --- Handlers ---
  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setView('ADMIN');
    showToast("Welcome back, Admin!");
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setView('LOGIN');
    showToast("Logged out successfully");
  };

  const handleAdminAction = async (type, emp) => {
    try {
      const empRef = doc(db, 'onboardings', emp.id);

      if (type === 'SEND_OTP' || type === 'RESEND_OTP') {
        const token =SBgenerateToken();
        const sentTime = new Date().toISOString();
        const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(); // 8 Hours
        
        await updateDoc(empRef, {
            status: 'SENT',
            accessToken: token,
            tokenExpiresAt: expiresAt,
            sentAt: sentTime
        });

        const link = `${window.location.origin}/?view=JOINER&token=${token}`;
        await navigator.clipboard.writeText(link);
        showToast("Link copied to clipboard!");
      }
      else if (type === 'COPY_LINK') {
         constQtlink = `${window.location.origin}/?view=JOINER&token=${emp.accessToken}`;
         await navigator.clipboard.writeText(link);
         showToast("Link copied!");
      }
      else if (type === 'VERIFY') {
        // ในสถานการณ์จริงอาจจะมี Modal ยืนยัน แต่ขอใช้ confirm ไปก่อนเพื่อความเร็วครับ
        // หรือจะเปลี่ยนเป็น Custom Modal ก็ได้ แต่เพื่อความกระชับในไฟล์เดียว
        if(confirm("Confirm documents verification?")) {
            await updateDoc(empRef, {
                status: 'VERIFIED',
                verifiedAt: new Date().toISOString()
            });
            showToast("Employee verified!");
        }
      }
      else if (type === 'SEND_WELCOME') {
        await updateDoc(empRef, {
            status: 'COMPLETED',
            welcomeSentAt: new Date().toISOString()
        });
        showToast("Welcome email sent! (Simulation)");
      }
      else if (type === 'DELETE') {
        if(confirm(`Delete ${emp.employee.name}? This cannot be undone.`)) {
            await deleteDoc(empRef);
            showToast("Employee deleted", "error");
        }
      }
    } catch (error) {
      console.error(error);
      showToast("Action failed: " + error.message, "error");
    }
  };

  const handleJoinerLogin = (email) => {
    const emp = employees.find(e => e.employee.email === email);
    
    if (!emp) {
        return showToast("Email not found in system", "error");
    }
    if (emp.status === 'DRAFT') {
        return showToast("Access link has not been sent yet", "error");
    }
    if (['SENT', 'INCOMPLETE'].includes(emp.status)) {
        if (new Date() > new Date(emp.tokenExpiresAt)) {
            return showToast("Access link has expired", "error");
        }
    }

    // Login สำเร็จ (ในเคส Mock Login)
    setCurrentUser(emp);
    setView('JOINER');
  };
  
  // CreateJoiner และ JoinerWizard จัดการ Save ข้อมูลเองแล้ว เราแค่จัดการ View
  const handleCreated = () => {
    setView('ADMIN');
    showToast("New employee created successfully!");
  };

  const handleJoinerSubmit = () => {
      showToast("Information submitted successfully!");
      setCurrentUser(null);
      setView('LOGIN');
      window.history.replaceState({}, document.title, "/");
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-20 relative">
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 px-6 py-4 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] text-white font-bold animate-in fade-in slide-in-from-top-4 z-[100] flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-500' : 'bg-slate-800'}`}>
          {toast.type === 'error' ? <div className="w-2 h-2 bg-white rounded-full animate-pulse"/> : <div className="w-2 h-2 bg-[#00ce7c] rounded-full"/>}
          {toast.message}
        </div>
      )}

      <Navbar 
        isLoggedIn={isAdminLoggedIn} 
        onLogout={handleLogout}
        setView={setView}
      />

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        
        {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                <Loader2 className="animate-spin" size={40} />
                <p>Loading Data...</p>
            </div>
        )}

        {!loading && view === 'ADMIN' && isAdminLoggedIn && (
          <AdminDashboard 
            employees={employees} 
            onCreate={() => setView('CREATE')} 
            onAction={handleAdminAction} 
          />
        )}

        {view === 'ADMIN_LOGIN' && (
           <AdminLogin onLogin={handleAdminLogin} />
        )}

        {!loading && view === 'CREATE' && isAdminLoggedIn && (
          <CreateJoiner onCreated={handleCreated} />
        )}

        {!loading && view === 'LOGIN' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in">
             <div className="fkt-card max-w-md w-full text-center p-8">
                <div className="w-16 h-16 bg-freshket-green/10 text-freshket-green rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <User size={32} />
                </div>
                <h1 className="text-2xl font-black text-slate-800 mb-2">Welcome to Freshket!</h1>
                <p className="text-slate-400 text-sm mb-8">New Employee Onboarding</p>
                
                {/* Mock List for easier testing (Optional - can be removed for prod) */}
                <div className="text-left bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 mb-6 max-h-32 overflow-y-auto">
                  <p className="font-bold mb-2 uppercase tracking-wider text-slate-400">👇 Quick Access (Testing)</p>
                  <ul className="space-y-1.5">
                    {employees.length === 0 ? <li className="text-center py-2">No employees found</li> : employees.map(e => (
                      <li key={e.id} className="cursor-pointer hover:text-freshket-green hover:underline flex justify-between group" onClick={() => handleJoinerLogin(e.employee.email)}>
                        <span className="font-medium group-hover:translate-x-1 transition-transform">{e.employee.email}</span>
                        <span className={`text-[10px] px-1.5 rounded border ${e.status==='COMPLETED'?'bg-slate-800 text-white border-slate-800':'bg-white'}`}>{e.status}</span>
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

        {!loading && view === 'JOINER' && currentUser && (
          <JoinerWizard 
            employeeData={currentUser} 
            onExit={handleJoinerSubmit}
          />
        )}

      </main>
    </div>
  );
};

export default App;