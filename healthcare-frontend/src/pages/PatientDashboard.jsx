import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, Thermometer, Heart, FileText, Send, User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState({ bloodPressure: '', heartRate: '', medicalHistory: '' });
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setPatient(parsed);
      setVitals({
        bloodPressure: parsed.bloodPressure || '',
        heartRate: parsed.heartRate || '',
        medicalHistory: parsed.medicalHistory || ''
      });
    } else { window.location.href = '/login'; }
  }, []);

  const handleUpdateAndDiagnose = async () => {
    setLoading(true);
    try {
      // 1. Get AI Analysis
      const aiRes = await axios.post('https://health-ai-backend-q09o.onrender.com/api/auth/diagnose', {
        ...patient,
        bloodPressure: vitals.bloodPressure,
        heartRate: vitals.heartRate
      });
      
      const report = aiRes.data.summary;
      setAiResult(report);

      // 2. Sync to Database (Save vitals AND the report for the Doctor)
      await axios.put('https://health-ai-backend-q09o.onrender.com/api/auth/update-vitals', {
        email: patient.email,
        bloodPressure: vitals.bloodPressure,
        heartRate: vitals.heartRate,
        medicalHistory: report 
      });

      toast.success("Vitals Updated & Report Synced");
    } catch (err) {
      toast.error("Process Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!patient) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <header className="flex justify-between items-center mb-8 border-b-4 border-blue-600 pb-4">
        <h1 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter">Patient Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all">
          <LogOut size={18}/> LOGOUT
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-xl font-black text-slate-800 mb-6 uppercase flex items-center gap-2">
            <Activity className="text-blue-600"/> Update Your Vitals
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-2">Blood Pressure (mmHg)</label>
              <input 
                type="text" value={vitals.bloodPressure}
                className="w-full p-4 bg-slate-50 border-2 rounded-2xl font-bold focus:border-blue-600 outline-none transition-all"
                onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-2">Heart Rate (BPM)</label>
              <input 
                type="text" value={vitals.heartRate}
                className="w-full p-4 bg-slate-50 border-2 rounded-2xl font-bold focus:border-blue-600 outline-none transition-all"
                onChange={(e) => setVitals({...vitals, heartRate: e.target.value})}
              />
            </div>
            <button 
              onClick={handleUpdateAndDiagnose}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg disabled:bg-slate-400 transition-all"
            >
              {loading ? "Processing..." : "Generate AI Health Report"}
            </button>
          </div>
        </div>

        {/* Report Display Section */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 min-h-[500px]">
          <h2 className="text-xl font-black text-slate-800 mb-6 uppercase flex items-center gap-2">
            <FileText className="text-blue-600"/> AI Health Analysis
          </h2>
          <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-200 h-full overflow-y-auto">
            {aiResult ? (
              <div className="prose prose-blue max-w-none text-slate-700 font-medium leading-relaxed" 
                   dangerouslySetInnerHTML={{ __html: aiResult }} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-300">
                <Send size={48} className="mb-4 opacity-20"/>
                <p className="font-black uppercase tracking-widest">Awaiting Analysis...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
