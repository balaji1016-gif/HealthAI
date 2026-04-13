import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, CheckCircle, Clock, ClipboardList, LogOut, RefreshCw } from 'lucide-react';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const doctor = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchDoctorData = async () => {
      setLoading(true);
      try {
        // Fetch all patients from your Spring Boot endpoint
        const pRes = await axios.get('https://healthai-nx8q.onrender.com/api/auth/patients');
        setPatients(Array.isArray(pRes.data) ? pRes.data : []);
        
        // Try to fetch appointments, but don't crash if it fails
        try {
          const aRes = await axios.get('https://healthai-nx8q.onrender.com/api/appointments/all');
          setAppointments(Array.isArray(aRes.data) ? aRes.data : []);
        } catch (err) {
          console.warn("Appointments endpoint not found yet.");
        }

      } catch (e) {
        console.error("Data fetch error", e);
        toast.error("Could not sync with clinical database");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, []);

  const downloadReport = (p) => {
    const doc = new jsPDF();
    doc.text("PATIENT CLINICAL SUMMARY", 14, 20);
    doc.autoTable({
      startY: 30,
      head: [['Metric', 'Value']],
      body: [
        ['Name', p.name || 'N/A'],
        ['Email', p.email],
        ['Blood Pressure', p.bloodPressure || 'N/A'],
        ['Heart Rate', p.heartRate || 'N/A'],
      ],
    });
    doc.save(`${p.name || 'Patient'}_Report.pdf`);
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin text-indigo-600 mb-4" size={48} />
        <p className="text-slate-500 font-bold uppercase tracking-widest">Loading Doctor Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex justify-between items-center bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Dr. {doctor.name || 'Specialist'}</h1>
            <p className="text-indigo-600 font-bold text-xs uppercase tracking-widest mt-1">Hospital Management System</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-slate-400 font-bold hover:text-red-500 transition-all">
            <LogOut size={20} /> SIGN OUT
          </button>
        </header>

        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-widest flex items-center gap-2">
            <ClipboardList size={16} /> Patient Records ({patients.length})
          </h3>
          <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100">
            {patients.length === 0 ? (
              <div className="p-20 text-center text-slate-400 font-medium">No patient records found in the system.</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400">Patient</th>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400">Vitals</th>
                    <th className="p-6 text-right text-[10px] font-black uppercase text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id || p.email} className="border-b last:border-0 hover:bg-slate-50/50 transition-all">
                      <td className="p-6">
                        <p className="font-bold text-slate-800">{p.name || p.fullName}</p>
                        <p className="text-xs text-slate-400">{p.email}</p>
                      </td>
                      <td className="p-6">
                        <div className="flex gap-2">
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold font-mono">{p.bloodPressure || 'N/A'}</span>
                          <span className="bg-red-50 text-red-700 px-3 py-1 rounded-lg text-xs font-bold font-mono">{p.heartRate || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-6 text-right">
                        <button 
                          onClick={()=>downloadReport(p)} 
                          className="bg-slate-900 text-white p-3 rounded-xl hover:bg-indigo-600 transition-all shadow-lg"
                        >
                          <Download size={18} />
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
