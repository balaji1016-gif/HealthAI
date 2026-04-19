import React, { useEffect, useState } from 'react';
import { getAiAssessment, updateVitals } from '../api';
import { Activity, Heart, Thermometer, Save, RefreshCw, BrainCircuit, FileText } from 'lucide-react';
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
    if (!userData) { window.location.href = '/login'; return; }
    const user = JSON.parse(userData);
    setPatient(user);
    setVitalsForm({ bp: user.bloodPressure || '', hr: user.heartRate || '', doubt: user.medicalHistory || '' });
  }, []);

  const handleUpdateVitals = async () => {
    setLoading(true);
    try {
      const payload = { 
        email: patient.email, 
        bloodPressure: vitalsForm.bp, 
        heartRate: vitalsForm.hr,
        medicalHistory: vitalsForm.doubt 
      };
      const res = await updateVitals(payload);
      if (res.status === 200) {
        toast.success("Medical Records Updated!");
        setPatient({ ...patient, ...payload });
        localStorage.setItem('user', JSON.stringify({ ...patient, ...payload }));
      }
    } catch (e) { toast.error("Update failed"); } finally { setLoading(false); }
  };

  const handleRunAI = async () => {
    setAiLoading(true);
    try {
      const currentData = { bloodPressure: vitalsForm.bp, heartRate: vitalsForm.hr, medicalHistory: vitalsForm.doubt };
      const res = await getAiAssessment(currentData);
      setDiagnosis(res.data.summary);
      toast.success("AI Report Generated!");
    } catch (e) { toast.error("AI Analysis failed"); } finally { setAiLoading(false); }
  };

  if (!patient) return <div className="p-20 text-center text-blue-600 font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADING - BOLD AND VISIBLE */}
        <header className="flex justify-between items-end mb-10 border-b-4 border-blue-700 pb-6">
          <div>
            <h1 className="text-5xl font-black text-blue-800 uppercase tracking-tighter">PATIENT DASHBOARD</h1>
            <p className="text-blue-500 font-bold text-xs tracking-[0.3em] mt-1">AI HEALTH MANAGEMENT SYSTEM</p>
          </div>
          <div className="hidden md:block bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl text-sm font-bold text-blue-700">
            User: {patient.email}
          </div>
        </header>

        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('summary')} className={`px-10 py-4 rounded-xl font-black transition-all ${activeTab === 'summary' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-blue-400 border border-blue-100'}`}>OVERVIEW</button>
          <button onClick={() => setActiveTab('update')} className={`px-10 py-4 rounded-xl font-black transition-all ${activeTab === 'update' ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-blue-400 border border-blue-100'}`}>UPDATE VITALS</button>
        </div>

        {activeTab === 'summary' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-10 rounded-[2rem] border-l-8 border-blue-600 shadow-sm">
                <div className="flex items-center gap-2 text-blue-500 mb-3"><Thermometer size={20} /><span className="text-xs font-black uppercase tracking-widest">Blood Pressure</span></div>
                <p className="text-6xl font-black">{patient.bloodPressure || "N/A"}</p>
              </div>
              <div className="bg-white p-10 rounded-[2rem] border-l-8 border-red-500 shadow-sm">
                <div className="flex items-center gap-2 text-red-500 mb-3"><Heart size={20} /><span className="text-xs font-black uppercase tracking-widest">Heart Rate</span></div>
                <p className="text-6xl font-black">{patient.heartRate || "0"} <span className="text-xl text-slate-400">BPM</span></p>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-blue-50">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-700 p-4 rounded-2xl text-white"><BrainCircuit size={32} /></div>
                    <h2 className="text-3xl font-black text-blue-900 uppercase">AI Diagnosis Report</h2>
                  </div>
                  <button onClick={handleRunAI} disabled={aiLoading} className="bg-blue-700 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center gap-2 shadow-lg">
                    {aiLoading ? <RefreshCw className="animate-spin" /> : <><FileText size={20}/> Generate Full Report</>}
                  </button>
               </div>
               {diagnosis ? (
                 <div className="bg-blue-50/50 rounded-3xl p-10 border-2 border-dashed border-blue-200 min-h-[500px] prose prose-blue max-w-none" 
                      dangerouslySetInnerHTML={{ __html: diagnosis }} />
               ) : (
                 <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-bold uppercase tracking-widest">Generate report to see clinical analysis.</div>
               )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-blue-50 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                   <label className="text-[10px] font-black uppercase text-blue-900 mb-2 block ml-2">Blood Pressure (120/80)</label>
                   <input type="text" value={vitalsForm.bp} onChange={(e)=>setVitalsForm({...vitalsForm, bp: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-black text-blue-700 text-xl outline-none focus:border-blue-500 transition-all" />
                </div>
                <div>
                   <label className="text-[10px] font-black uppercase text-blue-900 mb-2 block ml-2">Heart Rate (BPM)</label>
                   <input type="text" value={vitalsForm.hr} onChange={(e)=>setVitalsForm({...vitalsForm, hr: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl font-black text-blue-700 text-xl outline-none focus:border-blue-500 transition-all" />
                </div>
             </div>
             <div>
                <label className="text-[10px] font-black uppercase text-blue-900 mb-2 block ml-2">Medical History / Symptoms</label>
                <textarea value={vitalsForm.doubt} onChange={(e)=>setVitalsForm({...vitalsForm, doubt: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-5 rounded-2xl h-40 font-semibold text-slate-700 outline-none focus:border-blue-500 transition-all" />
             </div>
             <button onClick={handleUpdateVitals} disabled={loading} className="w-full bg-blue-700 py-6 rounded-2xl text-white font-black text-xl hover:bg-blue-800 transition-all shadow-xl flex items-center justify-center gap-3">
                {loading ? <RefreshCw className="animate-spin" /> : <><Save size={24}/> SAVE HEALTH RECORDS</>}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
