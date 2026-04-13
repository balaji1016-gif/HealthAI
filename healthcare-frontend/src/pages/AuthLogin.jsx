import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const AuthLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await login(formData);
      
      // Since your Java backend returns the Patient object directly:
      // We check for res.data.email to confirm we got a valid user object
      if (res.data && res.data.email) {
        // Save user object
        localStorage.setItem('user', JSON.stringify(res.data));
        
        // We set a dummy token so any 'ProtectedRoute' doesn't think we are logged out
        localStorage.setItem('token', 'session_active'); 
        
        const userRole = res.data.role; // Matches your Patient entity 'role' field
        
        toast.success(`Welcome, ${res.data.name || 'User'}`);

        // Immediate redirection based on role
        if (userRole === 'DOCTOR') {
          navigate('/doctordashboard');
        } else {
          navigate('/patientdashboard');
        }
      } else {
        toast.error("Login failed: Unexpected response format from server.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      // Backend returns "Invalid credentials." string on 401
      const errorMsg = err.response?.data || "Invalid email or password.";
      toast.error(errorMsg);
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

        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">System Login</h2>
          <p className="text-slate-500 font-medium">Enter your credentials to access the AI portal.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? (
              "AUTHENTICATING..."
            ) : (
              <>
                <LogIn size={24} /> SECURE LOGIN
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm font-medium">
            New to the platform?{' '}
            <button 
              onClick={() => navigate('/register')} 
              className="text-indigo-600 font-black hover:underline ml-1"
            >
              Register Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLogin;
