import React, { useState } from 'react';
import { User, MapPin, FileText, CheckCircle, Upload, ChevronRight, Loader2 } from 'lucide-react';
import { Card, InputGroup, Button } from '../shared/UIComponents';

const Stepper = ({ step }) => {
  const steps = [
    { id: 1, label: 'Profile', icon: User },
    { id: 2, label: 'Address', icon: MapPin },
    { id: 3, label: 'Documents', icon: FileText },
  ];

  return (
    <div className="flex justify-center mb-10">
      <div className="flex items-center">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
             <div className="flex flex-col items-center relative z-10">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                     step >= s.id 
                     ? 'bg-[#00ce7c] border-[#00ce7c] text-white shadow-lg shadow-emerald-200 scale-110' 
                     : 'bg-white border-slate-200 text-slate-300'
                 }`}>
                     {step > s.id ? <CheckCircle size={24} /> : <s.icon size={20} />}
                 </div>
                 <span className={`absolute -bottom-6 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${
                     step >= s.id ? 'text-[#00ce7c]' : 'text-slate-300'
                 }`}>{s.label}</span>
             </div>
             {i < steps.length - 1 && (
                 <div className="w-16 md:w-24 h-1 rounded-full mx-2 overflow-hidden bg-slate-100">
                     <div className={`h-full bg-[#00ce7c] transition-all duration-700 ease-out`} style={{ width: step > s.id ? '100%' : '0%' }} />
                 </div>
             )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const JoinerWizard = ({ employeeData, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [personal, setPersonal] = useState({ prefix: 'นาย', firstName: '', lastName: '', phone: '' });
  const [address, setAddress] = useState({ 
      idAddress: { zip: '', houseNo: '', soiStreet: '', subDistrict: '', district: '', province: '' }, 
      currentAddress: { zip: '', houseNo: '', soiStreet: '', subDistrict: '', district: '', province: '' }, 
      sameAsId: false 
  });
  const [docs, setDocs] = useState({ idCard: null, bankBook: null });

  // Helpers
  const handleFile = (e, field) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setDocs(prev => ({ ...prev, [field]: reader.result }));
          reader.readAsDataURL(file);
      }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    // Simulate delay for effect
    setTimeout(() => {
        onSubmit(personal, address, docs);
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-700">
       <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800 mb-2">Welcome, {employeeData.employee.name.split(' ')[0]}!</h1>
          <p className="text-slate-500">Please complete your information to get started.</p>
       </div>

       <Stepper step={step} />

       <div className="mt-12">
          <Card className="p-8 md:p-10 relative overflow-hidden">
             {/* Decorative BG */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full -mr-16 -mt-16 pointer-events-none opacity-50" />

             {/* Step 1: Personal Info */}
             {step === 1 && (
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                   <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800"><User className="text-[#00ce7c]"/> Personal Information</h2>
                   <div className="grid md:grid-cols-2 gap-5">
                      <InputGroup label="Prefix">
                          <select className="fkt-input" value={personal.prefix} onChange={e => setPersonal({...personal, prefix: e.target.value})}>
                              <option>Mr.</option><option>Ms.</option><option>Mrs.</option>
                          </select>
                      </InputGroup>
                      <div className="hidden md:block"></div>
                      <InputGroup label="First Name">
                          <input className="fkt-input" placeholder="First Name" value={personal.firstName} onChange={e => setPersonal({...personal, firstName: e.target.value})} />
                      </InputGroup>
                      <InputGroup label="Last Name">
                          <input className="fkt-input" placeholder="Last Name" value={personal.lastName} onChange={e => setPersonal({...personal, lastName: e.target.value})} />
                      </InputGroup>
                      <InputGroup label="Phone Number">
                          <input className="fkt-input" placeholder="08x-xxx-xxxx" value={personal.phone} onChange={e => setPersonal({...personal, phone: e.target.value})} />
                      </InputGroup>
                   </div>
                </div>
             )}

             {/* Step 2: Address */}
             {step === 2 && (
                <div className="space-y-8 animate-in slide-in-from-right-8 duration-300">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800 mb-4"><MapPin className="text-[#00ce7c]"/> ID Card Address</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <input className="fkt-input" placeholder="House No." value={address.idAddress.houseNo} onChange={e => setAddress({...address, idAddress: {...address.idAddress, houseNo: e.target.value}})} />
                            <input className="fkt-input" placeholder="Zip Code" value={address.idAddress.zip} onChange={e => setAddress({...address, idAddress: {...address.idAddress, zip: e.target.value}})} />
                            <input className="fkt-input col-span-2" placeholder="Street / District / Province" value={address.idAddress.province} onChange={e => setAddress({...address, idAddress: {...address.idAddress, province: e.target.value}})} />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <label className="flex items-center gap-2 mb-4 cursor-pointer w-fit">
                            <input type="checkbox" className="w-4 h-4 text-[#00ce7c] rounded border-slate-300 focus:ring-[#00ce7c]" checked={address.sameAsId} onChange={e => setAddress({...address, sameAsId: e.target.checked})} />
                            <span className="text-sm font-bold text-slate-600">Current address same as ID card</span>
                        </label>
                        
                        {!address.sameAsId && (
                           <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                               <input className="fkt-input" placeholder="House No." value={address.currentAddress.houseNo} onChange={e => setAddress({...address, currentAddress: {...address.currentAddress, houseNo: e.target.value}})} />
                               <input className="fkt-input" placeholder="Zip Code" value={address.currentAddress.zip} onChange={e => setAddress({...address, currentAddress: {...address.currentAddress, zip: e.target.value}})} />
                               <input className="fkt-input col-span-2" placeholder="Street / District / Province" value={address.currentAddress.province} onChange={e => setAddress({...address, currentAddress: {...address.currentAddress, province: e.target.value}})} />
                           </div>
                        )}
                    </div>
                </div>
             )}

             {/* Step 3: Documents */}
             {step === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
                   <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800"><Upload className="text-[#00ce7c]"/> Upload Documents</h2>
                   <div className="grid gap-4">
                       {['ID Card Copy', 'Bank Book Copy'].map((label, idx) => {
                           const key = idx === 0 ? 'idCard' : 'bankBook';
                           return (
                               <div key={key} className={`border-2 border-dashed rounded-xl p-6 flex items-center justify-between transition-colors ${docs[key] ? 'border-[#00ce7c] bg-emerald-50/30' : 'border-slate-200 hover:border-slate-300'}`}>
                                   <div className="flex items-center gap-4">
                                       <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${docs[key] ? 'bg-[#00ce7c] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                           {docs[key] ? <CheckCircle size={24} /> : <FileText size={24} />}
                                       </div>
                                       <div>
                                           <p className="font-bold text-slate-700">{label}</p>
                                           <p className="text-xs text-slate-400">{docs[key] ? 'Uploaded successfully' : 'Max 5MB (JPG, PNG, PDF)'}</p>
                                       </div>
                                   </div>
                                   <label className="cursor-pointer">
                                       <span className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm">Choose File</span>
                                       <input type="file" className="hidden" onChange={e => handleFile(e, key)} />
                                   </label>
                               </div>
                           );
                       })}
                   </div>
                </div>
             )}

             {/* Actions */}
             <div className="flex justify-between mt-10 pt-6 border-t border-slate-50">
                <Button variant="ghost" onClick={() => setStep(s => Math.max(1, s-1))} disabled={step === 1 || loading} className={step === 1 ? 'invisible' : ''}>
                    Back
                </Button>
                <Button onClick={() => step < 3 ? setStep(s => s + 1) : handleFinalSubmit()} disabled={loading} className="px-8">
                    {loading ? <Loader2 className="animate-spin" /> : (step === 3 ? 'Submit Application' : <span className="flex items-center gap-2">Next Step <ChevronRight size={16}/></span>)}
                </Button>
             </div>
          </Card>
       </div>
    </div>
  );
};

export default JoinerWizard;