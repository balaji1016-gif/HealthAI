import React, { useState, useEffect } from 'react';
import { getPatients } from '../api';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, ClipboardList, LogOut, RefreshCw, UserCheck } from 'lucide-react';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const doctor = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      // Calling your new Spring Boot endpoint
      const res = await axios.get('https://healthai-nx8q.onrender.com/api/auth/patients');
      if (res.data) {
        setPatients(res.data);
      }
    } catch (e) {
      console.error("Clinical data fetch error", e);
      toast.error("Clinical Database Offline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const downloadReport = (p) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("CLINICAL PATIENT REPORT", 14, 20);
    doc.autoTable({
      startY: 30,
      head: [['Metric', 'Clinical Data']],
      body: [
        ['Name', p.name || p.fullName || 'Unknown'],
        ['Email', p.email],
        ['Blood Pressure', p.bloodPressure || '120/80'],
        ['Heart Rate', p.heartRate || '72 BPM'],
        ['Role', p.role || 'PATIENT']
      ],
      theme: 'grid'
    });
    doc.save(`Report_${p.email}.pdf`);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-500 font-bold uppercase tracking-tighter">Syncing Clinical Records...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-indigo-200">
              <UserCheck size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Dr. {doctor.name || 'Specialist'}</h1>
              <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Medical Supervisor Portal</p>
            </div>
          </div>
          <div className="flex gap-4">
             <button onClick={fetchDoctorData} className="p-4 bg-slate-100 rounded-2xl text-slate-600 hover:bg-slate-200 transition-all">
                <RefreshCw size={20} />
             </button>
             <button onClick={logout} className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black text-sm uppercase hover:bg-red-100 transition-all">
                <LogOut size={18} /> Logout
             </button>
          </div>
        </header>

        <section>
          <div className="flex justify-between items-center mb-6 px-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ClipboardList size={16} /> Patient Database ({patients.length})
            </h3>
          </div>
          
          <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
            {patients.length === 0 ? (
              <div className="p-24 text-center">
                <p className="text-slate-400 font-bold text-lg italic">No patient records found.</p>
                <p className="text-slate-300 text-sm">Please ensure patients are registered in the database.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400">Patient Details</th>
                    <th className="p-8 text-[10px] font-black uppercase text-slate-400">Vital Signs</th>
                    <th className="p-8 text-right text-[10px] font-black uppercase text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.email} className="border-b last:border-0 hover:bg-slate-50/50 transition-all group">
                      <td className="p-8">
                        <p className="font-black text-slate-800 text-lg">{p.name || p.fullName || 'Anonymous'}</p>
                        <p className="text-xs font-bold text-indigo-500 font-mono uppercase tracking-tight">{p.email}</p>
                      </td>
                      <td className="p-8">
                        <div className="flex gap-3">
                          <div className="bg-blue-50 px-4 py-2 rounded-xl">
                            <span className="block text-[8px] font-black text-blue-400 uppercase">BP</span>
                            <span className="font-mono font-black text-blue-700">{p.bloodPressure || '120/80'}</span>
                          </div>
                          <div className="bg-red-50 px-4 py-2 rounded-xl">
                            <span className="block text-[8px] font-black text-red-400 uppercase">HR</span>
                            <span className="font-mono font-black text-red-700">{p.heartRate || '72'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <button 
                          onClick={() => downloadReport(p)} 
                          className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-xl active:scale-90"
                          title="Generate Clinical PDF"
                        >
                          <Download size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;
