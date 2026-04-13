import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { confirmAppointment } from '../api';
import { Download, CheckCircle, Clock, User, ClipboardList } from 'lucide-react';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [schedule, setSchedule] = useState({ date: '', time: '' });
  const doctor = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      const pRes = await axios.get('https://healthai-nx8q.onrender.com/api/auth/patients');
      const aRes = await axios.get('https://healthai-nx8q.onrender.com/api/appointments/all');
      setPatients(pRes.data);
      setAppointments(aRes.data);
    };
    fetchData();
  }, []);

  const downloadReport = (p) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text("CLINICAL HEALTH REPORT", 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Patient Name: ${p.fullName || p.name}`, 14, 35);
    doc.text(`Email: ${p.email}`, 14, 42);
    doc.text(`Physician: Dr. ${doctor.name || 'System'}`, 14, 49);

    doc.autoTable({
      startY: 60,
      head: [['Metric', 'Value']],
      body: [
        ['Blood Pressure', p.bloodPressure || 'N/A'],
        ['Heart Rate', p.heartRate || 'N/A'],
        ['Patient Doubts', p.doubtText || 'None'],
        ['Assessment Date', new Date().toLocaleDateString()]
      ],
      headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save(`Report_${p.fullName}.pdf`);
  };

  const handleApprove = async (id) => {
    if(!schedule.date || !schedule.time) return toast.error("Set date and time first!");
    try {
      await confirmAppointment(id, schedule);
      toast.success("Appointment Scheduled!");
    } catch (e) { toast.error("Error"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Doctor Portal</h1>
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase">Dr. {doctor.name}</span>
        </header>

        {/* PATIENT LIST WITH DOUBTS */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400">Patient Details</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400">Patient Doubts</th>
                <th className="p-6 text-right text-[10px] font-black uppercase text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(p => (
                <tr key={p.email} className="border-b last:border-0">
                  <td className="p-6">
                    <p className="font-bold text-slate-800">{p.name || p.fullName}</p>
                    <p className="text-xs text-slate-500">BP: {p.bloodPressure} | HR: {p.heartRate}</p>
                  </td>
                  <td className="p-6 max-w-xs text-xs italic text-slate-600 font-medium">
                    "{p.doubtText || "No queries submitted"}"
                  </td>
                  <td className="p-6 text-right">
                    <button onClick={()=>downloadReport(p)} className="bg-slate-900 text-white p-3 rounded-xl hover:bg-blue-600 transition">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* APPOINTMENT MANAGER */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <h3 className="text-sm font-black text-slate-400 uppercase mb-6 flex items-center gap-2">
            <Clock size={16} /> Pending Appointment Confirmations
          </h3>
          <div className="space-y-4">
            {appointments.filter(a => a.status === 'PENDING').map(app => (
              <div key={app.id} className="p-6 bg-slate-50 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="font-bold text-lg text-slate-800">{app.patientName}</p>
                  <p className="text-xs text-indigo-600 font-bold italic">"{app.reason}"</p>
                </div>
                <div className="flex gap-2">
                  <input type="date" onChange={(e)=>setSchedule({...schedule, date: e.target.value})} className="p-2 border rounded-xl text-xs font-bold" />
                  <input type="time" onChange={(e)=>setSchedule({...schedule, time: e.target.value})} className="p-2 border rounded-xl text-xs font-bold" />
                  <button onClick={()=>handleApprove(app.id)} className="bg-green-600 text-white px-6 py-2 rounded-xl font-black text-xs uppercase shadow-lg shadow-green-100">Confirm</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
