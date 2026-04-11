import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit, RefreshCcw } from 'lucide-react';
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
      
      // Attempt fresh sync
      getPatients(user.email)
        .then(res => {
          if (res.data) {
            setPatients([res.data]);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        })
        .catch(() => console.log("Backend sync active..."));
    }
  }, []);

  const handleAiCheck = async (email) => {
    // This MUST show in the console if the button is working
    console.log("!!! TRIGGERING AI DIAGNOSIS FOR:", email);
    
    if (!email) {
      toast.error("Email not found. Please log in again.");
      return;
    }

    setLoadingAi(true);
    setAnalysis("Connecting to Render backend...");

    try {
      const res = await getAiAssessment(email);
      console.log("Backend Response:", res.data);

      if (res.data && res.data.summary) {
        setAnalysis(res.data.summary);
        toast.success("AI Insights Generated");
      } else {
        setAnalysis("The AI server responded but didn't return a summary.");
      }
    } catch (err) {
      console.error("CRITICAL CONNECTION ERROR:", err);
      setAnalysis("Server connection failed. Is the Render backend live?");
      toast.error("Connection Failed");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Activity className="text-blue-600" size={36} /> HEALTH DASHBOARD
          </h1>
          <button onClick={() => window.location.reload()} className="p-2 text-slate-400 hover:text-blue-600">
            <RefreshCcw size={20} />
          </button>
        </header>

        {patients.map((p) => (
          <div key={p.email} className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden mb-10">
            <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <h2 className="text-2xl font-bold">{p.name || "Patient Profile"}</h2>
              <p className="opacity-80">{p.email}</p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Blood Pressure</p>
                  <p className="text-3xl font-mono font-bold text-slate-800">{p.bloodPressure || '120/80'}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Heart Rate</p>
                  <p className="text-3xl font-mono font-bold text-slate-800">{p.heartRate || '72'} <span className="text-sm">BPM</span></p>
                </div>
              </div>

              {/* STABILITY PLACEHOLDER: No charts, so no width/height errors */}
              <div className="h-2 bg-slate-100 rounded-full mb-10 overflow-hidden">
                <div className="h-full bg-blue-500 w-2/3"></div>
              </div>

              <button
                onClick={() => handleAiCheck(p.email)}
                disabled={loadingAi}
                className={`w-full py-5 rounded-2xl flex items-center justify-center gap-4 text-xl font-black transition-all shadow-xl active:scale-95 ${
                  loadingAi ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <BrainCircuit size={28} />
                {loadingAi ? "ANALYZING..." : "RUN AI DIAGNOSIS"}
              </button>
            </div>
          </div>
        ))}

        {analysis && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border-l-8 border-indigo-600 animate-in fade-in duration-500">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <BrainCircuit className="text-indigo-600" /> AI CLINICAL SUMMARY
            </h3>
            <div className="bg-indigo-50 p-6 rounded-2xl text-indigo-900 italic text-lg border border-indigo-100">
              "{analysis}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
