"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Phone, Briefcase, User, GraduationCap, ArrowLeft, Calendar, Clock } from 'lucide-react';

export default function DetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPerson() {
      if (!id) return;
      const { data } = await supabase.from('entries').select('*').eq('id', id).single();
      if (data) setPerson(data);
      setLoading(false);
    }
    loadPerson();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400 font-bold animate-pulse">Opening Profile...</p>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-slate-500">Profile not found.</p>
        <button onClick={() => router.push('/')} className="text-indigo-600 font-bold underline">Go Back Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* HEADER */}
      <div className="p-4 flex items-center gap-4 border-b sticky top-0 bg-white/90 backdrop-blur-md z-20">
        <button onClick={() => router.push('/')} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-black text-slate-800 uppercase tracking-tight">Profile Detail</h1>
      </div>

      {/* PHOTO SECTION */}
      <div className="relative h-48 bg-indigo-600 flex items-end justify-center">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <img 
          src={person.photo_1 || 'https://via.placeholder.com/400?text=No+Photo'} 
          className="w-40 h-40 rounded-[2.5rem] object-cover border-8 border-white shadow-2xl translate-y-12 z-10"
          alt={person.name}
        />
      </div>

      {/* DETAILS SECTION */}
      <div className="max-w-xl mx-auto mt-20 px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-800">{person.name}</h2>
          <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm mt-1">{person.occupation}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <DetailBox label="Place of Birth" value={person.place} icon={<MapPin size={18} className="text-rose-500" />} />
          
          <div className="grid grid-cols-2 gap-4">
            <DetailBox label="DOB" value={person.dob} icon={<Calendar size={18} className="text-blue-500" />} />
            <DetailBox label="Time" value={person.time} icon={<Clock size={18} className="text-amber-500" />} />
          </div>

          <DetailBox label="Education" value={person.education} icon={<GraduationCap size={18} className="text-purple-500" />} />
          <DetailBox label="Business" value={person.business} icon={<Briefcase size={18} className="text-emerald-500" />} />
          
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mt-2">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">Family Background</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-slate-500 text-sm font-medium">Father</span>
                <span className="font-bold text-slate-800">{person.father_name || '—'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm font-medium">Mother</span>
                <span className="font-bold text-slate-800">{person.mother_name || '—'}</span>
              </div>
            </div>
          </div>

          <a href={`tel:${person.contact_number}`} className="mt-6 flex items-center justify-center gap-3 w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
            <Phone size={20} /> Call Now
          </a>
        </div>
      </div>
    </div>
  );
}

function DetailBox({ label, value, icon }: any) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
        <p className="text-slate-700 font-bold">{value || 'N/A'}</p>
      </div>
    </div>
  );
}
