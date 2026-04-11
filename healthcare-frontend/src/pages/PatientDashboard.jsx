import React, { useEffect, useState, useRef } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit, Heart, Thermometer, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const chartContainerRef = useRef(null);

  useEffect(() => {
    // Stage 1: Load User Data
    const data = localStorage.getItem('user');
    if (data) {
      const user = JSON.parse(data);
      setPatients([user]);
      
      getPatients(user.email).then(res => {
        if (res.data) {
          setPatients([res.data]);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      }).catch(err => console.error("Sync Error:", err));
    }

    // Stage 2: React 19 Stability Guard
    // We wait for the browser to finish the "Layout Paint" before showing the chart
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleAiCheck = async (email) => {
    console.log("AI Diagnosis Triggered for:", email);
    setLoadingAi(true);
    setAnalysis(""); 

    try {
      // Matches your api.js: export const getAiAssessment = (email) => API.post('/auth/diagnose', { email: email });
      const res = await getAiAssessment(email);
      
      if (res.data && res.data.summary) {
        setAnalysis(res.data.summary);
        toast.success("AI Analysis Complete");
      } else {
        setAnalysis("AI Analysis completed, but no summary was provided by the engine.");
      }
    } catch (err) {
      console.error("AI API Error:", err);
      const errorMsg = err.response?.data?.message || "Server connection failed. Is the Render backend awake?";
      setAnalysis(`Error: ${errorMsg}`);
      toast.error("AI Engine Offline");
    } finally {
      setLoadingAi(false);
    }
  };

  const trendData = [
    { name: '08:00', hr: 70 },
    { name: '10:00', hr: 75 },
    { name: '12:00', hr: 82 },
    { name: '14:00', hr: 74 },
    { name: '16:00', hr: 78 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center gap-3 mb-10">
          <Activity className="text-indigo-600" size={32} />
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">PATIENT VITALS</h1>
        </header>

        {patients.map((p) => (
          <div key={p.email} className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden mb-8">
            <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{p.name || 'User'}</h2>
                <p className="text-slate-500 font-medium">{p.email}</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase block">BP</span>
                  <span className="text-lg font-mono font-bold text-indigo-600">{p.bloodPressure || '120/80'}</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase block">HR</span>
                  <span className="text-lg font-mono font-bold text-red-500">{p.heartRate || '72'}</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Vitals Chart Section */}
              <div className="mb-10">
                <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                  <Heart size={16} className="text-red-500" /> Vitals History
                </h3>
                
                {/* THE TECHNICAL FIX: Forced height container + isReady guard */}
                <div 
                  ref={chartContainerRef}
                  style={{ width: '100%', height: '300px', minHeight: '300px', position: 'relative' }}
                >
                  {isReady ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Line 
                          type="monotone" 
                          dataKey="hr" 
                          stroke="#4f46e5" 
                          strokeWidth={4} 
                          dot={{ r: 6, fill: '#4f46e5', strokeWidth: 0 }}
                          activeDot={{ r: 8 }}
                          isAnimationActive={false} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <RefreshCw className="animate-spin text-slate-300" />
                    </div>
                  )}
                </div>
              </div>

              {/* AI Button Section */}
              <button
                onClick={() => handleAiCheck(p.email)}
                disabled={loadingAi}
                className={`w-full py-6 rounded-2xl flex items-center justify-center gap-3 text-xl font-black transition-all shadow-xl active:scale-95 ${
                  loadingAi 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                }`}
              >
                <BrainCircuit size={28} />
                {loadingAi ? "AI IS ANALYZING..." : "RUN AI CLINICAL DIAGNOSIS"}
              </button>
            </div>
          </div>
        ))}

        {/* AI Results Section */}
        {analysis && (
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl border-l-[12px] border-indigo-600 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <BrainCircuit className="text-indigo-600" /> AI CLINICAL ASSESSMENT
            </h3>
            <div className="bg-indigo-50/50 p-6 rounded-2xl text-indigo-900 italic text-lg leading-relaxed border border-indigo-100">
              "{analysis}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
