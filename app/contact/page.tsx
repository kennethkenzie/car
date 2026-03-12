"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ContactPage() {
    return (
        <div className="bg-[#f8fafc] min-h-screen">
            <Header />
            
            <main className="mx-auto max-w-6xl px-6 py-32">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4 italic uppercase">
                        Get in Touch
                    </h1>
                    <p className="text-lg font-medium text-gray-500">
                        Have questions about a vehicle? We're here to help. Reach out to our specialists.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="flex gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shrink-0 shadow-lg shadow-black/10">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg tracking-tight uppercase text-gray-900">Call us</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Mon-Sat from 8am to 7pm</p>
                                <p className="font-bold text-black">+256 700 111 222</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shrink-0 shadow-lg shadow-black/10">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg tracking-tight uppercase text-gray-900">Email us</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">We'll respond within 24 hours</p>
                                <p className="font-bold text-black">support@carbaazar.co.ug</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shrink-0 shadow-lg shadow-black/10">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg tracking-tight uppercase text-gray-900">Visit us</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Our flagship bond in Kampala</p>
                                <p className="font-bold text-black italic uppercase">Plot 12, Kampala Road, Uganda</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <form className="grid gap-6 rounded-2xl border border-gray-100 bg-white p-10 shadow-sm">
                            <div className="grid md:grid-cols-2 gap-8">
                                <Input label="First Name" placeholder="John" />
                                <Input label="Last Name" placeholder="Doe" />
                            </div>
                            <Input label="Email Address" type="email" placeholder="john@example.com" />
                            <Input label="Subject" placeholder="How can we help?" />
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Message</label>
                                <textarea
                                    className="flex min-h-[160px] w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-black/5 transition resize-none"
                                    placeholder="Tell us more about your inquiry..."
                                />
                            </div>
                            
                            <Button className="w-full md:w-auto h-14 px-10 flex items-center justify-center gap-2 rounded-2xl bg-black text-white font-bold uppercase text-xs tracking-widest shadow-xl shadow-black/20 hover:bg-neutral-800 transition-all active:scale-95">
                                <Send className="h-4 w-4" />
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
