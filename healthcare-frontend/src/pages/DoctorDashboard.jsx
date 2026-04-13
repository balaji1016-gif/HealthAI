import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { confirmAppointment } from '../api';
import { Download, CheckCircle, Clock, User, ClipboardList, LogOut } from 'lucide-react';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [schedule, setSchedule] = useState({ date: '', time: '' });
  const [loading, setLoading] = useState(true);
  const doctor = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await axios.get('https://healthai-nx8q.onrender.com/api/auth/patients');
        const aRes = await axios.get('https://healthai-nx8q.onrender.com/api/appointments/all');
        setPatients(pRes.data);
        setAppointments(aRes.data);
      } catch (e) {
        console.error("Clinical data sync error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const downloadReport = (p) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text("PATIENT CLINICAL SUMMARY", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    doc.autoTable({
      startY: 35,
      head: [['Clinical Metric', 'Data Value']],
      body: [
        ['Full Name', p.name || p.fullName],
        ['Email Address', p.email],
        ['Blood Pressure', p.bloodPressure || '120/80'],
        ['Heart Rate', p.heartRate || '72 BPM'],
        ['Current Symptoms / Doubts', p.doubtText || 'No queries submitted'],
        ['Status', 'Active Monitoring']
      ],
      headStyles: { fillColor: [79, 70, 229], fontStyle: 'bold' },
      styles: { cellPadding: 5, fontSize: 11 }
    });

    doc.save(`${p.name}_Clinical_Report.pdf`);
    toast.success("PDF Report Generated");
  };

  const handleApprove = async (id) => {
    if(!schedule.date || !schedule.time) {
      toast.error("Please select a date and time");
      return;
    }
    try {
      await confirmAppointment(id, schedule);
      setAppointments(appointments.map(a => a.id === id ? {...a, status: 'APPROVED'} : a));
      toast.success("Appointment Confirmed & Scheduled");
    } catch (e) {
      toast.error("Error updating appointment");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <RefreshCw className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Dashboard</h1>
            <p className="text-indigo-600 font-black text-xs uppercase tracking-widest mt-1">Physician: Dr. {doctor?.name || "Specialist"}</p>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-slate-400 font-bold hover:text-red-500 transition-all">
            <LogOut size={20} /> LOGOUT
          </button>
        </header>

        <section>
          <h3 className="text-xs font-black text-slate-400 uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
            <ClipboardList size={16} /> Patient Vital Monitoring
          </h3>
          <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400">Identity</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400">Vitals</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400">Symptoms / Doubts</th>
                  <th className="p-6 text-right text-[10px] font-black uppercase text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.email} className="border-b last:border-0 hover:bg-slate-50/50 transition-all">
                    <td className="p-6">
                      <p className="font-bold text-slate-800">{p.name || p.fullName}</p>
                      <p className="text-xs text-slate-400">{p.email}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex gap-2">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold font-mono">{p.bloodPressure || '120/80'}</span>
                        <span className="bg-red-50 text-red-700 px-3 py-1 rounded-lg text-xs font-bold font-mono">{p.heartRate || '72'}</span>
                      </div>
                    </td>
                    <td className="p-6 max-w-xs">
                      <p className="text-xs italic text-slate-500 line-clamp-2">
                        {p.doubtText ? `"${p.doubtText}"` : "No active queries."}
                      </p>
                    </td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={()=>downloadReport(p)} 
                        className="bg-slate-900 text-white p-3 rounded-xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                        title="Download Full PDF Report"
                      >
                        <Download size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <h3 className="text-xs font-black text-slate-400 uppercase mb-8 tracking-[0.2em] flex items-center gap-2">
            <Clock size={16} /> Appointment Requests & Scheduling
          </h3>
          <div className="space-y-6">
            {appointments.filter(a => a.status === 'PENDING').length === 0 ? (
              <p className="text-slate-400 italic text-center py-4">No pending appointment requests from patients.</p>
            ) : (
              appointments.filter(a => a.status === 'PENDING').map(app => (
                <div key={app.id} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col lg:flex-row justify-between items-center gap-6">
                  <div>
                    <p className="font-black text-xl text-slate-800">{app.patientName}</p>
                    <p className="text-sm text-indigo-600 font-bold italic mt-1">"{app.reason}"</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase ml-1">Date</p>
                      <input type="date" onChange={(e)=>setSchedule({...schedule, date: e.target.value})} className="p-3 border rounded-xl text-sm font-bold bg-white" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase ml-1">Time</p>
                      <input type="time" onChange={(e)=>setSchedule({...schedule, time: e.target.value})} className="p-3 border rounded-xl text-sm font-bold bg-white" />
                    </div>
                    <button 
                      onClick={()=>handleApprove(app.id)} 
                      className="bg-green-600 text-white px-8 py-3 rounded-xl font-black text-xs uppercase shadow-xl shadow-green-100 hover:bg-green-700 transition-all active:scale-95 mt-4 lg:mt-0"
                    >
                      Confirm Schedule
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DoctorDashboard;
