import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import { Leaf, Sprout, Users, Globe } from "lucide-react";

// TreeModel Component
function TreeModel() {
  const { scene } = useGLTF("/assets/3d/Trees.glb");
  return <primitive object={scene} scale={0.6} position={[0, -1.5, 0]} rotation={[0, -Math.PI / 4, 0]} />;
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        setIsInView(isVisible);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6 }}
      id="about"
  className="relative bg-white py-24"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-200 to-transparent" />
      <div className="absolute -left-32 top-32 h-64 w-64 rounded-full bg-green-100/50 blur-3xl" />
      <div className="absolute bottom-10 right-0 h-72 w-72 translate-x-1/2 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr,0.95fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-green-600">About Agriconnect</p>
            <h2 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
              Rooted in data, built for the growers of tomorrow.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
              We unite agronomists, technologists, and local communities to deliver technology that feels effortless in the field. Every feature is crafted to simplify decisions, cut waste, and celebrate sustainable progress.
            </p>

            <div className="mt-10 space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                  <Leaf className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-base font-semibold text-slate-900">Sustainable innovation</p>
                  <p className="mt-1 text-sm text-slate-500">
                    From soil sensors to climate models, we surface insights that protect yields and ecosystems alike.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.35 }}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                  <Users className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-base font-semibold text-slate-900">Human expertise</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Verified agronomists and progressive growers form a knowledge network ready to support every decision.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.5 }}
                className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                  <Globe className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-base font-semibold text-slate-900">Global reach</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Localized recommendations and region-specific marketplaces streamline trade across borders.
                  </p>
                </div>
              </motion.div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 text-left shadow-sm">
                <p className="text-3xl font-semibold text-slate-900">38</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Countries</p>
                <p className="mt-2 text-sm text-slate-500">A growing footprint of connected growers.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 text-left shadow-sm">
                <p className="text-3xl font-semibold text-slate-900">84%</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Satisfaction</p>
                <p className="mt-2 text-sm text-slate-500">Partner cooperatives reporting higher ROI.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 text-left shadow-sm">
                <p className="text-3xl font-semibold text-slate-900">6M+</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Hectares</p>
                <p className="mt-2 text-sm text-slate-500">Fields enriched with AgriConnect intelligence.</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-green-50 to-white p-6 shadow-[0_35px_90px_-50px_rgba(15,23,42,0.4)]">
              <div className="h-[320px] sm:h-[360px] md:h-[420px] overflow-hidden rounded-2xl bg-white/60">
                {isInView && (
                  <Canvas camera={{ position: [4, 3, 6], fov: 50 }}>
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[5, 5, 5]} intensity={1.2} />
                    <pointLight position={[10, 10, 10]} intensity={0.8} />
                    <Suspense fallback={null}>
                      <TreeModel />
                      <Environment preset="sunset" />
                    </Suspense>
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                  </Canvas>
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                transition={{ delay: 0.6 }}
                className="absolute -top-10 right-8 w-48 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg"
              >
                <span className="text-xs font-medium text-slate-500">Carbon offset</span>
                <p className="mt-3 text-3xl font-semibold text-slate-900">-22%</p>
                <p className="text-xs text-slate-500">Average emission reduction with optimized input plans.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: 0.75 }}
                className="absolute -bottom-12 left-8 w-56 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                  <Sprout className="h-5 w-5" />
                </span>
                <p className="mt-3 text-base font-semibold text-slate-900">Soil vitality scores</p>
                <p className="mt-1 text-xs text-slate-500">Updated with each field report and sensor reading.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
