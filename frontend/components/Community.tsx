import { motion } from "framer-motion";
import Link from "next/link";
import { Users, MessageCircle, Sparkles } from "lucide-react";

function CommunityForumSection() {
  const highlights = [
    {
      icon: Users,
      title: "Peer-to-peer support",
      description: "Exchange proven practices with growers facing the same climate and soil realities as you.",
    },
    {
      icon: MessageCircle,
      title: "Expert-led sessions",
      description: "Weekly AMAs with agronomists and supply-chain mentors moderated by the AgriConnect team.",
    },
    {
      icon: Sparkles,
      title: "Showcase successes",
      description: "Celebrate harvest milestones, farmer innovations, and community-driven sustainability wins.",
    },
  ];

  return (
    <motion.section
      id="community-forum"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative bg-white py-24"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
      <div className="absolute -right-32 top-24 h-64 w-64 rounded-full bg-green-100/60 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-72 w-72 -translate-y-12 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.1fr,0.9fr] items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-green-600">Community Forum</p>
            <h2 className="mt-6 text-4xl font-semibold text-slate-900 tracking-tight md:text-5xl">
              Where knowledge travels faster than climate change.
            </h2>
            <p className="mt-6 text-base text-slate-600 leading-relaxed">
              Join a curated network of cultivators, co-operatives, and experts sharing in-field learnings, crisis responses, and market signals in real time.
            </p>

            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              {highlights.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-base font-semibold text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                href="/community-forum"
                className="inline-flex items-center justify-center rounded-full bg-green-600 px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700"
              >
                Join the forum
              </Link>
              <Link
                href="/community-forum#featured"
                className="inline-flex items-center justify-center rounded-full border border-green-500/70 bg-white px-7 py-3 text-sm font-semibold text-green-600 transition-all duration-300 hover:bg-green-500 hover:text-white"
              >
                See member stories
              </Link>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-[0_35px_90px_-45px_rgba(15,23,42,0.4)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">Live threads</p>
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">Active</span>
              </div>
              <p className="mt-6 text-4xl font-semibold text-slate-900">87</p>
              <p className="mt-2 text-sm text-slate-500">Discussions moving in the last 24 hours.</p>

              <div className="mt-8 space-y-4">
                {["Organic pest strategy for pulses", "Co-op buyers in Maharashtra", "Weather hedge best practices"].map((topic, index) => (
                  <div key={topic} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                    <p className="text-sm font-semibold text-slate-900">{topic}</p>
                    <p className="mt-1 text-xs text-slate-500">Community curated insights • {12 + index * 5} replies</p>
                  </div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-10 right-6 w-52 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg"
              >
                <p className="text-xs font-medium text-slate-500">Verified experts</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">140+</p>
                <p className="mt-1 text-xs text-slate-500">Agronomists, soil scientists, market analysts.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

export default CommunityForumSection;
