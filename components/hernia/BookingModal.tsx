"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Monday - Saturday only
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Available appointment slots: 4:30 PM - 7:00 PM
// (Last appointment ends at 7:00 PM)
const TIMES = [
  "4:30 pm",
  "5:00 pm",
  "5:30 pm",
  "6:00 pm",
  "6:30 pm",
];

function firstWeekday(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}
function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

type Step = "form" | "calendar";

const inputCls = "w-full rounded-lg border border-[#d1dbe8] bg-white px-3.5 py-2.5 text-[14px] text-[#1a2332] outline-none transition placeholder:text-[#b0bec5] focus:border-[#42c8c8] focus:shadow-[0_0_0_2px_rgba(66,200,200,0.2)]";
const labelCls = "mb-1.5 block text-[13.5px] font-semibold text-[#1a2332]";

function RadioGroup({
  label, options, value, onChange, required,
}: {
  label: string; options: string[]; value: string;
  onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <p className="mb-2.5 text-[13.5px] font-semibold text-[#1a2332]">
        {label}{required && <span className="ml-0.5 text-red-400"> *</span>}
      </p>
      <div className="flex flex-col gap-2">
        {options.map(opt => (
          <label key={opt} className="flex cursor-pointer items-start gap-2.5"
            onClick={() => onChange(opt)}>
            <span className={`mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full border-2 transition
              ${value === opt ? "border-[#126e6e] bg-[#126e6e]" : "border-[#c5d0de] bg-white hover:border-[#42c8c8]"}`}>
              {value === opt && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            <span className="text-[13.5px] leading-snug text-[#333]">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function BookingModal() {
  const router = useRouter();
  const now = new Date();
  const [open, setOpen]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [year, setYear]       = useState(now.getFullYear());
  const [month, setMonth]     = useState(now.getMonth());
  const [day, setDay]         = useState<number | null>(null);
  const [pending, setPending]       = useState<string | null>(null);
  const [step, setStep]             = useState<Step>("form");
  const [bookedSlots, setBooked]    = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", phone:"", location:"" });
  const [symptomType, setSymptomType] = useState("");
  const [hadSurgery,  setHadSurgery]  = useState("");
  const [prevConsult, setPrevConsult] = useState("");

  function resetAll() {
    setDay(null); setPending(null); setStep("form");
    setForm({ firstName:"", lastName:"", email:"", phone:"", location:"" });
    setSymptomType(""); setHadSurgery(""); setPrevConsult("");
    setBooked([]); setSlotsLoading(false);
    setSubmitError(""); setSubmitting(false);
  }

  useEffect(() => {
    if (!day || !open) return;
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    fetch(`/api/slots?date=${dateKey}`)
      .then(r => r.json())
      .then(d => setBooked(Array.isArray(d.booked) ? d.booked : []))
      .catch(() => setBooked([]))
      .finally(() => setSlotsLoading(false));
  }, [day, month, year, open]);

  useEffect(() => {
    function handle(e: Event) {
      const link = (e.target as HTMLElement).closest('a[href="#book"]');
      if (!link) return;
      e.preventDefault();
      resetAll();
      setOpen(true);
    }
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open]);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setDay(null); setPending(null);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setDay(null); setPending(null);
  }

  function isAvailable(d: number) {
    const date  = new Date(year, month, d);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return date >= today && date.getDay() !== 0;
  }
  function isToday(d: number) {
    return year === now.getFullYear() && month === now.getMonth() && d === now.getDate();
  }

  const selDateObj = day ? new Date(year, month, day) : null;
  const selDayName = selDateObj ? DAY_NAMES[selDateObj.getDay()] : "";
  const blanks     = firstWeekday(year, month);
  const total      = daysInMonth(year, month);

  async function confirmBooking(selectedTime: string) {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source:          "Hernia-Booking",
          firstName:       form.firstName,
          lastName:        form.lastName,
          email:           form.email,
          phone:           form.phone,
          location:        form.location,
          dateKey:         `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
          appointmentDate: `${selDayName}, ${MONTHS[month]} ${day}, ${year}`,
          appointmentTime: selectedTime,
          symptomType,
          hadSurgery,
          prevConsult,
          pageUrl:         window.location.href,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      router.push("/thank-you");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-[#0a1f1f]/70 p-4 backdrop-blur-[6px] max-[620px]:p-0"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className="relative flex h-[90vh] w-full max-w-[1040px] flex-col overflow-hidden rounded-[20px] shadow-[0_48px_120px_-24px_rgba(10,40,40,0.6)] max-[620px]:h-[100dvh] max-[620px]:rounded-none">

        {/* Header */}
        <div className="flex flex-none items-center gap-4 bg-[#0f1f2e] px-8 py-5 max-[620px]:px-4 max-[620px]:py-3.5">
          <div className="grid h-10 w-10 flex-none place-items-center rounded-xl bg-[#42c8c8]/15 max-[620px]:h-8 max-[620px]:w-8 max-[620px]:rounded-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#42c8c8" strokeWidth="2" strokeLinecap="round" className="max-[620px]:h-4 max-[620px]:w-4">
              <rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#42c8c8] max-[620px]:text-[9.5px]">Hernia Consultation</p>
            <p className="text-[15px] font-semibold text-white max-[620px]:text-[13px]">
              {step === "form" ? "Tell us a bit about yourself." : "Pick a time that works for you."}
            </p>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close"
            className="grid h-9 w-9 flex-none cursor-pointer place-items-center rounded-full border border-white/10 bg-white/8 text-[#aaa] transition hover:bg-white/15 hover:text-white max-[620px]:h-8 max-[620px]:w-8">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M1 1l12 12M13 1L1 13"/>
            </svg>
          </button>
        </div>

        {/* ── Form view (step 1) ── */}
        {step === "form" && (
          <div className="flex flex-1 overflow-hidden bg-white max-[620px]:flex-col max-[620px]:overflow-y-auto">

            {/* Desktop left panel */}
            <div className="flex w-[320px] flex-none flex-col overflow-y-auto border-r border-[#eef2f2] p-8 max-[620px]:hidden">
              <img
                src="https://res.cloudinary.com/dthj7fakc/image/upload/v1781681953/Marina-logo_v7lcbn.png"
                alt="Marina's"
                className="mb-6 h-14 w-auto object-contain object-left"
              />
              <p className="mb-1 text-[12px] font-semibold text-[#7a9898]">Marina&apos;s Hospitals</p>
              <p className="mb-5 text-[17px] font-bold leading-snug text-[#0f1f2e]">
                Hernia Consultation<br/>with Dr. Preethi Mrinalini
              </p>
              <div className="flex flex-col gap-3.5 text-[13px] text-[#444]">
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 flex-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7a9898" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  <span>30 min</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="mt-0.5 flex-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7a9898" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <span className="font-semibold text-[#1a2332]">India Standard Time</span>
                </div>
              </div>
              <p className="mt-5 text-[12px] leading-relaxed text-[#9ab8b8]">
                This consultation will help us understand your hernia symptoms, review your reports, and walk you through your treatment options. You&apos;ll pick a convenient date and time next.
              </p>
            </div>

            {/* Right — scrollable form */}
            <div className="flex flex-1 flex-col overflow-y-auto p-10 max-[620px]:p-4">
              {/* Logo — mobile only, shown at top of form */}
              <img
                src="https://res.cloudinary.com/dthj7fakc/image/upload/v1781681953/Marina-logo_v7lcbn.png"
                alt="Marina's"
                className="mb-4 hidden h-14 w-auto object-contain object-left max-[620px]:block"
              />
              <p className="mb-5 text-[22px] font-bold text-[#0f1f2e] max-[620px]:mb-4 max-[620px]:text-[18px]">Enter Details</p>
              <form className="flex flex-col gap-5 pb-4 max-[620px]:gap-4" onSubmit={(e) => {
                  e.preventDefault();
                  setStep("calendar");
                }}>

                {/* First + Last — stacks on mobile */}
                <div className="grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
                  <div>
                    <label className={labelCls}>First name <span className="text-red-400">*</span></label>
                    <input required value={form.firstName}
                      onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                      className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Last name <span className="text-red-400">*</span></label>
                    <input required value={form.lastName}
                      onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                      className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Email <span className="text-red-400">*</span></label>
                  <input required type="email" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Phone Number <span className="text-red-400">*</span></label>
                  <div className="flex overflow-hidden rounded-lg border border-[#d1dbe8] bg-white transition focus-within:border-[#42c8c8] focus-within:shadow-[0_0_0_2px_rgba(66,200,200,0.2)]">
                    <div className="flex items-center gap-2 border-r border-[#d1dbe8] px-3 text-[14px] text-[#444]">
                      <span>🇮🇳</span>
                      <span className="font-medium">+91</span>
                    </div>
                    <input required type="tel" value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="flex-1 bg-transparent px-3 py-2.5 text-[14px] text-[#1a2332] outline-none" />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Where are you located? <span className="text-red-400">*</span></label>
                  <input required placeholder="City, State" value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    className={inputCls} />
                </div>

                <hr className="border-[#eef2f2]" />

                <RadioGroup
                  label="What type of hernia symptom do you have?"
                  required value={symptomType} onChange={setSymptomType}
                  options={[
                    "Abdominal bulge or lump",
                    "Groin pain or swelling",
                    "Post-pregnancy bulge (diastasis recti)",
                    "Post-surgery concern",
                    "Not sure — need evaluation",
                  ]}
                />

                <RadioGroup
                  label="Have you been advised surgery before?"
                  required value={hadSurgery} onChange={setHadSurgery}
                  options={[
                    "Yes — I want a second opinion",
                    "No — this is my first consultation",
                    "Currently evaluating options",
                  ]}
                />

                <RadioGroup
                  label="Have you consulted another doctor for this before?"
                  required value={prevConsult} onChange={setPrevConsult}
                  options={[
                    "Yes — looking for specialist opinion",
                    "No — this is my first consultation",
                    "Yes — but reports were inconclusive",
                  ]}
                />

                <hr className="border-[#eef2f2]" />

                <p className="text-[12px] leading-relaxed text-[#9ab0b0]">
                  By proceeding, you confirm that you have read and agree to our{" "}
                  <span className="font-semibold text-[#126e6e]">Terms</span> and{" "}
                  <span className="font-semibold text-[#126e6e]">Privacy Notice.</span>
                </p>

                <button type="submit"
                  className="w-full rounded-full bg-[#126e6e] py-3.5 text-[15px] font-bold text-white transition hover:bg-[#0d5252] max-[620px]:py-3 max-[620px]:text-[14px]">
                  Continue to Schedule
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Calendar view (step 2) ── */}
        {step === "calendar" && (
          <div className="flex flex-1 overflow-hidden bg-white max-[620px]:flex-col max-[620px]:overflow-y-auto">

            {/* Calendar panel */}
            <div className="flex flex-1 flex-col border-r border-[#f0f4f4] p-7 max-[620px]:border-b max-[620px]:border-r-0 max-[620px]:p-4">
              <button onClick={() => setStep("form")}
                className="mb-4 flex cursor-pointer items-center gap-1 text-[13px] font-semibold text-[#555] hover:text-[#126e6e]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                Back
              </button>
              <p className="mb-5 text-[16px] font-bold text-[#0f1f2e] max-[620px]:mb-3 max-[620px]:text-[15px]">Select a Date &amp; Time</p>

              {/* Month nav */}
              <div className="mb-4 flex items-center justify-between">
                <button onClick={prevMonth} className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-[#666] transition hover:bg-[#f0f4f4]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <span className="text-[15px] font-bold text-[#0f1f2e]">{MONTHS[month]} {year}</span>
                <button onClick={nextMonth} className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-[#666] transition hover:bg-[#f0f4f4]">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>

              {/* Weekday headers */}
              <div className="mb-2 grid grid-cols-7 text-center">
                {DAYS.map(d => (
                  <span key={d} className="text-[11px] font-bold uppercase tracking-wider text-[#aab8b8] max-[620px]:text-[10px]">{d}</span>
                ))}
              </div>

              {/* Date grid */}
              <div className="grid grid-cols-7 content-start gap-y-1 text-center">
                {Array.from({ length: blanks }).map((_, i) => <span key={`b${i}`} />)}
                {Array.from({ length: total }).map((_, i) => {
                  const d      = i + 1;
                  const avail  = isAvailable(d);
                  const sel    = day === d;
                  const today  = isToday(d);
                  const isSun  = new Date(year, month, d).getDay() === 0;
                  return (
                    <button key={d} disabled={!avail}
                      onClick={() => { setDay(d); setPending(null); setSlotsLoading(true); }}
                      className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-full text-[13.5px] font-medium transition-all max-[620px]:h-8 max-[620px]:w-8 max-[620px]:text-[12.5px]
                        ${sel ? "bg-[#126e6e] font-bold text-white shadow-[0_4px_14px_-4px_rgba(18,110,110,0.5)]" : ""}
                        ${avail && !sel ? "cursor-pointer text-[#126e6e] hover:bg-[#e6f5f5]" : ""}
                        ${isSun || (!avail && !sel) ? "cursor-not-allowed text-[#d8e0e0]" : ""}
                      `}
                    >
                      {d}
                      {today && !sel && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#42c8c8]" />}
                    </button>
                  );
                })}
              </div>

              {/* Timezone */}
              <div className="mt-5 flex items-center gap-2 border-t border-[#f0f4f4] pt-4 text-[12.5px] text-[#7a9898] max-[620px]:mt-3 max-[620px]:pt-3">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <span>India Standard Time (IST)</span>
              </div>
            </div>

            {/* Time slots — inline confirm/cancel */}
            <div className="flex w-[268px] flex-col overflow-y-auto p-6 max-[620px]:w-full max-[620px]:border-t max-[620px]:border-[#f0f4f4] max-[620px]:p-4">
              {!day ? (
                <div className="flex flex-col items-center justify-center gap-3 py-8 text-center max-[620px]:py-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccdada" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                  <p className="text-[13px] text-[#aab8b8]">Select a date to see available times</p>
                </div>
              ) : (
                <>
                  <p className="mb-0.5 text-[13px] font-bold text-[#0f1f2e]">{selDayName}</p>
                  <p className="mb-4 text-[12px] text-[#7a9898]">{MONTHS[month]} {day}, {year}</p>
                  {/* Mobile: 2-col grid for slots */}
                  <div className="grid gap-2 max-[620px]:grid-cols-2 min-[621px]:flex min-[621px]:flex-col">
                    {slotsLoading ? (
                      <p className="col-span-2 py-4 text-center text-[13px] text-[#aab8b8]">Checking availability…</p>
                    ) : TIMES.map(t => {
                      const isPending = pending === t;
                      const isBooked  = bookedSlots.includes(t);
                      return (
                        <div key={t} className={isPending ? "max-[620px]:col-span-2" : ""}>
                          <button
                            disabled={isBooked || submitting}
                            onClick={() => setPending(isPending ? null : t)}
                            className={`relative w-full rounded-xl border-2 py-2.5 text-[14px] font-semibold transition-all max-[620px]:py-2 max-[620px]:text-[13px]
                              ${isBooked
                                ? "cursor-not-allowed border-[#eee] bg-[#f9f9f9] text-[#ccc]"
                                : isPending
                                  ? "cursor-pointer border-[#126e6e] bg-[#126e6e] text-white"
                                  : "cursor-pointer border-[#daeaea] bg-[#f5fafa] text-[#126e6e] hover:border-[#126e6e] hover:bg-[#e6f5f5]"}`}
                          >
                            {t}
                            {isBooked && (
                              <span className="ml-2 text-[11px] font-normal text-[#bbb]">Booked</span>
                            )}
                          </button>
                          {isPending && (
                            <div className="mt-2 flex gap-2">
                              <button onClick={() => setPending(null)} disabled={submitting}
                                className="flex-1 cursor-pointer rounded-xl border border-[#e2e8f0] bg-white py-2 text-[12.5px] font-semibold text-[#666] transition hover:bg-[#f5f5f5] disabled:cursor-not-allowed disabled:opacity-60">
                                Cancel
                              </button>
                              <button onClick={() => { setPending(null); confirmBooking(t); }} disabled={submitting}
                                className="flex-1 cursor-pointer rounded-xl bg-[#126e6e] py-2 text-[12.5px] font-bold text-white transition hover:bg-[#0d5252] disabled:cursor-not-allowed disabled:opacity-60">
                                {submitting ? "Booking…" : "Confirm"}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {submitError && (
                    <p className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-[12.5px] font-medium text-red-600">{submitError}</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
