import React, { useState, useEffect } from 'react';
import { User, Mail, Loader2, ArrowRight } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

// Import Components
import Navbar from './components/shared/Navbar';
import AdminDashboard from './components/admin/AdminDashboard';
import JoinerWizard from './components/joiner/JoinerWizard';
import CreateJoiner from './components/admin/CreateJoiner';

// Import Mock Data
import { MOCK_DB_INITIAL, generateId } from './utils/mockData';

const App = () => {
  const [view, setView] = useState('ADMIN'); // 'ADMIN', 'CREATE', 'LOGIN', 'JOINER'
  
  // 1. Initialize State from LocalStorage
  const [employees, setEmployees] = useState(() => {
      const saved = localStorage.getItem('freshket_mock_db');
      if (saved) {
          return JSON.parse(saved);
      }
      return MOCK_DB_INITIAL;
  });

  const [currentUser, setCurrentUser] = useState(null);

  // 2. Save to LocalStorage whenever state changes
  useEffect(() => {
      localStorage.setItem('freshket_mock_db', JSON.stringify(employees));
  }, [employees]);

  // 3. Routing Logic
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
                 alert("ลิงก์หมดอายุแล้ว (Link Expired)");
                 window.history.replaceState({}, document.title, "/");
                 setView('LOGIN');
             } else if (emp.status === 'COMPLETED') {
                 alert("รายการนี้เสร็จสมบูรณ์แล้ว");
                 window.history.replaceState({}, document.title, "/");
                 setView('LOGIN');
             } else {
                 setCurrentUser(emp);
                 setView('JOINER');
             }
          }
      }
  }, [employees]); // Add employees dependency to update when data changes

  // --- Mock Actions ---
  
  const handleAdminAction = async (type, emp) => {
    try {
      if (type === 'SEND_OTP' || type === 'RESEND_OTP') {
        const token = generateId();
        const sentTime = new Date().toISOString();
        const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
        
        setEmployees(prev => prev.map(e => e.id === emp.id ? {
            ...e,
            status: 'SENT',
            accessToken: token,
            tokenExpiresAt: expiresAt,
            sentAt: sentTime
        } : e));

        const link = `http://localhost:5173/?view=JOINER&token=${token}`;
        alert(`✅ ส่งลิงก์เรียบร้อย!\nToken: ${token}`);
      }
      
      else if (type === 'COPY_LINK') {
         const link = `http://localhost:5173/?view=JOINER&token=${emp.accessToken}`;
         navigator.clipboard.writeText(link).then(() => {
             alert(`คัดลอกลิงก์เรียบร้อย!\n\n${link}`);
         });
      }
      
      else if (type === 'VERIFY') {
        if(confirm("คุณได้ตรวจสอบข้อมูลและเอกสารทั้งหมดแล้วใช่หรือไม่?")) {
          setEmployees(prev => prev.map(e => e.id === emp.id ? { 
              ...e, 
              status: 'VERIFIED', 
              verifiedAt: new Date().toISOString() 
          } : e));
        }
      }
      
      else if (type === 'SEND_WELCOME') {
        setEmployees(prev => prev.map(e => e.id === emp.id ? { 
            ...e, 
            status: 'COMPLETED', 
            welcomeSentAt: new Date().toISOString() 
        } : e));
        alert("ส่งอีเมลต้อนรับเรียบร้อยแล้ว!");
      }

      // --- เพิ่ม Action สำหรับการลบข้อมูล ---
      else if (type === 'DELETE') {
        if(confirm(`คุณต้องการลบข้อมูลของ "${emp.employee.name}" ใช่หรือไม่?\n(การกระทำนี้ไม่สามารถเรียกคืนได้)`)) {
            setEmployees(prev => prev.filter(e => e.id !== emp.id));
            // ถ้าลบข้อมูลที่กำลังเปิดดูอยู่ (ในกรณีหายาก)
            if (currentUser && currentUser.id === emp.id) {
                setCurrentUser(null);
                setView('LOGIN');
            }
        }
      }

    } catch (error) {
      console.error("Action Error:", error);
      alert("เกิดข้อผิดพลาด: " + error.message);
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
      alert("สร้างพนักงานใหม่สำเร็จ! (Mock)");
      setView('ADMIN');
  }

  // Joiner Login Logic
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

    if (emp.status === 'SENT' || emp.status === 'INCOMPLETE') {
      const now = new Date();
      const expire = new Date(emp.tokenExpiresAt);
      if (now > expire) {
        alert("ลิงก์หมดอายุแล้ว");
        return;
      }
    } else if (emp.status === 'SUBMITTED' || emp.status === 'VERIFIED' || emp.status === 'COMPLETED') {
        alert("คุณได้ส่งข้อมูลครบถ้วนแล้ว อยู่ระหว่างการตรวจสอบ");
        return;
    }

    setCurrentUser(emp);
    setView('JOINER');
  };
  
  const handleJoinerSubmit = (data, isComplete) => {
      setEmployees(prev => prev.map(e => e.id === currentUser.id ? {
          ...e,
          status: isComplete ? 'SUBMITTED' : 'INCOMPLETE',
          submission: { 
              ...data, 
              submittedAt: new Date().toISOString(),
              isDocsComplete: isComplete 
          }
      } : e));
      
      alert("ส่งข้อมูลเรียบร้อยแล้ว!");
      setCurrentUser(null);
      setView('LOGIN');
      window.history.replaceState({}, document.title, "/");
  }

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-emerald-500" size={40}/></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 pb-20">
      <Navbar 
        isAdmin={view === 'ADMIN' || view === 'CREATE'} 
        setIsAdmin={() => {}} 
        adminTab={view === 'CREATE' ? 'create' : 'dashboard'}
        setAdminTab={(tab) => setView(tab === 'create' ? 'CREATE' : 'ADMIN')}
        setStep={() => {}} 
      />

      <main className="max-w-6xl mx-auto p-4 md:p-8 md:pt-10">
        
        {view === 'ADMIN' && (
          <AdminDashboard 
            employees={employees} 
            onCreate={() => setView('CREATE')} 
            onAction={handleAdminAction} 
          />
        )}

        {view === 'CREATE' && (
          <CreateJoiner onMockSubmit={handleCreateEmployee} isMock={true} />
        )}

        {view === 'LOGIN' && (
          <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">ยินดีต้อนรับสู่ Freshket!</h1>
              <p className="text-slate-400 text-sm mt-2">กรุณาระบุอีเมลเพื่อเข้าสู่ระบบ</p>
            </div>
            
            <div className="text-left bg-slate-50 p-3 rounded border text-xs text-slate-500 mb-4 overflow-y-auto max-h-40">
              <strong>Email สำหรับทดสอบ:</strong>
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
              className="w-full py-3 bg-emerald-500 text-white font-bold rounded-lg shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              เข้าสู่ระบบ <ArrowRight size={18}/>
            </button>
            <div className="text-center mt-4">
               <button onClick={() => setView('ADMIN')} className="text-xs text-slate-400 hover:underline">กลับไปหน้า Admin</button>
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