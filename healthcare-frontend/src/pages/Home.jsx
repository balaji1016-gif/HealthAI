import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('PATIENT');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? 'login' : 'register';
      const response = await axios.post(`https://healthai-nx8q.onrender.com/api/auth/${endpoint}`, { email, password, role });

      if (isLogin) {
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate(response.data.role === 'DOCTOR' ? '/doctor-dashboard' : '/patient-dashboard');
      } else {
        alert("Registration Successful");
        setIsLogin(true);
      }
    } catch (error) {
      alert("System Error: Please check backend connection.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Top Bar */}
      <nav className="bg-white border-b border-slate-200 px-10 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
          <span className="text-xl font-bold tracking-tight text-slate-800">Health<span className="text-blue-600">AI</span></span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Branding */}
        <div className="space-y-6">
          <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
            v2.0 AI-POWERED MONITORING
          </span>
          <h1 className="text-6xl font-extrabold text-slate-900 leading-tight">
            Advanced Care <br />
            <span className="text-blue-600 underline decoration-blue-200">Simplified.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-md">
            The intelligent bridge between patients and clinicians. Experience real-time vitals monitoring and AI-driven diagnostic insights.
          </p>
        </div>

        {/* Right Side: Auth Card */}
        <div className="bg-white border border-slate-200 shadow-2xl shadow-blue-100/50 rounded-3xl p-10">
          <div className="flex gap-8 mb-10 border-b border-slate-100">
            {['SIGN IN', 'REGISTER'].map((tab, idx) => (
              <button
                key={tab}
                onClick={() => setIsLogin(idx === 0)}
                className={`pb-4 text-sm font-bold tracking-widest transition-all ${
                  (isLogin && idx === 0) || (!isLogin && idx === 1)
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Identify As</label>
                <select
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                >
                  <option value="PATIENT">Patient (User)</option>
                  <option value="DOCTOR">Doctor (Clinician)</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Email Access</label>
              <input
                type="email" placeholder="name@medical.com" required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Secure Key</label>
              <input
                type="password" placeholder="••••••••" required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
              {isLogin ? 'Enter System' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
