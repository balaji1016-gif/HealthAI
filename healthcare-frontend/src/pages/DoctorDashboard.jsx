import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, LogOut, RefreshCw, Users, ShieldCheck } from 'lucide-react';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const doctor = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://healthai-nx8q.onrender.com/api/auth/patients', {
        withCredentials: true
      });
      setPatients(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Server Error: Database column mismatch or connection lost.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const generateReport = (p) => {
    const doc = new jsPDF();
    doc.text("HEALTH AI - CLINICAL RECORD", 14, 20);
    doc.autoTable({
      startY: 30,
      head: [['Field', 'Value']],
      body: [
        ['Name', p.name || 'N/A'],
        ['Email', p.email],
        ['Age', p.age],
        ['BP', p.bloodPressure || 'N/A'],
        ['Heart Rate', p.heartRate || 'N/A'],
        ['History', p.medicalHistory || 'None Recorded']
      ],
    });
    doc.save(`Patient_${p.name}.pdf`);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <RefreshCw className="animate-spin text-indigo-600 mb-4" size={40} />
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Clinical Data...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="bg-white p-8 rounded-[2rem] shadow-sm flex justify-between items-center border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white"><ShieldCheck /></div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">Dr. {doctor.name || 'Specialist'}</h1>
              <p className="text-indigo-600 text-[10px] font-black uppercase">Medical Records Access</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100"><RefreshCw size={20}/></button>
            <button onClick={logout} className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold text-xs uppercase hover:bg-red-100">Logout</button>
          </div>
        </header>

        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-8 text-[10px] font-black uppercase text-slate-400">Patient</th>
                <th className="p-8 text-[10px] font-black uppercase text-slate-400">Vitals</th>
                <th className="p-8 text-right text-[10px] font-black uppercase text-slate-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.length === 0 ? (
                <tr><td colSpan="3" className="p-20 text-center text-slate-400 italic font-bold">No Records Found.</td></tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.email} className="hover:bg-slate-50/50 transition-all">
                    <td className="p-8">
                      <p className="font-black text-slate-800 text-lg">{p.name}</p>
                      <p className="text-indigo-500 font-mono text-xs">{p.email}</p>
                    </td>
                    <td className="p-8">
                      <div className="flex gap-2">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-bold">BP: {p.bloodPressure || 'N/A'}</span>
                        <span className="bg-red-50 text-red-700 px-3 py-1 rounded-lg text-[10px] font-bold">HR: {p.heartRate || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="p-8 text-right">
                      <button onClick={() => generateReport(p)} className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-lg"><Download size={20}/></button>
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
