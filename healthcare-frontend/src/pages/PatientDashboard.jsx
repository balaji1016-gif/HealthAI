import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PatientDashboard = () => {
  const [vitals, setVitals] = useState({ bloodPressure: '', heartRate: '' });
  const [aiInsight, setAiInsight] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState([{day: 'Mon', hr: 72}, {day: 'Tue', hr: 75}, {day: 'Wed', hr: 70}]);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleAnalyze = async (e) => {
    e.preventDefault();

    // 1. Validation Logic
    const bpRegex = /^\d{2,3}\/\d{2,3}$/;
    if (!bpRegex.test(vitals.bloodPressure)) {
      return toast.error("Use BP format: 120/80");
    }

    setLoading(true);
    const loadId = toast.loading("AI analyzing vitals...");

    try {
      const res = await axios.post('https://healthai-nx8q.onrender.com/api/vitals/add', {
        ...vitals, patientId: user.id
      });
      setAiInsight(res.data.aiInsight);
      setChartData([...chartData, { day: 'Now', hr: parseInt(vitals.heartRate) }]);
      toast.success("Analysis Complete", { id: loadId });
    } catch (err) {
      toast.error("Server connection failed", { id: loadId });
    } finally {
      setLoading(false);
    }
  };

  const handleAppointment = async () => {
    if (!reason) return toast.error("Please enter a reason");
    try {
      await axios.post('https://healthai-nx8q.onrender.com/api/appointments/request', {
        patientId: user.id, patientName: user.fullName, reason: reason
      });
      toast.success("Consultation Request Sent!");
      setReason('');
    } catch (err) {
      toast.error("Failed to send request.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="bg-white border p-6 rounded-3xl flex justify-between items-center mb-8 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Patient Hub</h1>
            <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">Active Session: {user.fullName}</p>
          </div>
          <button onClick={() => {localStorage.clear(); window.location.href='/';}} className="bg-slate-100 text-slate-500 px-6 py-2 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-500 transition">Logout</button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="bg-white border p-8 rounded-3xl shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              Live Biometrics
            </h3>
            <form onSubmit={handleAnalyze} className="space-y-4">
              <input type="text" placeholder="BP (e.g. 120/80)" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 transition" onChange={(e)=>setVitals({...vitals, bloodPressure: e.target.value})} />
              <input type="number" placeholder="HR (BPM)" className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:border-blue-500 transition" onChange={(e)=>setVitals({...vitals, heartRate: e.target.value})} />
              <button disabled={loading} className={`w-full py-4 rounded-2xl font-bold transition ${loading ? 'bg-slate-200 text-slate-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-100 hover:bg-blue-700'}`}>
                {loading ? 'Processing...' : 'Run AI Diagnostic'}
              </button>
            </form>
            <div className="p-5 bg-blue-50 text-blue-800 rounded-2xl text-sm border border-blue-100 leading-relaxed italic">
              <span className="block text-[10px] font-black uppercase mb-1 not-italic opacity-50">AI Insight Output:</span>
              {aiInsight || "Awaiting clinical biometric data input..."}
            </div>
          </div>

          {/* Chart Panel */}
          <div className="lg:col-span-2 bg-white border p-8 rounded-3xl shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 uppercase text-xs tracking-tighter">Heart Rate Trend Analysis</h3>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <XAxis dataKey="day" hide />
                  <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                  <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                  <Area type="monotone" dataKey="hr" stroke="#2563eb" strokeWidth={3} fill="#dbeafe" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Appointment Section */}
        <div className="mt-8 bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <h3 className="text-xl font-bold">Need a Specialist?</h3>
            <p className="text-slate-400 text-sm">Request a consultation based on your AI report.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <input value={reason} onChange={(e)=>setReason(e.target.value)} type="text" placeholder="Reason for visit..." className="flex-1 md:w-80 p-4 bg-white/10 border border-white/20 rounded-2xl outline-none focus:bg-white/20" />
            <button onClick={handleAppointment} className="bg-blue-600 px-8 rounded-2xl font-bold hover:bg-blue-500 transition">Request</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PatientDashboard;
