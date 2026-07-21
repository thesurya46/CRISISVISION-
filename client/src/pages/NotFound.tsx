import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background overflow-hidden">
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

      <div className="relative z-10 w-full max-w-lg mx-4">
        <Card className="border border-[#ff006e]/30 bg-card/50 backdrop-blur-sm glow-red">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 rounded-full animate-pulse bg-[#ff006e]/20" />
                <AlertTriangle className="relative h-16 w-16 text-[#ff006e]" />
              </div>
            </div>

            <h1 className="text-6xl font-bold neon-red mb-2">404</h1>

            <h2 className="text-xl font-semibold text-gray-300 mb-4">
              Page Not Found
            </h2>

            <p className="text-gray-400 mb-8 leading-relaxed">
              The page you are looking for doesn't exist.
              <br />
              It may have been moved or deleted.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleGoHome}
                className="bg-[#00d9ff] text-[#0a0e27] hover:bg-[#00e5ff] font-bold px-6 py-2.5 glow-cyan"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
