import React, { useEffect, useState } from 'react';
import { LogOut, Users, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { getPatients, confirmAppointment } from '../api'; // FIXED IMPORT

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [doctor, setDoctor] = useState(null);
  const [appointmentData, setAppointmentData] = useState({});

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setDoctor(JSON.parse(savedUser));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getPatients();
      setPatients(res.data);
    } catch (e) { 
      toast.error("Error fetching patient data"); 
    }
  };

  const handleConfirm = async (patient) => {
    const details = appointmentData[patient.email];
    if (!details?.date || !details?.time) {
      toast.error("Set Date and Time first!");
      return;
    }

    try {
      await confirmAppointment({
        ...patient,
        appointmentDate: details.date,
        appointmentTime: details.time
      });
      toast.success(`Appointment set for ${patient.name}`);
      fetchData();
    } catch (e) {
      toast.error("Confirmation failed");
    }
  };

  const downloadPDF = (p) => {
    const doc = new jsPDF();
    doc.setFillColor(30, 58, 138); doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.text("PATIENT CLINICAL RECORD", 20, 25);
    doc.setTextColor(0, 0, 0); doc.setFontSize(12);
    doc.text(`Patient Name: ${p.name}`, 20, 50);
    doc.text(`Vitals: BP ${p.bloodPressure || 'N/A'} | HR ${p.heartRate || 'N/A'} BPM`, 20, 60);
    doc.text(`AI Recommendation: ${p.aiRecommendation || 'Awaiting'}`, 20, 85);
    const content = (p.medicalHistory || "").replace(/<br\s*\/?>/gi, '\n').replace(/<b>|<\/b>/gi, '');
    const splitText = doc.splitTextToSize(content, 170);
    doc.text(splitText, 20, 100);
    doc.save(`${p.name}_Report.pdf`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <header className="flex justify-between items-center mb-10 border-b-4 border-blue-600 pb-6 uppercase font-black italic">
        <div className="flex flex-col">
           <h1 className="text-4xl text-blue-900">Doctor Portal</h1>
           {doctor && <p className="text-xs text-slate-500 not-italic tracking-widest mt-1">LOGGED IN AS: {doctor.name} ({doctor.email})</p>}
        </div>
        <button onClick={() => { localStorage.removeItem('user'); window.location.href='/login'; }} className="bg-red-600 text-white px-8 py-2 rounded-xl text-sm font-black italic">LOGOUT</button>
      </header>

      <div className="bg-white rounded-3xl shadow-2xl border-2 border-blue-50 overflow-hidden">
        <div className="p-8 flex justify-between items-center bg-blue-50/30">
          <h2 className="text-2xl font-black text-blue-900 flex items-center gap-2 uppercase"><Users/> Patient Roster</h2>
          <input type="text" placeholder="Search Patient Name..." className="p-3 border-2 rounded-xl w-1/3 font-bold" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <table className="w-full">
          <thead className="bg-blue-900 text-white uppercase text-sm">
            <tr>
              <th className="p-6 text-left">Patient</th>
              <th className="p-6">Vitals</th>
              <th className="p-6">Set Appointment</th>
              <th className="p-6">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map((p, i) => (
              <tr key={i} className={`border-b hover:bg-blue-50 transition-colors ${p.highPriority ? 'bg-red-50/50' : ''}`}>
                <td className="p-6 font-black uppercase text-slate-800 text-sm">
                  {p.name}
                  {p.highPriority && <span className="ml-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded-full animate-pulse flex items-center w-fit gap-1 mt-1"><AlertTriangle size={10}/> URGENT</span>}
                </td>
                <td className="p-6 font-bold text-center text-xs">
                  <div className="text-blue-600">BP: {p.bloodPressure}</div>
                  <div className="text-red-500">HR: {p.heartRate} BPM</div>
                </td>
                <td className="p-6">
                   <div className="flex flex-col gap-1">
                      <input type="date" className="p-1 border rounded text-xs font-bold" onChange={(e) => setAppointmentData({...appointmentData, [p.email]: {...appointmentData[p.email], date: e.target.value}})} />
                      <input type="time" className="p-1 border rounded text-xs font-bold" onChange={(e) => setAppointmentData({...appointmentData, [p.email]: {...appointmentData[p.email], time: e.target.value}})} />
                      <button onClick={() => handleConfirm(p)} className="bg-blue-600 text-white py-1.5 rounded-lg text-[10px] font-black uppercase hover:bg-blue-800 flex items-center justify-center gap-1">
                        <CheckCircle size={10}/> Confirm
                      </button>
                   </div>
                </td>
                <td className="p-6 text-center">
                  <button onClick={() => downloadPDF(p)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 hover:bg-emerald-700 shadow-md">
                    <Download size={14}/> PDF
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
