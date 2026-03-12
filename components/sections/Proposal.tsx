import React, { useState } from 'react';
import { SectionLayout } from './SectionLayout';
import { Calendar, Download, Mail, MessageSquare } from 'lucide-react';
import { MeetingModal } from './MeetingModal';
import { exportToPDF } from '../utils/PDFExporter';

export const Proposal = ({ onNavigate, onTogglePause, isActive, isExiting, exitDirection }: { onNavigate?: (index: number) => void, onTogglePause?: (paused: boolean) => void, isActive?: boolean, isExiting?: boolean, exitDirection?: 'left' | 'right' }) => {
    const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

    return (
        <SectionLayout
            id="proposal-section"
            title="AI API PARTNERSHIP PROPOSAL"
            subtitle="Direct Access to Pre-Trained Developers"
            index="05"
            isActive={isActive}
            isExiting={isExiting}
            exitDirection={exitDirection}
        >
            <div className="max-w-[93.75rem] flex flex-col gap-16 w-full h-full pb-16">

                {/* Main Hero Message */}
                <div className="bg-white p-12 lg:p-20 border-b-[2rem] border-accent relative text-black mb-8 stagger-item">
                    <p className="text-5xl lg:text-7xl font-black leading-[0.85] tracking-tighter max-w-6xl uppercase">
                        WE OFFER API PROVIDERS A DIRECT PIPELINE TO DEVELOPERS WHO ARE <span className="bg-black text-accent px-6 py-2 inline-block -rotate-2 -ml-2 -mt-2 my-2 shadow-[1.25rem_1.25rem_0_0_#000] border-4 border-black">ALREADY TRAINED</span>, HIGHLY ENGAGED, AND READY TO DEPLOY.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {[
                        { title: "SPONSORED API CREDITS", text: "Direct access to developers" },
                        { title: "DESIGNATED API CHALLENGES", text: "Drive adoption via hackathons" },
                        { title: "CUSTOM IMPLEMENTATION WORKSHOPS", text: "Train early adopters" },
                        { title: "RECRUITMENT & TALENT PIPELINE", text: "Hire proven builders" }
                    ].map((benefit, i) => (
                        <div key={i} className="bg-[#111] p-12 border-t-[1rem] border-white group hover:border-black hover:bg-white transition-colors duration-500 flex flex-col h-full hover:shadow-[1rem_1rem_0_0_rgba(168,85,247,1)] hover:-translate-y-4 stagger-item">
                            <div className="text-white/20 group-hover:text-black/10 text-[8rem] font-black mb-12 uppercase leading-none">{`0${i + 1}`}</div>
                            <h4 className="text-4xl font-black text-white group-hover:text-black uppercase tracking-tighter mb-8 leading-none">{benefit.title}</h4>
                            <p className="text-sm font-black text-accent uppercase tracking-widest leading-loose mt-auto">{benefit.text}</p>
                        </div>
                    ))}
                </div>

                {/* Core Philosophy Box */}
                <div className="bg-accent p-12 lg:p-16 border-[1rem] border-black text-black shadow-[-1.5rem_1.5rem_0_0_#fff] relative overflow-hidden mt-16 group hover:-translate-x-4 transition-transform w-[calc(100%-1.5rem)] ml-auto stagger-item">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000 origin-bottom-left">
                        <MessageSquare size={400} className="text-black" />
                    </div>
                    <div className="relative z-10 max-w-5xl">
                        <p className="text-2xl lg:text-3xl text-black font-black uppercase tracking-[0.3em] leading-snug mb-12 bg-white px-6 py-3 inline-block border-4 border-black">
                            "WE DO NOT OPERATE AS AN EVENT AGENCY."
                        </p>
                        <p className="text-5xl md:text-[5.5rem] font-black text-black uppercase tracking-tighter leading-[0.8] lg:w-[110%] break-words">
                            ACCESS THOUSANDS OF <span className="underline decoration-white decoration-[0.75rem] underline-offset-[1rem]">EXECUTION-ORIENTED BUILDERS</span> READY TO INTEGRATE YOUR MODELS.
                        </p>
                    </div>
                </div>

                {/* Colossal Bottom CTA Buttons */}
                <div className="flex flex-col xl:flex-row gap-12 items-stretch mt-16">
                    <button
                        onClick={() => setIsMeetingModalOpen(true)}
                        className="group flex flex-col xl:flex-row flex-1 items-start xl:items-center justify-between p-12 lg:p-16 bg-white border-[0.75rem] border-black hover:bg-black hover:border-accent transition-colors duration-500 shadow-[1.25rem_1.25rem_0_0_rgba(255,255,255,0.2)] hover:translate-x-4 hover:-translate-y-4 stagger-item"
                    >
                        <div className="flex flex-col items-start text-left">
                            <span className="text-black group-hover:text-accent font-black text-6xl lg:text-[6rem] uppercase tracking-tighter leading-[0.85] mb-8">SCHEDULE<br />MEETING</span>
                            <span className="text-base lg:text-lg text-black/60 group-hover:text-white uppercase font-black tracking-[0.4em] bg-black/10 group-hover:bg-white/10 px-6 py-3 border-2 border-transparent group-hover:border-white/30">START STRATEGIC CONV.</span>
                        </div>
                        <Calendar className="text-black group-hover:text-accent mt-12 xl:mt-0 transition-transform group-hover:rotate-12 group-hover:scale-125" size={140} />
                    </button>

                    <button
                        disabled
                        className="group flex flex-col xl:flex-row flex-1 items-start xl:items-center justify-between p-12 lg:p-16 bg-[#111] border-[0.75rem] border-white/20 opacity-40 cursor-not-allowed shadow-none stagger-item"
                    >
                        <div className="flex flex-col items-start text-left">
                            <span className="text-white font-black text-6xl lg:text-[6rem] uppercase tracking-tighter leading-[0.85] mb-8 text-white/40">DOWNLOAD<br />CATALOG</span>
                            <span className="text-base lg:text-lg text-white/20 uppercase font-black tracking-[0.4em] bg-white/5 px-6 py-3 border-2 border-white/10">PREPARING RESOURCES...</span>
                        </div>
                        <Download className="text-white/20 mt-12 xl:mt-0" size={140} />
                    </button>
                </div>

                {/* Footer details */}
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center text-sm font-black text-white/40 uppercase tracking-[0.6em] mt-24 border-t-[0.75rem] border-white/20 pt-12 gap-8 stagger-item">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <div className="px-6 py-2 bg-white text-black font-black text-xl">2026</div>
                        <span className="text-xl">ECOSYSTEM GROWTH PARTNERSHIP</span>
                    </div>
                    <div
                        onClick={() => setIsMeetingModalOpen(true)}
                        className="flex items-center gap-6 group/mail cursor-pointer bg-white/5 hover:bg-white p-6 border-4 border-transparent hover:border-black transition-all"
                    >
                        <Mail size={32} className="text-white group-hover/mail:text-black" />
                        <span className="text-white group-hover/mail:text-black tracking-[0.4em] text-lg uppercase">weaver.jeong@softsquared.com</span>
                    </div>
                </div>
            </div>

            {/* Meeting Modal */}
            <MeetingModal
                isOpen={isMeetingModalOpen}
                onClose={() => setIsMeetingModalOpen(false)}
            />
        </SectionLayout>
    );
};