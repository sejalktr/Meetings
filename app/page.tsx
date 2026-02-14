"use client";
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, MapPin, Plus } from 'lucide-react';

export default function ListingPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('entries').select('*').order('created_at', { ascending: false });
      if (data) setEntries(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = entries.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.place.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-black text-indigo-600">COMMUNITY</h1>
          <a href="/add" className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1">
            <Plus size={16} /> Join
          </a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or city..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-md focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? <p>Loading cards...</p> : filtered.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-4">
              <img src={item.photo_1} className="w-20 h-20 rounded-2xl object-cover bg-slate-100" alt="" />
              <div>
                <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
                <p className="text-indigo-600 text-sm font-medium">{item.occupation}</p>
                <div className="flex items-center gap-1 text-slate-400 text-xs mt-2">
                  <MapPin size={12} /> {item.place}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
