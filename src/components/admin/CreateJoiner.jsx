import React, { useState } from 'react';
import { UserPlus, Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { InputLabel, SectionHeader } from '../shared/UIComponents';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const CreateJoiner = ({ onCreated }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', position: '', department: 'Technology & Innovation', startDate: ''
  });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.position || !form.startDate) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน"); return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "onboardings"), {
        employee: { ...form },
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        submission: {}
      });
      alert("สร้างพนักงานสำเร็จ!");
      onCreated();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-4">
      <div className="fkt-card p-10">
        <SectionHeader icon={UserPlus} title="สร้างพนักงานใหม่" sub="Employee Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
           <div className="col-span-full space-y-1"><InputLabel label="ชื่อ-นามสกุล" required /><input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 border rounded-lg" /></div>
           <div className="col-span-full space-y-1"><InputLabel label="อีเมล" required /><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-3 border rounded-lg" /></div>
           <div className="space-y-1"><InputLabel label="ตำแหน่ง" required /><input type="text" value={form.position} onChange={e => setForm({...form, position: e.target.value})} className="w-full p-3 border rounded-lg" /></div>
           <div className="space-y-1"><InputLabel label="แผนก" required /><select value={form.department} onChange={e => setForm({...form, department: e.target.value})} className="w-full p-3 border rounded-lg"><option>Technology</option><option>Operations</option><option>Commercial</option><option>HR</option></select></div>
           <div className="col-span-full space-y-1"><InputLabel label="วันเริ่มงาน" required /><input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full p-3 border rounded-lg" /></div>
        </div>
        <div className="pt-8"><button onClick={handleSubmit} disabled={loading} className="w-full py-4 bg-[#00ce7c] text-white rounded-xl font-bold shadow-xl">{loading ? <Loader2 className="animate-spin mx-auto"/> : "บันทึกข้อมูล"}</button></div>
      </div>
    </div>
  );
};
export default CreateJoiner;