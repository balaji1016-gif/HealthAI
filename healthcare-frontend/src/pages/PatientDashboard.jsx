import React, { useEffect, useState } from 'react';
import { getAiAssessment, updateVitals } from '../api';
import { LogOut, User, BrainCircuit, RefreshCw } from 'lucide-react';
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
      setVitals({ 
        bp: user.bloodPressure || '', 
        hr: user.heartRate || '', 
        doubt: user.medicalHistory || '' 
      });
    } else { 
      window.location.href = '/login'; 
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      // This calls your fixed backend service
      const res = await getAiAssessment({ 
        email: patient.email, 
        bloodPressure: vitals.bp, 
        heartRate: vitals.hr, 
        medicalHistory: vitals.doubt 
      });
      setDiagnosis(res.data.summary);
      toast.success("Report Generated");
    } catch (e) { 
      toast.error("AI Error (500) - Check Safety Settings"); 
    } finally { 
      setLoading(false); 
    }
  };

  if (!patient) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      {/* RESTORED HEADER */}
      <header className="flex justify-between items-center mb-10 border-b-4 border-blue-600 pb-6">
        <div>
          <h1 className="text-4xl font-black text-blue-900 italic uppercase">Healthcare Dashboard</h1>
          <div className="flex gap-4 mt-2 font-bold">
             <span className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2">
               <User size={16}/> {patient.name}
             </span>
             <span className="text-blue-400 self-center">{patient.email}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-red-600 text-white px-6 py-2 rounded-lg font-black flex items-center gap-2 shadow-lg">
          <LogOut size={18}/> LOGOUT
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* VITALS INPUT PANEL */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <h3 className="text-xl font-black mb-6 uppercase text-slate-700">Patient Vitals</h3>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="BP (e.g. 120/80)" 
              value={vitals.bp} 
              onChange={(e) => setVitals({...vitals, bp: e.target.value})} 
              className="w-full p-4 bg-slate-50 border-2 rounded-xl font-bold" 
            />
            <input 
              type="text" 
              placeholder="Heart Rate (e.g. 72)" 
              value={vitals.hr} 
              onChange={(e) => setVitals({...vitals, hr: e.target.value})} 
              className="w-full p-4 bg-slate-50 border-2 rounded-xl font-bold" 
            />
            <textarea 
              placeholder="Medical History" 
              value={vitals.doubt} 
              onChange={(e) => setVitals({...vitals, doubt: e.target.value})} 
              className="w-full p-4 bg-slate-50 border-2 rounded-xl h-32 font-medium" 
            />
          </div>
        </div>

        {/* AI REPORT DISPLAY */}
        <div className="lg:col-span-2 bg-white p-10 rounded-3xl shadow-2xl border-t-8 border-blue-600">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-blue-900 flex items-center gap-3">
              <BrainCircuit size={32}/> AI HEALTH REPORT
            </h2>
            <button 
              onClick={generateReport} 
              disabled={loading} 
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md"
            >
              {loading ? <RefreshCw className="animate-spin"/> : "GENERATE REPORT"}
            </button>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl min-h-[400px] border-2 border-dashed border-slate-200">
            {diagnosis ? (
              <div className="prose prose-blue max-w-none text-slate-800 whitespace-pre-wrap font-medium" 
                   dangerouslySetInnerHTML={{ __html: diagnosis }} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50 py-20">
                <BrainCircuit size={100} strokeWidth={1} />
                <p className="font-bold uppercase mt-4 tracking-widest">Awaiting Analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
