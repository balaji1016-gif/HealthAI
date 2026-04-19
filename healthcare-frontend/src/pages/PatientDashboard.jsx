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
    setVitalsForm({ 
      bp: user.bloodPressure || '', 
      hr: user.heartRate || '', 
      doubt: user.medicalHistory || '' 
    });
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
        toast.success("Vitals Saved to Cloud");
        setPatient({ ...patient, ...payload });
        localStorage.setItem('user', JSON.stringify({ ...patient, ...payload }));
      }
    } catch (e) { toast.error("Cloud Save Failed"); } finally { setLoading(false); }
  };

  const handleRunAI = async () => {
    setAiLoading(true);
    try {
      // FIX: Send email + current form values to avoid 400 Bad Request
      const currentData = { 
        email: patient.email,
        bloodPressure: vitalsForm.bp, 
        heartRate: vitalsForm.hr, 
        medicalHistory: vitalsForm.doubt 
      };
      const res = await getAiAssessment(currentData);
      setDiagnosis(res.data.summary);
      toast.success("AI Analysis Complete");
    } catch (e) { 
      console.error(e);
      toast.error("AI Analysis failed (400 Bad Request)"); 
    } finally { setAiLoading(false); }
  };

  if (!patient) return <div className="h-screen flex items-center justify-center text-blue-600 font-bold">Connecting to Health Server...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADING - BOLD, BLUE, VISIBLE */}
        <header className="flex justify-between items-end mb-10 border-b-4 border-blue-700 pb-6">
          <div>
            <h1 className="text-5xl font-black text-blue-800 uppercase tracking-tighter">PATIENT DASHBOARD</h1>
            <p className="text-blue-500 font-bold text-xs tracking-[0.3em] mt-1">HEALTH MONITORING PORTAL</p>
          </div>
          <div className="hidden md:block bg-blue-50 border border-blue-200 px-5 py-2 rounded-xl text-sm font-bold text-blue-700">
            {patient.email}
          </div>
        </header>

        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('summary')} className={`px-10 py-4 rounded-xl font-black transition-all ${activeTab === 'summary' ? 'bg-blue-700 text-white shadow-xl' : 'bg-white text-blue-400 border border-blue-100'}`}>SUMMARY</button>
          <button onClick={() => setActiveTab('update')} className={`px-10 py-4 rounded-xl font-black transition-all ${activeTab === 'update' ? 'bg-blue-700 text-white shadow-xl' : 'bg-white text-blue-400 border border-blue-100'}`}>EDIT VITALS</button>
        </div>

        {activeTab === 'summary' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-10 rounded-[2.5rem] border-l-8 border-blue-600 shadow-md transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-2 text-blue-500 mb-3"><Thermometer size={24} /><span className="text-xs font-black uppercase tracking-widest">Blood Pressure</span></div>
                <p className="text-6xl font-black">{patient.bloodPressure || "0/0"}</p>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] border-l-8 border-red-500 shadow-md transition-transform hover:scale-[1.02]">
                <div className="flex items-center gap-2 text-red-500 mb-3"><Heart size={24} /><span className="text-xs font-black uppercase tracking-widest">Heart Rate</span></div>
                <p className="text-6xl font-black">{patient.heartRate || "0"} <span className="text-xl text-slate-300 font-bold">BPM</span></p>
              </div>
            </div>

            {/* AI DIAGNOSIS - LARGE PAGE-LIKE DISPLAY */}
            <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-blue-100">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-700 p-4 rounded-2xl text-white shadow-lg"><BrainCircuit size={40} /></div>
                    <h2 className="text-3xl font-black text-blue-900 uppercase">AI Diagnostic Report</h2>
                  </div>
                  <button onClick={handleRunAI} disabled={aiLoading} className="bg-blue-700 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all flex items-center gap-3 shadow-xl">
                    {aiLoading ? <RefreshCw className="animate-spin" /> : <><FileText size={24}/> Run Analysis</>}
                  </button>
               </div>

               {diagnosis ? (
                 <div className="bg-blue-50/30 rounded-3xl p-10 border-2 border-dashed border-blue-200 min-h-[600px] shadow-inner">
                    <div className="prose prose-blue max-w-none text-slate-700 font-medium leading-relaxed text-lg" 
                         dangerouslySetInnerHTML={{ __html: diagnosis }} />
                 </div>
               ) : (
                 <div className="py-32 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50">
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em]">Click the button to generate clinical report</p>
                 </div>
               )}
            </div>
          </div>
        ) : (
          /* FORM SECTION */
          <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-blue-50 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                   <label className="text-xs font-black uppercase text-blue-900 ml-2">Blood Pressure</label>
                   <input type="text" value={vitalsForm.bp} onChange={(e)=>setVitalsForm({...vitalsForm, bp: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-2xl font-black text-blue-700 text-2xl outline-none focus:border-blue-500 transition-all" placeholder="120/80" />
                </div>
                <div className="space-y-3">
                   <label className="text-xs font-black uppercase text-blue-900 ml-2">Heart Rate</label>
                   <input type="text" value={vitalsForm.hr} onChange={(e)=>setVitalsForm({...vitalsForm, hr: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-2xl font-black text-blue-700 text-2xl outline-none focus:border-blue-500 transition-all" placeholder="72" />
                </div>
             </div>
             <div className="space-y-3">
                <label className="text-xs font-black uppercase text-blue-900 ml-2">Medical History & Symptoms</label>
                <textarea value={vitalsForm.doubt} onChange={(e)=>setVitalsForm({...vitalsForm, doubt: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-2xl h-48 font-semibold text-slate-700 outline-none focus:border-blue-500 transition-all" placeholder="Enter history..." />
             </div>
             <button onClick={handleUpdateVitals} disabled={loading} className="w-full bg-blue-700 py-8 rounded-3xl text-white font-black text-2xl hover:bg-blue-800 transition-all shadow-2xl flex items-center justify-center gap-4">
                {loading ? <RefreshCw className="animate-spin" /> : <><Save size={28}/> UPDATE CLOUD DATA</>}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
