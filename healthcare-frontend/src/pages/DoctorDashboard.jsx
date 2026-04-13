import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, LogOut, RefreshCw, Activity, Users, AlertTriangle } from 'lucide-react';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const doctor = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://healthai-nx8q.onrender.com/api/auth/patients');
      // If server returns 500, it will jump to the catch block
      setPatients(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      toast.error("Server Error (500): Database connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadReport = (p) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Clinical Summary", 14, 20);
    doc.autoTable({
      startY: 30,
      head: [['Metric', 'Detail']],
      body: [
        ['Name', p.name || 'Unknown'],
        ['Email', p.email],
        ['BP', p.bloodPressure || '120/80'],
        ['Heart Rate', p.heartRate || '72 BPM'],
      ],
    });
    doc.save(`${p.email}_report.pdf`);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-slate-500 font-black text-xs uppercase tracking-widest">Rebuilding Database View...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Dr. {doctor.name || 'Admin'}</h1>
              <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest">System Supervisor</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData} className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 text-slate-600 transition-all">
              <RefreshCw size={20} />
            </button>
            <button onClick={logout} className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black text-xs uppercase hover:bg-red-100 transition-all">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Database Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-8 text-[10px] font-black uppercase text-slate-400">Patient Identification</th>
                <th className="p-8 text-[10px] font-black uppercase text-slate-400">Clinical Vitals</th>
                <th className="p-8 text-right text-[10px] font-black uppercase text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {patients.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-24 text-center">
                    <AlertTriangle className="mx-auto text-amber-400 mb-4" size={48} />
                    <p className="text-slate-400 font-bold italic">No records found or Database offline.</p>
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.email} className="border-b last:border-0 hover:bg-slate-50/50 transition-all">
                    <td className="p-8">
                      <p className="font-black text-slate-800 text-lg">{p.name || 'No Name'}</p>
                      <p className="text-indigo-500 font-mono text-xs font-bold">{p.email}</p>
                    </td>
                    <td className="p-8">
                      <div className="flex gap-2">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black">BP: {p.bloodPressure || 'N/A'}</span>
                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black">HR: {p.heartRate || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <button onClick={() => downloadReport(p)} className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-lg">
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
  );
};

export default DoctorDashboard;
