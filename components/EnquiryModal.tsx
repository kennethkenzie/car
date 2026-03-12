"use client";

import { useState } from "react";
import { X, Send, Phone, MessageSquare, CheckCircle2 } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";

export function EnquiryModal({ vehicleId, dealerId }: { vehicleId: string; dealerId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "I'm interested in this vehicle. Is it still available?",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting enquiry:", { vehicleId, dealerId, ...form });
    setStep(2);
    setTimeout(() => {
      setStep(1);
      setIsOpen(false);
    }, 3000);
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="w-full py-4 text-sm font-bold shadow-xl shadow-[#4228c4]/20"
        variant="secondary"
      >
        Enquire Now
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="px-10 pt-10 pb-6 flex items-center justify-between border-b border-gray-50">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Express Enquiry</h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Vehicle REF: {vehicleId}</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-10">
              {step === 1 ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <Input
                      label="Your Name"
                      placeholder="John Doe"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <Input
                      label="Phone"
                      placeholder="+256 7xx xxx xxx"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Message</label>
                    <textarea
                      className="w-full border border-gray-100 bg-gray-50 px-4 py-3 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4228c4]/20 transition h-32 resize-none"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                    />
                  </div>

                  <Button type="submit" variant="secondary" className="w-full py-4 flex items-center gap-2">
                    <Send size={16} />
                    Send Enquiry
                  </Button>

                  <div className="flex items-center justify-center gap-6 pt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 group cursor-pointer hover:text-black transition-colors">
                      <Phone size={14} />
                      Call Us
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 group cursor-pointer hover:text-black transition-colors">
                      <MessageSquare size={14} />
                      WhatsApp
                    </div>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12 animate-in zoom-in duration-500">
                  <div className="h-20 w-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Enquiry Sent!</h3>
                  <p className="text-gray-500 font-medium">A specialist from Car Baazar will contact you shortly regarding this vehicle.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
