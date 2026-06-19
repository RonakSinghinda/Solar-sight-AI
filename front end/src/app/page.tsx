"use client";

import React from 'react';
import Navbar from '@/components/marketing/Navbar';
import HeroSection from '@/components/marketing/HeroSection';
import AboutSection from '@/components/marketing/AboutSection';
import FeaturesSection from '@/components/marketing/FeaturesSection';
import DashboardSection from '@/components/marketing/DashboardSection';
import WorkflowSection from '@/components/marketing/WorkflowSection';
import BenefitsSection from '@/components/marketing/BenefitsSection';
import TestimonialsSection from '@/components/marketing/TestimonialsSection';
import FAQSection from '@/components/marketing/FAQSection';
import FinalCTASection from '@/components/marketing/FinalCTASection';
import Footer from '@/components/marketing/Footer';

export default function LandingPage() {
  return (
    <div className="relative w-full min-h-screen bg-background text-primary overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <DashboardSection />
        <WorkflowSection />
        <BenefitsSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
}
