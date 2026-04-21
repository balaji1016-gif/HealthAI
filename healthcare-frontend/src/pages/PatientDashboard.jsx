import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, User, LogOut, Send, Brain, Calendar, TrendingUp } from 'lucide-react';
// 1. You will need to install recharts: npm install recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAiAssessment } from '../api';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vitals, setVitals] = useState({ bloodPressure: '', heartRate: '', doubts: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // 2. PARSE LOGIC: Converts "80,timestamp|85,timestamp|" into Chart Data
  const formatChartData = () => {
    if (!user?.vitalsHistory) return [];
    return user.vitalsHistory.split('|')
      .filter(entry => entry.trim() !== '')
      .map(entry => {
        const [rate, time] = entry.split(',');
        return {
          time: new Date(parseInt(time)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          bpm: parseInt(rate)
        };
      }).slice(-7); // Show last 7 readings
  };

  const handleAiRun = async () => {
    if (!vitals.bloodPressure || !vitals.heartRate) {
      toast.error("Please enter BP and Heart Rate");
      return;
    }
    setLoading(true);
    try {
      const res = await getAiAssessment({ ...vitals, email: user.email });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success("Vitals Updated & AI Analyzed!");
    } catch (err) {
      toast.error("Error updating vitals");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar - Remains Identical */}
      <div className="w-80 bg-white border-r border-slate-200 p-8 flex flex-col shadow-sm">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white"><Activity size={24} /></div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">HealthAI</h1>
        </div>
        <div className="bg-slate-50 rounded-[2rem] p-6 mb-8 border border-slate-100">
          <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-4"><User size={32} /></div>
          <h3 className="font-black text-slate-800 text-lg leading-tight">{user.name}</h3>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">{user.email}</p>
        </div>
        <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="mt-auto flex items-center gap-3 text-slate-400 font-bold hover:text-red-500 transition-colors p-2">
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-indigo-600 font-black text-sm uppercase tracking-[0.2em] mb-2">Patient Overview</p>
              <h2 className="text-5xl font-black text-slate-800">Your Dashboard</h2>
            </div>
            <button className="px-8 py-4 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-2">
              <Calendar size={20} /> Request Appointment
            </button>
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Vitals Input (Left - 5 columns) */}
            <div className="col-span-5 bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
              <h4 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3"><Send className="text-indigo-600" /> Update Vitals</h4>
              <div className="space-y-6">
                <input type="text" placeholder="BP (e.g. 120/80)" className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-none" onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})}/>
                <input type="text" placeholder="Heart Rate (BPM)" className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-none" onChange={(e) => setVitals({...vitals, heartRate: e.target.value})}/>
                <textarea placeholder="Any symptoms?" className="w-full p-5 bg-slate-50 border rounded-2xl font-bold outline-none h-24" onChange={(e) => setVitals({...vitals, doubts: e.target.value})}></textarea>
                <button onClick={handleAiRun} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-100">
                  {loading ? "Analyzing..." : <><Brain size={24} /> Run AI Assessment</>}
                </button>
              </div>
            </div>

            {/* AI Report & Graph (Right - 7 columns) */}
            <div className="col-span-7 space-y-8">
              {/* AI Report Card */}
              <div className="bg-indigo-900 rounded-[3rem] p-10 text-white shadow-xl">
                <h4 className="text-xl font-black mb-6 flex items-center gap-3"><Activity /> AI Analysis</h4>
                <div className="bg-indigo-800/50 rounded-2xl p-6 border border-indigo-700/50">
                  <p className="text-2xl font-black">{user.aiRecommendation || "No Data"}</p>
                  <p className="mt-2 text-indigo-200 italic font-medium">"{user.medicalHistory || "Please update vitals."}"</p>
                </div>
              </div>

              {/* NEW: THE CHART SECTION */}
              <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 h-80">
                <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <TrendingUp className="text-indigo-600" /> Heart Rate Trend
                </h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formatChartData()}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold', fontSize: 12}} />
                      <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} />
                      <Line type="monotone" dataKey="bpm" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
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
