import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment, updateVitals, bookAppointment } from '../api';
import { Activity, BrainCircuit, Heart, Thermometer, MessageSquare, Calendar, Save } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' or 'update'
  const [analysis, setAnalysis] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [vitalsForm, setVitalsForm] = useState({ bp: '', hr: '', doubt: '' });

  useEffect(() => {
    const data = localStorage.getItem('user');
    if (data) {
      const user = JSON.parse(data);
      getPatients(user.email).then(res => {
        setPatient(res.data);
        setVitalsForm({ bp: res.data.bloodPressure || '', hr: res.data.heartRate || '', doubt: '' });
      });
    }
  }, []);

  const handleUpdateVitals = async () => {
    try {
      await updateVitals({ email: patient.email, ...vitalsForm });
      toast.success("Health data updated!");
    } catch (e) { toast.error("Update failed"); }
  };

  const handleRequestAppointment = async () => {
    try {
      await bookAppointment({ email: patient.email, name: patient.name, reason: vitalsForm.doubt });
      toast.success("Appointment Requested!");
    } catch (e) { toast.error("Request failed"); }
  };

  if (!patient) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-2">
            <Activity className="text-indigo-600" /> MY HEALTH
          </h1>
          <button onClick={handleRequestAppointment} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200">
            <Calendar size={18} /> Request Appointment
          </button>
        </header>

        {/* TABS NAVIGATION */}
        <div className="flex gap-2 mb-6 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
          <button onClick={() => setActiveTab('summary')} className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'summary' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Summary</button>
          <button onClick={() => setActiveTab('update')} className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'update' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Update Details</button>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
          {activeTab === 'summary' ? (
            <div className="p-8">
              <div className="flex gap-4 mb-8">
                <div className="flex-1 bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <span className="text-[10px] font-black text-blue-500 uppercase">Blood Pressure</span>
                  <p className="text-2xl font-mono font-bold">{patient.bloodPressure || '120/80'}</p>
                </div>
                <div className="flex-1 bg-red-50 p-6 rounded-3xl border border-red-100">
                  <span className="text-[10px] font-black text-red-500 uppercase">Heart Rate</span>
                  <p className="text-2xl font-mono font-bold">{patient.heartRate || '72'} <small>BPM</small></p>
                </div>
              </div>

              <div className="h-[250px] mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[{t:'8am', h:70},{t:'12pm', h:80},{t:'4pm', h:75}]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="t" hide />
                    <YAxis hide domain={['auto', 'auto']} />
                    <Line type="monotone" dataKey="h" stroke="#4f46e5" strokeWidth={4} dot />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <button onClick={() => setAnalysis("AI is processing...")} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3">
                <BrainCircuit size={24} /> RUN AI DIAGNOSIS
              </button>
            </div>
          ) : (
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2">Current BP</label>
                  <input type="text" value={vitalsForm.bp} onChange={(e)=>setVitalsForm({...vitalsForm, bp: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 120/80" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase ml-2">Current HR</label>
                  <input type="text" value={vitalsForm.hr} onChange={(e)=>setVitalsForm({...vitalsForm, hr: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. 72" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase ml-2">Ask Any Doubt / Symptoms</label>
                <textarea rows="4" value={vitalsForm.doubt} onChange={(e)=>setVitalsForm({...vitalsForm, doubt: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Describe how you feel..." />
              </div>
              <button onClick={handleUpdateVitals} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl">
                <Save size={24} /> SAVE HEALTH UPDATES
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
