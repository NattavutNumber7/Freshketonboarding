import React, { useState } from 'react';
import { 
  ShieldCheck, Check, User, MapPin, FileText, Info, Upload, 
  CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Loader2 
} from 'lucide-react';
import { InputLabel } from '../shared/UIComponents';
import AddressSection from './AddressSection';
import Stepper from './Stepper';

const JoinerWizard = ({ employeeData, onSubmit, onExit }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [personal, setPersonal] = useState({ prefix: 'นาย', firstName: '', lastName: '', phone: '', dob: '' });
  const [address, setAddress] = useState({ 
    idAddress: { zip: '', houseNo: '', soiStreet: '', subDistrict: '', district: '', province: '' },
    currentAddress: { zip: '', houseNo: '', soiStreet: '', subDistrict: '', district: '', province: '' },
    sameAsId: false 
  });
  const [documents, setDocuments] = useState({ idCard: null, bankBook: null });

  // --- Handlers ---
  const handleFile = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZipChange = async (zip, type, setAddrState) => {
    // Logic หาที่อยู่จาก Zip (Mock)
    setAddrState(prev => ({ ...prev, [type]: { ...prev[type], zip } }));
  };

  const handleFinalSubmit = async () => {
    const isComplete = documents.idCard && documents.bankBook;
    
    // Incomplete Logic: ถามยืนยันถ้าเอกสารไม่ครบ
    if (!isComplete) {
      const confirmMsg = "⚠️ เอกสารยังไม่ครบถ้วน!\n\nคุณต้องการส่งข้อมูลก่อนหรือไม่? (สถานะจะเป็น Incomplete)\nAdmin จะทำการตรวจสอบและอาจขอให้ส่งเพิ่มเติมภายหลัง";
      if (!window.confirm(confirmMsg)) return;
    } else {
      if (!window.confirm("ยืนยันการส่งข้อมูล?")) return;
    }

    setLoading(true);
    
    // Mock Submit
    setTimeout(() => {
        onSubmit({
          personal,
          address,
          documents,
        }, isComplete);
        setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Stepper step={step} />

      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-xl shadow-slate-200/50 mt-8">
        
        {/* Step 1: Review Info */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><ShieldCheck className="text-emerald-500"/> 1. ตรวจสอบข้อมูลการจ้างงาน</h2>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-slate-400 font-bold uppercase">ชื่อ-นามสกุล</p><p className="font-bold text-slate-700">{employeeData.employee.name}</p></div>
                <div><p className="text-xs text-slate-400 font-bold uppercase">อีเมล</p><p className="font-bold text-slate-700">{employeeData.employee.email}</p></div>
                <div><p className="text-xs text-slate-400 font-bold uppercase">ตำแหน่ง</p><p className="font-bold text-slate-700">{employeeData.employee.position}</p></div>
                <div><p className="text-xs text-slate-400 font-bold uppercase">แผนก</p><p className="font-bold text-slate-700">{employeeData.employee.department}</p></div>
                <div><p className="text-xs text-slate-400 font-bold uppercase">วันเริ่มงาน</p><p className="font-bold text-emerald-600">{new Date(employeeData.employee.startDate).toLocaleDateString('th-TH')}</p></div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
              <Info className="shrink-0 mt-0.5" size={16}/>
              <p>ข้อมูลข้างต้นถูกระบุโดย HR หากไม่ถูกต้อง กรุณาติดต่อ People Team ก่อนดำเนินการต่อ</p>
            </div>
          </div>
        )}

        {/* Step 2: Personal Info */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><User className="text-emerald-500"/> 2. ข้อมูลส่วนตัว</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div><InputLabel label="ชื่อจริง (ไทย)" required /><input type="text" value={personal.firstName} onChange={e=>setPersonal({...personal, firstName: e.target.value})} className="w-full p-3 border rounded-lg" /></div>
               <div><InputLabel label="นามสกุล (ไทย)" required /><input type="text" value={personal.lastName} onChange={e=>setPersonal({...personal, lastName: e.target.value})} className="w-full p-3 border rounded-lg" /></div>
               <div><InputLabel label="เบอร์โทรศัพท์" required /><input type="tel" value={personal.phone} onChange={e=>setPersonal({...personal, phone: e.target.value})} className="w-full p-3 border rounded-lg" placeholder="08x-xxx-xxxx"/></div>
               <div><InputLabel label="วันเกิด" required /><input type="date" value={personal.dob} onChange={e=>setPersonal({...personal, dob: e.target.value})} className="w-full p-3 border rounded-lg"/></div>
            </div>
          </div>
        )}

        {/* Step 3: Address */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><MapPin className="text-emerald-500"/> 3. ที่อยู่ตามบัตรประชาชน</h2>
             <AddressSection 
                type="id" title="ที่อยู่ตามบัตรประชาชน" 
                data={address.idAddress} 
                onZipChange={(z, t) => handleZipChange(z, t, setAddress)} 
                addressOptions={[]} // Mock empty for now
                onDetailChange={(f, v, t) => setAddress(p => ({ ...p, [t === 'id' ? 'idAddress' : 'currentAddress']: { ...p[t === 'id' ? 'idAddress' : 'currentAddress'], [f]: v } }))}
             />
             
             <div className="flex items-center gap-2 my-4">
                <input type="checkbox" id="sameAddress" checked={address.sameAsId} onChange={(e) => setAddress(p => ({ ...p, sameAsId: e.target.checked }))} className="w-5 h-5 accent-emerald-500" />
                <label htmlFor="sameAddress" className="font-bold text-slate-700">ใช้ที่อยู่เดียวกับบัตรประชาชน</label>
             </div>

             {!address.sameAsId && (
               <AddressSection 
                  type="current" title="ที่อยู่ปัจจุบัน" 
                  data={address.currentAddress} 
                  onZipChange={(z, t) => handleZipChange(z, t, setAddress)} 
                  addressOptions={[]}
                  onDetailChange={(f, v, t) => setAddress(p => ({ ...p, [t === 'id' ? 'idAddress' : 'currentAddress']: { ...p[t === 'id' ? 'idAddress' : 'currentAddress'], [f]: v } }))}
               />
             )}
          </div>
        )}

        {/* Step 4: Documents */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2"><FileText className="text-emerald-500"/> 4. อัปโหลดเอกสารสำคัญ</h2>
            
            {[
              { id: 'idCard', l: 'สำเนาบัตรประชาชน' },
              { id: 'bankBook', l: 'หน้าสมุดบัญชีธนาคาร' }
            ].map((doc) => (
              <div key={doc.id} className={`p-4 border-2 border-dashed rounded-xl transition-all ${documents[doc.id] ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {documents[doc.id] ? <CheckCircle className="text-emerald-500"/> : <Upload className="text-slate-300"/>}
                    <div>
                       <p className={`font-bold text-sm ${documents[doc.id] ? 'text-emerald-700' : 'text-slate-600'}`}>{doc.l}</p>
                       <p className="text-xs text-slate-400">{documents[doc.id] ? 'พร้อมส่ง' : 'รองรับ JPG, PNG'}</p>
                    </div>
                  </div>
                  <label className="cursor-pointer">
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFile(e, doc.id)} />
                    <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50">Select File</span>
                  </label>
                </div>
                {documents[doc.id] && (
                  <img src={documents[doc.id]} className="mt-3 h-32 w-auto rounded object-contain bg-white border border-emerald-100 shadow-sm" alt="preview" />
                )}
              </div>
            ))}
            
            {/* Warning for Incomplete */}
            {(!documents.idCard || !documents.bankBook) && (
              <div className="flex items-start gap-2 p-3 bg-orange-50 text-orange-700 text-xs rounded-lg border border-orange-100 animate-pulse">
                <AlertTriangle size={16} className="shrink-0 mt-0.5"/>
                <p>คำแนะนำ: คุณสามารถกดส่งข้อมูลได้แม้เอกสารไม่ครบ (สถานะจะเป็น Incomplete) เพื่อให้ HR ทราบข้อมูลเบื้องต้นก่อน</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-10 flex justify-between pt-6 border-t border-slate-100">
           <button 
             onClick={() => setStep(s => Math.max(1, s-1))}
             className={`px-4 py-2 text-slate-400 font-bold hover:text-slate-600 flex items-center gap-1 ${step === 1 ? 'invisible' : ''}`}
           >
             <ChevronLeft size={16}/> ย้อนกลับ
           </button>
           <button 
             onClick={() => step < 4 ? setStep(s => s+1) : handleFinalSubmit()}
             disabled={loading}
             className="px-8 py-3 bg-slate-800 text-white rounded-lg font-bold shadow-lg hover:bg-slate-900 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
           >
             {loading ? <Loader2 className="animate-spin"/> : (step === 4 ? 'ยืนยันส่งข้อมูล' : 'ถัดไป')} <ChevronRight size={16}/>
           </button>
        </div>
      </div>
    </div>
  );
};

export default JoinerWizard;