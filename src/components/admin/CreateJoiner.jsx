import React from 'react';
import { UserPlus, Calendar, CheckCircle } from 'lucide-react';
import { InputLabel, SectionHeader } from '../shared/UIComponents';

const CreateJoiner = ({ onCreated }) => (
  <div className="max-w-2xl mx-auto space-y-8 animate-in">
    <div className="fkt-card p-10">
      <SectionHeader icon={UserPlus} title="สร้างพนักงานใหม่และส่ง OTP" sub="Employment Information" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
         <div className="space-y-1.5 col-span-full">
           <InputLabel label="ชื่อ-นามสกุล (พนักงาน)" required />
           <input type="text" placeholder="ระบุชื่อภาษาไทยหรืออังกฤษ" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white" />
         </div>
         <div className="space-y-1.5 col-span-full">
           <InputLabel label="อีเมลสำหรับส่งลิงก์" required />
           <input type="email" placeholder="example@freshket.com" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-inter focus:bg-white" />
         </div>
         <div className="space-y-1.5">
           <InputLabel label="ตำแหน่งงาน (Position)" required />
           <input type="text" placeholder="เช่น Software Engineer" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white" />
         </div>
         <div className="space-y-1.5">
           <InputLabel label="แผนก (Department)" required />
           <select className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white">
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
             <input type="date" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-inter focus:bg-white" />
             <Calendar className="absolute right-4 top-3.5 text-slate-300 pointer-events-none" size={20} />
           </div>
         </div>
      </div>
      <div className="pt-8">
        <button onClick={onCreated} className="w-full py-5 bg-[#00ce7c] text-white rounded-xl font-bold shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-3">
           <CheckCircle size={24} /> สร้างลิงก์และส่ง OTP (Generate & Send)
        </button>
      </div>
    </div>
  </div>
);

export default CreateJoiner;
