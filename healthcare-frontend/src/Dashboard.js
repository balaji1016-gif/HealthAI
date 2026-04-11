import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // 1. Ensure the component is fully mounted before rendering the chart
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
    { time: '10am', hr: 72 }, { time: '11am', hr: 75 }, { time: '12pm', hr: 80 },
    { time: '1pm', hr: 74 }, { time: '2pm', hr: 72 },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
          <Activity className="text-blue-600" /> CLINICAL PORTAL
        </h1>

        {patients.map((p) => (
          <div key={p.email} className="bg-white rounded-3xl shadow-2xl p-8 mb-10 border border-slate-100">
            <h2 className="text-2xl font-bold mb-6">{p.name} - Vitals</h2>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-blue-50 rounded-2xl">
                <span className="text-xs font-bold text-blue-600 uppercase">BP</span>
                <p className="text-2xl font-mono font-bold">{p.bloodPressure || '120/80'}</p>
              </div>
              <div className="p-6 bg-red-50 rounded-2xl">
                <span className="text-xs font-bold text-red-600 uppercase">HR</span>
                <p className="text-2xl font-mono font-bold">{p.heartRate || '72'} BPM</p>
              </div>
            </div>

            {/* CHART CONTAINER WITH STABILITY FIX */}
            <div className="mb-10" style={{ width: '100%', height: '300px', minHeight: '300px', position: 'relative' }}>
              {/* Only render the chart if mounted to avoid the -1 width error */}
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" />
                    <YAxis domain={['auto', 'auto']} />
                    <Tooltip />
                    <Line type="monotone" dataKey="hr" stroke="#4f46e5" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <button
              onClick={() => handleAiCheck(p.email)}
              disabled={loadingAi}
              className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black text-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-lg"
            >
              <BrainCircuit className="inline mr-2" />
              {loadingAi ? "ANALYZING..." : "RUN AI DIAGNOSIS"}
            </button>
          </div>
        ))}

        {analysis && (
          <div className="bg-white p-8 rounded-3xl border-l-8 border-indigo-600 shadow-xl">
            <h3 className="font-black mb-4">AI CLINICAL SUMMARY</h3>
            <p className="italic text-indigo-900 leading-relaxed">"{analysis}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
