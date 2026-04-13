import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, LogOut, RefreshCw, Users, ShieldAlert } from 'lucide-react';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const doctor = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchData = async () => {
    setLoading(true);
    try {
      // Calling the new /patients endpoint on your Render backend
      const res = await axios.get('https://healthai-nx8q.onrender.com/api/auth/patients');
      if (res.data) {
        setPatients(res.data);
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      toast.error("Clinical Database offline or path not found (404)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadPDF = (p) => {
    const doc = new jsPDF();
    doc.text("Clinical Patient Report", 14, 20);
    doc.autoTable({
      startY: 30,
      head: [['Field', 'Value']],
      body: [
        ['Name', p.name || 'N/A'],
        ['Email', p.email],
        ['Blood Pressure', p.bloodPressure || 'N/8'],
        ['Heart Rate', p.heartRate || 'N/A'],
        ['Account Type', p.role || 'PATIENT'],
      ],
    });
    doc.save(`Report_${p.email}.pdf`);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Syncing Database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm flex flex-col md:flex-row justify-between items-center border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dr. {doctor.name || 'Admin'}</h1>
              <p className="text-indigo-600 text-xs font-bold uppercase">Medical Portal</p>
            </div>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button onClick={fetchData} className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">
              <RefreshCw size={20} />
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-100">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="p-6 text-xs font-black uppercase text-slate-400">Patient</th>
                  <th className="p-6 text-xs font-black uppercase text-slate-400">Vitals</th>
                  <th className="p-6 text-right text-xs font-black uppercase text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-20 text-center">
                      <ShieldAlert className="mx-auto text-slate-200 mb-4" size={48} />
                      <p className="text-slate-400 font-bold italic">No patient records found in database.</p>
                    </td>
                  </tr>
                ) : (
                  patients.map((p) => (
                    <tr key={p.email} className="hover:bg-slate-50/50 transition-all">
                      <td className="p-6">
                        <span className="font-bold text-slate-800 block text-lg">{p.name || 'Unknown'}</span>
                        <span className="text-indigo-500 text-xs font-mono">{p.email}</span>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">BP: {p.bloodPressure || 'N/A'}</span>
                          <span className="bg-red-50 text-red-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter">HR: {p.heartRate || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <button 
                          onClick={() => downloadPDF(p)}
                          className="bg-slate-900 text-white p-3 rounded-xl hover:bg-indigo-600 transition-all"
                        >
                          <Download size={18} />
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
