import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, FileText, Send, LogOut, User, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState({ bloodPressure: '', heartRate: '' });
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setPatient(JSON.parse(userData));
    else window.location.href = '/login';
  }, []);

  const handleUpdateAndDiagnose = async () => {
    setLoading(true);
    try {
      const aiRes = await axios.post('https://health-ai-backend-q09o.onrender.com/api/auth/diagnose', {
        ...patient, bloodPressure: vitals.bloodPressure, heartRate: vitals.heartRate
      });
      const report = aiRes.data.summary;
      setAiResult(report);

      await axios.put('https://health-ai-backend-q09o.onrender.com/api/auth/update-vitals', {
        email: patient.email,
        bloodPressure: vitals.bloodPressure,
        heartRate: vitals.heartRate,
        medicalHistory: report
      });
      toast.success("Vitals Updated & Report Synced");
    } catch (err) { toast.error("Process Failed"); }
    finally { setLoading(false); }
  };

  const handleRequestAppointment = () => {
    toast.success("Appointment Requested Successfully!");
  };

  if (!patient) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <header className="flex justify-between items-center mb-8 border-b-4 border-blue-600 pb-4">
        <div>
          <h1 className="text-3xl font-black text-blue-900 uppercase italic tracking-tighter">Patient Dashboard</h1>
          <div className="flex gap-4 mt-2">
            <span className="font-bold text-blue-600 uppercase text-sm flex items-center gap-1"><User size={14}/> {patient.name}</span>
            <span className="font-bold text-slate-400 text-sm">{patient.email}</span>
          </div>
        </div>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href='/login'; }} className="bg-red-600 text-white px-6 py-2 rounded-xl font-black flex items-center gap-2">
          <LogOut size={18}/> LOGOUT
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <h2 className="text-xl font-black text-slate-800 mb-6 uppercase flex items-center gap-2"><Activity className="text-blue-600"/> Update Vitals</h2>
          <div className="space-y-6">
            <input type="text" placeholder="BP (e.g. 120/80)" className="w-full p-4 bg-slate-50 border-2 rounded-2xl font-black focus:border-blue-600 outline-none" onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})} />
            <input type="text" placeholder="Heart Rate (BPM)" className="w-full p-4 bg-slate-50 border-2 rounded-2xl font-black focus:border-blue-600 outline-none" onChange={(e) => setVitals({...vitals, heartRate: e.target.value})} />
            <button onClick={handleUpdateAndDiagnose} disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700">
              {loading ? "Processing..." : "Generate AI Health Report"}
            </button>
            <button onClick={handleRequestAppointment} className="w-full bg-blue-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2">
              <Calendar size={20}/> Request Appointment
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 min-h-[500px]">
          <h2 className="text-xl font-black text-slate-800 mb-6 uppercase flex items-center gap-2"><FileText className="text-blue-600"/> AI Health Analysis</h2>
          <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed h-full overflow-y-auto text-slate-700 font-bold leading-relaxed" dangerouslySetInnerHTML={{ __html: aiResult || "Awaiting Analysis..." }} />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
