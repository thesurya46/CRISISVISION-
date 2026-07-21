import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { ArrowRight, AlertTriangle, MapPin, Users, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-[#00d9ff]" />
            <span className="text-xl font-bold neon-cyan">CrisisVision AI</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-[#00d9ff] text-[#0a0e27] hover:bg-[#00e5ff] font-semibold"
                onClick={() => startLogin()}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(0, 217, 255, 0.05) 25%, rgba(0, 217, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.05) 75%, rgba(0, 217, 255, 0.05) 76%, transparent 77%, transparent),
                              linear-gradient(90deg, transparent 24%, rgba(0, 217, 255, 0.05) 25%, rgba(0, 217, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.05) 75%, rgba(0, 217, 255, 0.05) 76%, transparent 77%, transparent)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        {/* Gradient orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#00d9ff] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#ff006e] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" />

        <div className="relative z-10 container max-w-4xl mx-auto px-4 text-center">
          <div className="mb-6 inline-block">
            <div className="px-4 py-2 rounded-full border border-[#00d9ff]/30 bg-[#00d9ff]/5">
              <p className="text-sm font-medium text-[#00d9ff]">
                Real-Time Disaster Intelligence
              </p>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="neon-cyan">Crisis</span>
            <span className="text-white">Vision</span>
            <span className="neon-red"> AI</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Harness the power of artificial intelligence to predict, respond to, and manage
            disasters with unprecedented speed and precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              className="bg-[#00d9ff] text-[#0a0e27] hover:bg-[#00e5ff] font-bold text-lg px-8 glow-cyan"
              onClick={() => startLogin()}
            >
              Get Started <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#ff006e]/50 text-[#ff006e] hover:bg-[#ff006e]/10 font-bold text-lg px-8"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-20 border-t border-border/30">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00d9ff] mb-2">24/7</div>
              <p className="text-gray-400">Real-Time Monitoring</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#ff006e] mb-2">AI-Powered</div>
              <p className="text-gray-400">Predictions & Analysis</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#00d9ff] mb-2">Global</div>
              <p className="text-gray-400">Disaster Coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 border-t border-border/30">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="neon-cyan">Powerful</span> Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-6 rounded-lg border border-[#00d9ff]/20 bg-card hover:bg-card/80 hover:border-[#00d9ff]/50 transition-all duration-300 glow-cyan">
              <MapPin className="w-8 h-8 text-[#00d9ff] mb-4" />
              <h3 className="text-xl font-bold mb-2">Interactive Maps</h3>
              <p className="text-gray-400">
                Real-time disaster event tracking with heatmap overlays and shelter locations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-lg border border-[#ff006e]/20 bg-card hover:bg-card/80 hover:border-[#ff006e]/50 transition-all duration-300 glow-red">
              <AlertTriangle className="w-8 h-8 text-[#ff006e] mb-4" />
              <h3 className="text-xl font-bold mb-2">Alert Feed</h3>
              <p className="text-gray-400">
                Incoming disaster events with severity badges and urgency scores.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-lg border border-[#00d9ff]/20 bg-card hover:bg-card/80 hover:border-[#00d9ff]/50 transition-all duration-300 glow-cyan">
              <Zap className="w-8 h-8 text-[#00d9ff] mb-4" />
              <h3 className="text-xl font-bold mb-2">AI Predictions</h3>
              <p className="text-gray-400">
                Machine learning models predict disaster severity and recommend response actions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 rounded-lg border border-[#ff006e]/20 bg-card hover:bg-card/80 hover:border-[#ff006e]/50 transition-all duration-300 glow-red">
              <Users className="w-8 h-8 text-[#ff006e] mb-4" />
              <h3 className="text-xl font-bold mb-2">Resource Management</h3>
              <p className="text-gray-400">
                Track personnel, vehicles, and supplies across disaster zones.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-6 rounded-lg border border-[#00d9ff]/20 bg-card hover:bg-card/80 hover:border-[#00d9ff]/50 transition-all duration-300 glow-cyan">
              <AlertTriangle className="w-8 h-8 text-[#00d9ff] mb-4" />
              <h3 className="text-xl font-bold mb-2">Weather Intelligence</h3>
              <p className="text-gray-400">
                Real-time weather data visualization per disaster zone.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-6 rounded-lg border border-[#ff006e]/20 bg-card hover:bg-card/80 hover:border-[#ff006e]/50 transition-all duration-300 glow-red">
              <Zap className="w-8 h-8 text-[#ff006e] mb-4" />
              <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
              <p className="text-gray-400">
                Chat with an AI expert for disaster response guidance and protocols.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 border-t border-border/30">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Disaster Response?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join emergency response teams worldwide using CrisisVision AI to save lives.
          </p>
          <Button
            size="lg"
            className="bg-[#ff006e] text-white hover:bg-[#ff1493] font-bold text-lg px-8 glow-red"
            onClick={() => startLogin()}
          >
            Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 bg-card/50">
        <div className="container max-w-6xl mx-auto px-4 text-center text-gray-500">
          <p>© 2026 CrisisVision AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
