"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function EditFormContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [entry, setEntry] = useState<any>(null);
  const [message, setMessage] = useState("");

  // 1. Check if token is valid and load data
  useEffect(() => {
    async function loadData() {
      if (!token) return;
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('edit_token', token)
        .single();

      if (error || !data) {
        setMessage("❌ Access Denied: Invalid or missing token.");
      } else {
        setEntry(data);
      }
      setLoading(false);
    }
    loadData();
  }, [token]);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    const { error } = await supabase
      .from('entries')
      .update({
        name: formData.get('name'),
        place: formData.get('place'),
        occupation: formData.get('occupation'),
        education: formData.get('education'),
        business: formData.get('business'),
        father_name: formData.get('father_name'),
        mother_name: formData.get('mother_name'),
      })
      .eq('edit_token', token);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      alert("✅ Profile updated successfully!");
      window.location.href = "/";
    }
    setSaving(false);
  }

  if (loading) return <div className="text-center mt-20 font-bold text-indigo-600">Verifying Secret Token...</div>;
  if (!entry) return <div className="text-center mt-20 p-6 bg-red-50 text-red-600 rounded-3xl max-w-sm mx-auto border border-red-200">{message}</div>;

  return (
    <div className="max-w-xl mx-auto my-10 p-8 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-amber-100 p-3 rounded-2xl text-amber-600 font-bold">Edit Mode</div>
        <h1 className="text-2xl font-black text-slate-800">Update Profile</h1>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        {/* CONTACT NUMBER - READ ONLY */}
        <div>
          <label className="text-xs font-bold text-slate-400 ml-2 uppercase">Contact Number (Locked)</label>
          <input 
            value={entry.contact_number} 
            disabled 
            className="w-full p-4 bg-slate-100 rounded-2xl border-none text-slate-400 cursor-not-allowed italic" 
          />
        </div>

        {/* EDITABLE FIELDS */}
        <input name="name" defaultValue={entry.name} placeholder="Full Name" required className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500" />
        <input name="place" defaultValue={entry.place} placeholder="Place" required className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200" />
        <input name="occupation" defaultValue={entry.occupation} placeholder="Occupation" required className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200" />
        <input name="education" defaultValue={entry.education} placeholder="Education" className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200" />
        <input name="business" defaultValue={entry.business} placeholder="Business" className="w-full p-4 bg-slate-50 rounded-2xl border-none ring-1 ring-slate-200" />

        <button 
          type="submit" 
          disabled={saving} 
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all mt-4"
        >
          {saving ? 'Saving Changes...' : 'Save Updates'}
        </button>
      </form>
    </div>
  );
}

// Main page component with Suspense for Vercel stability
export default function EditPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditFormContent />
    </Suspense>
  );
}
