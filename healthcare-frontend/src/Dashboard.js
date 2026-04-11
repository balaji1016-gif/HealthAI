import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    // We try to load the user from local storage first
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setPatients([user]);
      
      // Then we try to get fresh data from the backend
      getPatients(user.email)
        .then(res => {
          if (res.data) {
            setPatients([res.data]);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        })
        .catch(err => console.log("Fresh data fetch skipped, using local data."));
    }
  }, []);

  const handleAiCheck = async (email) => {
    console.log("Button clicked! Attempting AI check for:", email);
    
    if (!email) {
      toast.error("Error: No email found for this user.");
      return;
    }

    setLoadingAi(true);
    setAnalysis("AI is connecting to your clinical data...");

    try {
      // THIS IS THE CALL THAT SHOULD SHOW IN NETWORK TAB
      console.log("Sending request to backend...");
      const res = await getAiAssessment(email);
      
      console.log("Response received:", res.data);

      if (res.data && res.data.summary) {
        setAnalysis(res.data.summary);
        toast.success("Analysis Complete");
      } else {
        setAnalysis("The AI server responded but did not provide a summary.");
      }
    } catch (err) {
      console.error("The request failed completely:", err);
      setAnalysis("Critical Connection Error: The request never left your browser or the server is down.");
      toast.error("Server Connection Failed");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <Activity className="text-blue-600" /> Patient Wellness Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <div key={patient.email || 'unique'} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-gray-700">{patient.name || "Patient"}</h2>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                Age: {patient.age || "N/A"}
              </span>
            </div>
            
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Blood Pressure:</span> 
                <span className="font-bold text-blue-600">{patient.bloodPressure || '120/80'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Heart Rate:</span> 
                <span className="font-bold text-red-500">{patient.heartRate || '72'} BPM</span>
              </div>
            </div>

            <button
              onClick={() => handleAiCheck(patient.email)}
              disabled={loadingAi}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all ${
                loadingAi ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg'
              }`}
            >
              <BrainCircuit size={20} /> 
              {loadingAi ? "Analyzing..." : "Run AI Diagnosis"}
            </button>
          </div>
        ))}
      </div>

      {analysis && (
        <div className="mt-8 p-6 bg-white border-l-4 border-indigo-500 rounded-r-xl shadow-md">
          <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
            <BrainCircuit size={20} /> AI Clinical Insights
          </h3>
          <div className="text-gray-700 leading-relaxed bg-indigo-50 p-4 rounded-lg border border-indigo-100 italic">
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
