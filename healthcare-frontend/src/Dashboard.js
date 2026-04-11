import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Sample data for the chart to prevent it from being empty
  const chartData = [
    { name: 'Mon', hr: 72 },
    { name: 'Tue', hr: 75 },
    { name: 'Wed', hr: 71 },
    { name: 'Thu', hr: 79 },
    { name: 'Fri', hr: 74 },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user && user.email) {
      // We fetch fresh data from the server using the stored email.
      getPatients(user.email)
        .then(res => {
          const freshData = Array.isArray(res.data) ? res.data : [res.data];
          setPatients(freshData);
          localStorage.setItem('user', JSON.stringify(freshData[0]));
        })
        .catch(() => {
          setPatients([user]);
        });
    }
  }, []);

  const handleAiCheck = async (email) => {
    if (!email) {
      toast.error("User email missing. Please re-login.");
      return;
    }

    setAnalysis("AI is analyzing your vitals...");
    setLoadingAi(true);
    try {
      const res = await getAiAssessment(email);
      
      // We check for 'summary' which is what our Java backend sends
      if (res.data && res.data.summary) {
        setAnalysis(res.data.summary);
        toast.success("AI Analysis Complete");
      } else {
        setAnalysis("AI service responded but no summary was generated.");
      }
    } catch (err) {
      console.error("AI Fetch Error:", err);
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

            {/* CHART SECTION: Fixed the Width/Height Error by wrapping in a 300px div */}
            <div className="mt-4 mb-4" style={{ width: '100%', height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Line type="monotone" dataKey="hr" stroke="#4f46e5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
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
          <p className="text-gray-700 leading-relaxed bg-indigo-50 p-4 rounded-lg border border-indigo-100 italic">
            "{analysis}"
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
