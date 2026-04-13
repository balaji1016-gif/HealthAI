import React, { useEffect, useState, useRef } from 'react';
import { getPatients, getAiAssessment, updateVitals, bookAppointment } from '../api';
import { Activity, BrainCircuit, Heart, Thermometer, RefreshCw, Calendar, Save, MessageSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); 
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [vitalsForm, setVitalsForm] = useState({ bp: '', hr: '', doubt: '' });
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const loadInitialData = async () => {
      const storedData = localStorage.getItem('user');
      if (!storedData) {
        toast.error("Session expired. Please login again.");
        window.location.href = '/login';
        return;
      }

      const user = JSON.parse(storedData);
      // Set initial state from local storage immediately so it doesn't get stuck loading
      setPatient(user);
      setVitalsForm({ 
        bp: user.bloodPressure || '', 
        hr: user.heartRate || '', 
        doubt: '' 
      });

      try {
        const res = await getPatients(user.email);
        if (res.data) {
          setPatient(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (err) {
        console.log("Using cached profile data...");
      }

      setTimeout(() => setIsReady(true), 500);
    };

    loadInitialData();
  }, []);

  const handleUpdateVitals = async () => {
    try {
      await updateVitals({ email: patient.email, ...vitalsForm });
      toast.success("Health updates saved!");
    } catch (e) {
      toast.error("Failed to update vitals");
    }
  };

  const handleRequestAppointment = async () => {
    try {
      await bookAppointment({ 
        email: patient.email, 
        name: patient.name || patient.fullName, 
        reason: vitalsForm.doubt || "Routine Checkup" 
      });
      toast.success("Appointment request sent to doctor!");
    } catch (e) {
      toast.error("Could not send request");
    }
  };

  const handleAiCheck = async () => {
    setLoadingAi(true);
    setAnalysis(""); 
    try {
      const res = await getAiAssessment(patient.email);
      if (res.data && res.data.summary) {
        setAnalysis(res.data.summary);
        toast.success("AI Analysis Complete");
      }
    } catch (err) {
      setAnalysis("AI Engine is currently waking up on Render. Please try again in a moment.");
    } finally {
      setLoadingAi(false);
    }
  };

  const trendData = [
    { name: '08:00', hr: 70 },
    { name: '10:00', hr: 75 },
    { name: '12:00', hr: 82 },
    { name: '14:00', hr: 74 },
    { name: '16:00', hr: 78 }
  ];

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div className="flex items-center gap-3">
            <Activity className="text-indigo-600" size={32} />
            <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Patient Portal</h1>
          </div>
          <button 
            onClick={handleRequestAppointment}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Calendar size={20} /> REQUEST APPOINTMENT
          </button>
        </header>

        <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('summary')} 
            className={`px-8 py-3 rounded-xl font-black text-sm uppercase transition-all ${activeTab === 'summary' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Vitals Summary
          </button>
          <button 
            onClick={() => setActiveTab('update')} 
            className={`px-8 py-3 rounded-xl font-black text-sm uppercase transition-all ${activeTab === 'update' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Update Details
          </button>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden mb-8">
          {activeTab === 'summary' ? (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-1 mb-1">
                      <Thermometer size={14} /> Blood Pressure
                    </span>
                    <p className="text-3xl font-mono font-black text-slate-800">{patient.bloodPressure || '120/80'}</p>
                  </div>
                </div>
                <div className="bg-red-50/50 p-8 rounded-3xl border border-red-100 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-red-500 uppercase flex items-center gap-1 mb-1">
                      <Heart size={14} /> Heart Rate
                    </span>
                    <p className="text-3xl font-mono font-black text-slate-800">{patient.heartRate || '72'} <small className="text-sm">BPM</small></p>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-xs font-black text-slate-400 mb-6 uppercase tracking-widest">Live Vital Trends</h3>
                <div style={{ width: '100%', height: '300px' }}>
                  {isReady && (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" hide />
                        <YAxis hide domain={['auto', 'auto']} />
                        <Tooltip />
                        <Line type="monotone" dataKey="hr" stroke="#4f46e5" strokeWidth={5} dot={{ r: 6, fill: '#4f46e5' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <button
                onClick={handleAiCheck}
                disabled={loadingAi}
                className={`w-full py-6 rounded-2xl flex items-center justify-center gap-3 text-xl font-black transition-all shadow-xl active:scale-95 ${loadingAi ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-black'}`}
              >
                <BrainCircuit size={28} />
                {loadingAi ? "AI ANALYSIS IN PROGRESS..." : "RUN AI CLINICAL DIAGNOSIS"}
              </button>
            </div>
          ) : (
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">Update Blood Pressure</label>
                  <input 
                    type="text" 
                    value={vitalsForm.bp} 
                    onChange={(e)=>setVitalsForm({...vitalsForm, bp: e.target.value})} 
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold" 
                    placeholder="e.g. 128/84" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest">Update Heart Rate</label>
                  <input 
                    type="text" 
                    value={vitalsForm.hr} 
                    onChange={(e)=>setVitalsForm({...vitalsForm, hr: e.target.value})} 
                    className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-bold" 
                    placeholder="e.g. 78" 
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase ml-2 tracking-widest flex items-center gap-2">
                  <MessageSquare size={14} /> Ask Any Doubt / Symptoms
                </label>
                <textarea 
                  rows="5" 
                  value={vitalsForm.doubt} 
                  onChange={(e)=>setVitalsForm({...vitalsForm, doubt: e.target.value})} 
                  className="w-full p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium" 
                  placeholder="Tell us how you are feeling today..." 
                />
              </div>
              <button 
                onClick={handleUpdateVitals} 
                className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                <Save size={24} /> SAVE HEALTH UPDATES
              </button>
            </div>
          )}
        </div>

        {analysis && (
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl border-l-[12px] border-indigo-600 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <BrainCircuit className="text-indigo-600" /> AI CLINICAL ASSESSMENT
            </h3>
            <div className="bg-indigo-50/50 p-6 rounded-2xl text-indigo-900 italic text-lg leading-relaxed border border-indigo-100">
              "{analysis}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
