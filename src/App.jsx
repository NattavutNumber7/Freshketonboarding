import React, { useState, useEffect } from 'react';
import { User, Mail, Loader2 } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

// Import Components
import Navbar from './components/shared/Navbar';
import AdminDashboard from './components/admin/AdminDashboard';
import JoinerWizard from './components/joiner/JoinerWizard';
import CreateJoiner from './components/admin/CreateJoiner';

const App = () => {
  const [view, setView] = useState('ADMIN'); // 'ADMIN', 'CREATE', 'LOGIN', 'JOINER'
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // --- Realtime Data Sync (Firestore) ---
  useEffect(() => {
    // ดึงข้อมูล Realtime จาก Collection 'onboardings'
    const q = query(collection(db, "onboardings"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmployees(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- Actions ---
  
  // Admin: จัดการสถานะต่างๆ
  const handleAdminAction = async (type, emp) => {
    try {
      const empRef = doc(db, "onboardings", emp.id);

      if (type === 'SEND_OTP' || type === 'RESEND_OTP') {
        // สร้าง Token และกำหนดเวลาหมดอายุ 8 ชม.
        const token = Math.random().toString(36).substr(2, 9);
        const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
        
        await updateDoc(empRef, {
          status: 'SENT',
          accessToken: token,
          tokenExpiresAt: expiresAt
        });
        alert(`ส่งลิงก์เรียบร้อยแล้ว!\n(จำลอง) Link: freshket.com/join/${token}`);
      }
      
      else if (type === 'VERIFY') {
        if(confirm("คุณได้ตรวจสอบข้อมูลและเอกสารทั้งหมดแล้วใช่หรือไม่?")) {
          await updateDoc(empRef, { 
            status: 'VERIFIED', 
            verifiedAt: new Date().toISOString() 
          });
        }
      }
      
      else if (type === 'SEND_WELCOME') {
        await updateDoc(empRef, { 
          status: 'COMPLETED', 
          welcomeSentAt: new Date().toISOString() 
        });
        alert("ส่งอีเมลต้อนรับเรียบร้อยแล้ว!");
      }
    } catch (error) {
      console.error("Action Error:", error);
      alert("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  // Joiner: จำลองการ Login (ในของจริงคือการคลิกลิงก์จากอีเมล)
  const handleJoinerLogin = (email) => {
    const emp = employees.find(e => e.employee.email === email);
    
    if (!emp) {
      alert("ไม่พบข้อมูลพนักงานในระบบ");
      return;
    }

    if (emp.status === 'DRAFT') {
      alert("HR ยังไม่ได้ส่งลิงก์ให้คุณ");
      return;
    }

    // Check 8-Hours Expiry Logic
    if (emp.status === 'SENT' || emp.status === 'SUBMITTED' || emp.status === 'INCOMPLETE') {
      const now = new Date();
      const expire = new Date(emp.tokenExpiresAt);
      if (now > expire) {
        alert("ลิงก์หมดอายุแล้ว (เกิน 8 ชั่วโมง) กรุณาติดต่อ HR เพื่อขอลิงก์ใหม่");
        return;
      }
    }

    setCurrentUser(emp);
    setView('JOINER');
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={40}/></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-20">
      <Navbar 
        isAdmin={view === 'ADMIN' || view === 'CREATE'} 
        setIsAdmin={() => {}} // Dummy prop
        adminTab={view === 'CREATE' ? 'create' : 'dashboard'}
        setAdminTab={(tab) => setView(tab === 'create' ? 'CREATE' : 'ADMIN')}
        setStep={() => {}} 
      />

      <main className="max-w-6xl mx-auto p-4 md:p-8 md:pt-10">
        
        {/* --- ADMIN DASHBOARD --- */}
        {view === 'ADMIN' && (
          <AdminDashboard 
            employees={employees} 
            onCreate={() => setView('CREATE')} 
            onAction={handleAdminAction} 
          />
        )}

        {/* --- CREATE NEW EMPLOYEE --- */}
        {view === 'CREATE' && (
          <CreateJoiner onCreated={() => setView('ADMIN')} />
        )}

        {/* --- MOCK LOGIN SCREEN --- */}
        {view === 'LOGIN' && (
          <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">ยินดีต้อนรับสู่ Freshket!</h1>
              <p className="text-slate-400 text-sm mt-2">กรุณาระบุอีเมลเพื่อเข้าสู่ระบบ (จำลองการกด Link)</p>
            </div>
            
            {/* List of emails for testing convenience */}
            <div className="text-left bg-slate-50 p-3 rounded border text-xs text-slate-500 mb-4">
              <strong>Email สำหรับทดสอบ (จากฐานข้อมูลจริง):</strong>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                {employees.map(e => (
                  <li key={e.id} className="cursor-pointer hover:text-emerald-600" onClick={() => handleJoinerLogin(e.employee.email)}>
                    {e.employee.email} ({e.status})
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <input 
                id="login-email"
                type="email" 
                placeholder="name@freshket.com" 
                className="w-full p-3 border rounded-lg pl-10" 
              />
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={18}/>
            </div>
            <button 
              onClick={() => handleJoinerLogin(document.getElementById('login-email').value)}
              className="w-full py-3 bg-emerald-500 text-white font-bold rounded-lg shadow-lg hover:scale-[1.02] transition-all"
            >
              เข้าสู่ระบบ (Access Link)
            </button>
            <div className="text-center mt-4">
               <button onClick={() => setView('ADMIN')} className="text-xs text-slate-400 hover:underline">กลับไปหน้า Admin</button>
            </div>
          </div>
        )}

        {/* --- EMPLOYEE WIZARD --- */}
        {view === 'JOINER' && currentUser && (
          <JoinerWizard 
            employeeData={currentUser} 
            onExit={() => { setView('LOGIN'); setCurrentUser(null); }}
          />
        )}

        {/* View Switcher for Demo purpose */}
        {view !== 'LOGIN' && view !== 'JOINER' && (
           <div className="fixed bottom-4 right-4 bg-white p-2 rounded-lg shadow-lg border border-slate-200 z-50">
              <button onClick={() => setView('LOGIN')} className="text-xs font-bold text-slate-500 hover:text-emerald-500">
                 Switch to Employee View
              </button>
           </div>
        )}

      </main>
    </div>
  );
};

export default App;