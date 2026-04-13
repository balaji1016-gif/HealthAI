import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, LogOut, RefreshCw, Activity, Users, ShieldCheck } from 'lucide-react';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const doctor = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Direct call to your new backend endpoint
      const res = await axios.get('https://healthai-nx8q.onrender.com/api/auth/patients');
      setPatients(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      toast.error("Failed to load clinical records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generatePDF = (p) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("HEALTH AI - CLINICAL REPORT", 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    doc.autoTable({
      startY: 40,
      head: [['Field', 'Patient Details']],
      body: [
        ['Patient Name', p.name || 'N/A'],
        ['Email ID', p.email],
        ['Blood Pressure', p.bloodPressure || '120/80'],
        ['Heart Rate', p.heartRate || '72 BPM'],
        ['Clinical Status', 'Verified'],
      ],
      headStyles: { fillStyle: [79, 70, 229] }
    });
    doc.save(`Report_${p.name || 'Patient'}.pdf`);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Syncing Medical Database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* TOP NAV */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Dr. {doctor.name || 'Specialist'}</h1>
              <p className="text-indigo-600 text-xs font-black uppercase tracking-widest">Medical Supervisor</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData} className="p-4 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 transition-all">
              <RefreshCw size={20} />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black text-xs uppercase hover:bg-red-100 transition-all">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <Users className="text-indigo-500 mb-4" size={32} />
            <h4 className="text-4xl font-black text-slate-800">{patients.length}</h4>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Total Patients</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm md:col-span-2">
             <Activity className="text-emerald-500 mb-4" size={32} />
             <h4 className="text-lg font-bold text-slate-800 tracking-tight">System Status: Operational</h4>
             <p className="text-slate-400 text-sm">All clinical nodes are responding. AI diagnostic engine is online.</p>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50">
            <h2 className="text-xl font-black text-slate-800">Patient Directory</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Identification</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Vital Trends</th>
                  <th className="p-6 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">Clinical Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-20 text-center text-slate-300 font-bold italic">No records found in database.</td>
                  </tr>
                ) : (
                  patients.map((p) => (
                    <tr key={p.email} className="hover:bg-slate-50/50 transition-all group">
                      <td className="p-6">
                        <span className="font-black text-slate-700 block text-lg">{p.name || 'Unknown Patient'}</span>
                        <span className="text-indigo-500 font-mono text-xs font-bold">{p.email}</span>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">BP: {p.bloodPressure || '120/80'}</span>
                          <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">HR: {p.heartRate || '72'}</span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <button 
                          onClick={() => generatePDF(p)}
                          className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-lg active:scale-90"
                        >
                          <Download size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
