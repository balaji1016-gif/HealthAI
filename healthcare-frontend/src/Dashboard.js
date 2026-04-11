import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit, RefreshCw } from 'lucide-react';
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
      
      // Attempt to sync with backend
      getPatients(user.email)
        .then(res => {
          if (res.data) {
            setPatients([res.data]);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        })
        .catch(() => console.log("Backend warming up..."));
    }
  }, []);

  const handleAiCheck = async (email) => {
    // This console log confirms the button is working
    console.log("DIAGNOSTIC TRIGGERED FOR:", email);
    
    if (!email) {
      toast.error("Profile Error: Email not found.");
      return;
    }

    setLoadingAi(true);
    setAnalysis("Connecting to AI diagnostic engine...");

    try {
      const res = await getAiAssessment(email);
      console.log("Backend Response:", res.data);

      if (res.data && res.data.summary) {
        setAnalysis(res.data.summary);
        toast.success("Analysis Complete");
      } else {
        setAnalysis("AI service is online but returned no summary.");
      }
    } catch (err) {
      console.error("Connection Failed:", err);
      setAnalysis("Server Connection Failed. Please ensure your Render backend is 'Live'.");
      toast.error("Connection Error");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Activity className="text-blue-600" size={32} /> VITAL PORTAL
          </h1>
          <button onClick={() => window.location.reload()} className="p-2 text-slate-400 hover:text-blue-600">
            <RefreshCw size={20} />
          </button>
        </header>

        {patients.map((p) => (
          <div key={p.email} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-10">
            <div className="p-8 border-b border-slate-50">
              <h2 className="text-2xl font-bold text-slate-800">{p.name || "Patient Profile"}</h2>
              <p className="text-slate-400 text-sm">{p.email}</p>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Blood Pressure Bar */}
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-xs font-black text-blue-600 uppercase">Blood Pressure</span>
                    <span className="text-2xl font-mono font-bold text-blue-900">{p.bloodPressure || '120/80'}</span>
                  </div>
                  <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '75%' }}></div>
                  </div>
                </div>

                {/* Heart Rate Bar */}
                <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-xs font-black text-red-600 uppercase">Heart Rate</span>
                    <span className="text-2xl font-mono font-bold text-red-900">{p.heartRate || '72'} BPM</span>
                  </div>
                  <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500" style={{ width: '60%' }}></div>
                  </div>
                </div>
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
          <div className="bg-white p-8 rounded-3xl shadow-lg border-l-8 border-indigo-600 animate-in fade-in duration-500">
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
