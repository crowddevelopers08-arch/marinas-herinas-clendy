"use client";

import SupportNavbar from "@/app/SupportNavbar";
import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf6] text-[#163030]">
      <SupportNavbar />
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-xl overflow-hidden rounded-[24px] border border-[#126e6e]/10 bg-white p-8 text-center shadow-[0_24px_70px_rgba(18,110,110,0.14)] sm:p-12">

          {/* Success icon */}
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-[#e6f5f5]">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#126e6e" strokeWidth="2.5" strokeLinecap="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>

          <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-[#ec5a38]" />
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em] text-[#42c8c8]">
            Booking Confirmed
          </p>
          <h1 className="mb-4 text-3xl font-bold text-[#163030] sm:text-5xl">
            Thank You!
          </h1>
          <p className="mx-auto mb-8 max-w-md text-base leading-7 text-[#4a6060] sm:text-lg">
            We&apos;ve received your consultation request. Our team will call you shortly to confirm your appointment slot.
          </p>

          <div className="mx-auto mb-8 max-w-sm rounded-2xl border border-[#126e6e]/10 bg-[#f5fafa] px-6 py-5 text-sm text-[#163030]">
            <div className="mb-3 font-bold text-[#126e6e]">What happens next?</div>
            <ol className="list-none space-y-2 pl-0 text-left text-[#4a6060]">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#126e6e] text-[10px] font-bold text-white">1</span>
                Our coordinator will call within 2 hours
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#126e6e] text-[10px] font-bold text-white">2</span>
                Your slot will be reserved on confirmation
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#126e6e] text-[10px] font-bold text-white">3</span>
                Visit us on the scheduled date
              </li>
            </ol>
          </div>

          <Link
            href="/"
            className="inline-block rounded-full bg-[#126e6e] px-8 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_8px_24px_rgba(18,110,110,0.28)] transition hover:-translate-y-0.5 hover:bg-[#0d5252]"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
