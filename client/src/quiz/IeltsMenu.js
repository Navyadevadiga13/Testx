import React from "react";
import { useNavigate } from "react-router-dom";

export default function IeltsMenu() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background-dark text-white font-display p-8 flex flex-col items-center justify-center">
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-300 mb-4">IELTS Mock Test</h1>
            <p className="text-gray-400 mb-12 text-lg">Select a module to begin your assessment.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
                {/* READING CARD */}
                <div onClick={() => navigate("/quiz/reading/intro")} className="group p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent hover:from-[#19fd91]/50 hover:to-[#19fd91]/20 cursor-pointer transition-all duration-300 transform hover:-translate-y-2">
                    <div className="bg-card-dark p-8 rounded-[22px] h-full flex flex-col items-center text-center group-hover:bg-black/80 transition-all">
                        <span className="material-symbols-outlined text-5xl text-gray-300 group-hover:text-[#19fd91] mb-4 transition-colors">menu_book</span>
                        <h2 className="text-2xl font-bold mb-2">Reading</h2>
                        <p className="text-sm text-gray-500 group-hover:text-gray-300">3 Passages • 40 Questions • 60 Min</p>
                    </div>
                </div>

                {/* LISTENING CARD */}
                <div onClick={() => navigate("/quiz/listening/intro")} className="group p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent hover:from-[#19fd91]/50 hover:to-[#19fd91]/20 cursor-pointer transition-all duration-300 transform hover:-translate-y-2">
                    <div className="bg-card-dark p-8 rounded-[22px] h-full flex flex-col items-center text-center group-hover:bg-black/80 transition-all">
                        <span className="material-symbols-outlined text-5xl text-gray-300 group-hover:text-[#19fd91] mb-4 transition-colors">headphones</span>
                        <h2 className="text-2xl font-bold mb-2">Listening</h2>
                        <p className="text-sm text-gray-500 group-hover:text-gray-300">4 Sections • 40 Questions • 30 Min</p>
                    </div>
                </div>

                {/* WRITING CARD */}
                <div onClick={() => navigate("/quiz/writing/intro")} className="group p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent hover:from-[#19fd91]/50 hover:to-[#19fd91]/20 cursor-pointer transition-all duration-300 transform hover:-translate-y-2">
                    <div className="bg-card-dark p-8 rounded-[22px] h-full flex flex-col items-center text-center group-hover:bg-black/80 transition-all">
                        <span className="material-symbols-outlined text-5xl text-gray-300 group-hover:text-[#19fd91] mb-4 transition-colors">edit_square</span>
                        <h2 className="text-2xl font-bold mb-2">Writing</h2>
                        <p className="text-sm text-gray-500 group-hover:text-gray-300">2 Tasks • Analysis & Essay • 60 Min</p>
                    </div>
                </div>

                {/* SPEAKING CARD */}
                <div onClick={() => navigate("/quiz/speaking/intro")} className="group p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent hover:from-[#19fd91]/50 hover:to-[#19fd91]/20 cursor-pointer transition-all duration-300 transform hover:-translate-y-2">
                    <div className="bg-card-dark p-8 rounded-[22px] h-full flex flex-col items-center text-center group-hover:bg-black/80 transition-all">
                        <span className="material-symbols-outlined text-5xl text-gray-300 group-hover:text-[#19fd91] mb-4 transition-colors">mic</span>
                        <h2 className="text-2xl font-bold mb-2">Speaking</h2>
                        <p className="text-sm text-gray-500 group-hover:text-gray-300">3 Parts • Face-to-Face • 11-14 Min</p>
                    </div>
                </div>
            </div>

            <button onClick={() => navigate("/tests")} className="mt-12 text-gray-500 hover:text-white transition-colors">← Back to Dashboard</button>
        </div>
    );
}

