import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LogOut, User, Download, Users, Search, Clock, Mail } from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSchedule, setShowSchedule] = useState(null);
  const [scheduleData, setScheduleData] = useState({ date: '', time: '' });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setDoctor(JSON.parse(userData));
      fetchPatients();
    } else { window.location.href = '/login'; }
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get('https://health-ai-backend-q09o.onrender.com/api/auth/patients');
      setPatients(res.data);
    } catch (e) { toast.error("Fetch Error"); }
  };

  const downloadPDF = (patient) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138);
    doc.text("HEALTH ASSESSMENT REPORT", 20, 20);
    doc.setFontSize(12);
    doc.text(`Patient: ${patient.name}`, 20, 40);
    doc.text(`Vitals: BP ${patient.bloodPressure} | HR ${patient.heartRate} bpm`, 20, 50);
    const reportContent = patient.medicalHistory || "No report available.";
    const cleanReport = reportContent.replace(/<br\s*\/?>/gi, '\n').replace(/<b>/gi, '').replace(/<\/b>/gi, '');
    const splitReport = doc.splitTextToSize(cleanReport, 170);
    doc.text(splitReport, 20, 70);
    doc.save(`${patient.name}_Report.pdf`);
  };

  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-10 font-sans">
      <header className="flex justify-between items-center mb-10 border-b-4 border-blue-600 pb-6">
        <div>
          <h1 className="text-4xl font-black text-blue-900 italic uppercase tracking-tighter">Doctor Dashboard</h1>
          <div className="flex gap-4 mt-2">
            <span className="font-black text-blue-600 uppercase flex items-center gap-1"><User size={16}/> DR. {doctor.name}</span>
            <span className="font-black text-slate-400 flex items-center gap-1"><Mail size={16}/> {doctor.email}</span>
          </div>
        </div>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href='/login'; }} className="bg-red-600 text-white px-8 py-2 rounded-xl font-black flex items-center gap-2">
          <LogOut size={18}/> LOGOUT
        </button>
      </header>

      <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">
        <div className="p-8 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-2xl font-black text-slate-800 uppercase flex items-center gap-2"><Users className="text-blue-600"/> Registered Patients</h2>
          <input type="text" placeholder="Search..." className="w-1/3 p-3 rounded-2xl border-2 font-black focus:border-blue-600 outline-none" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <table className="w-full text-left">
          <thead className="bg-blue-900 text-white uppercase text-xs">
            <tr>
              <th className="p-6">Patient Name</th>
              <th className="p-6 text-center">Vitals (Bold)</th>
              <th className="p-6 text-center">Schedule Appointment</th>
              <th className="p-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.filter(p => (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())).map((p, index) => (
              <tr key={index} className="hover:bg-blue-50 border-b transition-all">
                <td className="p-6 font-black uppercase text-slate-700">{p.name}</td>
                <td className="p-6 text-center font-black">
                  <div className="text-blue-600">BP: {p.bloodPressure || "N/A"}</div>
                  <div className="text-red-500">HR: {p.heartRate || "N/A"} bpm</div>
                </td>
                <td className="p-6 text-center font-black">
                  {showSchedule === p.email ? (
                    <div className="flex flex-col gap-2 p-2 bg-slate-50 rounded-xl">
                      <input type="date" className="p-1 border rounded font-bold text-xs" onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}/>
                      <input type="time" className="p-1 border rounded font-bold text-xs" onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}/>
                      <button onClick={() => {toast.success("Scheduled!"); setShowSchedule(null);}} className="bg-blue-600 text-white text-[10px] py-1 rounded">Save</button>
                    </div>
                  ) : (
                    <button onClick={() => setShowSchedule(p.email)} className="bg-blue-900 text-white px-4 py-2 rounded-xl text-xs flex items-center gap-2 mx-auto font-black">
                      <Clock size={14}/> SCHEDULE
                    </button>
                  )}
                </td>
                <td className="p-6 text-center">
                  <button onClick={() => downloadPDF(p)} className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-black text-xs flex items-center gap-2 mx-auto">
                    <Download size={14}/> DOWNLOAD REPORT
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorDashboard;
