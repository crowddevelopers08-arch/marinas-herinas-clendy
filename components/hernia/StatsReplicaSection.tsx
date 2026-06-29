import { section } from "./styles";

const stats = [
  ["5,000+", "Happy Patients"],
  ["1,000+", "Online Appointments"],
  ["12+", "Years Of Experience"],
  ["15+", "Doctors and Staff"],
];

export function StatsReplicaSection() {
  return (
    <section className={`bg-[#51bec4] text-white ${section}`}>
      <div className="mx-auto grid max-w-[1440px] grid-cols-4 items-start px-[72px] text-center max-[900px]:grid-cols-2 max-[900px]:gap-y-12 max-[620px]:px-5 max-[620px]:gap-y-9">
        {stats.map(([value, label]) => (
          <div key={label} className="min-w-0">
            <div className="font-display text-[clamp(34px,5vw,58px)] font-semibold leading-none">
              {value}
            </div>
            <div className="mt-4 font-body text-lg font-semibold leading-tight max-[620px]:mt-3 max-[620px]:text-base">
              {label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
