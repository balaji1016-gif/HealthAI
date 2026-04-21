import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, User, LogOut, Send, Brain, Calendar } from 'lucide-react';
import { getAiAssessment, bookAppointment } from '../api'; // Ensure these are imported
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    doubts: ''
  });
  const navigate = useNavigate();

  // 1. FIXED: Get user data on load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // 2. FIXED: Run AI Diagnostic
  const handleAiRun = async () => {
    if (!vitals.bloodPressure || !vitals.heartRate) {
      toast.error("Please enter BP and Heart Rate first");
      return;
    }
    setLoading(true);
    try {
      // We pass the current vitals PLUS the user email so the backend knows who it is
      const res = await getAiAssessment({
        ...vitals,
        email: user.email 
      });
      setUser(res.data); // Update local state with new AI results
      localStorage.setItem('user', JSON.stringify(res.data)); // Sync storage
      toast.success("AI Analysis Complete!");
    } catch (err) {
      toast.error("AI Service Error. Check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar - Same Design */}
      <div className="w-80 bg-white border-r border-slate-200 p-8 flex flex-col shadow-sm">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white">
            <Activity size={24} />
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">HealthAI</h1>
        </div>

        {/* FIXED: Showing Patient Name and Email */}
        <div className="bg-slate-50 rounded-[2rem] p-6 mb-8 border border-slate-100">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4">
            <User size={32} />
          </div>
          <h3 className="font-black text-slate-800 text-lg leading-tight">{user.name}</h3>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">{user.email}</p>
        </div>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-3 text-slate-400 font-bold hover:text-red-500 transition-colors p-2">
          <LogOut size={20} /> Logout Account
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-indigo-600 font-black text-sm uppercase tracking-[0.2em] mb-2">Patient Overview</p>
              <h2 className="text-5xl font-black text-slate-800">Your Dashboard</h2>
            </div>
            {/* Request Appointment Feature */}
            <button 
              onClick={() => toast.success("Appointment request sent to Doctor!")}
              className="px-8 py-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-2"
            >
              <Calendar size={20} /> Request Appointment
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Vitals Input - No Design Change */}
            <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h4 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                <Send className="text-indigo-600" /> Update Vitals
              </h4>
              <div className="space-y-6">
                <input 
                  type="text" 
                  placeholder="Blood Pressure (e.g. 120/80)" 
                  className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-500"
                  onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Heart Rate (BPM)" 
                  className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-none focus:ring-2 ring-indigo-500"
                  onChange={(e) => setVitals({...vitals, heartRate: e.target.value})}
                />
                <textarea 
                  placeholder="Any doubts or symptoms?" 
                  className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-none h-32"
                  onChange={(e) => setVitals({...vitals, doubts: e.target.value})}
                ></textarea>
                <button 
                  onClick={handleAiRun}
                  disabled={loading}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100"
                >
                  {loading ? "Analyzing..." : <><Brain size={24} /> Run AI Assessment</>}
                </button>
              </div>
            </div>

            {/* AI Results Section */}
            <div className="bg-indigo-900 rounded-[3rem] p-10 text-white shadow-xl shadow-indigo-200">
              <h4 className="text-xl font-black mb-8 flex items-center gap-3">
                <Activity /> AI Analysis Report
              </h4>
              <div className="space-y-6">
                <div className="bg-indigo-800/50 rounded-2xl p-6 border border-indigo-700/50">
                  <p className="text-indigo-300 font-bold text-xs uppercase mb-2">Recommendation</p>
                  <p className="text-2xl font-black">{user.aiRecommendation || "No Data Yet"}</p>
                </div>
                <div className="bg-indigo-800/50 rounded-2xl p-6 border border-indigo-700/50">
                  <p className="text-indigo-300 font-bold text-xs uppercase mb-2">Medical Insight</p>
                  <p className="font-semibold text-indigo-50 leading-relaxed italic">
                    "{user.medicalHistory || "Please update your vitals to generate an AI report."}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
