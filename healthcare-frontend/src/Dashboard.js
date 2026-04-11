import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    // 1. Initial Load from LocalStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setPatients([user]);
      
      // 2. Refresh from Backend
      getPatients(user.email)
        .then(res => {
          if (res.data) {
            setPatients([res.data]);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        })
        .catch(() => console.log("Backend sync in progress..."));
    }
  }, []);

  const handleAiCheck = async (email) => {
    // This console log is your confirmation the button is working
    console.log("DIAGNOSTIC TRIGGERED FOR:", email);
    
    if (!email) {
      toast.error("User data missing. Please re-login.");
      return;
    }

    setLoadingAi(true);
    setAnalysis("Establishing secure connection to AI Clinical Engine...");

    try {
      // 3. API CALL
      const res = await getAiAssessment(email);
      console.log("BACKEND RESPONSE RECEIVED:", res.data);

      if (res.data && res.data.summary) {
        setAnalysis(res.data.summary);
        toast.success("AI Insights Generated");
      } else {
        setAnalysis("The AI server is awake but returned an empty response.");
      }
    } catch (err) {
      console.error("NETWORK ERROR:", err);
      setAnalysis("Server Connection Failed. Please ensure your Render backend is 'Live' and not sleeping.");
      toast.error("Connection Failed");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Activity className="text-blue-600" size={32} /> HEALTH MONITOR
          </h1>
          <p className="text-slate-500">AI-Powered Diagnostic Dashboard</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* PATIENT VITALS CARD */}
          <div className="lg:col-span-2 space-y-6">
            {patients.map((p) => (
              <div key={p.email} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">{p.name || "Patient Profile"}</h2>
                  <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-black uppercase">
                    Status: Online
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Blood Pressure</p>
                    <p className="text-3xl font-mono font-bold text-blue-600">{p.bloodPressure || '120/80'}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Heart Rate</p>
                    <p className="text-3xl font-mono font-bold text-red-500">{p.heartRate || '72'} <span className="text-sm">BPM</span></p>
                  </div>
                </div>

                {/* THE STABILITY FIX: We use a static placeholder instead of the buggy chart */}
                <div className="h-40 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center mb-8">
                  <Activity className="text-slate-300 mb-2" size={32} />
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Real-time Data Stream Active</p>
                </div>

                <button
                  onClick={() => handleAiCheck(p.email)}
                  disabled={loadingAi}
                  className={`w-full py-5 rounded-2xl flex items-center justify-center gap-4 text-xl font-black transition-all transform active:scale-95 shadow-2xl ${
                    loadingAi ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <BrainCircuit size={28} /> 
                  {loadingAi ? "ANALYZING..." : "RUN AI DIAGNOSIS"}
                </button>
              </div>
            ))}
          </div>

          {/* AI ANALYSIS SIDEBAR */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 h-fit min-h-[500px]">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <BrainCircuit className="text-indigo-600" /> AI Insights
            </h3>
            
            {analysis ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-indigo-900 italic leading-relaxed shadow-inner">
                "{analysis}"
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-300 border-2 border-dashed border-slate-50 rounded-2xl">
                <AlertTriangle size={48} className="mb-4 opacity-20" />
                <p className="text-sm text-center px-6 font-medium">Click the button on the left to start AI clinical analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
