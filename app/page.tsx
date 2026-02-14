// This is your main page with Search and Cards
"use client";
import React, { useState, useEffect } from 'react';

export default function DirectoryPage() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      {/* HEADER & SEARCH */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">Community Directory</h1>
        <input 
          type="text" 
          placeholder="Search by name, place, or job..." 
          className="w-full max-w-md p-4 rounded-2xl border-none shadow-lg focus:ring-2 ring-indigo-400"
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
      </div>

      {/* THE CARDS GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {entries.filter(e => e.name.toLowerCase().includes(search)).map((entry) => (
          <div key={entry.id} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer border-t-4 border-indigo-500">
            <img src={entry.photo_1} className="w-24 h-24 rounded-2xl object-cover mb-4 mx-auto bg-slate-100" />
            <h2 className="text-xl font-bold text-center text-slate-800">{entry.name}</h2>
            <p className="text-center text-indigo-500 font-medium">{entry.occupation}</p>
            <div className="mt-4 pt-4 border-t border-slate-100 text-sm text-slate-500 flex justify-between">
              <span>📍 {entry.place}</span>
              <span>🎓 {entry.education}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
