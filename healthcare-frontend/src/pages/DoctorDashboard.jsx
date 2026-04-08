import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await axios.get('http://localhost:8081/api/auth/patients');
        const aRes = await axios.get('http://localhost:8081/api/appointments/all');
        setPatients(pRes.data);
        setAppointments(aRes.data);
      } catch (e) {
        toast.error("Failed to load clinical data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const downloadReport = async (p) => {
    const loadId = toast.loading(`Generating report for ${p.fullName}...`);
    try {
      const res = await axios.get(`http://localhost:8081/api/vitals/patient/${p.id}`);
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("Clinical Health Analysis", 14, 20);
      doc.setFontSize(10);
      doc.text(`Patient: ${p.fullName} | Physician: Dr. ${user.fullName}`, 14, 30);

      doc.autoTable({
        startY: 35,
        head: [['Date', 'Blood Pressure', 'Heart Rate', 'AI Status']],
        body: res.data.map(log => [new Date(log.timestamp).toLocaleDateString(), log.bloodPressure, log.heartRate, log.aiInsight]),
        headStyles: { fillColor: [37, 99, 235] }
      });
      doc.save(`${p.fullName}_Report.pdf`);
      toast.success("PDF Downloaded", { id: loadId });
    } catch (e) {
      toast.error("Error generating PDF", { id: loadId });
    }
  };

  const approveApp = async (id) => {
    try {
      await axios.post(`http://localhost:8081/api/appointments/approve/${id}`);
      setAppointments(appointments.map(a => a.id === id ? {...a, status: 'APPROVED'} : a));
      toast.success("Appointment Confirmed");
    } catch (e) { toast.error("Error approving."); }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Management</h1>
            <p className="text-blue-600 font-bold text-xs uppercase">Physician: Dr. {user.fullName}</p>
          </div>
          <button onClick={() => {localStorage.clear(); window.location.href='/';}} className="text-slate-400 font-bold text-sm hover:text-red-500 transition">Logout System</button>
        </header>

        {loading ? (
          /* Loading Skeletons */
          <div className="space-y-4 animate-pulse">
            <div className="h-20 bg-slate-200 rounded-3xl"></div>
            <div className="h-20 bg-slate-200 rounded-3xl"></div>
            <div className="h-20 bg-slate-200 rounded-3xl"></div>
          </div>
        ) : (
          <>
            {/* Patient Records Table */}
            <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400">Patient Identity</th>
                    <th className="p-6 text-right text-[10px] font-black uppercase text-slate-400">Clinical Data</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-blue-50/30 transition">
                      <td className="p-6 font-bold text-slate-700">{p.fullName}</td>
                      <td className="p-6 text-right">
                        <button onClick={()=>downloadReport(p)} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-bold uppercase hover:bg-blue-600 transition">Download PDF</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Appointment Section */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border p-8 rounded-3xl shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6 text-xs uppercase tracking-widest">Pending Consultations</h3>
                <div className="space-y-4">
                  {appointments.filter(a => a.status === 'PENDING').length === 0 && <p className="text-slate-400 italic text-sm">No new requests.</p>}
                  {appointments.filter(a => a.status === 'PENDING').map(app => (
                    <div key={app.id} className="p-4 bg-slate-50 border rounded-2xl flex justify-between items-center">
                      <div>
                        <p className="font-bold text-sm text-slate-800">{app.patientName}</p>
                        <p className="text-[10px] text-slate-500 italic">"{app.reason}"</p>
                      </div>
                      <button onClick={()=>approveApp(app.id)} className="bg-green-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-green-700 transition">Approve</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border p-8 rounded-3xl shadow-sm">
                <h3 className="font-bold text-slate-800 mb-6 text-xs uppercase tracking-widest">Upcoming Schedule</h3>
                <div className="space-y-4 opacity-60">
                  {appointments.filter(a => a.status === 'APPROVED').map(app => (
                    <div key={app.id} className="p-4 border border-dashed rounded-2xl flex justify-between items-center">
                      <p className="font-bold text-sm text-slate-600">{app.patientName}</p>
                      <span className="text-[9px] font-black text-blue-600 uppercase border border-blue-200 px-2 py-1 rounded-md">Scheduled</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default DoctorDashboard;