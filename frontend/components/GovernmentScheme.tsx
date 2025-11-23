import { motion } from "framer-motion";
import Link from "next/link";

function GovernmentSchemesSection() {
  const schemes = [
    {
      id: 1,
      title: "Pradhan Mantri Kisan Samman Nidhi",
      description: "Provides income support to farmers for meeting agricultural needs.",
      apply_link: "https://pmkisan.gov.in"
    },
    {
      id: 2,
      title: "Pradhan Mantri Fasal Bima Yojana",
      description: "Crop insurance scheme to protect farmers against losses.",
      apply_link: "https://pmfby.gov.in"
    },
    {
      id: 3,
      title: "Soil Health Card Scheme",
      description: "Ensures healthy soil management practices for better yields.",
      apply_link: "https://soilhealth.gov.in"
    },
    {
      id: 4,
      title: "Rashtriya Krishi Vikas Yojana",
      description: "Boosts agricultural productivity and rural development.",
      apply_link: "https://rkvy.nic.in"
    },
    {
      id: 5,
      title: "Kisan Credit Card Scheme",
      description: "Provides farmers with credit facilities for their needs.",
      apply_link: "https://kcc.gov.in"
    },
    {
      id: 6,
      title: "National Food Security Mission",
      description: "Aims to ensure sustainable food production and distribution.",
      apply_link: "https://nfsm.gov.in"
    }
  ];

  return (
    <motion.section
      id="government-schemes"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative bg-slate-50 py-24"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-green-600">Policy Support</p>
          <h2 className="mt-6 text-4xl font-semibold text-slate-900 tracking-tight md:text-5xl">
            Navigate programmes that put farmers first.
          </h2>
          <p className="mt-6 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            We monitor high-impact government initiatives so you can unlock funding, insurance, and resources without the paperwork confusion.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {schemes.map((scheme, index) => (
            <motion.article
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-1 hover:border-green-400/60 hover:shadow-[0_35px_70px_-40px_rgba(34,197,94,0.35)]"
            >
              <div>
                <span className="text-xs font-medium uppercase tracking-[0.35em] text-green-500">Scheme</span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900 leading-snug">
                  {scheme.title}
                </h3>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  {scheme.description}
                </p>
              </div>

              <Link
                href={scheme.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center text-sm font-semibold text-green-600 hover:text-green-700"
              >
                Apply now
                <span className="ml-2 text-base" aria-hidden>→</span>
              </Link>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex flex-col items-center justify-center gap-3 rounded-3xl border border-green-200 bg-white/80 p-10 text-center shadow-[0_30px_80px_-45px_rgba(34,197,94,0.35)]"
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-green-500">Guided Assistance</p>
          <h3 className="text-2xl font-semibold text-slate-900">Need help with eligibility?</h3>
          <p className="max-w-xl text-sm text-slate-600">
            Our advisory partners walk you through documentation, deadlines, and regional requirements at no additional cost.
          </p>
          <Link
            href="/government-schemes"
            className="mt-4 inline-flex items-center justify-center rounded-full border border-green-500/70 bg-white px-6 py-3 text-sm font-semibold text-green-600 transition-all duration-300 hover:bg-green-500 hover:text-white"
          >
            Discover all schemes
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default GovernmentSchemesSection;
