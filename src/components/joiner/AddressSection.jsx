import React from 'react';
import { Home, Loader2, MapPin } from 'lucide-react';
import { InputLabel } from '../shared/UIComponents';

const AddressSection = ({ type, title, data, disabled, onZipChange, loadingAddress, activeAddressType, addressOptions, onSelectAddress, onDetailChange }) => (
  <div className={`fkt-card ${disabled ? 'bg-slate-50/50 opacity-80 pointer-events-none' : 'bg-white'}`}>
    <div className="flex items-center gap-3 mb-6">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${type === 'id' ? 'bg-[#00ce7c]/10 text-[#00ce7c]' : 'bg-blue-50 text-blue-500'}`}>
        <Home size={20} />
      </div>
      <h3 className="font-bold text-lg text-slate-800">{title}</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      <div className="md:col-span-full space-y-1">
        <InputLabel label="รหัสไปรษณีย์" required />
        <div className="relative">
          <input 
            type="text" maxLength={5} value={data.zip}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg outline-none font-inter text-xl font-bold tracking-widest" 
            placeholder="00000"
            onChange={(e) => onZipChange(e.target.value, type)}
          />
          {loadingAddress && activeAddressType === type && <Loader2 className="absolute right-4 top-4 animate-spin text-[#00ce7c]" />}
          {addressOptions.length > 0 && activeAddressType === type && (
            <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-slate-100 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
              {addressOptions.map((item, idx) => (
                <div key={idx} onClick={() => onSelectAddress(item, type)} className="p-4 hover:bg-emerald-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-none">
                  <MapPin size={16} className="text-[#00ce7c]" />
                  <span className="text-sm font-bold text-slate-700">ต. {item.name_th} → อ. {item.district.name_th} ({item.district.province.name_th})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="md:col-span-2 space-y-1">
        <InputLabel label="บ้านเลขที่" required />
        <input type="text" value={data.houseNo} onChange={(e) => onDetailChange('houseNo', e.target.value, type)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="เช่น 123/45" />
      </div>
      <div className="md:col-span-4 space-y-1">
        <InputLabel label="หมู่ที่ / ซอย / ถนน" required />
        <input type="text" value={data.soiStreet} onChange={(e) => onDetailChange('soiStreet', e.target.value, type)} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-lg" placeholder="ซอยทองหล่อ 10" />
      </div>
      <div className="md:col-span-2 space-y-1"><InputLabel label="แขวง / ตำบล" /><input type="text" readOnly value={data.subDistrict} className="w-full p-3.5 bg-slate-100 border-none rounded-lg text-slate-500 font-bold" /></div>
      <div className="md:col-span-2 space-y-1"><InputLabel label="เขต / อำเภอ" /><input type="text" readOnly value={data.district} className="w-full p-3.5 bg-slate-100 border-none rounded-lg text-slate-500 font-bold" /></div>
      <div className="md:col-span-2 space-y-1"><InputLabel label="จังหวัด" /><input type="text" readOnly value={data.province} className="w-full p-3.5 bg-slate-100 border-none rounded-lg text-slate-500 font-bold" /></div>
    </div>
  </div>
);

export default AddressSection;
