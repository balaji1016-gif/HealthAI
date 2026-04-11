import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit, Heart, Thermometer } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isReady, setIsReady] = useState(false); // GUARD 1: Lifecycle check

  useEffect(() => {
    setIsReady(true);
    const data = localStorage.getItem('user');
    if (data) {
      const user = JSON.parse(data);
      setPatients([user]);
      getPatients(user.email).then(res => {
        if (res.data) {
          setPatients([res.data]);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      });
    }
  }, []);

  const handleAiCheck = async (email) => {
    setLoadingAi(true);
    try {
      const res = await getAiAssessment(email);
      if (res.data?.summary) setAnalysis(res.data.summary);
      toast.success("AI Insights Generated");
    } catch (err) {
      toast.error("Server Connection Failed");
    } finally {
      setLoadingAi(false);
    }
  };

  const chartData = [
    { name: 'Mon', hr: 70 }, { name: 'Tue', hr: 75 }, { name: 'Wed', hr: 72 },
    { name: 'Thu', hr: 80 }, { name: 'Fri', hr: 74 }
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-8 flex items-center gap-2">
          <Activity className="text-indigo-600" /> VITAL CARE PORTAL
        </h1>

        {patients.map((p) => (
          <div key={p.email} className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-slate-200">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold">{p.name}</h2>
                <p className="text-slate-500">{p.email}</p>
              </div>
              <div className="flex gap-4">
                <div className="text-right">
                  <span className="block text-xs font-bold text-slate-400 uppercase">Blood Pressure</span>
                  <span className="text-xl font-mono font-bold text-indigo-600">{p.bloodPressure || '120/80'}</span>
                </div>
                <div className="text-right">
                  <span className="block text-xs font-bold text-slate-400 uppercase">Heart Rate</span>
                  <span className="text-xl font-mono font-bold text-red-500">{p.heartRate || '72'} BPM</span>
                </div>
              </div>
            </div>

            {/* FEATURE: REAL-TIME TREND CHART */}
            <div className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Vitals Trend Analysis</h3>
              
              {/* GUARD 2: Force specific height and only render after mount */}
              <div style={{ width: '100%', height: 300, minHeight: 300 }}>
                {isReady && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                      <Line type="monotone" dataKey="hr" stroke="#4f46e5" strokeWidth={4} dot={{ r: 6, fill: '#4f46e5' }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* FEATURE: AI DIAGNOSIS TRIGGER */}
            <button
              onClick={() => handleAiCheck(p.email)}
              disabled={loadingAi}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95"
            >
              <BrainCircuit size={28} />
              {loadingAi ? "AI IS ANALYZING..." : "RUN AI DIAGNOSIS"}
            </button>
          </div>
        ))}

        {/* FEATURE: AI RESPONSE DISPLAY */}
        {analysis && (
          <div className="bg-white p-8 rounded-3xl shadow-2xl border-l-[12px] border-indigo-600 animate-in fade-in slide-in-from-bottom-5 duration-500">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              <BrainCircuit className="text-indigo-600" /> AI CLINICAL SUMMARY
            </h3>
            <div className="bg-indigo-50 p-6 rounded-2xl text-indigo-900 italic text-lg leading-relaxed border border-indigo-100">
              "{analysis}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
