import React, { useEffect, useState } from 'react';
import { getAiAssessment, updateVitals } from '../api';
import { Activity, Heart, Thermometer, Save, RefreshCw, BrainCircuit } from 'lucide-react';
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
    if (!userData) {
      window.location.href = '/login';
      return;
    }
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
        toast.success("Health Record Updated!");
        const updatedUser = { ...patient, ...payload };
        setPatient(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setActiveTab('summary');
      }
    } catch (e) {
      toast.error(e.response?.data || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRunAI = async () => {
    setAiLoading(true);
    try {
      const res = await getAiAssessment(patient.email);
      setDiagnosis(res.data.summary);
      toast.success("AI Analysis Complete!");
    } catch (e) {
      toast.error("AI Service currently unavailable");
    } finally {
      setAiLoading(false);
    }
  };

  if (!patient) return <div className="p-20 text-center font-bold text-blue-600">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        
        {/* MAIN HEADING - BOLD, BLUE, AND VISIBLE */}
        <header className="flex justify-between items-center mb-10 border-b-2 border-blue-100 pb-6">
          <div>
            <h1 className="text-4xl font-black text-blue-700 uppercase tracking-tight">
              PATIENT DASHBOARD
            </h1>
            <p className="text-blue-400 font-bold text-xs mt-1">AI-POWERED HEALTHCARE MANAGEMENT</p>
          </div>
          <div className="bg-white px-5 py-2 rounded-2xl border border-blue-200 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Logged in as</p>
            <p className="text-sm font-bold text-blue-600">{patient.email}</p>
          </div>
        </header>

        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('summary')} className={`px-8 py-3 rounded-2xl font-black transition-all ${activeTab === 'summary' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-blue-400 border border-blue-100'}`}>OVERVIEW</button>
          <button onClick={() => setActiveTab('update')} className={`px-8 py-3 rounded-2xl font-black transition-all ${activeTab === 'update' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-blue-400 border border-blue-100'}`}>UPDATE VITALS</button>
        </div>

        {activeTab === 'summary' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[2rem] border border-blue-50 shadow-sm">
                <div className="flex items-center gap-2 text-blue-500 mb-4">
                  <Thermometer size={20} />
                  <span className="text-xs font-black uppercase">Blood Pressure</span>
                </div>
                <p className="text-5xl font-black text-slate-800">{patient.bloodPressure || "0/0"}</p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-blue-50 shadow-sm">
                <div className="flex items-center gap-2 text-red-500 mb-4">
                  <Heart size={20} />
                  <span className="text-xs font-black uppercase">Heart Rate</span>
                </div>
                <p className="text-5xl font-black text-slate-800">{patient.heartRate || "0"} <span className="text-lg text-slate-400 font-bold">BPM</span></p>
              </div>
            </div>

            {/* AI DIAGNOSIS SECTION - RESTORED */}
            <div className="bg-blue-700 rounded-[2.5rem] p-10 relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <BrainCircuit className="text-white" size={32} />
                  <h3 className="text-2xl font-black text-white uppercase italic">AI Diagnostic Insights</h3>
                </div>
                <p className="text-blue-100 mb-8 max-w-md font-medium">Analyze your vitals using our Gemini AI model for personalized health summaries.</p>
                <button onClick={handleRunAI} disabled={aiLoading} className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-50 transition-colors flex items-center gap-2">
                  {aiLoading ? <RefreshCw className="animate-spin" /> : "Run AI Diagnosis"}
                </button>
                {diagnosis && (
                  <div className="mt-8 p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md">
                    <p className="text-sm leading-relaxed text-white italic font-medium">"{diagnosis}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* UPDATE FORM - BLUE THEME */
          <div className="bg-white p-10 rounded-[2.5rem] border border-blue-100 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-black uppercase text-blue-400 ml-2 mb-2 block">BP (e.g. 120/80)</label>
                <input type="text" value={vitalsForm.bp} onChange={(e)=>setVitalsForm({...vitalsForm, bp: e.target.value})} className="w-full bg-slate-50 border border-blue-100 p-5 rounded-2xl font-bold text-blue-700 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-blue-400 ml-2 mb-2 block">Heart Rate (BPM)</label>
                <input type="text" value={vitalsForm.hr} onChange={(e)=>setVitalsForm({...vitalsForm, hr: e.target.value})} className="w-full bg-slate-50 border border-blue-100 p-5 rounded-2xl font-bold text-blue-700 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-blue-400 ml-2 mb-2 block">Symptoms / Medical History</label>
              <textarea value={vitalsForm.doubt} onChange={(e)=>setVitalsForm({...vitalsForm, doubt: e.target.value})} className="w-full bg-slate-50 border border-blue-100 p-5 rounded-2xl h-40 font-medium text-slate-600 outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button onClick={handleUpdateVitals} disabled={loading} className="w-full bg-blue-600 py-6 rounded-2xl text-white font-black text-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-3">
              {loading ? <RefreshCw className="animate-spin" /> : <><Save size={24}/> SAVE UPDATES</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
