import React, { useEffect, useState } from 'react';
import { getAiAssessment, updateVitals, bookAppointment } from '../api';
import { Activity, Heart, Thermometer, Save, RefreshCw, BrainCircuit, FileText, CalendarPlus } from 'lucide-react';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); 
  const [vitalsForm, setVitalsForm] = useState({ bp: '', hr: '', doubt: '' });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setPatient(user);
      setVitalsForm({ bp: user.bloodPressure || '', hr: user.heartRate || '', doubt: user.medicalHistory || '' });
    }
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload = { email: patient.email, bloodPressure: vitalsForm.bp, heartRate: vitalsForm.hr, medicalHistory: vitalsForm.doubt };
      await updateVitals(payload);
      setPatient({...patient, ...payload});
      localStorage.setItem('user', JSON.stringify({...patient, ...payload}));
      toast.success("Vitals Updated");
    } catch (e) { toast.error("Update Failed"); } finally { setLoading(false); }
  };

  const handleRunAI = async () => {
    setAiLoading(true);
    try {
      const res = await getAiAssessment({ email: patient.email, bloodPressure: vitalsForm.bp, heartRate: vitalsForm.hr, medicalHistory: vitalsForm.doubt });
      setDiagnosis(res.data.summary);
      toast.success("Full AI Report Ready");
    } catch (e) { toast.error("AI Error (500)"); } finally { setAiLoading(false); }
  };

  const handleBook = async () => {
    try {
      await bookAppointment({ email: patient.email, reason: vitalsForm.doubt });
      toast.success("Appointment Requested");
    } catch (e) { toast.error("Booking Failed"); }
  };

  if (!patient) return <div className="p-20 text-blue-600 font-black">LOADING...</div>;

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <header className="mb-10 border-b-4 border-blue-600 pb-6">
        <h1 className="text-5xl font-black text-blue-800 uppercase italic">PATIENT DASHBOARD</h1>
        <p className="text-blue-500 font-bold text-xs tracking-widest mt-1">SECURE CLINICAL ACCESS</p>
      </header>

      <div className="flex gap-4 mb-8">
        <button onClick={() => setActiveTab('summary')} className={`px-8 py-3 rounded-xl font-black ${activeTab === 'summary' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-blue-400'}`}>OVERVIEW</button>
        <button onClick={() => setActiveTab('update')} className={`px-8 py-3 rounded-xl font-black ${activeTab === 'update' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-blue-400'}`}>EDIT DATA</button>
        <button onClick={handleBook} className="ml-auto px-8 py-3 bg-emerald-600 text-white rounded-xl font-black flex items-center gap-2"><CalendarPlus size={18}/> REQUEST APPOINTMENT</button>
      </div>

      {activeTab === 'summary' ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-10 rounded-3xl border border-blue-200">
              <span className="text-xs font-black text-blue-400 uppercase">Blood Pressure</span>
              <p className="text-6xl font-black text-blue-800">{patient.bloodPressure || "0/0"}</p>
            </div>
            <div className="bg-red-50 p-10 rounded-3xl border border-red-100">
              <span className="text-xs font-black text-red-400 uppercase">Heart Rate</span>
              <p className="text-6xl font-black text-red-600">{patient.heartRate || "0"}</p>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-blue-100 min-h-[500px]">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-blue-900 flex items-center gap-3"><BrainCircuit size={40}/> AI CLINICAL REPORT</h2>
              <button onClick={handleRunAI} disabled={aiLoading} className="bg-blue-700 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2">
                {aiLoading ? <RefreshCw className="animate-spin" /> : <><FileText/> GENERATE PAGE</>}
              </button>
            </div>
            <div className="prose prose-blue max-w-none text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: diagnosis || "Click generate to see full analysis." }} />
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 space-y-6">
          <input type="text" value={vitalsForm.bp} onChange={e => setVitalsForm({...vitalsForm, bp: e.target.value})} className="w-full p-6 rounded-2xl border-2 font-black text-2xl" placeholder="BP (120/80)" />
          <input type="text" value={vitalsForm.hr} onChange={e => setVitalsForm({...vitalsForm, hr: e.target.value})} className="w-full p-6 rounded-2xl border-2 font-black text-2xl" placeholder="Heart Rate" />
          <textarea value={vitalsForm.doubt} onChange={e => setVitalsForm({...vitalsForm, doubt: e.target.value})} className="w-full p-6 rounded-2xl border-2 h-40 font-bold" placeholder="Medical History..." />
          <button onClick={handleUpdate} className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-2xl flex items-center justify-center gap-3"><Save/> SAVE TO CLOUD</button>
        </div>
      )}
    </div>
  );
};
export default PatientDashboard;
