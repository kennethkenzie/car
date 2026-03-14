"use client";

import { Mail, Phone } from "lucide-react";

export default function TopContactBar() {
  return (
    <div className="bg-black px-4 py-2 text-white sm:px-6">
      <div className="mx-auto flex min-h-[36px] max-w-[1600px] flex-col gap-2 text-xs font-medium md:flex-row md:items-center xl:px-2">
        <div className="relative hidden min-w-0 flex-1 overflow-hidden md:block">
          <div className="top-contact-marquee whitespace-nowrap text-white/80">
            Premium deals on verified cars and vans. Flexible financing available. Buy with confidence at Car Baazar.
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] sm:gap-x-6 sm:text-xs md:ml-auto md:justify-end">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-[#4228c4]" />
            <span>+256 705 921 419</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-[#4228c4]" />
            <span>info@carbazaar.co.ug</span>
          </div>
        </div>
      </div>
      <style jsx>{`
        .top-contact-marquee {
          display: inline-block;
          padding-left: 100%;
          animation: top-contact-marquee 18s linear infinite;
        }

        @keyframes top-contact-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
