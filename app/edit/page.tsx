"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';

export default function EditEntry() {
  const params = useSearchParams();
  const token = params.get('token');
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from('entries').select('*').eq('edit_token', token).single();
      if (data) setFormData(data);
      setLoading(false);
    }
    if (token) loadData();
  }, [token]);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const updates = Object.fromEntries(new FormData(e.currentTarget));
    const { error } = await supabase.from('entries').update(updates).eq('edit_token', token);
    if (!error) alert("Profile Updated Successfully!");
  }

  if (loading) return <p className="text-center mt-10">Loading profile data...</p>;
  if (!formData) return <p className="text-center mt-10 text-red-500">Invalid Edit Link.</p>;

  return (
    <div className="max-w-xl mx-auto my-10 p-8 bg-white rounded-[2.5rem] shadow-xl border">
      <h1 className="text-2xl font-black mb-6">Edit Your Profile</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <EditField label="Full Name" name="name" defaultValue={formData.name} />
        <div className="grid grid-cols-2 gap-4">
           <EditField label="DOB" name="dob" type="date" defaultValue={formData.dob} />
           <EditField label="Time" name="time" type="time" defaultValue={formData.time} />
        </div>
        <EditField label="Place of Birth" name="place" defaultValue={formData.place} />
        <EditField label="Education" name="education" defaultValue={formData.education} />
        <EditField label="Occupation" name="occupation" defaultValue={formData.occupation} />
        <EditField label="Business Name" name="business" defaultValue={formData.business} />
        <div className="grid grid-cols-2 gap-4">
          <EditField label="Father's Name" name="father_name" defaultValue={formData.father_name} />
          <EditField label="Mother's Name" name="mother_name" defaultValue={formData.mother_name} />
        </div>
        
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Current Photo</p>
          <img src={formData.photo_1} className="w-20 h-20 rounded-xl mt-2 object-cover" />
          <p className="text-[10px] text-slate-400 mt-2">Note: Photo change is currently disabled in Edit mode.</p>
        </div>

        <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg">
          Update Profile
        </button>
      </form>
    </div>
  );
}

function EditField({ label, name, type = "text", defaultValue }: any) {
  return (
    <div>
      <label className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-wider">{label}</label>
      <input name={name} type={type} defaultValue={defaultValue} className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 mt-1" />
    </div>
  );
}
