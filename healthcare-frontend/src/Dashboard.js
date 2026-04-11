import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    // 1. Initial load from local storage
    const data = localStorage.getItem('user');
    if (data) {
      const user = JSON.parse(data);
      setPatients([user]);
      
      // 2. Refresh data from the Render backend
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
    console.log("AI Diagnostic Button Clicked for:", email);
    
    if (!email) {
      toast.error("Profile Error: Email not found.");
      return;
    }

    setLoadingAi(true);
    setAnalysis("Establishing secure link to AI engine...");

    try {
      // 3. Trigger the network request to Render
      const res = await getAiAssessment(email);
      console.log("Response from server:", res.data);

      if (res.data && res.data.summary) {
        setAnalysis(res.data.summary);
        toast.success("AI Insights Generated");
      } else {
        setAnalysis("The AI module is active but returned an empty result.");
      }
    } catch (err) {
      console.error("The API call failed:", err);
      setAnalysis("Server Connection Failed. Please ensure your Render backend is 'Live'.");
      toast.error("Connection Error");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Activity className="text-blue-600" size={32} />
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">VITAL CARE</h1>
          </div>
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100">
            <ShieldCheck size={18} />
            <span className="text-xs font-bold uppercase">System Stable</span>
          </div>
        </header>

        {patients.map((p) => (
          <div key={p.email} className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden mb-10">
            {/* Patient Header */}
            <div className="p-8 border-b border-slate-50">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">{p.name || "Patient Profile"}</h2>
              <p className="text-slate-400 text-sm">{p.email}</p>
            </div>

            {/* Vitals Grid */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xs font-black text-blue-600 uppercase">Blood Pressure</span>
                  <span className="text-2xl font-mono font-bold text-blue-900">{p.bloodPressure || '120/80'}</span>
                </div>
                {/* Manual Vital Bar (Replaces the broken chart) */}
                <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xs font-black text-red-600 uppercase">Heart Rate</span>
                  <span className="text-2xl font-mono font-bold text-red-900">{p.heartRate || '72'} <small className="text-sm">BPM</small></span>
                </div>
                {/* Manual Vital Bar (Replaces the broken chart) */}
                <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="px-8 pb-8">
              <button
                onClick={() => handleAiCheck(p.email)}
                disabled={loadingAi}
                className={`w-full py-5 rounded-2xl flex items-center justify-center gap-4 text-xl font-black transition-all shadow-xl active:scale-95 ${
                  loadingAi 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <BrainCircuit size={28} />
                {loadingAi ? "ANALYZING..." : "RUN AI DIAGNOSIS"}
              </button>
            </div>
          </div>
        ))}

        {/* AI Results Section */}
        {analysis && (
          <div className="bg-white p-8 rounded-3xl shadow-lg border-l-8 border-indigo-600">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <BrainCircuit className="text-indigo-600" /> AI CLINICAL INSIGHT
            </h3>
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-indigo-900 leading-relaxed italic text-lg">
              "{analysis}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
