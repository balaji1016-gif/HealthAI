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

  useEffect(() => {
    const loadInitialData = async () => {
      const storedData = localStorage.getItem('user');
      if (!storedData) {
        window.location.href = '/login';
        return;
      }
      const user = JSON.parse(storedData);
      setPatient(user);
      setVitalsForm({ 
        bp: user.bloodPressure || '', 
        hr: user.heartRate || '', 
        doubt: user.medicalHistory || '' 
      });
      try {
        const res = await getPatients(user.email);
        if (res.data) {
          setPatient(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
      setTimeout(() => setIsReady(true), 500);
    };
    loadInitialData();
  }, []);

  const handleUpdateVitals = async () => {
    try {
      const res = await updateVitals({ 
        email: patient.email, 
        bloodPressure: vitalsForm.bp, 
        heartRate: vitalsForm.hr,
        medicalHistory: vitalsForm.doubt 
      });
      if (res.status === 200 || res.status === 201) {
        toast.success("Health updates saved!");
        const updatedUser = { ...patient, bloodPressure: vitalsForm.bp, heartRate: vitalsForm.hr, medicalHistory: vitalsForm.doubt };
        setPatient(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setActiveTab('summary');
      }
    } catch (e) {
      toast.error("Update failed");
    }
  };

  const handleAiCheck = async () => {
    setLoadingAi(true);
    try {
      const res = await getAiAssessment(patient.email);
      setAnalysis(res.data.summary || "Vitals are within range.");
      toast.success("AI Analysis Complete");
    } catch (err) {
      setAnalysis("AI is processing. Please retry.");
    } finally {
      setLoadingAi(false);
    }
  };

  const trendData = [{ name: '08:00', hr: 70 }, { name: '10:00', hr: 75 }, { name: '12:00', hr: 82 }, { name: '14:00', hr: 74 }, { name: '16:00', hr: 78 }];

  if (!patient) return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <Activity className="text-indigo-600" size={32} />
            <h1 className="text-3xl font-black text-slate-800 uppercase">Patient Portal</h1>
          </div>
        </header>

        <div className="flex gap-2 mb-8 bg-slate-200 p-1 rounded-2xl w-fit">
          <button onClick={() => setActiveTab('summary')} className={`px-6 py-2 rounded-xl font-bold ${activeTab === 'summary' ? 'bg-white text-indigo-600' : 'text-slate-500'}`}>Summary</button>
          <button onClick={() => setActiveTab('update')} className={`px-6 py-2 rounded-xl font-bold ${activeTab === 'update' ? 'bg-white text-indigo-600' : 'text-slate-500'}`}>Update</button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          {activeTab === 'summary' ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-2xl">
                  <span className="flex items-center gap-2 text-blue-600 font-bold uppercase text-xs mb-2"><Thermometer size={16}/> BP</span>
                  <p className="text-3xl font-black">{patient.bloodPressure || 'N/A'}</p>
                </div>
                <div className="bg-red-50 p-6 rounded-2xl">
                  <span className="flex items-center gap-2 text-red-600 font-bold uppercase text-xs mb-2"><Heart size={16}/> Heart Rate</span>
                  <p className="text-3xl font-black">{patient.heartRate || 'N/A'} BPM</p>
                </div>
              </div>
              <button onClick={handleAiCheck} disabled={loadingAi} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all">
                {loadingAi ? "ANALYZING..." : "RUN AI DIAGNOSIS"}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <input type="text" placeholder="BP (120/80)" value={vitalsForm.bp} onChange={(e)=>setVitalsForm({...vitalsForm, bp: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl" />
              <input type="text" placeholder="HR (72)" value={vitalsForm.hr} onChange={(e)=>setVitalsForm({...vitalsForm, hr: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl" />
              <textarea placeholder="Notes" value={vitalsForm.doubt} onChange={(e)=>setVitalsForm({...vitalsForm, doubt: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-xl" rows="4" />
              <button onClick={handleUpdateVitals} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black">SAVE UPDATES</button>
            </div>
          )}
        </div>

        {analysis && (
          <div className="bg-white p-6 rounded-3xl border-l-8 border-indigo-600 shadow-lg">
            <h3 className="font-black mb-2 flex items-center gap-2"><BrainCircuit size={20}/> AI ASSESSMENT</h3>
            <p className="italic text-slate-700">"{analysis}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
