import React, { useEffect, useState } from 'react';
import { getPatients, confirmAppointment } from '../api'; 
import { LogOut, User, Download, Users, FileText, Search, Clock } from 'lucide-react';
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
      const parsedUser = JSON.parse(userData);
      setDoctor(parsedUser);
      if (parsedUser.email) fetchPatients(parsedUser.email);
    } else { window.location.href = '/login'; }
  }, []);

  const fetchPatients = async (email) => {
    try {
      const res = await getPatients(email);
      setPatients(Array.isArray(res.data) ? res.data : []);
    } catch (e) { 
      toast.error("Records Not Found"); 
    }
  };

  const handleConfirm = async (patientEmail) => {
    if (!scheduleData.date || !scheduleData.time) return toast.error("Select Date & Time");
    try {
      await confirmAppointment({ email: patientEmail, ...scheduleData });
      toast.success(`Confirmed for ${scheduleData.date}`);
      setShowSchedule(null);
    } catch (e) { toast.error("Error confirming"); }
  };

  const downloadPDF = (patient) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138);
    doc.text("HEALTH ASSESSMENT REPORT", 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Patient: ${patient.name || "N/A"}`, 20, 40);
    doc.text(`BP: ${patient.bloodPressure || 'N/A'} | HR: ${patient.heartRate || 'N/A'}`, 20, 50);
    doc.text("--------------------------------------------------", 20, 60);
    const history = patient.medicalHistory || "No history.";
    doc.text(doc.splitTextToSize(history, 170), 20, 70);
    doc.save(`${patient.name || "Patient"}_Report.pdf`);
    toast.success("PDF Saved");
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!doctor) return null;

  return (
    <div className="min-h-screen bg-slate-50 p-10 font-sans">
      <header className="flex justify-between items-center mb-10 border-b-4 border-blue-600 pb-6">
        <div>
          <h1 className="text-4xl font-black text-blue-900 italic uppercase tracking-tighter">Doctor Dashboard</h1>
          <div className="flex gap-4 mt-2 font-bold uppercase text-xs">
             <span className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2"><User size={14}/> DR. {doctor.name || "BALAJI D"}</span>
             <span className="text-blue-400 self-center tracking-widest">{doctor.email}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-red-600 text-white px-8 py-2 rounded-xl font-black flex items-center gap-2 hover:bg-red-700 shadow-lg transition-all">
          <LogOut size={18}/> LOGOUT
        </button>
      </header>

      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 uppercase"><Users size={30} className="text-blue-600"/> Registered Patients</h2>
          <div className="relative w-1/3">
            <Search className="absolute left-4 top-3 text-slate-400" size={18}/>
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-12 pr-4 py-2.5 rounded-2xl border-2 font-bold outline-none focus:border-blue-600 transition-all" 
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-900 text-white uppercase text-xs tracking-widest">
                <th className="p-6">Patient Name</th>
                <th className="p-6 text-center">Vitals</th>
                <th className="p-6 text-center">Manage Appointment</th>
                <th className="p-6 text-center">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {patients.filter(p => (p.name || "").toLowerCase().includes(searchTerm.toLowerCase())).map((p, index) => (
                <tr key={index} className="hover:bg-blue-50/50 font-bold transition-all">
                  <td className="p-6 uppercase">{p.name || "Unnamed Patient"}</td>
                  <td className="p-6 text-center">
                    <span className="text-blue-600 mr-2">{p.bloodPressure || "N/A"}</span>
                    <span className="text-red-500">{p.heartRate || "N/A"} bpm</span>
                  </td>
                  <td className="p-6 text-center">
                    {showSchedule === p.email ? (
                      <div className="flex flex-col gap-2 bg-slate-50 p-2 rounded-lg border">
                        <input type="date" className="p-1 border rounded text-xs" onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}/>
                        <input type="time" className="p-1 border rounded text-xs" onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}/>
                        <div className="flex gap-2">
                          <button onClick={() => handleConfirm(p.email)} className="bg-blue-600 text-white text-[10px] p-1 rounded flex-1">Confirm</button>
                          <button onClick={() => setShowSchedule(null)} className="bg-slate-400 text-white text-[10px] p-1 rounded flex-1">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setShowSchedule(p.email)} className="bg-blue-900 text-white px-4 py-2 rounded-xl text-xs flex items-center gap-2 mx-auto">
                        <Clock size={14}/> SCHEDULE
                      </button>
                    )}
                  </td>
                  <td className="p-6 text-center">
                    <button onClick={() => downloadPDF(p)} className="bg-emerald-600 text-white px-5 py-2 rounded-xl font-black text-xs flex items-center gap-2 mx-auto hover:bg-emerald-700 shadow-md">
                      <Download size={14}/> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {patients.length === 0 && <p className="p-20 text-center font-black uppercase text-slate-300">No Records Found</p>}
        </div>
      </div>
    </div>
  );
};
export default DoctorDashboard;
