import Image from "next/image";
import { button, wrap } from "./styles";

export function Footer() {
  return (
    <footer className="bg-ink pb-[120px] pt-12 text-[13px] text-[#9ecece] max-[620px]:pb-20 max-[620px]:pt-9">
      <div className={wrap}>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-6 border-b border-white/10 pb-[26px]">
          <div className="flex items-center gap-[11px] font-bold">
            <div className="inline-flex items-center rounded-[10px] bg-white px-2.5 py-1.5">
              <Image
                src="https://res.cloudinary.com/dthj7fakc/image/upload/v1781681953/Marina-logo_v7lcbn.png"
                alt="Preethi Mrinalini Clinic"
                width={120}
                height={48}
                style={{ objectFit: "contain" }}
              />
            </div>
            <small className="block text-[11px] font-medium tracking-[0.04em] text-[#9ecece]">Advanced Laparoscopic &amp; Hernia Surgeon</small>
          </div>
          <a href="#book" className={button}>
            Book Consultation
          </a>
        </div>
        <p className="max-w-[80ch] leading-[1.7] text-[#7ab8b8] [&_b]:text-[#b5e8e8]">
          <b>Medical disclaimer:</b> This page is for general information and to
          help you book a consultation. It is not medical advice, diagnosis, or
          treatment, and the symptom self-check is not a diagnostic tool.
          Outcomes, benefits, and recovery vary from person to person. Always
          consult a qualified medical professional regarding your individual
          condition. Replace all placeholder figures, images, and videos with
          verified content before publishing.
        </p>
        <p className="mt-3.5 max-w-[80ch] leading-[1.7] text-[#7ab8b8]">
          Copyright 2026 Dr.Preethi Mrinalini. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
