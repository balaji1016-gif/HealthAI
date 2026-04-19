import React, { useEffect, useState } from 'react';
import { getPatients, getAiAssessment, updateVitals } from '../api';
import { Activity, Heart, Thermometer, Save, RefreshCw, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('summary'); 
  const [vitalsForm, setVitalsForm] = useState({ bp: '', hr: '', doubt: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = () => {
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
    };
    loadData();
  }, []);

  const handleUpdateVitals = async () => {
    if (!vitalsForm.bp || !vitalsForm.hr) {
      toast.error("Please fill in BP and Heart Rate");
      return;
    }

    setLoading(true);
    try {
      // payload matches Patient.java fields exactly
      const payload = { 
        email: patient.email, 
        bloodPressure: vitalsForm.bp, 
        heartRate: vitalsForm.hr,
        medicalHistory: vitalsForm.doubt 
      };

      const res = await updateVitals(payload);

      if (res.status === 200) {
        toast.success("Vitals Updated Successfully");
        const updatedUser = { ...patient, ...payload };
        setPatient(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setActiveTab('summary');
      }
    } catch (e) {
      const errorMsg = e.response?.data || "Server connection error";
      toast.error(errorMsg);
      console.error("Update Error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!patient) return <div className="flex h-screen items-center justify-center font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
            <Activity className="text-indigo-600" size={30} />
            <h1 className="text-2xl font-black uppercase">Patient Dashboard</h1>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase">Logged in as</p>
            <p className="font-bold text-slate-800">{patient.email}</p>
          </div>
        </header>

        <div className="flex gap-2 mb-8 bg-slate-200 p-1 rounded-2xl w-fit">
          <button onClick={() => setActiveTab('summary')} className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'summary' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Overview</button>
          <button onClick={() => setActiveTab('update')} className={`px-8 py-3 rounded-xl font-bold transition-all ${activeTab === 'update' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Update Vitals</button>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-slate-100">
          {activeTab === 'summary' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <Thermometer size={18} />
                  <span className="text-xs font-black uppercase">Blood Pressure</span>
                </div>
                <p className="text-4xl font-black text-slate-800">{patient.bloodPressure || 'N/A'}</p>
              </div>
              <div className="bg-red-50/50 p-8 rounded-3xl border border-red-100">
                <div className="flex items-center gap-2 text-red-500 mb-2">
                  <Heart size={18} />
                  <span className="text-xs font-black uppercase">Heart Rate</span>
                </div>
                <p className="text-4xl font-black text-slate-800">{patient.heartRate || '0'} <small className="text-sm">BPM</small></p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2 ml-1">Current BP</label>
                  <input type="text" value={vitalsForm.bp} onChange={(e)=>setVitalsForm({...vitalsForm, bp: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="120/80" />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-slate-400 mb-2 ml-1">Heart Rate</label>
                  <input type="text" value={vitalsForm.hr} onChange={(e)=>setVitalsForm({...vitalsForm, hr: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="72" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-2 ml-1">Symptoms/Notes</label>
                <textarea value={vitalsForm.doubt} onChange={(e)=>setVitalsForm({...vitalsForm, doubt: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl font-medium focus:ring-2 focus:ring-indigo-500 outline-none" rows="4" placeholder="How are you feeling?" />
              </div>
              <button onClick={handleUpdateVitals} disabled={loading} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                {loading ? <RefreshCw className="animate-spin" /> : <><Save size={20}/> SAVE HEALTH DATA</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
