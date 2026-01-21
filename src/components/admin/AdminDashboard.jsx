import React from 'react';
import { 
  Users, Clock, CheckCircle, FileText, LayoutDashboard, 
  Search, Plus, Send, Copy, Eye, Mail, Trash2, Calendar
} from 'lucide-react';
import { Card, Button, Badge } from '../shared/UIComponents';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <Card className="p-5 flex items-center justify-between group hover:-translate-y-1 transition-transform cursor-default">
    <div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-3xl font-black text-slate-800">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} bg-opacity-10 text-opacity-100 group-hover:scale-110 transition-transform`}>
      <Icon size={24} className={color.replace('bg-', 'text-')} />
    </div>
  </Card>
);

const AdminDashboard = ({ employees, onCreate, onAction }) => {
  const stats = {
    total: employees.length,
    pending: employees.filter(e => ['SENT', 'INCOMPLETE', 'SUBMITTED'].includes(e.status)).length,
    completed: employees.filter(e => e.status === 'COMPLETED').length,
    new: employees.filter(e => e.status === 'DRAFT').length
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Staff" value={stats.total} icon={Users} color="bg-blue-500" />
        <StatCard title="In Process" value={stats.pending} icon={Clock} color="bg-orange-500" />
        <StatCard title="Onboarded" value={stats.completed} icon={CheckCircle} color="bg-emerald-500" />
        <StatCard title="Drafts" value={stats.new} icon={FileText} color="bg-slate-500" />
      </div>

      {/* Main Table Card */}
      <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <LayoutDashboard className="text-[#00ce7c]" /> Employee Overview
            </h2>
            <p className="text-sm text-slate-400 mt-1">Manage onboarding status and documents</p>
          </div>
          <Button onClick={onCreate} variant="secondary">
            <Plus size={18} /> Add New Employee
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 text-slate-400 text-[11px] uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4 text-left">Employee</th>
                <th className="px-6 py-4 text-left">Role & Dept</th>
                <th className="px-6 py-4 text-left">Timeline</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center"><Search size={24} className="opacity-50"/></div>
                      <p>No employees found. Start by adding one!</p>
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map(emp => (
                  <tr key={emp.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold border border-white shadow-sm">
                          {emp.employee.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700">{emp.employee.name}</p>
                          <p className="text-xs text-slate-400">{emp.employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-slate-700">{emp.employee.position}</p>
                      <p className="text-xs text-slate-400">{emp.employee.department}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-slate-500 flex items-center gap-1.5">
                          <Calendar size={12}/> Start: {new Date(emp.employee.startDate).toLocaleDateString('en-GB')}
                        </span>
                        {emp.sentAt && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                            <Send size={10}/> Sent: {new Date(emp.sentAt).toLocaleDateString('en-GB')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={emp.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                         {/* Dynamic Actions Based on Status */}
                         {emp.status === 'DRAFT' && (
                            <Button variant="primary" className="!px-3 !py-1.5 !text-xs" onClick={() => onAction('SEND_OTP', emp)}>
                               <Send size={12} /> Send Invite
                            </Button>
                         )}
                         {(emp.status === 'SENT' || emp.status === 'INCOMPLETE') && (
                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="!px-2 !py-1.5 !text-xs" onClick={() => onAction('COPY_LINK', emp)} title="Copy Link">
                                    <Copy size={12} />
                                </Button>
                                <Button variant="ghost" className="!px-2 !py-1.5 !text-xs text-orange-500" onClick={() => onAction('RESEND_OTP', emp)} title="Resend">
                                    <Send size={12} />
                                </Button>
                            </div>
                         )}
                         {emp.status === 'SUBMITTED' && (
                            <Button variant="secondary" className="!px-3 !py-1.5 !text-xs !bg-purple-600 hover:!bg-purple-700" onClick={() => onAction('VERIFY', emp)}>
                               <Eye size={12} /> Review
                            </Button>
                         )}
                         {emp.status === 'VERIFIED' && (
                             <Button variant="primary" className="!px-3 !py-1.5 !text-xs" onClick={() => onAction('SEND_WELCOME', emp)}>
                                <Mail size={12} /> Onboard
                             </Button>
                         )}
                         {emp.status === 'COMPLETED' && (
                             <span className="text-xs text-emerald-500 font-bold flex items-center gap-1"><CheckCircle size={14}/> Done</span>
                         )}

                         <button onClick={() => onAction('DELETE', emp)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ml-2">
                             <Trash2 size={14}/>
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;