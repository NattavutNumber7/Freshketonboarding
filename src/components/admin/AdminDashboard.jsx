import React from 'react';
import { UserPlus, Plus, Send, Clock, Eye, Mail, CheckCircle, Copy, Link as LinkIcon } from 'lucide-react';
import { Badge } from '../shared/UIComponents';

const ActionButtons = ({ emp, onAction }) => {
  // --- Status Logic ---
  
  if (emp.status === 'DRAFT') {
    return (
      <button onClick={() => onAction('SEND_OTP', emp)} className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ml-auto border border-blue-100">
        <Send size={12} /> Send Link
      </button>
    );
  }

  if (emp.status === 'SENT') {
    const isExpired = new Date() > new Date(emp.tokenExpiresAt);
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
            <button onClick={() => onAction('COPY_LINK', emp)} className="text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1" title="Copy Link">
                <Copy size={10} /> Copy
            </button>
            <div className={`text-xs flex items-center gap-1 ${isExpired ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                <Clock size={12} /> {isExpired ? 'Expired' : 'Waiting...'}
            </div>
        </div>
        {isExpired && (
          <button onClick={() => onAction('RESEND_OTP', emp)} className="text-orange-500 text-[10px] hover:underline font-bold">
            Resend Link
          </button>
        )}
      </div>
    );
  }

  if (['SUBMITTED', 'INCOMPLETE'].includes(emp.status)) {
    return (
      <button onClick={() => onAction('VERIFY', emp)} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ml-auto transition-all ${
        emp.status === 'INCOMPLETE' ? 'bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200' : 'bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200'
      }`}>
        <Eye size={12} /> {emp.status === 'INCOMPLETE' ? 'Review (Docs Missing)' : 'Verify Data'}
      </button>
    );
  }

  if (emp.status === 'VERIFIED') {
    return (
      <button onClick={() => onAction('SEND_WELCOME', emp)} className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 ml-auto border border-emerald-200">
        <Mail size={12} /> Send Welcome
      </button>
    );
  }

  return <span className="text-xs text-slate-300 font-bold flex items-center justify-end gap-1"><CheckCircle size={12}/> Done</span>;
};

const AdminDashboard = ({ employees, onCreate, onAction }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: 'Pending Action', v: employees.filter(e => ['SUBMITTED','INCOMPLETE','VERIFIED'].includes(e.status)).length, c: 'text-orange-500 bg-orange-50' },
          { l: 'Onboarding', v: employees.filter(e => e.status !== 'COMPLETED').length, c: 'text-blue-500 bg-blue-50' },
          { l: 'Completed', v: employees.filter(e => e.status === 'COMPLETED').length, c: 'text-emerald-500 bg-emerald-50' },
          { l: 'Total', v: employees.length, c: 'text-slate-600 bg-slate-100' },
        ].map((s,i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">{s.l}</span>
            <span className={`text-2xl font-black ${s.c} px-3 py-1 rounded-lg`}>{s.v}</span>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <h2 className="font-bold text-lg text-slate-700 flex items-center gap-2">
          <UserPlus className="text-emerald-500" size={20}/> รายชื่อพนักงาน (Mock Mode)
        </h2>
        <button onClick={onCreate} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-emerald-200">
          <Plus size={16} /> สร้างพนักงานใหม่
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-wider">
              <tr>
                <th className="p-4">พนักงาน</th>
                <th className="p-4">ตำแหน่ง / แผนก</th>
                <th className="p-4">ข้อมูลการส่ง (Sent Info)</th>
                <th className="p-4">สถานะ</th>
                <th className="p-4 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {employees.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-slate-400">ยังไม่มีข้อมูล</td></tr>
              ) : employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">
                        {emp.employee.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-700 text-sm">{emp.employee.name}</div>
                        <div className="text-xs text-slate-400">{emp.employee.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-600 text-xs">{emp.employee.position}</div>
                    <div className="text-[10px] text-slate-400 uppercase">{emp.employee.department}</div>
                  </td>
                  <td className="p-4">
                    {emp.sentAt ? (
                        <div className="text-xs text-slate-500">
                            <div className="font-bold flex items-center gap-1"><LinkIcon size={10}/> Sent At:</div>
                            {new Date(emp.sentAt).toLocaleString('th-TH', { 
                                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                        </div>
                    ) : (
                        <span className="text-xs text-slate-300">-</span>
                    )}
                  </td>
                  <td className="p-4"><Badge status={emp.status} /></td>
                  <td className="p-4 text-right">
                    <ActionButtons emp={emp} onAction={onAction} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;