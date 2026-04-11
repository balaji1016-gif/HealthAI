import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from './api';
import { Activity, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    // 1. Get user data from localStorage (saved during login)
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user && user.email) {
      // In a single-user dashboard, we show the logged-in user's card
      // If your backend getPatients() returns a list, use that instead.
      setPatients([user]); 
    } else {
      // Fallback: Fetch from backend if localStorage is empty
      getPatients()
        .then(res => {
          const data = Array.isArray(res.data) ? res.data : [res.data];
          setPatients(data);
        })
        .catch(() => toast.error("Failed to load patient data"));
    }
  }, []);

  const handleAiCheck = async (email) => {
    setAnalysis("AI is analyzing your vitals...");
    setLoadingAi(true);
    try {
      // 2. We pass 'email' because your Java @Id is now email
      const res = await getAiAssessment(email);
      
      // 3. Match the backend key "summary" from our AuthController
      setAnalysis(res.data.summary);
      toast.success("AI Analysis Complete");
    } catch (err) {
      setAnalysis("Connection Error: Could not reach the AI Diagnostic Service.");
      toast.error("AI Service Unavailable");
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
        {patients.map(patient => (
          // Use email as key since id is now null in your DB
          <div key={patient.email} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-gray-700">{patient.name}</h2>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                Age: {patient.age}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-gray-600 text-sm flex justify-between">
                <span>Blood Pressure:</span> 
                <span className="font-mono font-semibold text-blue-600">{patient.bloodPressure || 'N/A'}</span>
              </p>
              <p className="text-gray-600 text-sm flex justify-between">
                <span>Heart Rate:</span> 
                <span className="font-mono font-semibold text-red-500">{patient.heartRate || 'N/A'} BPM</span>
              </p>
            </div>

            <button
              onClick={() => handleAiCheck(patient.email)}
              disabled={loadingAi}
              className={`mt-4 w-full py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors ${
                loadingAi ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <BrainCircuit size={18} /> 
              {loadingAi ? "Processing..." : "Run AI Diagnosis"}
            </button>
          </div>
        ))}
      </div>

      {analysis && (
        <div className="mt-8 p-6 bg-white border-l-4 border-indigo-500 rounded-r-xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="text-indigo-600" size={20} />
            <h3 className="font-bold text-indigo-900">AI Clinical Insights</h3>
          </div>
          <p className="text-gray-700 leading-relaxed bg-indigo-50 p-4 rounded-lg border
