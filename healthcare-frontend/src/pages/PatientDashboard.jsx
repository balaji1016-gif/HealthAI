import React, { useEffect, useState } from 'react';
import { getAiAssessment, updateVitals, bookAppointment } from '../api';
import { Heart, Thermometer, Save, RefreshCw, BrainCircuit, FileText, CalendarPlus, LogOut, User } from 'lucide-react';
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
    } else { window.location.href = '/login'; }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload = { email: patient.email, bloodPressure: vitalsForm.bp, heartRate: vitalsForm.hr, medicalHistory: vitalsForm.doubt };
      await updateVitals(payload);
      setPatient({ ...patient, ...payload });
      localStorage.setItem('user', JSON.stringify({ ...patient, ...payload }));
      toast.success("Health Data Saved");
    } catch (e) { toast.error("Database Error"); } finally { setLoading(false); }
  };

  const handleRunAI = async () => {
    setAiLoading(true);
    try {
      const res = await getAiAssessment({ email: patient.email, bloodPressure: vitalsForm.bp, heartRate: vitalsForm.hr, medicalHistory: vitalsForm.doubt });
      setDiagnosis(res.data.summary);
      toast.success("Analysis Generated");
    } catch (e) { toast.error("AI Service Unavailable (500)"); } finally { setAiLoading(false); }
  };

  if (!patient) return <div className="p-20 text-blue-800 font-black">LOADING...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER RESTORED */}
        <header className="flex justify-between items-center mb-10 border-b-4 border-blue-600 pb-8">
          <div>
            <h1 className="text-5xl font-black text-blue-900 uppercase italic">PATIENT DASHBOARD</h1>
            <div className="flex items-center gap-4 mt-2">
                <span className="bg-blue-700 text-white px-3 py-1 rounded font-black flex items-center gap-2 uppercase text-xs">
                    <User size={14}/> {patient.name || "BALAJI D"}
                </span>
                <span className="text-blue-500 font-bold text-sm">{patient.email}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-black shadow-lg">
            <LogOut size={20} /> LOGOUT
          </button>
        </header>

        <div className="flex gap-4 mb-10">
          <button onClick={() => setActiveTab('summary')} className={`px-8 py-4 rounded-xl font-black ${activeTab === 'summary' ? 'bg-blue-700 text-white shadow-xl' : 'bg-white text-blue-400'}`}>OVERVIEW</button>
          <button onClick={() => setActiveTab('update')} className={`px-8 py-4 rounded-xl font-black ${activeTab === 'update' ? 'bg-blue-700 text-white shadow-xl' : 'bg-white text-blue-400'}`}>EDIT VITALS</button>
          <button onClick={async () => { try { await bookAppointment({ email: patient.email }); toast.success("Request Sent"); } catch(e) { toast.error("Failed"); } }} 
            className="ml-auto px-8 py-4 bg-emerald-600 text-white rounded-xl font-black flex items-center gap-2 shadow-lg">
            <CalendarPlus size={20}/> BOOK APPOINTMENT
          </button>
        </div>

        {activeTab === 'summary' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-12 rounded-[2.5rem] border-l-[10px] border-blue-600 shadow-sm">
                <div className="flex items-center gap-2 text-blue-500 mb-2"><Thermometer size={20}/><span className="text-xs font-black uppercase">Blood Pressure</span></div>
                <p className="text-6xl font-black">{patient.bloodPressure || "120/80"}</p>
              </div>
              <div className="bg-white p-12 rounded-[2.5rem] border-l-[10px] border-red-500 shadow-sm">
                <div className="flex items-center gap-2 text-red-500 mb-2"><Heart size={20}/><span className="text-xs font-black uppercase">Heart Rate</span></div>
                <p className="text-6xl font-black">{patient.heartRate || "72"}</p>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-12 shadow-2xl border border-blue-50">
               <div className="flex justify-between items-center mb-10">
                  <h2 className="text-3xl font-black text-blue-900 uppercase flex items-center gap-4"><BrainCircuit size={40}/> AI Diagnostic Report</h2>
                  <button onClick={handleRunAI} disabled={aiLoading} className="bg-blue-700 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3">
                    {aiLoading ? <RefreshCw className="animate-spin" /> : <><FileText/> GENERATE FULL PAGE</>}
                  </button>
               </div>
               <div className="prose prose-blue max-w-none text-xl leading-relaxed text-slate-700 min-h-[400px]" dangerouslySetInnerHTML={{ __html: diagnosis || "Click Generate to start analysis." }} />
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-blue-50 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input type="text" value={vitalsForm.bp} onChange={(e)=>setVitalsForm({...vitalsForm, bp: e.target.value})} className="p-8 bg-slate-50 border-2 rounded-2xl font-black text-2xl text-blue-700" placeholder="BP (120/80)" />
                <input type="text" value={vitalsForm.hr} onChange={(e)=>setVitalsForm({...vitalsForm, hr: e.target.value})} className="p-8 bg-slate-50 border-2 rounded-2xl font-black text-2xl text-blue-700" placeholder="HR (72)" />
             </div>
             <textarea value={vitalsForm.doubt} onChange={(e)=>setVitalsForm({...vitalsForm, doubt: e.target.value})} className="w-full p-8 bg-slate-50 border-2 rounded-2xl h-48 font-bold text-lg" placeholder="Medical History..." />
             <button onClick={handleUpdate} className="w-full bg-blue-700 py-8 rounded-2xl text-white font-black text-2xl shadow-xl flex items-center justify-center gap-4"><Save size={28}/> SAVE TO CLOUD</button>
          </div>
        )}
      </div>
    </div>
  );
};
export default PatientDashboard;
