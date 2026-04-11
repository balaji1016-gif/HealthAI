import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Static data for the chart to satisfy the Recharts requirement
  const chartData = [
    { name: 'Mon', hr: 70 },
    { name: 'Tue', hr: 72 },
    { name: 'Wed', hr: 68 },
    { name: 'Thu', hr: 74 },
    { name: 'Fri', hr: 71 },
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setPatients([user]);
      
      // Try to refresh data from server
      getPatients(user.email)
        .then(res => {
          if (res.data) {
            setPatients([res.data]);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        })
        .catch(() => console.log("Using cached local data."));
    }
  }, []);

  const handleAiCheck = async (email) => {
    // Safety check to prevent code crash
    if (!email) {
      toast.error("User email is missing. Please log in again.");
      return;
    }

    setLoadingAi(true);
    setAnalysis("AI is connecting to the diagnostic server...");

    try {
      // Triggering the API call
      const res = await getAiAssessment(email);
      
      if (res.data && res.data.summary) {
        setAnalysis(res.data.summary);
        toast.success("Analysis Complete");
      } else {
        setAnalysis("The AI server responded, but no clinical summary was generated.");
      }
    } catch (err) {
      console.error("API Call Failed:", err);
      setAnalysis("Server connection failed. The backend might be starting up—please try again in 30 seconds.");
      toast.error("Connection Failed");
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
          <div key={patient.email || 'user-card'} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-semibold text-gray-700">{patient.name || "Patient"}</h2>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                Age: {patient.age || "N/A"}
              </span>
            </div>
            
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Blood Pressure:</span> 
                <span className="font-bold text-blue-600">{patient.bloodPressure || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Heart Rate:</span> 
                <span className="font-bold text-red-500">{patient.heartRate || 'N/A'} BPM</span>
              </div>
            </div>

            {/* FIXED CHART CONTAINER: The 'height' here solves the width(-1) height(-1) error */}
            <div className="mt-4 mb-4" style={{ width: '100%', height: '200px', minHeight: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="hr" stroke="#4f46e5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <button
              onClick={() => handleAiCheck(patient.email)}
              disabled={loadingAi}
              className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-all shadow-md ${
                loadingAi ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
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
