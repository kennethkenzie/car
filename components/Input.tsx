"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">
          {label}
        </label>
      )}
      <input
        className={`w-full border border-gray-100 bg-gray-50 px-3 py-3 rounded-xl text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4228c4]/20 transition ${className}`}
        {...props}
      />
      {error && <p className="text-[10px] font-bold text-red-500 pl-1">{error}</p>}
    </div>
  );
}
