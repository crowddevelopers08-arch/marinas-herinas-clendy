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
        <div className={`${wrap} flex items-center justify-between gap-3 py-[13px]`}>
          <div className="flex items-center gap-[11px] font-bold">
            <Image
              src="https://res.cloudinary.com/dthj7fakc/image/upload/v1781681465/logo-marinas_lm71bk.png"
              alt="Preethi Mrinalini Clinic"
              width={130}
              height={52}
              style={{ objectFit: "contain" }}
              priority
              className="max-[620px]:w-[92px]"
            />
          </div>
          <span className="text-[13px] font-medium text-ink-soft max-[620px]:hidden">
            Hernia &amp; Diastasis Recti Care
          </span>
          <div className="flex shrink-0 items-center gap-2 max-[360px]:gap-1.5">
            <a
              href="tel:+919884000171"
              className="inline-flex cursor-pointer items-center justify-center rounded-full px-[16px] py-[11px] font-body text-sm font-bold text-teal-deep transition-[transform,background,color] duration-200 hover:-translate-y-0.5 hover:bg-teal hover:text-white active:translate-y-0 max-[620px]:px-2 max-[620px]:py-2.5 max-[620px]:text-[11px]"
            >
              +91 98840 00171
            </a>
            <a href="#book" className={`${button} px-[22px] py-[11px] text-sm`}>
              <span className="max-[620px]:hidden">Book Consultation</span>
              <span className="min-[621px]:hidden">Book</span>
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
