import React, { useEffect,依useState } from 'react';
import { getPatients, getAiAssessment } from '../api';
import { Activity, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [patients, setPatients] = useState([]);
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Load user on start
  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      const user = JSON.parse(data);
      setPatients([user]);
      
      // Attempt fresh fetch
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

  // Simplified function
  const runAiProcess = async (email) => {
    // FORCE LOG: This will show in console even if API fails
    console.log("CLICK DETECTED: Running process for " + email);
    
    if (!email) {
      alert("Error: Email is missing from your profile.");
      return;
    }

    setLoadingAi(true);
    setAnalysis("Establishing secure AI connection...");

    try {
      const response = await getAiAssessment(email);
      
      if (response.data && response.data.summary) {
        setAnalysis(response.data.summary);
        toast.success("AI Insights Loaded");
      } else {
        setAnalysis("The AI module is active but returned no data.");
      }
    } catch (error) {
      console.error("The API request failed:", error);
      setAnalysis("Server Connection Failed. Please ensure your Render backend is 'Live' and the URL is correct.");
      toast.error("Connection Error");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-3 mb-10">
          <Activity className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">Healthcare Dashboard</h1>
        </header>

        <div className="grid grid-cols-1 gap-8">
          {patients.map((p) => (
            <div key={p.email || 'main'} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{p.name || "User"}</h2>
                  <p className="text-gray-500">{p.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                  <p className="text-green-500 font-bold">● Connected</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Blood Pressure</p>
                  <p className="text-xl font-bold text-gray-900">{p.bloodPressure || '120/80'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-500 mb-1">Heart Rate</p>
                  <p className="text-xl font-bold text-gray-900">{p.heartRate || '72'} BPM</p>
                </div>
              </div>

              <button
                onClick={() => runAiProcess(p.email)}
                disabled={loadingAi}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 disabled:bg-gray-300"
              >
                <BrainCircuit size={24} />
                {loadingAi ? "ANALYZING..." : "RUN AI DIAGNOSIS"}
              </button>
            </div>
          ))}
        </div>

        {analysis && (
          <div className="mt-10 p-8 bg-white border-t-4 border-indigo-600 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BrainCircuit className="text-indigo-600" /> AI Result
            </h3>
            <p className="text-gray-700 leading-relaxed italic bg-indigo-50 p-6 rounded-lg border border-indigo-100">
              {analysis}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
