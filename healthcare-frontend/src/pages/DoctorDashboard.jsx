import React, { useState } from 'react';
import { confirmAppointment } from '../api';
import { CalendarCheck, Clock, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const DoctorDashboard = () => {
  const [schedule, setSchedule] = useState({ date: '', time: '' });
  
  const handleConfirm = async (id) => {
    try {
      await confirmAppointment({ id, ...schedule });
      toast.success("Appointment Confirmed for " + schedule.date);
    } catch (e) { toast.error("Confirmation Failed"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <h1 className="text-4xl font-black text-blue-900 mb-10">DOCTOR CONSOLE</h1>
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100 max-w-2xl">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><UserCheck/> Set Appointment Schedule</h3>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <input type="date" className="p-4 border rounded-xl font-bold" onChange={e => setSchedule({...schedule, date: e.target.value})} />
          <input type="time" className="p-4 border rounded-xl font-bold" onChange={e => setSchedule({...schedule, time: e.target.value})} />
        </div>
        <button onClick={() => handleConfirm('123')} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2">
          <CalendarCheck/> CONFIRM APPOINTMENT
        </button>
      </div>
    </div>
  );
};
export default DoctorDashboard;
