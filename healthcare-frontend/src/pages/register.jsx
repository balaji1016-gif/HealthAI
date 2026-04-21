import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
// IMPORT the register function from your api.js file
import { register } from '../api'; 

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT',
    age: '',
    bloodPressure: '',
    heartRate: '',
    medicalHistory: '',
    vitalsHistory: '', 
    doubts: '' 
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // FIX: We now use the 'register' function from api.js 
      // This ensures the correct URL (healthai-nx8q.onrender.com) and CORS headers are used
      const res = await register(formData);
      
      if (res.status === 201 || res.status === 200) {
        toast.success("Account created successfully!");
        navigate('/login');
      }
    } catch (err) {
      // Detailed error logging to see if it's a 400 (Email exists) or 500 (DB Error)
      console.error("Registration Error Details:", err.response);
      const errorMessage = err.response?.data?.message || "Registration failed - check if email exists";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-2 text-slate-400 font-bold text-sm uppercase hover:text-indigo-600 transition-colors">
          <ArrowLeft size={16} /> Back to Home
        </button>

        <h2 className="text-3xl font-black text-slate-800 mb-2">Create Account</h2>
        <p className="text-slate-500 mb-8 font-medium">Join our AI Healthcare platform</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="relative">
            <User className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Full Name" 
              required 
              className="w-full p-4 pl-12 bg-slate-50 border rounded-2xl focus:ring-2 ring-indigo-500 outline-none font-semibold" 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required 
              className="w-full p-4 pl-12 bg-slate-50 border rounded-2xl focus:ring-2 ring-indigo-500 outline-none font-semibold" 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              required 
              className="w-full p-4 pl-12 bg-slate-50 border rounded-2xl focus:ring-2 ring-indigo-500 outline-none font-semibold" 
              onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-black text-slate-400 uppercase ml-2">User Role</label>
            <select 
              className="w-full p-4 bg-slate-50 border rounded-2xl font-bold appearance-none cursor-pointer outline-none" 
              value={formData.role} 
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
            </select>
          </div>

          {formData.role === 'PATIENT' && (
            <div className="space-y-4 pt-2 border-t border-dashed">
              <input 
                type="number" 
                placeholder="Age" 
                className="w-full p-4 bg-slate-50 border rounded-2xl font-semibold outline-none" 
                onChange={(e) => setFormData({ ...formData, age: e.target.value })} 
              />
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="BP (120/80)" 
                  className="w-1/2 p-4 bg-slate-50 border rounded-2xl font-semibold outline-none" 
                  onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })} 
                />
                <input 
                  type="text" 
                  placeholder="HR (BPM)" 
                  className="w-1/2 p-4 bg-slate-50 border rounded-2xl font-semibold outline-none" 
                  onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })} 
                />
              </div>
              <textarea 
                placeholder="Initial Medical History" 
                className="w-full p-4 bg-slate-50 border rounded-2xl font-semibold outline-none h-24" 
                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })} 
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? "CREATING ACCOUNT..." : <><UserPlus size={20}/> Register Now</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
