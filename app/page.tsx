"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import {
  Users,
  Brush,
  Upload,
  Download,
  Grid,
  Github,
  Undo2,
  Twitter,
  Laptop,
  Sparkles,
  Zap,
  Palette,
} from "lucide-react";

// Feature type definition
interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
}

// features
const features: Feature[] = [
  {
    title: "Intuitive Drawing Tools",
    description:
      "Experience fluid, precise drawing with pressure sensitivity support and customizable brushes. Perfect for both digital artists and designers.",
    icon: <Brush className="h-6 w-6" />,
    gradient: "from-blue-400/20 to-cyan-300/20",
    delay: 0.1,
  },
  {
    title: "Smart Image Management",
    description:
      "Import, resize, and manipulate images with ease. Supports multiple formats and maintains high quality for professional results.",
    icon: <Upload className="h-6 w-6" />,
    gradient: "from-purple-400/20 to-pink-300/20",
    delay: 0.2,
  },
  {
    title: "Real-time Collaboration",
    description:
      "Work together seamlessly with team members. Share, edit, and create simultaneously with zero lag and automatic syncing.",
    icon: <Users className="h-6 w-6" />,
    gradient: "from-green-400/20 to-emerald-300/20",
    delay: 0.3,
  },
  {
    title: "Professional Export Options",
    description:
      "Export your work in various formats including PNG, SVG, and PDF. Maintain quality with resolution control and layer preservation.",
    icon: <Download className="h-6 w-6" />,
    gradient: "from-orange-400/20 to-amber-300/20",
    delay: 0.4,
  },
  {
    title: "Unlimited History",
    description:
      "Never lose your work with our robust undo/redo system. Track changes and restore previous versions with ease.",
    icon: <Undo2 className="h-6 w-6" />,
    gradient: "from-red-400/20 to-rose-300/20",
    delay: 0.5,
  },
  {
    title: "Precision Grid System",
    description:
      "Achieve perfect alignment with customizable grids and smart guides. Snap-to-grid functionality ensures pixel-perfect designs.",
    icon: <Grid className="h-6 w-6" />,
    gradient: "from-indigo-400/20 to-violet-300/20",
    delay: 0.6,
  },
];

// Benefits section data
const benefits = [
  {
    icon: <Laptop className="h-8 w-8" />,
    title: "Cross-Platform",
    description:
      "Work seamlessly across all devices and browsers. Your canvas, everywhere you go.",
  },
  {
    icon: <Palette className="h-8 w-8" />,
    title: "Design Freedom",
    description:
      "No limitations. Create anything from simple sketches to complex illustrations.",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Lightning Fast",
    description:
      "Optimized performance ensures smooth drawing and responsive controls.",
  },
];

export default function Page() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.2], [100, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [0.9, 1]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background relative overflow-hidden">
      {/* */}
      <div className="absolute inset-0 bg-grid-white/[0.01] -z-10" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 -z-10" />

      {/*  Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 border-b border-border/40 backdrop-blur-md bg-background/80"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Chromanvas</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#demo"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Demo
            </Link>
            <Link
              href="/canvas"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Launch App
            </Link>
          </nav>
        </div>
      </motion.header>

      {/*  Hero Section */}
      <section className="pt-32 pb-24 relative min-h-screen flex items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="container mx-auto px-4"
        >
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="mb-8"
            >
              <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full inline-block mb-4">
                Version 2.0 Now Available
              </span>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                Create Amazing Art with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                  Chromanvas
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                A powerful digital canvas that brings your creative ideas to
                life. Professional tools, real-time collaboration, and unlimited
                possibilities.
              </p>
            </motion.div>

            {/**/}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row justify-center gap-6"
            >
              <Link
                href="/canvas"
                className="group inline-flex items-center justify-center px-8 py-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
              >
                Start Creating
                <Sparkles className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-all duration-300"
              >
                Watch Demo
              </Link>
            </motion.div>

            {/*  */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-16 pt-16 border-t border-border/40"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-2">10</h3>
                  <p className="text-muted-foreground">Active Users</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-2">100</h3>
                  <p className="text-muted-foreground">Artworks Created</p>
                </div>
                <div className="text-center">
                  <h3 className="text-3xl font-bold mb-2">4.9/5</h3>
                  <p className="text-muted-foreground">User Rating</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        ref={targetRef}
        id="features"
        className="py-32 relative bg-gradient-to-b from-background/50 via-background/30 to-background/50"
      >
        <motion.div
          style={{ opacity, y, scale }}
          className="container mx-auto px-4"
        >
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Everything You Need to Create
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed for professional creators and beginners
              alike.
            </p>
          </div>

          <motion.div
            ref={ref}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: feature.delay, duration: 0.5 }}
                className="group relative p-8 rounded-2xl border border-border/40 bg-gradient-to-b from-background/50 to-background/30 hover:border-primary/30 transition-all duration-500"
              >
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-10 ${feature.gradient} rounded-2xl transition-opacity duration-500`}
                />
                <div
                  className={`inline-flex p-4 rounded-xl ${feature.gradient} mb-6`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-5">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex p-4 rounded-xl bg-primary/5 mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/*  */}
      <section className="py-32 relative bg-gradient-to-b from-background/50 to-background">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mb-12 mx-auto">
            Join hundrens of creators who use Chromanvas to bring their ideas to
            life. Start your creative journey today.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/canvas"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/25"
            >
              Launch Canvas
              <Sparkles className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/*  Footer */}
      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">Chromanvas</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link
                href="https://github.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Chromanvas. All rights reserved.
            </p>
            <nav className="flex items-center space-x-6">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
