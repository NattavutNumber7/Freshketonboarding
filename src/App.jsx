import React, { useState } from 'react';
import { 
  User, FileText, ChevronRight, ChevronLeft, Upload, 
  CheckCircle, AlertCircle, Building2, GraduationCap, Heart, Check
} from 'lucide-react';

// Import Components ที่เราแยกไว้
import Navbar from './components/shared/Navbar';
import { InputLabel, SectionHeader } from './components/shared/UIComponents';
import AddressSection from './components/joiner/AddressSection';
import Stepper from './components/joiner/Stepper';
import AdminDashboard from './components/admin/AdminDashboard';
import CreateJoiner from './components/admin/CreateJoiner';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [step, setStep] = useState(1);
  const [adminTab, setAdminTab] = useState('dashboard');
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [addressOptions, setAddressOptions] = useState([]);
  const [activeAddressType, setActiveAddressType] = useState(null);

  const [employees, setEmployees] = useState([
    { name: 'สมชาย รักดี', email: 'somchai.r@freshket.com', position: 'Software Engineer', department: 'Technology', startDate: '2026-02-02', status: 'Pending', otpSent: true },
    { name: 'วิภาดา สายลม', email: 'wipada.s@freshket.com', position: 'UX Designer', department: 'Technology', startDate: '2026-02-15', status: 'Incomplete', otpSent: false },
    { name: 'ธนภูมิ มีเงิน', email: 'tanapoom.m@freshket.com', position: 'Sales Manager', department: 'Commercial', startDate: '2026-01-20', status: 'Verified', otpSent: true },
  ]);

  const [formData, setFormData] = useState({
    position: 'Software Engineer (Mobile)',
    department: 'Technology & Innovation',
    startDate: '02 FEBRUARY 2026',
    employmentType: 'พนักงานประจำ (Full-time)',
    idAddress: { zip: '', houseNo: '', soiStreet: '', subDistrict: '', district: '', province: '' },
    currentAddress: { zip: '', houseNo: '', soiStreet: '', subDistrict: '', district: '', province: '' },
    sameAsId: false,
    idCardImage: null, // เก็บรูปบัตรปชช เป็นข้อความ Base64
    bankBookImage: null // เก็บรูปสมุดบัญชี เป็นข้อความ Base64
  });

  // --- Utility: Convert File to Base64 ---
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // --- Handlers ---
  const handleFileUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setFormData(prev => ({ ...prev, [fieldName]: base64 }));
        // Note: ในของจริงไม่ต้อง alert ก็ได้ หรือใช้ toast แทน
        alert(`อัปโหลดรูปสำเร็จ! (ขนาด: ${(file.size / 1024).toFixed(2)} KB)`);
      } catch (error) {
        console.error("Error converting file:", error);
        alert("เกิดข้อผิดพลาดในการอัปโหลดรูป");
      }
    }
  };

  const handleSendOTP = (index) => {
    const newEmps = [...employees];
    newEmps[index].otpSent = true;
    setEmployees(newEmps);
    alert(`ส่ง OTP ไปยัง ${newEmps[index].name} สำเร็จ!`);
  };

  const handleSendWelcome = (name) => {
    alert(`ส่งอีเมลต้อนรับให้คุณ ${name} เรียบร้อยแล้ว!`);
  };

  const handleZipChange = async (zip, type) => {
    const addr = type === 'id' ? 'idAddress' : 'currentAddress';
    setFormData(prev => ({ ...prev, [addr]: { ...prev[addr], zip } }));
    if (zip.length === 5) {
      setLoadingAddress(true);
      setActiveAddressType(type);
      try {
        const response = await fetch('[https://raw.githubusercontent.com/Mininok/province-json-api/refs/heads/main/sub_district_with_district_and_province.json](https://raw.githubusercontent.com/Mininok/province-json-api/refs/heads/main/sub_district_with_district_and_province.json)');
        const data = await response.json();
        const filtered = data.filter(item => item.zip_code.toString() === zip);
        setAddressOptions(filtered);
      } catch (error) { console.error(error); } finally { setLoadingAddress(false); }
    } else { setAddressOptions([]); }
  };

  const handleSelectAddress = (item, type) => {
    const addrKey = type === 'id' ? 'idAddress' : 'currentAddress';
    setFormData(prev => ({
      ...prev,
      [addrKey]: { ...prev[addrKey], subDistrict: item.name_th, district: item.district.name_th, province: item.district.province.name_th }
    }));
    setAddressOptions([]);
    setActiveAddressType(null);
  };

  const handleDetailChange = (field, value, type) => {
    const addrKey = type === 'id' ? 'idAddress' : 'currentAddress';
    setFormData(prev => ({ ...prev, [addrKey]: { ...prev[addrKey], [field]: value } }));
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navbar Section */}
      <Navbar 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin} 
        adminTab={adminTab} 
        setAdminTab={setAdminTab} 
        setStep={setStep} 
      />

      {/* Admin Mobile Tabs */}
      {isAdmin && (
        <div className="md:hidden flex p-4 gap-2 bg-white border-b border-slate-100">
            <button onClick={() => setAdminTab('dashboard')} className={`flex-1 py-2 rounded-lg font-bold text-xs ${adminTab === 'dashboard' ? 'bg-slate-800 text-white' : 'text-slate-400 bg-slate-50'}`}>Dashboard</button>
            <button onClick={() => setAdminTab('create')} className={`flex-1 py-2 rounded-lg font-bold text-xs ${adminTab === 'create' ? 'bg-slate-800 text-white' : 'text-slate-400 bg-slate-50'}`}>Create OTP</button>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-4 md:p-8 md:pt-10">
        {isAdmin ? (
          /* --- ADMIN VIEW --- */
          adminTab === 'dashboard' ? <AdminDashboard employees={employees} onReview={()=>{}} onSendOTP={handleSendOTP} onSendWelcome={handleSendWelcome} /> :
          adminTab === 'create' ? <CreateJoiner onCreated={() => { alert('Created!'); setAdminTab('dashboard'); }} /> : null
        ) : (
          /* --- NEW JOINER VIEW --- */
          <div className="max-w-4xl mx-auto">
            <Stepper step={step} />
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 tracking-tight italic">
                {step === 1 && "1. ตรวจสอบข้อมูลการจ้างงาน"}
                {step === 2 && "2. กรอกข้อมูลส่วนตัวพื้นฐาน"}
                {step === 3 && "3. ข้อมูลที่อยู่ที่ติดต่อได้"}
                {step === 4 && "4. อัปโหลดเอกสารสำคัญ"}
              </h2>
            </div>
            
            {step === 1 && (
              <div className="space-y-6 animate-in">
                <div className="bg-red-50 border border-red-100 p-5 rounded-lg flex gap-3"><AlertCircle className="text-red-500 shrink-0 mt-0.5" /><p className="text-sm text-red-800 leading-relaxed">ข้อมูลส่วนนี้ระบุล่วงหน้าโดย HR <b>ไม่สามารถแก้ไขได้</b> หากพบข้อผิดพลาด กรุณาติดต่อ People Experience</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[{l:'ตำแหน่ง',v:formData.position},{l:'แผนก',v:formData.department},{l:'วันเริ่มงาน',v:formData.startDate,h:true},{l:'ประเภท',v:formData.employmentType}].map((it,i)=>(
                    <div key={i} className="fkt-card border-none bg-slate-50/50 p-6"><p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-widest">{it.l}</p><p className={`font-bold text-lg ${it.h?'text-[#00ce7c]':''}`}>{it.v}</p></div>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in">
                <div className="fkt-card">
                  <SectionHeader icon={User} title="ข้อมูลส่วนตัว (Basic Info)" sub="Identity & Nickname" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
                    <div className="space-y-1"><InputLabel label="คำนำหน้า (TH)" required /><select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"><option>นาย</option><option>นางสาว</option><option>นาง</option></select></div>
                    <div className="space-y-1"><InputLabel label="ชื่อจริง (ไทย)" required /><input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" /></div>
                    <div className="space-y-1"><InputLabel label="นามสกุล (ไทย)" required /><input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" /></div>
                    
                    {/* EN Name Section with Title EN */}
                    <div className="space-y-1"><InputLabel label="Title (EN)" required /><select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-inter"><option>Mr.</option><option>Ms.</option><option>Mrs.</option></select></div>
                    <div className="space-y-1"><InputLabel label="First Name (EN)" required /><input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-inter" placeholder="English Name" /></div>
                    <div className="space-y-1"><InputLabel label="Last Name (EN)" required /><input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-inter" placeholder="English Surname" /></div>

                    <div className="space-y-1"><InputLabel label="ชื่อเล่น (ไทย)" required /><input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" /></div>
                    <div className="space-y-1"><InputLabel label="Nickname (EN)" required /><input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-inter" /></div>
                    <div className="space-y-1"><InputLabel label="วันเกิด" required /><input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-inter" /></div>
                    <div className="md:col-span-2 space-y-1"><InputLabel label="เบอร์โทรศัพท์" required /><input type="tel" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-inter" placeholder="08X-XXX-XXXX" /></div>
                    <div className="md:col-span-1 space-y-1"><InputLabel label="Line ID" /><input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-inter" /></div>
                  </div>
                </div>

                <div className="fkt-card">
                  <SectionHeader icon={GraduationCap} title="การศึกษา (Education)" sub="Academic background" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
                    <div className="space-y-1"><InputLabel label="วุฒิการศึกษาล่าสุด" required /><select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg"><option>ปริญญาตรี</option><option>ปริญญาโท</option></select></div>
                    <div className="space-y-1"><InputLabel label="สถาบันการศึกษา" required /><input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" placeholder="ชื่อมหาวิทยาลัย" /></div>
                  </div>
                </div>

                <div className="fkt-card">
                  <SectionHeader icon={Heart} title="ผู้ติดต่อฉุกเฉิน (Emergency)" sub="Contact person" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
                    <div className="space-y-1"><InputLabel label="ชื่อ-นามสกุล" required /><input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" /></div>
                    <div className="space-y-1"><InputLabel label="ความสัมพันธ์" required /><input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg" placeholder="บิดา / มารดา" /></div>
                    <div className="space-y-1"><InputLabel label="เบอร์โทรศัพท์" required /><input type="tel" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-inter" /></div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in">
                <AddressSection type="id" title="ที่อยู่ตามบัตรประชาชน" data={formData.idAddress} onZipChange={handleZipChange} loadingAddress={loadingAddress} activeAddressType={activeAddressType} addressOptions={addressOptions} onSelectAddress={handleSelectAddress} onDetailChange={handleDetailChange} />
                <button onClick={()=>setFormData(p=>({...p,sameAsId:!p.sameAsId,currentAddress:!p.sameAsId?{...p.idAddress}:{zip:'',houseNo:'',soiStreet:'',subDistrict:'',district:'',province:''}}))} className={`mx-auto flex items-center gap-3 px-6 py-3 rounded-xl font-bold border-2 transition-all ${formData.sameAsId?'bg-[#00ce7c] text-white shadow-lg shadow-emerald-100':'bg-white text-slate-500 border-slate-100'}`}><CheckCircle size={18} /> ใช้ที่อยู่เดียวกับบัตรประชาชน</button>
                <AddressSection type="current" title="ที่อยู่ปัจจุบัน" data={formData.currentAddress} disabled={formData.sameAsId} onZipChange={handleZipChange} loadingAddress={loadingAddress} activeAddressType={activeAddressType} addressOptions={addressOptions} onSelectAddress={handleSelectAddress} onDetailChange={handleDetailChange} />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-8 animate-in">
                <div className="fkt-card">
                   <SectionHeader icon={FileText} title="อัปโหลดเอกสารสำคัญ" sub="Identity Verification" />
                   <div className="space-y-6 pt-4">
                      <div className="space-y-1.5"><InputLabel label="เลขบัตรประชาชน (13 หลัก)" required /><input type="text" maxLength={13} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg font-inter text-xl font-bold tracking-[0.2em]" placeholder="0 0000 00000 00 0" /></div>
                      
                      {/* ส่วนอัปโหลดบัตรประชาชน (แก้ไขใหม่ให้รองรับ Base64) */}
                      <label className={`p-10 border-2 border-dashed rounded-lg flex flex-col items-center gap-3 transition-all cursor-pointer ${formData.idCardImage ? 'border-[#00ce7c] bg-emerald-50' : 'border-slate-100 hover:border-[#00ce7c]'}`}>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'idCardImage')} />
                        {formData.idCardImage ? (
                          <>
                            <CheckCircle className="text-[#00ce7c]" size={32} />
                            <p className="font-bold text-[#00ce7c]">อัปโหลดเรียบร้อยแล้ว</p>
                            <img src={formData.idCardImage} alt="Preview" className="h-20 object-contain rounded-md mt-2" />
                          </>
                        ) : (
                          <>
                            <Upload className="text-slate-300" size={32} />
                            <p className="font-bold text-slate-500">คลิกเพื่ออัปโหลดสำเนาบัตรประชาชน</p>
                          </>
                        )}
                      </label>

                   </div>
                </div>
                <div className="fkt-card">
                   <SectionHeader icon={Building2} title="ข้อมูลบัญชีธนาคาร" sub="Bank account for payroll" />
                   <div className="space-y-6 pt-4">
                      <div className="space-y-1.5"><InputLabel label="เลขที่บัญชีธนาคาร" required /><input type="text" className="w-full p-4 bg-emerald-50/20 border border-[#00ce7c]/30 text-[#00ce7c] rounded-lg font-inter text-xl font-bold" placeholder="000-0-00000-0" /></div>
                      
                      {/* ส่วนอัปโหลดสมุดบัญชี (แก้ไขใหม่ให้รองรับ Base64) */}
                      <label className={`p-10 border-2 border-dashed rounded-lg flex flex-col items-center gap-3 transition-all cursor-pointer ${formData.bankBookImage ? 'border-[#00ce7c] bg-emerald-50' : 'border-slate-100 hover:border-[#00ce7c]'}`}>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'bankBookImage')} />
                        {formData.bankBookImage ? (
                          <>
                            <CheckCircle className="text-[#00ce7c]" size={32} />
                            <p className="font-bold text-[#00ce7c]">อัปโหลดเรียบร้อยแล้ว</p>
                            <img src={formData.bankBookImage} alt="Preview" className="h-20 object-contain rounded-md mt-2" />
                          </>
                        ) : (
                          <>
                            <Upload className="text-slate-300" size={32} />
                            <p className="font-bold text-slate-500">คลิกเพื่ออัปโหลดสำเนาหน้าสมุดบัญชี</p>
                          </>
                        )}
                      </label>

                   </div>
                </div>
              </div>
            )}

            <div className="mt-12 flex justify-between items-center pb-24">
               <button onClick={()=>setStep(s=>Math.max(1,s-1))} className={`px-6 py-3 rounded-xl font-bold text-slate-400 hover:bg-slate-50 transition-all ${step===1?'invisible':''}`}><ChevronLeft className="inline mr-1"/> ย้อนกลับ</button>
               <button onClick={()=>step<4?setStep(s=>s+1):alert('Submitted!')} className="px-12 py-4 bg-[#00ce7c] text-white rounded-xl font-bold shadow-xl shadow-emerald-200 hover:scale-[1.02] active:scale-95 transition-all text-lg">
                  {step === 4 ? "ยืนยันส่งข้อมูล" : "ขั้นตอนถัดไป"} <ChevronRight className="inline ml-1" />
               </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
