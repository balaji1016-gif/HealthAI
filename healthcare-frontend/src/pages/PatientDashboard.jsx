import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, FileText, User, LogOut, Heart, AlertCircle, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState({ bloodPressure: '', heartRate: '', doubts: '' });
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const p = JSON.parse(userData);
      setPatient(p);
      if (p.vitalsHistory) parseChart(p.vitalsHistory);
    } else window.location.href = '/login';
  }, []);

  const parseChart = (history) => {
    const data = history.split('|').filter(x => x).map((item, i) => ({
      name: `Check ${i + 1}`,
      bpm: parseInt(item.split(',')[0])
    }));
    setChartData(data);
  };

  const handleProcess = async () => {
    setLoading(true);
    try {
      const res = await axios.post('https://health-ai-backend-q09o.onrender.com/api/auth/diagnose', {
        ...patient, ...vitals
      });
      setPatient(res.data);
      parseChart(res.data.vitalsHistory);
      toast.success("Health Data Synced with Doctor Dashboard");
    } catch (err) { toast.error("Deployment Link or Server Error"); }
    finally { setLoading(false); }
  };

  if (!patient) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <header className="flex justify-between items-center mb-8 border-b-4 border-blue-600 pb-4">
        <h1 className="text-3xl font-black text-blue-900 uppercase italic">Patient Portal</h1>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href='/login'; }} className="bg-red-600 text-white px-6 py-2 rounded-xl font-black hover:scale-105 transition-transform">LOGOUT</button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-blue-50">
            <h2 className="text-xl font-black text-slate-800 mb-6 uppercase flex items-center gap-2"><Activity className="text-blue-600"/> Vital Signs & Doubts</h2>
            <div className="space-y-4">
              <input type="text" placeholder="BP (e.g. 120/80)" className="w-full p-4 bg-slate-50 border-2 rounded-2xl font-bold outline-blue-600" onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})} />
              <input type="text" placeholder="Heart Rate (BPM)" className="w-full p-4 bg-slate-50 border-2 rounded-2xl font-bold outline-blue-600" onChange={(e) => setVitals({...vitals, heartRate: e.target.value})} />
              <textarea placeholder="Describe your doubts or symptoms here..." className="w-full p-4 bg-slate-50 border-2 rounded-2xl font-bold h-32 outline-blue-600" onChange={(e) => setVitals({...vitals, doubts: e.target.value})} />
              <button onClick={handleProcess} disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700">
                {loading ? "Analyzing..." : "Submit to AI & Doctor"}
              </button>
            </div>
          </div>

          {chartData.length >= 2 && (
            <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-blue-50">
              <h2 className="text-xl font-black text-slate-800 mb-4 uppercase flex items-center gap-2"><Heart className="text-red-500"/> Heart Rate Trend</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="bpm" stroke="#2563eb" strokeWidth={5} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-blue-50 flex flex-col min-h-[600px]">
          <h2 className="text-xl font-black text-slate-800 mb-6 uppercase flex items-center gap-2"><FileText className="text-blue-600"/> Analysis & Recommendations</h2>
          
          {patient.aiRecommendation && (
            <div className={`mb-6 p-5 rounded-2xl border-4 flex items-center gap-4 font-black uppercase text-center justify-center ${patient.aiRecommendation.includes('Doctor') ? 'bg-red-50 border-red-600 text-red-700' : 'bg-green-50 border-green-600 text-green-700'}`}>
              {patient.aiRecommendation.includes('Doctor') ? <AlertCircle/> : <CheckCircle/>}
              {patient.aiRecommendation}
            </div>
          )}

          <div className="bg-slate-50 p-6 rounded-2xl flex-grow overflow-y-auto font-bold text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: patient.medicalHistory || "Please update your vitals to generate a report." }} />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
