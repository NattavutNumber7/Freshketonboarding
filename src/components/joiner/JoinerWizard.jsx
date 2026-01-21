import React, { useState } from 'react';
import { ShieldCheck, Check, User, MapPin, FileText, Info, Upload, CheckCircle, AlertTriangle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { InputLabel } from '../shared/UIComponents';
import AddressSection from './AddressSection';
import Stepper from './Stepper';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const JoinerWizard = ({ employeeData, onExit }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [personal, setPersonal] = useState({ prefix: 'นาย', firstName: '', lastName: '', phone: '', dob: '' });
  const [address, setAddress] = useState({ idAddress: { zip: '', houseNo: '', soiStreet: '', subDistrict: '', district: '', province: '' }, currentAddress: { zip: '', houseNo: '', soiStreet: '', subDistrict: '', district: '', province: '' }, sameAsId: false });
  const [documents, setDocuments] = useState({ idCard: null, bankBook: null });

  // Convert File to Base64
  const handleFile = (e, field) => {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.onloadend = () => setDocuments(p => ({...p, [field]: reader.result}));
        reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = async () => {
    const isComplete = documents.idCard && documents.bankBook;
    if (!isComplete && !confirm("เอกสารไม่ครบ ยืนยันที่จะส่ง?")) return;
    if (isComplete && !confirm("ยืนยันการส่งข้อมูล?")) return;

    setLoading(true);
    try {
      await updateDoc(doc(db, "onboardings", employeeData.id), {
        status: isComplete ? 'SUBMITTED' : 'INCOMPLETE',
        submission: { personal, address, documents, isDocsComplete: isComplete, submittedAt: new Date().toISOString() }
      });
      alert("ส่งข้อมูลเรียบร้อย!");
      onExit();
    } catch (e) { alert("Error: " + e.message); } finally { setLoading(false); }
  };

  const handleZipChange = (zip, type, setAddr) => setAddr(p => ({...p, [type]: {...p[type], zip}}));
  const handleDetailChange = (f, v, type) => setAddress(p => ({...p, [type==='id'?'idAddress':'currentAddress']: {...p[type==='id'?'idAddress':'currentAddress'], [f]: v} }));

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Stepper step={step} />
      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-xl mt-8">
        {step===1 && (
            <div className="space-y-4">
                <h2 className="text-xl font-bold flex gap-2"><ShieldCheck className="text-emerald-500"/> ตรวจสอบข้อมูล</h2>
                <div className="bg-slate-50 p-6 rounded-xl border grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-slate-400 font-bold">ชื่อ</p><p className="font-bold">{employeeData.employee.name}</p></div>
                    <div><p className="text-xs text-slate-400 font-bold">ตำแหน่ง</p><p className="font-bold">{employeeData.employee.position}</p></div>
                </div>
            </div>
        )}
        {step===2 && (
            <div className="space-y-4">
                <h2 className="text-xl font-bold flex gap-2"><User className="text-emerald-500"/> ข้อมูลส่วนตัว</h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <div><InputLabel label="ชื่อจริง" required/><input className="w-full p-3 border rounded" value={personal.firstName} onChange={e=>setPersonal({...personal, firstName: e.target.value})}/></div>
                    <div><InputLabel label="นามสกุล" required/><input className="w-full p-3 border rounded" value={personal.lastName} onChange={e=>setPersonal({...personal, lastName: e.target.value})}/></div>
                    <div><InputLabel label="เบอร์โทร" required/><input className="w-full p-3 border rounded" value={personal.phone} onChange={e=>setPersonal({...personal, phone: e.target.value})}/></div>
                </div>
            </div>
        )}
        {step===3 && (
            <div className="space-y-4">
                <h2 className="text-xl font-bold flex gap-2"><MapPin className="text-emerald-500"/> ที่อยู่</h2>
                <AddressSection type="id" title="ที่อยู่ตามบัตร" data={address.idAddress} onZipChange={(z,t)=>handleZipChange(z,t,setAddress)} onDetailChange={handleDetailChange}/>
                <div className="flex items-center gap-2"><input type="checkbox" checked={address.sameAsId} onChange={e=>setAddress(p=>({...p, sameAsId: e.target.checked}))}/> ใช้ที่อยู่เดียวกับบัตร</div>
                {!address.sameAsId && <AddressSection type="current" title="ที่อยู่ปัจจุบัน" data={address.currentAddress} onZipChange={(z,t)=>handleZipChange(z,t,setAddress)} onDetailChange={handleDetailChange}/>}
            </div>
        )}
        {step===4 && (
            <div className="space-y-4">
                <h2 className="text-xl font-bold flex gap-2"><FileText className="text-emerald-500"/> เอกสาร</h2>
                {['idCard', 'bankBook'].map(key => (
                    <div key={key} className="border-2 border-dashed p-4 rounded-xl flex justify-between items-center">
                        <div className="flex gap-3 items-center">{documents[key]?<CheckCircle className="text-emerald-500"/>:<Upload className="text-slate-300"/>}<span>{key}</span></div>
                        <input type="file" onChange={e=>handleFile(e, key)}/>
                    </div>
                ))}
            </div>
        )}
        <div className="flex justify-between mt-8">
            <button onClick={()=>setStep(s=>Math.max(1, s-1))} className={`btn ${step===1?'invisible':''}`}>Back</button>
            <button onClick={()=>step<4?setStep(s=>s+1):handleFinalSubmit()} className="bg-slate-800 text-white px-6 py-2 rounded">{loading?<Loader2 className="animate-spin"/>:(step===4?'Submit':'Next')}</button>
        </div>
      </div>
    </div>
  );
};
export default JoinerWizard;