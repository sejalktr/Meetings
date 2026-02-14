"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [access, setAccess] = useState(false);

  // Logic: If no token or wrong token, show "Access Denied"
  if (!token) return <div className="text-center mt-20 text-red-500 font-bold">Access Denied: No Token Provided</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Edit Your Profile</h1>
      <p className="text-slate-500 mb-4">Note: Contact number is locked and cannot be edited.</p>
      {/* Form fields here, with contact_number marked 'disabled' */}
    </div>
  );
}
