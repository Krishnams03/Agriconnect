"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Leaf,
  Menu,
  X,
  Upload,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Info,
  Sparkles,
  ShieldCheck,
  Microscope,
  Sprout,
  Camera,
  BookOpen,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { isAuthenticated, getUserInfo } from "@/app/utils/auth";
import { logUserActivity } from "@/lib/activity";
import AnimatedLeafLogo from "@/components/AnimatedLeafLogo";

const CONFIDENCE_WIDTH_CLASSES: Record<number, string> = {
  0: "w-[0%]",
  5: "w-[5%]",
  10: "w-[10%]",
  15: "w-[15%]",
  20: "w-[20%]",
  25: "w-[25%]",
  30: "w-[30%]",
  35: "w-[35%]",
  40: "w-[40%]",
  45: "w-[45%]",
  50: "w-[50%]",
  55: "w-[55%]",
  60: "w-[60%]",
  65: "w-[65%]",
  70: "w-[70%]",
  75: "w-[75%]",
  80: "w-[80%]",
  85: "w-[85%]",
  90: "w-[90%]",
  95: "w-[95%]",
  100: "w-[100%]",
};

const getConfidenceWidthClass = (value: number) => {
  const normalized = Math.max(0, Math.min(100, Math.round(value / 5) * 5));
  return CONFIDENCE_WIDTH_CLASSES[normalized as keyof typeof CONFIDENCE_WIDTH_CLASSES] ?? "w-[0%]";
};

type AnalysisResult = {
  prediction: string;
  confidence: number;
  recommendations: string[];
};

export default function DiseaseDetectionPage() {
  const router = useRouter();
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000); // Adjust duration as needed
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);

      if (!authenticated) {
        router.push("/sign-up");
        return;
      }

      const userInfo = getUserInfo();
      if (userInfo) {
        setUserName(userInfo.name || 'User');
      }
    };

    checkAuth();
  }, [router]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const highlightPills = [
    "99.1% model accuracy",
    "35+ supported crops",
    "Works offline with queued sync",
  ];

  const detectionSteps = [
    {
      title: "Capture the leaf",
      description: "Photograph in daylight with the camera parallel to the leaf for crisp textures.",
      icon: Camera,
    },
    {
      title: "AI lab analysis",
      description: "Our CNN compares the sample against 50k+ curated disease images in milliseconds.",
      icon: Microscope,
    },
    {
      title: "Actionable plan",
      description: "Receive tailored chemical and organic treatment steps plus prevention insights.",
      icon: ShieldCheck,
    },
  ];

  const learningTiles = [
    {
      title: "Government Support",
      description: "Unlock subsidies and insurance that offset treatment costs.",
      href: "/government-schemes",
    },
    {
      title: "Growth Playbooks",
      description: "Pair disease cures with soil nutrition and irrigation tweaks.",
      href: "/growth-factors",
    },
    {
      title: "Community Forum",
      description: "Compare cases with agronomists and fellow farmers in real time.",
      href: "/community-forum",
    },
  ];

  const recommendationFallback: Record<string, string[]> = {
    "Early Blight": [
      "Prune infected foliage and dispose away from the field.",
      "Alternate copper-based fungicides weekly to slow spread.",
      "Improve airflow by widening plant spacing.",
    ],
    "Late Blight": [
      "Immediately remove and burn infected plants.",
      "Switch to resistant varieties for the next cycle.",
      "Avoid over-irrigation; keep foliage dry overnight.",
    ],
    "Leaf Spot": [
      "Rotate crops every season to break pathogen cycles.",
      "Apply neem or bio-fungicides after rainfall events.",
      "Sanitize tools between plant clusters.",
    ],
  };

  const scrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setUploadedImage(file);
      setFeedback(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetection = async () => {
    if (!uploadedImage) return;

    setIsLoading(true);
    setFeedback(null);
    const formData = new FormData();
    formData.append("image", uploadedImage);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/predict", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const prediction = data.prediction ?? "Unknown";
        const confidence = Number(data.confidence) || 0;
        const recommendations =
          data.recommendations ?? recommendationFallback[prediction] ?? [
            "Isolate the affected area and monitor neighboring crops.",
            "Record this case in your agronomy log for pattern tracking.",
            "Consult a local agronomist if symptoms escalate within 48 hours.",
          ];

        setAnalysis({ prediction, confidence, recommendations });
        setFeedback({ type: "success", message: `Detected ${prediction}` });
        await logUserActivity({
          type: "disease",
          title: `Disease prediction: ${prediction}`,
          details: `Confidence ${confidence}%`,
          meta: {
            prediction,
            confidence,
            source: "disease-detection",
          },
        });
      } else {
        setFeedback({ type: "error", message: "Could not analyze the image. Try again." });
      }
    } catch (error) {
      console.error("Detection error:", error);
      setFeedback({ type: "error", message: "Detection failed. Please retry with a clearer photo." });
    } finally {
      setIsLoading(false);
    }
  };

  const diseaseInfo = [
    {
      title: "Early Blight",
      description: "Dark circular lesions with concentric rings and yellow halos on older leaves.",
      treatment: "Remove infected leaves, switch to drip irrigation, apply copper fungicides.",
    },
    {
      title: "Late Blight",
      description: "Water-soaked spots that quickly turn black; white mildew underside in humid weather.",
      treatment: "Destroy infected plants, sanitize soil tools, rotate away from nightshades.",
    },
    {
      title: "Leaf Spot",
      description: "Small brown dots that expand with purple borders; spreads rapidly after rain.",
      treatment: "Use certified seeds, improve spacing, and spray bio-fungicides post rainfall.",
    },
  ];

  const uploadGuidelines = [
    "Shoot under natural light with the flash off to avoid glare.",
    "Include a healthy portion of the leaf for comparison.",
    "Hold the phone steady; allow autofocus before tapping the shutter.",
    "Wipe the lens to remove dust or water droplets before capturing.",
    "Upload multiple angles if the symptoms vary across the leaf.",
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-green-800">
              Access Restricted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Authentication Required</AlertTitle>
              <AlertDescription>
                Please sign in to access the Plant Disease Detection feature.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => router.push("/sign-up")}
              className="w-full mt-4 bg-green-600 hover:bg-green-700"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white via-emerald-50 to-white text-slate-600">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-green-500">Preparing lab</p>
        <p className="mt-3 text-2xl font-semibold text-slate-900">Loading disease intelligence...</p>
        <p className="mt-2 text-sm text-slate-500">Just a moment while we ready your plant diagnostics.</p>
      </div>
    );
  }

  const heroConfidenceValue = analysis ? analysis.confidence : 95;
  const heroProgressClass = getConfidenceWidthClass(heroConfidenceValue);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-emerald-50/40 to-white text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-3" aria-label="AgriConnect home">
            <AnimatedLeafLogo size="sm" />
            <span className="text-xl font-semibold tracking-tight text-slate-900">AgriConnect Labs</span>
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link href="/growth-factors" className="hover:text-slate-900">
              Growth Factors
            </Link>
            <Link href="/marketplace" className="hover:text-slate-900">
              Marketplace
            </Link>
            <Link href="/community-forum" className="hover:text-slate-900">
              Community
            </Link>
            <Button
              className="rounded-full bg-green-600 px-6 text-white hover:bg-green-700"
              onClick={scrollToWorkspace}
            >
              Launch Scanner
            </Button>
          </div>
          <button
            className="md:hidden rounded-full border border-slate-200 p-2 text-slate-600"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-4 text-slate-600 md:hidden">
            <div className="space-y-3">
              <Link href="/growth-factors" className="block">
                Growth Factors
              </Link>
              <Link href="/marketplace" className="block">
                Marketplace
              </Link>
              <Link href="/community-forum" className="block">
                Community
              </Link>
              <Button className="w-full rounded-full bg-green-600 text-white" onClick={scrollToWorkspace}>
                Launch Scanner
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative isolate overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-white"
        >
          <div className="absolute inset-y-0 right-0 hidden w-[480px] bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_60%)] lg:block" />
          <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-green-100/70 blur-3xl" />
          <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-[1.05fr,0.95fr]">
            <div className="space-y-8">
              <motion.p variants={itemVariants} className="text-xs font-semibold uppercase tracking-[0.35em] text-green-600">
                Precision plant care
              </motion.p>
              <motion.h1 variants={itemVariants} className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
                Welcome back, {userName || "grower"}. Diagnose crop stress before it becomes an outbreak.
              </motion.h1>
              <motion.p variants={itemVariants} className="max-w-2xl text-lg text-slate-600">
                Mirror the main dashboard experience with a dedicated disease lab. Upload a clear photo, let the CNN model benchmark
                it against agronomist-verified cases, and receive a plan that matches your farm conditions.
              </motion.p>
              <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                {highlightPills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-green-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-green-700"
                  >
                    {pill}
                  </span>
                ))}
              </motion.div>
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <Button className="rounded-full bg-green-600 px-6 text-white" onClick={scrollToWorkspace}>
                  Start a diagnosis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full border-green-200 bg-white px-6 text-green-700 hover:bg-green-50"
                  onClick={() => router.push("/growth-factors")}
                >
                  View treatment playbooks
                </Button>
              </motion.div>
              <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Photos analyzed", value: "8.4k" },
                  { label: "Avg. response", value: "3.1s" },
                  { label: "Supported crops", value: "35+" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                    <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                    <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
            <motion.div
              variants={itemVariants}
              className="relative rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.35)]"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Live agronomy feed</span>
                <span>Updated {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <span className="rounded-full bg-white p-2">
                    <Sprout className="h-5 w-5 text-green-600" />
                  </span>
                  <div>
                    <p className="text-sm text-slate-500">Current confidence</p>
                    <p className="text-3xl font-semibold text-slate-900">{analysis ? `${analysis.confidence}%` : "95%"}</p>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white">
                  <div className={`h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 ${heroProgressClass}`} />
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-green-600" />
                  Adaptive model v2.4 cross-checks lesions, mildew, and nutrient stress.
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  Averaging sub-4-second responses in low-connectivity regions.
                </p>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                  <Microscope className="h-5 w-5 text-green-600" />
                  <p className="mt-3 text-2xl font-semibold text-slate-900">+18%</p>
                  <p className="text-xs text-slate-500">Average yield retention when acted upon within 48h.</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <p className="mt-3 text-2xl font-semibold text-slate-900">Zero data leaks</p>
                  <p className="text-xs text-slate-500">Session encrypted end-to-end just like main dashboard.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section variants={containerVariants} initial="hidden" animate="visible" ref={workspaceRef} className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-green-600">Workspace</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">Disease prediction lab</h2>
                <p className="mt-2 text-slate-600">Styled to mirror the homepage—clean cards, rounded edges, and soft gradients.</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold text-green-700">
                <ShieldCheck className="h-4 w-4" /> Secure session active
              </span>
            </div>
            <div className="grid gap-8 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-lg lg:grid-cols-[5fr_4fr]">
              <div className="space-y-6">
                <div className="rounded-2xl border border-dashed border-green-200 bg-emerald-50/40 p-6 text-center">
                  <Input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                  <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center gap-3">
                    <div className="rounded-full bg-white p-4 shadow">
                      <ImageIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-lg font-medium text-slate-900">Drop or click to upload</p>
                    <p className="max-w-sm text-sm text-slate-500">
                      Supported formats: JPG, PNG. Ideal resolution 1080px+. The clearer the veins and lesions, the more accurate the prediction.
                    </p>
                  </label>
                  {imagePreview && (
                    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={800}
                        height={450}
                        className="h-auto w-full object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    onClick={handleDetection}
                    disabled={!uploadedImage || isLoading}
                    className="w-full rounded-full bg-green-600 text-white hover:bg-green-700"
                  >
                    {isLoading ? "Analyzing sample..." : "Run detection"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    disabled={isLoading}
                    onClick={() => {
                      setUploadedImage(null);
                      setImagePreview(null);
                      setAnalysis(null);
                      setFeedback(null);
                    }}
                  >
                    Reset workspace
                  </Button>
                </div>
                {feedback && (
                  <Alert
                    variant={feedback.type === "error" ? "destructive" : "default"}
                    className={
                      feedback.type === "error"
                        ? "rounded-2xl border border-red-100 bg-red-50 text-red-700"
                        : "rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-800"
                    }
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>
                        {feedback.type === "error" ? "Something went wrong" : "Prediction complete"}
                      </AlertTitle>
                    </div>
                    <AlertDescription>{feedback.message}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-6">
                <Card className="border border-slate-100 bg-white/90">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Upload className="h-5 w-5 text-green-600" />
                      Analysis summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 text-sm text-slate-600">
                    {analysis ? (
                      <div className="space-y-5">
                        <div>
                          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Prediction</p>
                          <p className="text-3xl font-semibold text-slate-900">{analysis.prediction}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Confidence</p>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r from-green-500 via-emerald-500 to-sky-500 ${getConfidenceWidthClass(
                                analysis.confidence
                              )}`}
                            />
                          </div>
                          <p className="mt-2 text-sm text-slate-500">{analysis.confidence}% certainty based on latest model weights.</p>
                        </div>
                        <div className="space-y-3">
                          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Field actions</p>
                          <ul className="space-y-3 text-slate-700">
                            {analysis.recommendations.map((tip) => (
                              <li key={tip} className="flex items-start gap-3">
                                <CheckCircle2 className="mt-1 h-4 w-4 text-green-600" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 text-slate-500">
                        <p>Upload an image to see the AI summary, confidence score, and prioritized treatment steps.</p>
                        <div className="rounded-xl border border-dashed border-slate-200 p-4">
                          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Tip</p>
                          <p className="text-sm text-slate-500">
                            Start with the most symptomatic leaf, then cross-check with your field history for seasonal patterns.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-slate-100 bg-white/90">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-slate-900">
                      <Info className="h-5 w-5 text-green-600" />
                      Capture guidelines
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4 text-sm text-slate-600">
                      {uploadGuidelines.map((guideline) => (
                        <li key={guideline} className="flex items-start gap-3">
                          <BookOpen className="mt-1 h-4 w-4 text-green-600" />
                          <span>{guideline}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="px-6 pb-20">
          <div className="mx-auto max-w-7xl space-y-10">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-green-600">Workflow clarity</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">How your diagnosis travels through the lab</h2>
              <p className="mt-2 text-slate-600">
                The same guided steps from the homepage now tailored for plant pathology in three simple phases.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {detectionSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 inline-flex rounded-full bg-emerald-50 p-3">
                      <Icon className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.section>

        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="px-6 pb-20">
          <div className="mx-auto max-w-7xl space-y-10">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-green-600">Field intelligence</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Most flagged diseases this season</h2>
              <p className="mt-2 text-slate-600">Compare symptoms and treatments before they escalate across your acreage.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {diseaseInfo.map((disease) => (
                <Card key={disease.title} className="border border-slate-200 bg-white/90">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-emerald-50 p-2">
                        <Sprout className="h-5 w-5 text-green-600" />
                      </div>
                      <CardTitle className="text-xl text-slate-900">{disease.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-slate-600">
                    <p>{disease.description}</p>
                    <p className="text-green-700">Treatment: {disease.treatment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section variants={containerVariants} initial="hidden" animate="visible" className="px-6 pb-20">
          <div className="mx-auto max-w-7xl space-y-10">
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.35em] text-green-600">Continue learning</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Blend AI insights with agronomist wisdom</h2>
              <p className="mt-2 text-slate-600">Use these curated spaces to convert a diagnosis into resilient farming playbooks.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {learningTiles.map((tile) => (
                <Card key={tile.title} className="border border-slate-200 bg-white/90">
                  <CardHeader>
                    <CardTitle className="text-xl text-slate-900">{tile.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-slate-600">
                    <p>{tile.description}</p>
                    <Link href={tile.href} className="inline-flex items-center text-green-700 hover:text-green-600">
                      Explore more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="px-6 pb-20">
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow">
            <p className="text-xs uppercase tracking-[0.35em] text-green-600">Next steps</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">Ready to sync with the rest of AgriConnect?</h2>
            <p className="mt-3 text-slate-600">Head back to the main dashboard or hop into the community forum to validate your findings.</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button className="rounded-full bg-green-600 px-6 text-white" onClick={() => router.push("/")}>
                Return to main page
              </Button>
              <Button
                variant="outline"
                className="rounded-full border-green-200 bg-white px-6 text-green-700 hover:bg-green-50"
                onClick={() => router.push("/community-forum")}
              >
                Ask the community
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
