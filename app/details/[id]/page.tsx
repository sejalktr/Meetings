"use client";
import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  MapPin, Phone, Briefcase, ArrowLeft, Calendar, 
  Clock, Heart, Sparkles, Loader2, Share2, UserCircle2, 
  GraduationCap, Download, Quote, Trophy
} from 'lucide-react';

export default function DetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const downloadRef = useRef<HTMLDivElement>(null);
  const [person, setPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // --- PDF DOWNLOAD LOGIC ---
  const handleDownload = async () => {
    if (!downloadRef.current) return;
    setIsDownloading(true);
    try {
      const element = downloadRef.current;
      const canvas = await html2canvas(element, {
        scale: 3, // High quality
        useCORS: true, // Crucial for Supabase Images
        backgroundColor: "#FAFBFF",
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${person.name}_Biodata.pdf`);
    } catch (err) {
      console.error('Download Error:', err);
      alert("Failed to generate PDF. Check CORS settings.");
    } finally {
      setIsDownloading(false);
    }
  };

  const calculateAge = (dobString: string) => {
    if (!dobString) return 0;
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age > 0 ? age : 0;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${person.name} | Biodata`,
          url: window.location.href,
        });
      } catch (err) { console.log(err); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  };

  useEffect(() => {
    async function loadData() {
      const { data } = await supabase.from('entries').select('*').eq('id', id).single();
      if (data) setPerson(data);
      setLoading(false);
    }
    loadData();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>;

  return (
    <div className="min-h-screen bg-[#FAFBFF] pb-24 text-slate-900">
      {/* 1. NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button onClick={() => router.push('/')} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          
          <div className="flex gap-2">
            <button onClick={handleDownload} disabled={isDownloading} className="p-3 bg-slate-900 text-white rounded-2xl transition-all flex items-center gap-2 px-4">
              {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
              <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">
                {isDownloading ? 'Generating...' : 'Download PDF'}
              </span>
            </button>
            <button onClick={handleShare} className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-2xl transition-all group">
              <Share2 size={20} className="text-emerald-600 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. MAIN CAPTURE AREA */}
      <main ref={downloadRef} className="max-w-4xl mx-auto px-6 pt-6 bg-[#FAFBFF]">
        {/* IMAGES */}
        <div className="grid grid-cols-2 gap-4 h-[260px] md:h-[400px]">
          <ImageFrame src={person.photo_1} alt="Primary" />
          <ImageFrame src={person.photo_2} alt="Secondary" />
        </div>

        {/* IDENTITY */}
        <div className="mt-10 space-y-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.9]">
              {person.name}
            </h1>
            <div className="mt-4 flex flex-wrap gap-4">
               <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                 <Briefcase size={14} /> {person.occupation}
               </p>
               <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                 <Trophy size={14} /> Gotra: {person.gotra || "—"}
               </p>
            </div>
          </div>

          {/* META GRID */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <MetaBox icon={<Calendar size={18}/>} label="Birth Date" value={person.dob} />
            <MetaBox icon={<Clock size={18}/>} label="Time" value={person.time || "--:--"} />
            <MetaBox icon={<MapPin size={18}/>} label="Birth Place" value={person.place} />
            <MetaBox icon={<GraduationCap size={18}/>} label="Education" value={person.education} />
            <MetaBox icon={<Sparkles size={18}/>} label="Age" value={`${calculateAge(person.dob)} Years`} />
          </div>
        </div>

        {/* BIO SECTION */}
        {person.bio && (
          <div className="mt-12 p-8 bg-emerald-50 rounded-[2.5rem] relative overflow-hidden">
            <Quote className="absolute right-6 bottom-6 text-emerald-100" size={80} />
            <p className="text-emerald-900 font-medium italic leading-relaxed relative z-10">"{person.bio}"</p>
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-emerald-600">Hobbies: {person.hobbies || "Exploring life"}</p>
          </div>
        )}

        {/* LEGACY ROOTS */}
        <div className="mt-12 bg-white rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-xl">
          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
              <Heart size={20} fill="currentColor" />
            </div>
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Family & Contact</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <FamilyInfo label="Father's Name" value={person.father_name} />
              <FamilyInfo label="Mother's Name" value={person.mother_name} />
              <FamilyInfo label="Family Business" value={person.business} isBusiness />
            </div>
            
            <div className="space-y-6">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Quick Contact</p>
              <ContactCard icon={<Phone size={20}/>} label="Primary" value={person.contact_number} href={`tel:${person.contact_number}`} isMain />
              <div className="grid grid-cols-1 gap-3">
                {person.family_contact_1 && <ContactCard label="Family Contact 1" value={person.family_contact_1} />}
                {person.family_contact_2 && <ContactCard label="Family Contact 2" value={person.family_contact_2} />}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- COMPONENTS ---

function ImageFrame({ src, alt }: { src: string, alt: string }) {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-xl border-4 border-white">
      {src ? (
        <img src={src} crossOrigin="anonymous" className="w-full h-full object-cover" alt={alt} />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
          <UserCircle2 size={60} strokeWidth={1} />
        </div>
      )}
    </div>
  );
}

function FamilyInfo({ label, value, isBusiness }: any) {
  return (
    <div className="group">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{label}</p>
      <p className={`${isBusiness ? 'text-xl' : 'text-2xl'} font-bold text-slate-900 tracking-tight`}>
        {value || "—"}
      </p>
    </div>
  );
}

function ContactCard({ icon, label, value, href, isMain }: any) {
  const Card = href ? 'a' : 'div';
  return (
    <Card href={href} className={`flex items-center gap-4 p-4 rounded-[1.5rem] transition-all ${isMain ? 'bg-slate-900 text-white hover:bg-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
      {icon && <div className="p-2 bg-white/10 rounded-xl">{icon}</div>}
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{label}</p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </Card>
  );
}

function MetaBox({ icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center">
      <div className="text-emerald-500 mb-2">{icon}</div>
      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{label}</p>
      <p className="text-[12px] font-bold text-slate-900">{value}</p>
    </div>
  );
}
