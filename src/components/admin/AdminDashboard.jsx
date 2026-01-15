import React from 'react';
import { User, AlertCircle, Eye, CheckCircle, Search, Filter, Phone as PhoneIcon, Mail } from 'lucide-react';

const AdminDashboard = ({ employees, onReview, onSendOTP, onSendWelcome }) => (
  <div className="space-y-8 animate-in">
    {/* Stats Cards Section */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { label: 'Total', count: 65, color: 'bg-slate-100 text-slate-600', icon: User },
        { label: 'Incomplete', count: 12, color: 'bg-orange-50 text-[#F37021]', icon: AlertCircle },
        { label: 'Pending Review', count: 5, color: 'bg-blue-50 text-blue-500', icon: Eye },
        { label: 'Verified', count: 48, color: 'bg-emerald-50 text-[#00ce7c]', icon: CheckCircle },
      ].map((stat, i) => (
        <div key={i} className="fkt-card flex items-center gap-5">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
            <stat.icon size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            <p className="text-3xl font-bold text-slate-800">{stat.count}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Table Section */}
    <div className="fkt-card border-none overflow-hidden p-0">
      <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="font-bold text-lg text-slate-800">รายชื่อพนักงานใหม่ (New Joiners)</h3>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-auto">
             <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
             <input type="text" placeholder="ค้นหาชื่อ..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm outline-none w-full" />
          </div>
          <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 hover:bg-slate-100 transition-all"><Filter size={18} /></button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">พนักงาน</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">ตำแหน่ง / แผนก</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">การดำเนินการ</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">สถานะ</th>
              <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right whitespace-nowrap">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {employees.map((emp, i) => (
              <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                <td className="p-6 whitespace-nowrap">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#00ce7c] flex items-center justify-center font-bold text-xs uppercase">{emp.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-slate-700">{emp.name}</p>
                        <p className="text-xs text-slate-400 font-inter">{emp.email}</p>
                      </div>
                   </div>
                </td>
                <td className="p-6 whitespace-nowrap">
                  <p className="text-sm font-bold text-slate-600">{emp.position}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{emp.department}</p>
                </td>
                <td className="p-6 text-center whitespace-nowrap">
                   <div className="flex justify-center gap-2">
                      <button 
                        disabled={emp.status !== 'Incomplete' || emp.otpSent}
                        onClick={() => onSendOTP(i)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                          emp.status === 'Incomplete' && !emp.otpSent 
                          ? 'bg-white border-blue-200 text-blue-600 hover:bg-blue-50' 
                          : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                        }`}
                      >
                        <PhoneIcon size={12} /> {emp.otpSent ? 'OTP SENT' : 'SEND OTP'}
                      </button>

                      {emp.status === 'Verified' && (
                        <button 
                          onClick={() => onSendWelcome(emp.name)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-white border-[#00ce7c] text-[#00ce7c] hover:bg-emerald-50 transition-all border"
                        >
                          <Mail size={12} /> SEND WELCOME
                        </button>
                      )}
                   </div>
                </td>
                <td className="p-6 whitespace-nowrap">
                  <span className={`status-pill ${
                    emp.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 
                    emp.status === 'Pending' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {emp.status}
                  </span>
                </td>
                <td className="p-6 text-right whitespace-nowrap">
                  <button className="p-2.5 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-[#00ce7c] hover:border-[#00ce7c] transition-all">
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
