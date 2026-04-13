import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Updated import
import { Download, LogOut, RefreshCw, Users, ShieldCheck } from 'lucide-react';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const doctor = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://healthai-nx8q.onrender.com/api/auth/patients');
      setPatients(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Server Error: Database connection failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- FIXED PDF GENERATOR ---
  const generateReport = (p) => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(20);
      doc.setTextColor(79, 70, 229); // Indigo color
      doc.text("HEALTH AI - CLINICAL RECORD", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);

      // Using the autoTable function directly to avoid "t.autoTable is not a function"
      autoTable(doc, {
        startY: 35,
        head: [['Field', 'Patient Details']],
        body: [
          ['Full Name', p.name || 'N/A'],
          ['Email Address', p.email],
          ['Age', p.age || 'N/A'],
          ['Blood Pressure', p.bloodPressure || 'N/A'],
          ['Heart Rate', p.heartRate || 'N/A'],
          ['Medical History', p.medicalHistory || 'No history provided'],
          ['Account Role', p.role || 'PATIENT']
        ],
        theme: 'striped',
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 10, cellPadding: 5 }
      });

      doc.save(`Clinical_Report_${p.name || 'Patient'}.pdf`);
      toast.success("PDF Downloaded Successfully");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Could not generate PDF. Check console for details.");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <RefreshCw className="animate-spin text-indigo-600 mb-4" size={40} />
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Clinical Records...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-white p-8 rounded-[2rem] shadow-sm flex justify-between items-center border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dr. {doctor.name || 'Specialist'}</h1>
              <p className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">Medical Supervisor Access</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchData} className="p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">
              <RefreshCw size={20} />
            </button>
            <button onClick={logout} className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-black text-xs uppercase hover:bg-red-100 transition-all">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </header>

        {/* Patients Table */}
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100">
          <div className="p-8 border-b border-slate-50">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <Users size={20} className="text-indigo-500" /> Patient Database
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-8 text-[10px] font-black uppercase text-slate-400">Patient Details</th>
                  <th className="p-8 text-[10px] font-black uppercase text-slate-400">Vitals Status</th>
                  <th className="p-8 text-right text-[10px] font-black uppercase text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-24 text-center text-slate-300 font-bold italic">No records found in the database.</td>
                  </tr>
                ) : (
                  patients.map((p) => (
                    <tr key={p.email} className="hover:bg-slate-50/50 transition-all group">
                      <td className="p-8">
                        <p className="font-black text-slate-800 text-lg leading-tight">{p.name || 'Unnamed Patient'}</p>
                        <p className="text-indigo-500 font-mono text-xs font-bold mt-1">{p.email}</p>
                      </td>
                      <td className="p-8">
                        <div className="flex gap-2">
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-[10px] font-black">BP: {p.bloodPressure || 'N/A'}</span>
                          <span className="bg-red-50 text-red-700 px-3 py-1 rounded-lg text-[10px] font-black">HR: {p.heartRate || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-8 text-right">
                        <button 
                          onClick={() => generateReport(p)} 
                          className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                          title="Download Medical PDF"
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
