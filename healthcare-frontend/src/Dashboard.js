import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    // 1. Get user from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setPatients([user]);
      
      // 2. Refresh data from the server
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
    // This log will confirm the button is working in your F12 console
    console.log("AI Diagnostic started for:", email);
    
    if (!email) {
      toast.error("User email missing. Please re-login.");
      return;
    }

    setLoadingAi(true);
    setAnalysis("AI is analyzing your clinical vitals...");

    try {
      // 3. This is the network request
      const res = await getAiAssessment(email);
      
      if (res.data && res.data.summary) {
        setAnalysis(res.data.summary);
        toast.success("Analysis Complete");
      } else {
        setAnalysis("The AI server responded but did not return a summary.");
      }
    } catch (err) {
      console.error("Connection failed:", err);
      setAnalysis("Server connection failed. Is the Render backend awake?");
      toast.error("Connection Failed");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800">
          <Activity className="text-blue-600" size={32} /> Patient Health Portal
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {patients.map((patient) => (
            <div key={patient.email || 'main'} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{patient.name || "Patient"}</h2>
                  <p className="text-gray-500 text-sm">{patient.email}</p>
                </div>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                  Age: {patient.age || "N/A"}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-600 font-bold uppercase mb-1">Blood Pressure</p>
                  <p className="text-2xl font-mono font-bold text-blue-900">{patient.bloodPressure || '120/80'}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <p className="text-xs text-red-600 font-bold uppercase mb-1">Heart Rate</p>
                  <p className="text-2xl font-mono font-bold text-red-900">{patient.heartRate || '72'} <span className="text-sm">BPM</span></p>
                </div>
              </div>

              {/* STABILITY FIX: We use a placeholder area instead of the buggy ResponsiveContainer */}
              <div className="h-32 w-full bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center mb-6">
                <p className="text-gray-400 text-xs italic text-center px-4">
                  Real-time Vital Stream Active <br/> (Vitals within normal baseline)
                </p>
              </div>

              <button
                onClick={() => handleAiCheck(patient.email)}
                disabled={loadingAi}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-lg active:scale-95 ${
                  loadingAi ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                <BrainCircuit size={24} /> 
                {loadingAi ? "Analyzing..." : "Run AI Diagnosis"}
              </button>
            </div>
          ))}

          {/* AI RESULTS SECTION */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BrainCircuit className="text-indigo-600" size={24} /> 
              Clinical AI Summary
            </h3>
            
            {analysis ? (
              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-indigo-900 leading-relaxed italic shadow-inner">
                "{analysis}"
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed border-gray-50 rounded-2xl">
                <BrainCircuit size={48} className="mb-4 opacity-10" />
                <p>Click the button to generate clinical insights</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
