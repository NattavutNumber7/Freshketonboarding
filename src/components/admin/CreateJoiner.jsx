import React, { useState } from 'react';
import { UserPlus, Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { InputLabel, SectionHeader } from '../shared/UIComponents';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const CreateJoiner = ({ onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    position: '',
    department: 'Technology & Innovation',
    startDate: ''
  });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.position || !form.startDate) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setLoading(true);
    try {
      // 1. Save to Firestore with 'DRAFT' status
      await addDoc(collection(db, "onboardings"), {
        employee: { ...form },
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        submission: {}
      });
      
      alert("สร้างข้อมูลพนักงานสำเร็จ! (สถานะ: Draft)");
      onCreated();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
      <div className="fkt-card p-10">
        <SectionHeader icon={UserPlus} title="สร้างพนักงานใหม่ (Initiation)" sub="Employee Information" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
           <div className="space-y-1.5 col-span-full">
             <InputLabel label="ชื่อ-นามสกุล (พนักงาน)" required />
             <input 
                type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                placeholder="ระบุชื่อภาษาไทยหรืออังกฤษ" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white" 
             />
           </div>
           <div className="space-y-1.5 col-span-full">
             <InputLabel label="อีเมลสำหรับส่งลิงก์" required />
             <input 
                type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                placeholder="example@freshket.com" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-inter focus:bg-white" 
             />
           </div>
           <div className="space-y-1.5">
             <InputLabel label="ตำแหน่งงาน (Position)" required />
             <input 
                type="text" value={form.position} onChange={e => setForm({...form, position: e.target.value})}
                placeholder="เช่น Software Engineer" 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white" 
             />
           </div>
           <div className="space-y-1.5">
             <InputLabel label="แผนก (Department)" required />
             <select 
                value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
             >
                <option>Technology & Innovation</option>
                <option>Operations & Supply Chain</option>
                <option>Commercial & Marketing</option>
                <option>People Experience (HR)</option>
                <option>Accounting & Finance</option>
             </select>
           </div>
           <div className="space-y-1.5 col-span-full">
             <InputLabel label="วันเริ่มงาน (Start Date)" required />
             <div className="relative">
               <input 
                  type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-inter focus:bg-white" 
               />
               <Calendar className="absolute right-4 top-3.5 text-slate-300 pointer-events-none" size={20} />
             </div>
           </div>
        </div>

        <div className="pt-8">
          <button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full py-4 bg-[#00ce7c] text-white rounded-xl font-bold shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-3 disabled:opacity-70"
          >
             {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle size={24} /> บันทึกและสร้าง Draft</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateJoiner;