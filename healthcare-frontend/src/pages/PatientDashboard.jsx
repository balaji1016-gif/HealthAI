import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, User, LogOut, Send, Brain, Calendar, TrendingUp } from 'lucide-react';
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
      }).slice(-7);
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
      toast.success("AI Assessment Complete!");
    } catch (err) {
      toast.error("Analysis Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* HORIZONTAL HEADER - KEEPING YOUR DESIGN */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl text-white"><Activity size={20} /></div>
          <h1 className="text-xl font-black text-slate-800">HealthAI</h1>
        </div>
        
        {/* HORIZONTAL TABS/USER INFO */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
             <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-xs">
               {user.name?.charAt(0)}
             </div>
             <div>
               <p className="text-sm font-black text-slate-800 leading-none">{user.name}</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{user.email}</p>
             </div>
          </div>
          
          <button onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} className="text-slate-400 hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-black text-slate-800">Welcome Back, {user.name.split(' ')[0]}</h2>
          <button 
            onClick={() => toast.success("Appointment request sent!")}
            className="px-6 py-3 bg-white border-2 border-slate-200 rounded-2xl font-black text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center gap-2"
          >
            <Calendar size={18} /> Request Appointment
          </button>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* LEFT COLUMN: INPUTS */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
              <h4 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <Send size={18} className="text-indigo-600" /> Update Vitals
              </h4>
              <div className="space-y-4">
                <input type="text" placeholder="BP (120/80)" className="w-full p-4 bg-slate-50 border rounded-xl font-bold outline-none shadow-inner" onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})}/>
                <input type="text" placeholder="Heart Rate (BPM)" className="w-full p-4 bg-slate-50 border rounded-xl font-bold outline-none shadow-inner" onChange={(e) => setVitals({...vitals, heartRate: e.target.value})}/>
                <textarea placeholder="Symptoms/Doubts" className="w-full p-4 bg-slate-50 border rounded-xl font-bold outline-none h-24 shadow-inner" onChange={(e) => setVitals({...vitals, doubts: e.target.value})}></textarea>
                <button onClick={handleAiRun} disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  {loading ? "Analyzing..." : <><Brain size={20} /> Run AI Button</>}
                </button>
              </div>
            </div>

            {/* CHART */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
              <h4 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                <TrendingUp size={18} className="text-indigo-600" /> Vitals History
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatChartData()}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 'bold', fontSize: 10}} />
                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Line type="monotone" dataKey="bpm" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: FULL PAGE AI REPORT */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="bg-indigo-900 rounded-[2.5rem] p-10 text-white shadow-2xl min-h-[800px]">
              <div className="flex justify-between items-center mb-8 border-b border-indigo-700 pb-6">
                <h4 className="text-2xl font-black flex items-center gap-3">
                    <Activity size={28} className="text-indigo-400" /> AI Diagnostic Report
                </h4>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Generated For</p>
                    <p className="text-sm font-bold">{user.name}</p>
                </div>
              </div>
              
              {/* UPDATED: Renders the AI's HTML properly and styles for full page */}
              <div className="bg-indigo-800/30 rounded-3xl p-8 border border-indigo-700/50">
                <div 
                  className="text-indigo-50 text-lg leading-relaxed font-medium text-justify space-y-4"
                  dangerouslySetInnerHTML={{ 
                    __html: user.medicalHistory || "Please submit your vitals to generate a full clinical analysis report." 
                  }}
                />
              </div>
              
              {/* Added a formal recommendation badge */}
              <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-indigo-300 font-black text-xs uppercase tracking-widest mb-2">AI Summary Recommendation</p>
                <p className="text-2xl font-black text-emerald-400">{user.aiRecommendation || "Pending Analysis"}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
