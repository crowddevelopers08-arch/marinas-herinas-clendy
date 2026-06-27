"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "./Icons";
import { button, wrap } from "./styles";

const SYMPTOM_VIDEO =
  "https://ik.imagekit.io/tpucbav8z/output%201hernia_squished.mp4";

function VideoModal({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-3 bg-[rgba(10,40,40,0.88)] p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close button — outside the card, always visible */}
      <button
        className="flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
        onClick={onClose}
        aria-label="Close"
      >
        <svg viewBox="0 0 14 14" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <path d="M1 1l12 12M13 1L1 13" />
        </svg>
        Close
      </button>

      <div
        className="w-full max-w-[480px] overflow-hidden rounded-[22px] shadow-[0_40px_100px_-20px_rgba(10,40,40,0.9)]"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src={SYMPTOM_VIDEO}
          controls
          autoPlay
          playsInline
          className="block max-h-[calc(90vh-60px)] w-full object-contain"
        />
      </div>
    </div>
  );
}

export function HeroSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [heroVideoMuted, setHeroVideoMuted] = useState(true);

  return (
    <>
      <section
        className="relative isolate min-h-[640px] overflow-hidden py-[72px] max-[1024px]:py-14 max-[900px]:min-h-0 max-[900px]:py-12 max-[620px]:py-10"
        id="hero"
      >
        {/* Light gradient base */}
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(105deg,rgba(251,250,246,1)_0%,rgba(251,250,246,0.98)_50%,rgba(231,240,237,0.9)_100%)]" />

        {/* Doctor background video — desktop: right half | mobile: full section background */}
        <div className="absolute inset-y-0 right-0 z-0 w-[52%] max-[900px]:inset-x-0 max-[900px]:top-auto max-[900px]:h-[300px] max-[900px]:w-full max-[620px]:inset-0 max-[620px]:h-full max-[620px]:w-full">
          <video
            src={SYMPTOM_VIDEO}
            autoPlay
            muted={heroVideoMuted}
            loop
            playsInline
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,250,246,1)_0%,rgba(251,250,246,0.55)_38%,transparent_70%)] max-[900px]:bg-[linear-gradient(180deg,transparent_20%,rgba(251,250,246,0.7)_70%,rgba(251,250,246,1)_100%)] max-[620px]:bg-[rgba(251,250,246,0.45)]" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_80%_20%,rgba(66,200,200,0.14),transparent_70%)]" />
          <button
            type="button"
            aria-label="Unmute hero video"
            className="absolute inset-0 cursor-pointer border-0 bg-transparent p-0"
            onClick={() => setHeroVideoMuted(false)}
          />
        </div>

        {/* Decorative coral accent */}
        <div className="absolute left-[-60px] top-[30%] -z-10 h-[320px] w-[320px] rounded-full bg-[rgba(236,90,56,0.07)] blur-[60px] max-[900px]:hidden" />

        <div className={`${wrap} relative z-[1]`}>
          <div className="max-w-[52%] max-[900px]:max-w-full">

            {/* Badge */}
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgba(66,200,200,0.13)] bg-white/80 px-[15px] py-[9px] text-[12.5px] font-bold tracking-[0.04em] text-teal-deep shadow-[0_12px_30px_-24px_rgba(18,110,110,0.85)] max-[620px]:mb-3.5 max-[620px]:px-3 max-[620px]:text-[11.5px]">
              <span className="h-2 w-2 animate-[pulse-dot_2s_infinite] rounded-full bg-coral" />{" "}
              Watch before you decide what to do
            </span>

            {/* Headline */}
            <h1 className="mb-5 text-[clamp(28px,3vw,48px)] leading-[1.06] text-ink [text-wrap:balance] max-[620px]:text-[clamp(26px,7.5vw,34px)]">
              Living with a Hernia is a choice you are making{" "}
              <em className="not-italic text-coral-deep">Every Single Day.</em>
            </h1>

            {/* Paragraph */}
            <p className="mb-7 max-w-[48ch] text-[clamp(15px,1.1vw,17px)] leading-[1.7] text-ink-soft max-[620px]:mb-5 max-[620px]:text-[15px]">
              The bulge, the heaviness, the pull when you lift or cough - most
              people wait months hoping it fades. It does not. A short, honest
              assessment tells you exactly what you are dealing with and what
              your real options are.
            </p>

            {/* CTAs */}
            <div className="mb-5 flex flex-wrap items-center gap-3 max-[620px]:flex-col max-[620px]:items-stretch max-[620px]:gap-2.5">
              <a href="#book" className={`${button} max-[620px]:w-full`}>
                Book My Consultation
              </a>
              <button
                className="inline-flex cursor-pointer items-center justify-center gap-2.5 rounded-full border-[1.5px] border-[rgba(22,48,48,0.18)] bg-transparent px-[26px] py-[15px] font-body text-base font-bold text-teal-deep transition-[transform,background,border-color] duration-200 hover:-translate-y-0.5 hover:border-transparent hover:bg-mist active:translate-y-0 max-[620px]:w-full max-[620px]:px-4 max-[620px]:py-3 max-[620px]:text-sm"
                onClick={() => setModalOpen(true)}
              >
                Watch Video
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-2.5 text-[13px] font-semibold text-ink-soft max-[620px]:text-xs">
              <span className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[rgba(22,48,48,0.09)] bg-white/70 px-3 py-1.5 shadow-[0_12px_26px_-25px_rgba(18,110,110,0.7)] max-[620px]:flex-[1_1_140px] max-[620px]:justify-center">
                <CheckIcon color="#42c8c8" size={16} /> Minimally invasive approach
              </span>
              <span className="inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[rgba(22,48,48,0.09)] bg-white/70 px-3 py-1.5 shadow-[0_12px_26px_-25px_rgba(18,110,110,0.7)] max-[620px]:flex-[1_1_140px] max-[620px]:justify-center">
                <CheckIcon color="#42c8c8" size={16} /> Reports reviewed personally
              </span>
            </div>
          </div>
        </div>
      </section>

      {modalOpen && <VideoModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
