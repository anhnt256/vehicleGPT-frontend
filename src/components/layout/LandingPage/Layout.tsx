import React from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20 bg-slate-100">{children}</main>
      <Footer />
    </div>
  );
};

export default LandingPageLayout;
