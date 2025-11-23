import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactDetails = [
  {
    icon: Phone,
    label: "Call us",
    value: "+91 98765 43210",
    href: "tel:+919876543210",
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@agriconnect.io",
    href: "mailto:support@agriconnect.io",
  },
  {
    icon: MapPin,
    label: "Visit",
    value: "Ahmedabad Innovation Hub, Gujarat",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon - Sat · 9:00 AM to 6:00 PM IST",
  },
];

function ContactSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.3 }}
      id="contact"
      className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/40 to-white py-24"
    >
      <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-emerald-100 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-200/60 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[0.9fr,1.1fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-green-600">
                Contact
              </p>
              <h2 className="mt-4 text-4xl font-semibold text-slate-900 md:text-5xl">
                Let’s build better harvests together.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Have a product question, partnership idea, or want to see AgriConnect in action? Our team of agronomists, technologists, and customer success experts is ready to help.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ul className="mt-12 space-y-5">
                {contactDetails.map(({ icon: Icon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
                    <span className="mt-1 flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{label}</p>
                      {href ? (
                        <a href={href} className="mt-2 block text-base font-medium text-slate-900 transition hover:text-green-600">
                          {value}
                        </a>
                      ) : (
                        <p className="mt-2 text-base font-medium text-slate-900">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 rounded-3xl border border-green-200 bg-green-50/80 p-6 shadow-inner"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-green-500">Customer success</p>
              <p className="mt-3 text-base text-green-800">
                Schedule a personalised platform walkthrough and we’ll share how leading growers digitise their operations with AgriConnect.
              </p>
              <a
                href="mailto:success@agriconnect.io"
                className="mt-4 inline-flex items-center text-sm font-semibold text-green-600 transition hover:text-green-700"
              >
                success@agriconnect.io
              </a>
            </motion.div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            viewport={{ once: true }}
            className="relative rounded-[32px] border border-slate-200 bg-white/95 p-10 shadow-[0_35px_90px_-45px_rgba(15,23,42,0.4)]"
            action="https://formspree.io/f/xzbndlek"
            method="POST"
          >
            <div className="mb-8 text-left">
              <h3 className="text-2xl font-semibold text-slate-900">Send us a note</h3>
              <p className="mt-2 text-sm text-slate-500">
                We’ll respond within one business day.
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="contact-name" className="text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  required
                  placeholder="Khushi Patel"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-sm font-medium text-slate-700">
                  Email address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  required
                  placeholder="you@farms.io"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-sm font-medium text-slate-700">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Share a bit about your goals and we’ll come prepared."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Send message
                </Button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </motion.section>
  );
}

export default ContactSection;