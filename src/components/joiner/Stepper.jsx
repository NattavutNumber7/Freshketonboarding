import React from 'react';
import { ShieldCheck, User, MapPin, FileText, Check } from 'lucide-react';

const Stepper = ({ step }) => {
  const stepsData = [
    { id: 1, title: 'จ้างงาน', icon: ShieldCheck },
    { id: 2, title: 'ส่วนตัว', icon: User },
    { id: 3, title: 'ที่อยู่', icon: MapPin },
    { id: 4, title: 'เอกสาร', icon: FileText },
  ];
  return (
    <div className="max-w-3xl mx-auto px-6 mb-12 flex justify-between">
      {stepsData.map((s, idx) => (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center z-10">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
              step >= s.id ? 'bg-[#00ce7c] border-[#00ce7c] text-white' : 'bg-white border-slate-200 text-slate-300'
            }`}>
              {step > s.id ? <Check size={20} /> : <s.icon size={18} />}
            </div>
            <span className={`text-[11px] font-bold mt-2 uppercase tracking-widest ${step >= s.id ? 'text-[#00ce7c]' : 'text-slate-300'}`}>
              {s.title}
            </span>
          </div>
          {idx < stepsData.length - 1 && (
            <div className={`step-line ${step > s.id ? 'active' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;
