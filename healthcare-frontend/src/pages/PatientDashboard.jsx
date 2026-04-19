import React, { useEffect, useState } from 'react';
import { getAiAssessment, updateVitals, bookAppointment } from '../api';
import { Activity, Heart, Thermometer, Save, RefreshCw, BrainCircuit, FileText, CalendarPlus, LogOut, User } from 'lucide-react';
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
      setVitalsForm({ 
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

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload = { 
        email: patient.email, 
        bloodPressure: vitalsForm.bp, 
        heartRate: vitalsForm.hr, 
        medicalHistory: vitalsForm.doubt 
      };
      await updateVitals(payload);
      const updatedUser = { ...patient, ...payload };
      setPatient(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success("Vitals Synchronized");
    } catch (e) {
      toast.error("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRunAI = async () => {
    setAiLoading(true);
    try {
      const res = await getAiAssessment({ 
        email: patient.email, 
        bloodPressure: vitalsForm.bp, 
        heartRate: vitalsForm.hr, 
        medicalHistory: vitalsForm.doubt 
      });
      setDiagnosis(res.data.summary);
      toast.success("Full Clinical Analysis Generated");
    } catch (e) {
      toast.error("AI Service Error (Check Render API Key)");
    } finally {
      setAiLoading(false);
    }
  };

  const handleBook = async () => {
    try {
      await bookAppointment({ email: patient.email, reason: vitalsForm.doubt });
      toast.success("Appointment Request Sent to Doctor");
    } catch (e) {
      toast.error("Booking Error");
    }
  };

  if (!patient) return <div className="p-20 text-center text-blue-600 font-black tracking-tighter text-2xl animate-pulse">AUTHENTICATING...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* RESTORED HEADER: LOGOUT, NAME, EMAIL, AND BOLD HEADING */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-4 border-blue-600 pb-8 gap-4">
          <div>
            <h1 className="text-5xl font-black text-blue-800 uppercase italic tracking-tighter">
              PATIENT DASHBOARD
            </h1>
            <div className="flex items-center gap-3 mt-2">
                <div className="bg-blue-600 p-1 rounded-md">
                    <User size={16} className="text-white" />
                </div>
                <p className="text-blue-900 font-black text-lg uppercase">{patient.name || "BALAJI D"}</p>
                <span className="text-slate-300">|</span>
                <p className="text-blue-500 font-bold text-sm">{patient.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-black hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-sm"
          >
            <LogOut size={20} /> LOGOUT
          </button>
        </header>

        <div className="flex flex-wrap gap-4 mb-8">
          <button onClick={() => setActiveTab('summary')} className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${activeTab === 'summary' ? 'bg-blue-700 text-white shadow-xl' : 'bg-white text-blue-400 border border-blue-100'}`}>Overview</button>
          <button onClick={() => setActiveTab('update')} className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${activeTab === 'update' ? 'bg-blue-700 text-white shadow-xl' : 'bg-white text-blue-400 border border-blue-100'}`}>Edit Vitals</button>
          <button onClick={handleBook} className="md:ml-auto px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-emerald-700 transition-all">
            <CalendarPlus size={20}/> Request Appointment
          </button>
        </div>

        {activeTab === 'summary' ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-12 rounded-[3rem] border-l-[12px] border-blue-600 shadow-sm">
                <div className="flex items-center gap-2 text-blue-600 mb-4">
                  <Thermometer size={28} />
                  <span className="text-sm font-black uppercase tracking-[0.2em]">Blood Pressure</span>
                </div>
                <p className="text-7xl font-black text-slate-800 tracking-tighter">{patient.bloodPressure || "0/0"}</p>
              </div>
              <div className="bg-white p-12 rounded-[3rem] border-l-[12px] border-red-500 shadow-sm">
                <div className="flex items-center gap-2 text-red-500 mb-4">
                  <Heart size={28} />
                  <span className="text-sm font-black uppercase tracking-[0.2em]">Heart Rate</span>
                </div>
                <p className="text-7xl font-black text-slate-800 tracking-tighter">{patient.heartRate || "0"} <span className="text-2xl text-slate-300 uppercase">Bpm</span></p>
              </div>
            </div>

            {/* AI REPORT AREA - LARGE AND CLEAN */}
            <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl border border-blue-50 relative overflow-hidden">
               <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                  <div className="flex items-center gap-5">
                    <div className="bg-blue-800 p-5 rounded-[1.5rem] text-white shadow-2xl">
                      <BrainCircuit size={48} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black text-blue-900 uppercase italic leading-none">AI Diagnostic Report</h2>
                        <p className="text-blue-400 font-bold mt-2">Powered by Google Gemini Clinical Analysis</p>
                    </div>
                  </div>
                  <button onClick={handleRunAI} disabled={aiLoading} className="bg-blue-700 text-white px-12 py-6 rounded-[2rem] font-black uppercase tracking-[0.15em] hover:bg-blue-900 transition-all flex items-center gap-4 shadow-2xl active:scale-95">
                    {aiLoading ? <RefreshCw className="animate-spin" /> : <><FileText size={24}/> Generate Full Analysis</>}
                  </button>
               </div>

               {diagnosis ? (
                 <div className="bg-slate-50/50 rounded-[2.5rem] p-12 border-2 border-dashed border-blue-200 min-h-[600px] shadow-inner">
                    <div className="prose prose-blue max-w-none text-slate-700 font-medium leading-[1.8] text-xl" 
                         dangerouslySetInnerHTML={{ __html: diagnosis }} />
                 </div>
               ) : (
                 <div className="py-40 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <p className="text-slate-300 font-black text-2xl uppercase tracking-[0.2em]">Ready for Clinical Processing</p>
                    <p className="text-slate-400 font-medium mt-2">Click the button above to synthesize your health metrics.</p>
                 </div>
               )}
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-blue-50">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
                <div className="space-y-4">
                   <label className="text-sm font-black uppercase text-blue-900 ml-4">Current Blood Pressure</label>
                   <input type="text" value={vitalsForm.bp} onChange={(e)=>setVitalsForm({...vitalsForm, bp: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-8 rounded-[2rem] font-black text-blue-700 text-3xl outline-none focus:border-blue-500 transition-all shadow-inner" placeholder="120/80" />
                </div>
                <div className="space-y-4">
                   <label className="text-sm font-black uppercase text-blue-900 ml-4">Current Heart Rate (BPM)</label>
                   <input type="text" value={vitalsForm.hr} onChange={(e)=>setVitalsForm({...vitalsForm, hr: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-8 rounded-[2rem] font-black text-blue-700 text-3xl outline-none focus:border-blue-500 transition-all shadow-inner" placeholder="72" />
                </div>
             </div>
             <div className="mb-12 space-y-4">
                <label className="text-sm font-black uppercase text-blue-900 ml-4">Detailed Symptoms / Medical Background</label>
                <textarea value={vitalsForm.doubt} onChange={(e)=>setVitalsForm({...vitalsForm, doubt: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 p-8 rounded-[2rem] h-56 font-semibold text-slate-700 text-lg outline-none focus:border-blue-500 transition-all shadow-inner" placeholder="Type clinical notes here..." />
             </div>
             <button onClick={handleUpdate} disabled={loading} className="w-full bg-blue-700 py-10 rounded-[2.5rem] text-white font-black text-3xl hover:bg-blue-800 transition-all shadow-2xl flex items-center justify-center gap-6 active:scale-95">
                {loading ? <RefreshCw className="animate-spin" /> : <><Save size={36}/> SAVE TO MEDICAL CLOUD</>}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
