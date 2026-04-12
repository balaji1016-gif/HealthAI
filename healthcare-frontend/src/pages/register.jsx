import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api';
import { User, Mail, Lock, UserPlus, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'PATIENT' // Default role
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
        <button 
          onClick={() => navigate('/')} 
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <h2 className="text-3xl font-black text-slate-800 mb-2">Create Account</h2>
        <p className="text-slate-500 mb-8">Join the AI Healthcare network today.</p>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* NAME INPUT */}
          <div className="relative">
            <User className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* EMAIL INPUT */}
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* PASSWORD INPUT */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* ROLE SELECTION MENU (The Fix) */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">Select Role</label>
            <select
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none font-bold text-slate-700 cursor-pointer"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="PATIENT">Patient (View Vitals)</option>
              <option value="DOCTOR">Doctor (Manage Clinic)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? "CREATING..." : <><UserPlus size={24} /> Register Now</>}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-indigo-600 font-bold hover:underline">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
