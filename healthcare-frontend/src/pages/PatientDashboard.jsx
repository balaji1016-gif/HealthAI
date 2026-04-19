import React, { useEffect, useState } from 'react';
import { getAiAssessment, updateVitals } from '../api';
import { Heart, Thermometer, Save, RefreshCw, BrainCircuit, LogOut, User } from 'lucide-react';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState({ bp: '', hr: '', doubt: '' });
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setPatient(user);
      setVitals({ bp: user.bloodPressure || '', hr: user.heartRate || '', doubt: user.medicalHistory || '' });
    } else { window.location.href = '/login'; }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await getAiAssessment({ email: patient.email, bloodPressure: vitals.bp, heartRate: vitals.hr, medicalHistory: vitals.doubt });
      setDiagnosis(res.data.summary);
    } catch (e) { toast.error("AI Report Failed - Check Backend"); } finally { setLoading(false); }
  };

  if (!patient) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <header className="flex justify-between items-center mb-10 border-b-4 border-blue-600 pb-6">
        <div>
          <h1 className="text-4xl font-black text-blue-900 italic">HEALTHCARE DASHBOARD</h1>
          <div className="flex gap-4 mt-2 font-bold uppercase text-sm">
             <span className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2">
               <User size={14}/> {patient.name || "BALAJI D"}
             </span>
             <span className="text-blue-400">{patient.email}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-2 rounded-lg font-black flex items-center gap-2">
          <LogOut size={18}/> LOGOUT
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
          <h3 className="text-xl font-black mb-6 uppercase">Update Vitals</h3>
          <input type="text" placeholder="BP (120/80)" value={vitals.bp} onChange={(e)=>setVitals({...vitals, bp: e.target.value})} className="w-full p-4 mb-4 bg-slate-50 border-2 rounded-xl font-bold" />
          <input type="text" placeholder="HR (72)" value={vitals.hr} onChange={(e)=>setVitals({...vitals, hr: e.target.value})} className="w-full p-4 mb-4 bg-slate-50 border-2 rounded-xl font-bold" />
          <textarea placeholder="History" value={vitals.doubt} onChange={(e)=>setVitals({...vitals, doubt: e.target.value})} className="w-full p-4 mb-4 bg-slate-50 border-2 rounded-xl h-32" />
        </div>

        <div className="lg:col-span-2 bg-white p-10 rounded-3xl shadow-xl border-t-8 border-blue-600">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-blue-900 flex items-center gap-3"><BrainCircuit size={32}/> AI ANALYSIS</h2>
            <button onClick={generateReport} disabled={loading} className="bg-blue-700 text-white px-8 py-3 rounded-xl font-black">
              {loading ? <RefreshCw className="animate-spin"/> : "GENERATE REPORT"}
            </button>
          </div>
          <div className="prose prose-blue max-w-none text-slate-700 whitespace-pre-wrap min-h-[300px]" dangerouslySetInnerHTML={{ __html: diagnosis || "Click Generate to start." }} />
        </div>
      </div>
    </div>
  );
};
export default PatientDashboard;
