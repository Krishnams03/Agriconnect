import { motion } from "framer-motion";import { motion } from "framer-motion";

import { Leaf, Home, ArrowRight } from "lucide-react";import { Leaf, Home, ArrowRight } from "lucide-react";

import Link from "next/link";import Link from "next/link";

import { Button } from "@/components/ui/button";import { Button } from "@/components/ui/button";



interface Feature {interface Feature {

  icon: React.ReactNode;  icon: React.ReactNode;

  title: string;  title: string;

  description: string;  description: string;

  link: string;  link: string;

  buttonText: string;  buttonText: string;

}  gradient: string;

  bgColor: string;

function FeaturesSection() {}

  const mainFeatures: Feature[] = [

    {function FeaturesSection() {

      icon: <Leaf className="h-12 w-12 text-white" />,    const mainFeatures = [

      title: "Plant Disease Detection",      {

      description: "Advanced AI-powered plant disease identification system. Simply upload a photo of your plant and get instant, accurate diagnosis with detailed treatment recommendations and prevention tips.",        icon: <Leaf className="h-12 w-12 text-white" />,

      link: "/disease-detection",        title: "Plant Disease Detection", 

      buttonText: "Start Detection"        description: "Advanced AI-powered plant disease identification system. Simply upload a photo of your plant and get instant, accurate diagnosis with detailed treatment recommendations and prevention tips.",

    },        link: "/disease-detection",

    {        buttonText: "Start Detection",

      icon: <Home className="h-12 w-12 text-white" />,        gradient: "from-green-400 to-emerald-500",

      title: "Agricultural Marketplace",        bgColor: "bg-gradient-to-br from-green-50 to-emerald-50"

      description: "Complete e-commerce platform for farmers and buyers. Buy and sell crops, fertilizers, and agricultural equipment at competitive prices with secure transactions and nationwide delivery.",      },

      link: "/marketplace",      {

      buttonText: "Explore Market"        icon: <Home className="h-12 w-12 text-white" />,

    }        title: "Agricultural Marketplace",

  ];        description: "Complete e-commerce platform for farmers and buyers. Buy and sell crops, fertilizers, and agricultural equipment at competitive prices with secure transactions and nationwide delivery.",

        link: "/marketplace", 

  return (        buttonText: "Explore Market",

    <motion.section        gradient: "from-blue-400 to-cyan-500",

      id="features"        bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"

      initial={{ opacity: 0 }}      },

      whileInView={{ opacity: 1 }}    ];

      transition={{ duration: 1 }}

      viewport={{ once: false }}  return (

      className="bg-gradient-to-b from-white via-green-50 to-green-100 py-20 min-h-screen flex flex-col justify-center"    <motion.section

    >      id="features"

      <motion.h2      initial={{ opacity: 0 }}

        initial={{ opacity: 0, y: -20 }}      whileInView={{ opacity: 1 }}

        whileInView={{ opacity: 1, y: 0 }}      transition={{ duration: 1 }}

        transition={{ duration: 0.8, delay: 0.2 }}      viewport={{ once: false }}

        className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-6"      className="bg-gradient-to-b from-white via-green-50 to-green-100 py-20 min-h-screen flex flex-col justify-center"

      >    >

        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Core Features</span>      <motion.h2

      </motion.h2>        initial={{ opacity: 0, y: -20 }}

        whileInView={{ opacity: 1, y: 0 }}

      <motion.p        transition={{ duration: 0.8, delay: 0.2 }}

        initial={{ opacity: 0, y: 20 }}        className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-6"

        whileInView={{ opacity: 1, y: 0 }}      >

        transition={{ duration: 0.8, delay: 0.4 }}        Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Core Features</span>

        className="text-lg md:text-xl text-center text-gray-600 mb-16 mx-auto max-w-3xl px-4"      </motion.h2>

      >

        Discover the innovative tools that make agricultural management smarter, easier, and more productive than ever before.      <motion.p

      </motion.p>        initial={{ opacity: 0, y: 20 }}

        whileInView={{ opacity: 1, y: 0 }}

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl">        transition={{ duration: 0.8, delay: 0.4 }}

        {mainFeatures.map((feature, index) => (        className="text-lg md:text-xl text-center text-gray-600 mb-16 mx-auto max-w-3xl px-4"

          <motion.div      >

            key={index}        Discover the innovative tools that make agricultural management smarter, easier, and more productive than ever before.

            initial={{ opacity: 0, y: 30, scale: 0.95 }}      </motion.p>

            whileInView={{ opacity: 1, y: 0, scale: 1 }}

            transition={{      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl">

              duration: 0.8,        {mainFeatures.map((feature, index) => (

              delay: 0.6 + index * 0.3,          <motion.div

              ease: "easeOut"            key={index}

            }}            initial={{ opacity: 0, y: 30, scale: 0.95 }} 

            viewport={{ once: false, amount: 0.3 }}            whileInView={{ opacity: 1, y: 0, scale: 1 }} 

          >            transition={{

            <FeatureCard feature={feature} index={index} />              duration: 0.8,

          </motion.div>              delay: 0.6 + index * 0.3,

        ))}              ease: "easeOut"

      </div>            }}

    </motion.section>            viewport={{ once: false, amount: 0.3 }}

  );          >

}            <FeatureCard feature={feature} />

          </motion.div>

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {        ))}

  const isGreen = index === 0;      </div>

  const iconBg = isGreen ? "bg-gradient-to-br from-green-400 to-emerald-500" : "bg-gradient-to-br from-blue-400 to-cyan-500";    </motion.section>

  const buttonBg = isGreen ? "bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600" : "bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600";  );

}

  return (

    <motion.divfunction FeatureCard({ feature }: { feature: Feature }) {

      whileHover={{ y: -8 }}    return (

      className="relative overflow-hidden bg-white backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl p-8 text-center h-full group hover:shadow-2xl transition-all duration-300"      <motion.div

    >        whileHover={{ y: -8 }}

      <motion.div        className={

        className={`relative z-10 p-6 ${iconBg} rounded-2xl mb-6 mx-auto w-fit shadow-lg`}elative overflow-hidden backdrop-blur-sm border border-white/20 shadow-xl rounded-3xl p-8 text-center h-full group hover:shadow-2xl transition-all duration-300 bg-white}

        whileHover={{ scale: 1.1, rotate: 5 }}      >

        transition={{ duration: 0.3 }}        <motion.div 

      >          className={

        {feature.icon}elative z-10 p-6 bg-gradient-to-br rounded-2xl mb-6 mx-auto w-fit shadow-lg}

      </motion.div>          style={{ background: feature.gradient.includes('green') ? 'linear-gradient(to bottom right, #4ade80, #10b981)' : 'linear-gradient(to bottom right, #60a5fa, #06b6d4)' }}

        >

      <div className="relative z-10">          {feature.icon}

        <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>        </motion.div>

        <p className="text-gray-600 mb-8 leading-relaxed">{feature.description}</p>        

        <div className="relative z-10">

        <Link href={feature.link}>          <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>

          <Button className={`w-full ${buttonBg} text-white border-0 py-3 px-6 rounded-xl font-semibold transition-all duration-300 group`}>          <p className="text-gray-600 mb-8 leading-relaxed">{feature.description}</p>

            {feature.buttonText}          

            <ArrowRight className="h-5 w-5 ml-2" />          <Link href={feature.link}>

          </Button>            <Button

        </Link>              className="w-full text-white border-0 py-3 px-6 rounded-xl font-semibold transition-all duration-300"

      </div>              style={{ background: feature.gradient.includes('green') ? 'linear-gradient(to right, #4ade80, #10b981)' : 'linear-gradient(to right, #60a5fa, #06b6d4)' }}

            >

      <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>              {feature.buttonText} 

      <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>              <ArrowRight className="h-5 w-5 ml-2" />

    </motion.div>            </Button>

  );          </Link>

}        </div>

      </motion.div>

export default FeaturesSection;    );
}

export default FeaturesSection;
