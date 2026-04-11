import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit } from 'lucide-react';
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
    // This will definitely show in the console if the click works
    console.log("Button Clicked for email:", email);
    
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
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2 text-gray-800">
          <Activity className="text-blue-600" /> Patient Wellness Dashboard
        </h1>

        {patients.map((patient) => (
          <div key={patient.email} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{patient.name || "Patient"}</h2>
                <p className="text-gray-500 text-sm">{patient.email}</p>
              </div>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
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
                <p className="text-2xl font-mono font-bold text-red-900">{patient.heartRate || '72'} BPM</p>
              </div>
            </div>

            <button
              onClick={() => handleAiCheck(patient.email)}
              disabled={loadingAi}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg transition-all ${
                loadingAi ? 'bg-gray-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
              }`}
            >
              <BrainCircuit size={24} /> 
              {loadingAi ? "ANALYZING..." : "RUN AI DIAGNOSIS"}
            </button>
          </div>
        ))}

        {analysis && (
          <div className="mt-8 p-6 bg-white border-l-4 border-indigo-500 rounded-r-xl shadow-md animate-pulse">
            <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <BrainCircuit size={20} /> AI Clinical Insights
            </h3>
            <p className="text-gray-700 leading-relaxed bg-indigo-50 p-4 rounded-lg border border-indigo-100 italic">
              {analysis}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
