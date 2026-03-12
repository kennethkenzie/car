"use client";

import { Mail, MapPin, Phone } from "lucide-react";

export default function TopContactBar() {
  return (
    <div className="bg-black text-white py-2 px-6">
      <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row justify-between items-center text-xs font-medium gap-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-[#4228c4]" />
            <span>+256 700 000 000</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-[#4228c4]" />
            <span>info@carbazaar.co.ug</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-[#4228c4]" />
          <span>Kampala, Uganda</span>
        </div>
      </div>
    </div>
  );
}
