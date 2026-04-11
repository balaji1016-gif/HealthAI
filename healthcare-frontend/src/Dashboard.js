import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit, Heart, Activity as ChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // CRITICAL: Mount Guard

  useEffect(() => {
    // Force a re-render after mount so the browser has time to paint the layout
    setIsMounted(true);

    const data = localStorage.getItem('user');
    if (data) {
      const user = JSON.parse(data);
      setPatients([user]);
      
      getPatients(user.email)
        .then(res => {
          if (res.data) {
            setPatients([res.data]);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        })
        .catch(() => console.log("Backend syncing..."));
    }
  }, []);

  const handleAiCheck = async (email) => {
    console.log("AI check triggered for:", email);
    setLoadingAi(true);
    try {
      const res = await getAiAssessment(email);
      if (res.data && res.data.summary) {
        setAnalysis(res.data.summary);
        toast.success("AI Insights Generated");
      }
    } catch (err) {
      console.error("Connection Error:", err);
      toast.error("Server Connection Failed");
    } finally {
      setLoadingAi(false);
    }
  };

  const chartData = [
    { time: '10am', value: 72 }, { time: '11am', value: 75 },
    { time: '12pm', value: 80 }, { time: '1pm', value: 74 },
    { time: '2pm', value: 72 }, { time: '3pm', value: 78 }
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Activity className="text-blue-600" size={36} /> CLINICAL DASHBOARD
          </h1>
        </header>

        {patients.map((p) => (
          <div key={p.email} className="bg-white rounded-3xl shadow-2xl p-8 mb-10 border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold">{p.name || "Patient Profile"}</h2>
                <p className="text-slate-400">{p.email}</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                  <span className="text-xs font-black text-blue-600 uppercase">BP</span>
                  <p className="text-xl font-mono font-bold">{p.bloodPressure || '120/80'}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                  <span className="text-xs font-black text-red-600 uppercase">HR</span>
                  <p className="text-xl font-mono font-bold">{p.heartRate || '72'} BPM</p>
                </div>
              </div>
            </div>

            {/* CHART SECTION WITH STABILITY FIX */}
            <div className="mb-10">
              <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                <ChartIcon size={16} /> Vital Trends
              </h3>
              {/* THE FIX: Direct parent MUST have a height.
                isMounted ensures the ResponsiveContainer doesn't try to calculate 
                size until the DOM element actually exists.
              */}
              <div style={{ width: '100%', height: 300, minHeight: 300 }}>
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#4f46e5" 
                        strokeWidth={4} 
                        dot={{ r: 6, fill: '#4f46e5' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <button
              onClick={() => handleAiCheck(p.email)}
              disabled={loadingAi}
              className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-xl hover:bg-indigo-700 transition-all shadow-xl active:scale-95 disabled:bg-slate-300 flex items-center justify-center gap-3"
            >
              <BrainCircuit size={28} />
              {loadingAi ? "AI ANALYZING..." : "RUN AI DIAGNOSIS"}
            </button>
          </div>
        ))}

        {analysis && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border-l-8 border-indigo-600 animate-in fade-in duration-500">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <BrainCircuit className="text-indigo-600" /> AI CLINICAL SUMMARY
            </h3>
            <p className="bg-indigo-50 p-6 rounded-2xl text-indigo-900 italic border border-indigo-100 leading-relaxed text-lg">
              "{analysis}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
