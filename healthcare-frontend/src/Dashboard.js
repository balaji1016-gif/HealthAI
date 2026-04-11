import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit, CheckCircle } from 'lucide-react';
// Import Recharts components
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
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
    console.log("Starting AI Diagnosis for", email);
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

  // Sample data for the chart to ensure it has something to show
  const chartData = [
    { time: '10am', hr: 70 }, { time: '11am', hr: 72 }, { time: '12pm', hr: 75 },
    { time: '1pm', hr: 71 }, { time: '2pm', hr: 74 },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Activity className="text-blue-600" size={32} /> CLINICAL PORTAL
          </h1>
        </header>

        {patients.map((p) => (
          <div key={p.email} className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden mb-10">
            <div className="p-8 border-b border-slate-50">
              <h2 className="text-2xl font-bold text-slate-800">{p.name}</h2>
              <p className="text-slate-400">{p.email}</p>
            </div>

            <div className="p-8">
              {/* Vitals Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="p-6 rounded-2xl border border-blue-100 bg-blue-50/30">
                  <span className="text-xs font-black text-blue-600 uppercase">Blood Pressure</span>
                  <p className="text-3xl font-mono font-bold text-blue-900">{p.bloodPressure || '120/80'}</p>
                </div>
                <div className="p-6 rounded-2xl border border-red-100 bg-red-50/30">
                  <span className="text-xs font-black text-red-600 uppercase">Heart Rate</span>
                  <p className="text-3xl font-mono font-bold text-red-900">{p.heartRate || '72'} BPM</p>
                </div>
              </div>

              {/* RECHARTS SECTION - FIXED */}
              <div className="mb-10">
                <h3 className="text-sm font-bold text-slate-500 mb-4 uppercase">Vital Trends</h3>
                {/* CRITICAL FIX: We wrap ResponsiveContainer in a div with a FIXED MIN-HEIGHT.
                  This prevents the "width/height (-1)" error by giving Recharts a target size.
                */}
                <div style={{ width: '100%', height: 300, minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} domain={['auto', 'auto']} />
                      <Tooltip />
                      <Line type="monotone" dataKey="hr" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <button
                onClick={() => handleAiCheck(p.email)}
                disabled={loadingAi}
                className="w-full py-5 rounded-2xl flex items-center justify-center gap-4 text-xl font-black transition-all shadow-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-slate-300"
              >
                <BrainCircuit size={28} />
                {loadingAi ? "ANALYZING..." : "RUN AI DIAGNOSIS"}
              </button>
            </div>
          </div>
        ))}

        {analysis && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border-l-8 border-indigo-600">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <BrainCircuit className="text-indigo-600" /> AI CLINICAL SUMMARY
            </h3>
            <p className="bg-indigo-50 p-6 rounded-2xl text-indigo-900 italic border border-indigo-100">"{analysis}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
