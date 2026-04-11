import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // 1. Force clear the view and reload fresh data
  useEffect(() => {
    const init = () => {
      const data = localStorage.getItem('user');
      if (data) {
        const user = JSON.parse(data);
        setPatients([user]);
        
        // Immediate fetch from backend to ensure connection is live
        getPatients(user.email)
          .then(res => {
            if (res.data) {
              setPatients([res.data]);
              localStorage.setItem('user', JSON.stringify(res.data));
            }
          })
          .catch(() => console.log("Backend warming up..."));
      }
    };
    init();
  }, []);

  // 2. The most direct version of the AI call possible
  const handleAiCall = async (email) => {
    console.log("!!! ATTEMPTING AI CALL FOR: " + email);
    
    if (!email) {
      alert("System Error: No email found in local storage.");
      return;
    }

    setLoadingAi(true);
    setAnalysis("Connecting to Gemini AI via Render...");

    try {
      // Direct call to your API.js function
      const res = await getAiAssessment(email);
      
      console.log("SERVER RESPONSE RECEIVED:", res.data);

      if (res.data && res.data.summary) {
        setAnalysis(res.data.summary);
        toast.success("AI Analysis Complete");
      } else {
        setAnalysis("The server responded but the AI summary was empty.");
      }
    } catch (err) {
      console.error("NETWORK ERROR:", err);
      setAnalysis("Server Connection Failed. 1. Check if Render is 'Live'. 2. Check your internet. 3. Try again in 1 minute.");
      toast.error("Connection Failed");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Activity className="text-indigo-600" size={36} /> HEALTH DASHBOARD
          </h1>
          <button 
            onClick={() => window.location.reload()} 
            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
            title="Force Refresh"
          >
            <RefreshCw size={20} />
          </button>
        </div>

        {patients.length > 0 ? (
          patients.map((p) => (
            <div key={p.email} className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 mb-10">
              <div className="bg-indigo-600 p-6 text-white">
                <h2 className="text-2xl font-bold">{p.name || "Patient Profile"}</h2>
                <p className="opacity-80 text-sm">{p.email}</p>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Blood Pressure</p>
                    <p className="text-3xl font-mono font-bold text-slate-800">{p.bloodPressure || 'N/A'}</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Heart Rate</p>
                    <p className="text-3xl font-mono font-bold text-slate-800">{p.heartRate || 'N/A'} <span className="text-lg">BPM</span></p>
                  </div>
                </div>

                <button
                  onClick={() => handleAiCall(p.email)}
                  disabled={loadingAi}
                  className={`w-full py-5 rounded-2xl flex items-center justify-center gap-4 text-xl font-black transition-all transform active:scale-95 ${
                    loadingAi 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 shadow-2xl'
                  }`}
                >
                  <BrainCircuit size={28} />
                  {loadingAi ? "ANALYZING DATA..." : "RUN AI DIAGNOSIS"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400">No patient data found. Please log in again.</p>
          </div>
        )}

        {analysis && (
          <div className="bg-white p-8 rounded-3xl shadow-xl border-t-8 border-indigo-600 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3 mb-4 text-indigo-600">
              <BrainCircuit size={28} />
              <h3 className="text-xl font-black uppercase tracking-tight">Clinical Insights</h3>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl text-slate-700 leading-relaxed text-lg border border-slate-100 italic">
              "{analysis}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
