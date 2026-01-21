import React, { useState } from 'react';
import { ChevronLeft, Mail, Loader2, UserPlus } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Card, InputGroup, Button } from '../shared/UIComponents';

const CreateJoiner = ({ onCreated, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', position: '', department: 'Technology', startDate: ''
  });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.position || !form.startDate) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "onboardings"), {
        employee: { ...form },
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        submission: {}
      });
      onCreated();
    } catch (error) {
      console.error(error);
      alert("Error creating employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <div className="mb-6">
        <button onClick={onCancel} className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 mb-2">
            <ChevronLeft size={16}/> Back to Dashboard
        </button>
        <h1 className="text-2xl font-black text-slate-800">Add New Employee</h1>
        <p className="text-slate-500">Create a profile to start the onboarding process.</p>
      </div>
      
      <Card className="p-8">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
                <InputGroup label="Full Name" required>
                    <input className="fkt-input" placeholder="e.g. Somchai Jaidee" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </InputGroup>
            </div>
            <div className="col-span-full">
                <InputGroup label="Email Address" required>
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        <input className="fkt-input pl-10" type="email" placeholder="email@freshket.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                </InputGroup>
            </div>
            <InputGroup label="Position" required>
                <input className="fkt-input" placeholder="e.g. Senior Developer" value={form.position} onChange={e => setForm({...form, position: e.target.value})} />
            </InputGroup>
            <InputGroup label="Department" required>
                <select className="fkt-input appearance-none" value={form.department} onChange={e => setForm({...form, department: e.target.value})}>
                    <option>Technology</option>
                    <option>Product</option>
                    <option>Commercial</option>
                    <option>Operations</option>
                    <option>People</option>
                </select>
            </InputGroup>
            <div className="col-span-full">
                <InputGroup label="Start Date" required>
                    <input type="date" className="fkt-input" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
                </InputGroup>
            </div>
         </div>
         
         <div className="mt-8 flex justify-end gap-3">
             <Button variant="outline" onClick={onCancel}>Cancel</Button>
             <Button onClick={handleSubmit} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <><UserPlus size={18} /> Create Profile</>}
             </Button>
         </div>
      </Card>
    </div>
  );
};

export default CreateJoiner;