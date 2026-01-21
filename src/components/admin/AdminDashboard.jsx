import React from 'react';
import { UserPlus, Plus, Send, Clock, Eye, Mail, CheckCircle, Copy, Link as LinkIcon, Trash2 } from 'lucide-react';
import { Badge } from '../shared/UIComponents';

const ActionButtons = ({ emp, onAction }) => {
  let content;
  if (emp.status === 'DRAFT') {
    content = <button onClick={() => onAction('SEND_OTP', emp)} className="text-blue-600 bg-blue-50 px-3 py-1 rounded text-xs font-bold flex gap-1"><Send size={12}/> Send Link</button>;
  } else if (emp.status === 'SENT') {
    const isExpired = new Date() > new Date(emp.tokenExpiresAt);
    content = (
      <div className="flex flex-col items-end gap-1">
        <div className="flex gap-2">
            <button onClick={() => onAction('COPY_LINK', emp)} className="text-slate-500 border px-2 py-1 rounded text-[10px] flex gap-1"><Copy size={10}/> Copy</button>
            <span className={`text-xs ${isExpired?'text-red-500':'text-slate-400'}`}>{isExpired?'Expired':'Waiting'}</span>
        </div>
        {isExpired && <button onClick={() => onAction('RESEND_OTP', emp)} className="text-orange-500 text-[10px] underline">Resend</button>}
      </div>
    );
  } else if (['SUBMITTED', 'INCOMPLETE'].includes(emp.status)) {
    content = <button onClick={() => onAction('VERIFY', emp)} className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-xs font-bold flex gap-1"><Eye size={12}/> Verify</button>;
  } else if (emp.status === 'VERIFIED') {
    content = <button onClick={() => onAction('SEND_WELCOME', emp)} className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded text-xs font-bold flex gap-1"><Mail size={12}/> Welcome</button>;
  } else {
    content = <span className="text-xs text-slate-300 flex gap-1"><CheckCircle size={12}/> Done</span>;
  }

  return (
      <div className="flex items-center justify-end gap-3">
          {content}
          <button onClick={() => onAction('DELETE', emp)} className="p-1.5 text-slate-300 hover:text-red-500 bg-slate-50 rounded"><Trash2 size={14}/></button>
      </div>
  );
};

const AdminDashboard = ({ employees, onCreate, onAction }) => (
  <div className="space-y-8 animate-in">
    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
        <h2 className="font-bold text-lg flex gap-2"><UserPlus className="text-emerald-500"/> พนักงานทั้งหมด</h2>
        <button onClick={onCreate} className="bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold flex gap-2"><Plus size={16}/> เพิ่มพนักงาน</button>
    </div>
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-bold"><tr><th className="p-4">Name</th><th className="p-4">Position</th><th className="p-4">Sent At</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
            <tbody className="divide-y">
                {employees.map(emp => (
                    <tr key={emp.id} className="hover:bg-slate-50">
                        <td className="p-4 font-bold">{emp.employee.name}<br/><span className="text-xs text-slate-400 font-normal">{emp.employee.email}</span></td>
                        <td className="p-4 text-sm">{emp.employee.position}</td>
                        <td className="p-4 text-xs text-slate-500">{emp.sentAt ? new Date(emp.sentAt).toLocaleString('th-TH') : '-'}</td>
                        <td className="p-4"><Badge status={emp.status}/></td>
                        <td className="p-4 text-right"><ActionButtons emp={emp} onAction={onAction}/></td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  </div>
);
export default AdminDashboard;