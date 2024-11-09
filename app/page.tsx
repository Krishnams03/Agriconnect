"use client"

import { useState, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Home, Sprout, FileText, Users, ArrowRight, Mail, Phone, MapPin, Menu } from "lucide-react"
import Link from "next/link"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment } from "@react-three/drei"
import AnimatedText from "@/components/AnimatedText"

function PlantModel() {
  const { scene } = useGLTF("/assets/3d/potted_plant.glb")
  return <primitive object={scene} scale={0.4} position={[0, -3, 0]} rotation={[0, -Math.PI / 4, 0]} />
}

export default function AgriConnect() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-green-50"
    >
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="sticky top-0 bg-green-800 text-white z-50"
      >
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <Leaf className="mr-2" />
            AgriConnect
          </Link>
          <div className="hidden md:flex space-x-5">
            {["home", "about", "features", "contact"].map(section => (
              <motion.button
                key={section}
                whileHover={{ scale: 1.1 }}
                onClick={() => scrollToSection(section)}
                className="hover:text-green-300"
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </motion.button>
            ))}
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button variant="outline" className="bg-green-700 text-white hover:bg-green-600">
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </motion.div>
          </div>

          <div className="md:hidden">
            <Menu className="h-8 w-8" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
          </div>
        </nav>
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-green-700 text-white flex flex-col space-y-2 p-4"
            >
              {["home", "about", "features", "contact"].map(section => (
                <motion.button
                  key={section}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => scrollToSection(section)}
                  className="hover:text-green-300"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </motion.button>
              ))}
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button variant="outline" className="bg-green-700 text-white hover:bg-green-600">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main>
         {/* Hero Section */}
         <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-44 bg-gradient-to-t from-green-500 to-green-800 text-white text-center md:text-left"
        >
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 h-64 md:h-96">
              {mounted && (
                <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <Suspense fallback={null}>
                    <PlantModel />
                    <Environment preset="sunset" />
                  </Suspense>
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
                </Canvas>
              )}
            </div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="md:w-1/2 mt-8 md:mt-0"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to AgriConnect</h1>
              <p className="text-xl mb-6">Your all-in-one platform for smart and sustainable agriculture</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-white text-green-800 hover:bg-green-100">
                  Get Started
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          id="about"
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-10">About Us</h2>
            <div className="max-w-3xl mx-auto text-lg text-gray-600 space-y-6">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                AgriConnect is a pioneering platform dedicated to revolutionizing the agricultural sector through innovative technology and sustainable practices. Our mission is to empower farmers, agricultural professionals, and enthusiasts with cutting-edge tools and knowledge to enhance crop yield, reduce environmental impact, and promote food security.
              </motion.p>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                Join us in our journey to transform agriculture and cultivate a greener, more sustainable future for generations to come.
              </motion.p>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          id="features"
          className="py-20 bg-green-50"
        >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-green-800 mb-10">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature Cards */}
              {[
                {
                  icon: <Leaf className="h-8 w-8 text-green-600" />,
                  title: "Plant Disease Classification",
                  description: "Our AI system can identify plant diseases quickly and accurately. Simply upload a photo of your plant, and receive instant results along with treatment recommendations.",
                  link: "/disease-detection",
                  buttonText: "Detect Diseases",
                },
                {
                  icon: <Sprout className="h-8 w-8 text-green-600" />,
                  title: "Growth Factors",
                  description: "Optimize your crop yield with personalized growth factor recommendations. Enter your plant type and receive tailored advice on soil, water, light, and nutrient requirements.",
                  link: "/growth-factors",
                  buttonText: "Explore Factors",
                },
                {
                  icon: <FileText className="h-8 w-8 text-green-600" />,
                  title: "Government Schemes",
                  description: "Stay informed about the latest agricultural schemes and subsidies offered by both national and state governments. Access detailed information and application procedures all in one place.",
                  link: "/government-schemes",
                  buttonText: "View Schemes",
                },
                {
                  icon: <Users className="h-8 w-8 text-green-600" />,
                  title: "Community Forum",
                  description: "Connect with fellow farmers, agricultural experts, and enthusiasts. Share experiences, ask questions, and gain valuable insights from a diverse community of agriculture professionals.",
                  link: "/community-forum",
                  buttonText: "Join Discussion",
                },
                {
                  icon: <Home className="h-8 w-8 text-green-600" />,
                  title: "E-Commerce",
                  description: "Buy or sell the crop you need or crops you want to sell to best absolute price.",
                  link: "/marketplace",
                  buttonText: "Buy or Sell Items",
                },
              ].map(feature => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  link={feature.link}
                  buttonText={feature.buttonText}
                />
              ))}
            </div>
          </div>
        </motion.section>


        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          id="contact"
          className="py-20 bg-white"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-10">Contact Us</h2>
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-lg mx-auto space-y-6"
            >
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-600"
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-600"
                required
              />
              <textarea
                placeholder="Message"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-600"
                required
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button type="submit" className="bg-green-600 text-white hover:bg-green-500 w-full">
                  Send Message
                </Button>
              </motion.div>
            </motion.form>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-green-800 text-white py-6"
      >
        <div className="container mx-auto flex flex-col items-center space-y-4">
          <div className="flex space-x-6">
            {[
              { icon: <Mail className="h-6 w-6 mr-2" />, text: "contact@agriconnect.com" },
              { icon: <Phone className="h-6 w-6 mr-2" />, text: "+1 (555) 123-4567" },
              { icon: <MapPin className="h-6 w-6 mr-2" />, text: "123 Farm Road, Agriville, AG 12345" },
            ].map(item => (
              <motion.div
                key={item.text}
                whileHover={{ scale: 1.05 }}
                className="flex items-center"
              >
                {item.icon}
                <span>{item.text}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-sm">&copy; 2024 AgriConnect. All rights reserved.</p>
        </div>
      </motion.footer>
    </motion.div>
  )
}

function FeatureCard({ icon, title, description, link, buttonText }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="p-4"
    >
      <Card className="hover:shadow-xl transition-shadow duration-300 rounded-lg border border-gray-200">
        <CardHeader className="flex flex-col items-center space-y-4 text-center">
          <div className="p-3 bg-green-100 rounded-full">{icon}</div>
          <CardTitle className="text-lg font-semibold text-green-800">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center space-y-4">
          <p className="text-gray-600">{description}</p>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-full"
          >
            <Button
              variant="outline"
              className="w-full bg-green-600 text-white hover:bg-green-500 px-6 py-2 rounded-full transition-colors duration-300"
            >
              <Link href={link}>
                {buttonText} <ArrowRight className="ml-10 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


