import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatAssistant from "./components/ChatAssistant";
import Home from "./pages/Home";
import EmergencySOS from "./pages/EmergencySOS";
import ReportCrime from "./pages/ReportCrime";
import SafetyTips from "./pages/SafetyTips";
import Helplines from "./pages/Helplines";

// Scrolls to the top when the page changes.
// If the link has a #section (like /#contacts), it scrolls to that section instead.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      {/* Lets keyboard users skip the navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-berry focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sos" element={<EmergencySOS />} />
          <Route path="/report" element={<ReportCrime />} />
          <Route path="/tips" element={<SafetyTips />} />
          <Route path="/helplines" element={<Helplines />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      {/* Floating AI assistant, available on every page */}
      <ChatAssistant />
    </div>
  );
}
