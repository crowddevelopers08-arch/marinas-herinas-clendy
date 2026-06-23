import Image from "next/image";
import { button, wrap } from "./styles";

export function Header() {
  return (
    <>
      <div className="relative z-[60] overflow-hidden bg-teal py-[9px] text-[13.5px] font-semibold tracking-[0.01em] text-[#053535] [&_b]:text-white">
        <div className="urgent-marquee">
          {[0, 1].map((item) => (
            <span className="urgent-marquee__item" key={item}>
              A hernia does <b>not</b> heal on its own - the earlier it is
              assessed, the simpler your options.{" "}
              <b>Limited slots this week.</b>
            </span>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-[rgba(22,48,48,0.07)] bg-paper/85 backdrop-blur-xl">
        <div className={`${wrap} flex items-center justify-between py-[13px]`}>
          <div className="flex items-center gap-[11px] font-bold">
            <Image
              src="https://res.cloudinary.com/dthj7fakc/image/upload/v1781681465/logo-marinas_lm71bk.png"
              alt="Preethi Mrinalini Clinic"
              width={130}
              height={52}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <span className="text-[13px] font-medium text-ink-soft max-[620px]:hidden">
            Hernia &amp; Diastasis Recti Care
          </span>
          <a href="#book" className={`${button} px-[22px] py-[11px] text-sm`}>
            Book Consultation
          </a>
        </div>
      </header>
    </>
  );
}
