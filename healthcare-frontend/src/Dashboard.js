import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit, Heart, LineChart as ChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // GUARD: Prevents early render

  useEffect(() => {
    // Force the chart to wait until the browser has painted the DOM
    setIsMounted(true);

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
  }, []);

  const handleAiCheck = async (email) => {
    console.log("Triggering AI Diagnosis for:", email);
    setLoadingAi(true);
    try {
      const res = await getAiAssessment(email);
      if (res.data && res.data.summary) {
        setAnalysis(res.data.summary);
        toast.success("AI Insights Generated");
      }
    } catch (err) {
      console.error("API Error:", err);
      toast.error("Server Connection Failed");
    } finally {
      setLoadingAi(false);
    }
  };

  const chartData = [
    { time: '10am', hr: 72 }, { time: '11am', hr: 75 },
    { time: '12pm', hr: 80 }, { time: '1pm', hr: 74 },
    { time: '2pm', hr: 72 }
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex items-center gap-3">
          <Activity className="text-blue-600" size={32} />
          <h1 className="text-3xl font-black text-slate-800">CLINICAL PORTAL</h1>
        </header>

        {patients.map((p) => (
          <div key={p.email} className="bg-white rounded-3xl shadow-2xl p-8 mb-10 border border-slate-100">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold">{p.name || "Patient Profile"}</h2>
                <p className="text-slate-500">{p.email}</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center min-w-[100px]">
                  <span className="text-[10px] font-black text-blue-600 uppercase">BP</span>
                  <p className="text-xl font-mono font-bold">{p.bloodPressure || '120/80'}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center min-w-[100px]">
                  <span className="text-[10px] font-black text-red-600 uppercase">HR</span>
                  <p className="text-xl font-mono font-bold">{p.heartRate || '72'} BPM</p>
                </div>
              </div>
            </div>

            {/* Vitals Trend Feature */}
            <div className="mb-10">
              <h3 className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-2">
                <ChartIcon size={16} /> Heart Rate Trend
              </h3>
              
              {/* STABILITY FIX: We force a height on the parent div 
                  and only render after isMounted is true. */}
              <div className="w-full h-[300px] min-h-[300px] relative">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} />
                      <Tooltip />
                      <Line type="monotone" dataKey="hr" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: '#4f46e5' }} />
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
