import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';
import { User, Mail, Lock, UserPlus, ArrowLeft, Activity, History } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT',
    age: '',
    bloodPressure: '',
    heartRate: '',
    medicalHistory: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(formData);
      if (res.status === 201 || res.status === 200) {
        toast.success("Account created successfully!");
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-2 text-slate-400 font-bold text-sm uppercase">
          <ArrowLeft size={16} /> Back to Home
        </button>

        <h2 className="text-3xl font-black text-slate-800 mb-2">Create Account</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input type="text" placeholder="Full Name" required className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input type="email" placeholder="Email Address" required className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="password" placeholder="Password" required className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          
          <select className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
            <option value="PATIENT">Patient</option>
            <option value="DOCTOR">Doctor</option>
          </select>

          {/* PATIENT-ONLY FIELDS */}
          {formData.role === 'PATIENT' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <input type="number" placeholder="Age" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
              <div className="flex gap-2">
                <input type="text" placeholder="BP (e.g. 120/80)" className="w-1/2 p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })} />
                <input type="text" placeholder="HR (BPM)" className="w-1/2 p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })} />
              </div>
              <textarea placeholder="Medical History" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })} />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black">
            {loading ? "CREATING..." : "Register Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
