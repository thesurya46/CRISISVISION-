import { useAuth } from "@/_core/hooks/useAuth";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import { useState } from "react";

export default function AIAssistant() {
  const { isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "You are an expert disaster response coordinator with deep knowledge of emergency management, disaster protocols, resource allocation, and crisis communication. Provide actionable, evidence-based guidance for disaster response scenarios. Always prioritize safety and life-saving measures. Be concise but thorough in your responses.",
    },
    {
      role: "assistant",
      content: "Hello! I'm your Disaster Response Expert. I'm here to help you with emergency management strategies, evacuation procedures, resource allocation, and crisis communication. What would you like to know?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message to chat
    const userMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Mock AI response for now - in production, call tRPC LLM endpoint
      const mockResponses = [
        "Based on the current disaster parameters, I recommend prioritizing evacuation of high-density areas first. Coordinate with local authorities to establish clear evacuation routes.",
        "For resource allocation, consider the affected population size and severity level. Deploy personnel to critical zones first, then distribute supplies based on shelter capacity.",
        "In crisis situations, maintain clear communication channels with all stakeholders. Use multiple communication methods to ensure message delivery to affected populations.",
        "The severity assessment should factor in population density, infrastructure damage, and resource availability. High severity requires immediate response coordination.",
      ];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const assistantMessage: Message = { role: "assistant", content: randomResponse };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-400">Please sign in to access the AI assistant.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold neon-cyan">AI Assistant</h1>
          <p className="text-gray-400 mt-1">Expert guidance on disaster response and protocols</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Box */}
          <div className="lg:col-span-3">
            <Card className="border border-[#00d9ff]/30 bg-card/50 glow-cyan h-[600px] flex flex-col">
              <CardHeader className="border-b border-border/30">
                <CardTitle>Disaster Response Expert</CardTitle>
                <CardDescription>
                  Ask questions about disaster management, response protocols, and emergency procedures
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-0">
                <AIChatBox
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder="Ask me about disaster response strategies, evacuation procedures, resource allocation, or emergency protocols..."
              />
              </CardContent>
            </Card>
          </div>

          {/* Quick Tips Sidebar */}
          <div className="space-y-4">
            <Card className="border border-[#ff006e]/30 bg-card/50 glow-red">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[#ff006e]" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Badge className="bg-[#ff006e]/20 text-[#ff006e] border-[#ff006e]/30 border mb-2">
                    Evacuation
                  </Badge>
                  <p className="text-xs text-gray-400">Ask about safe evacuation routes and procedures</p>
                </div>
                <div>
                  <Badge className="bg-[#00d9ff]/20 text-[#00d9ff] border-[#00d9ff]/30 border mb-2">
                    Resources
                  </Badge>
                  <p className="text-xs text-gray-400">Get guidance on resource allocation and management</p>
                </div>
                <div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border mb-2">
                    First Aid
                  </Badge>
                  <p className="text-xs text-gray-400">Learn emergency medical response procedures</p>
                </div>
                <div>
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 border mb-2">
                    Communication
                  </Badge>
                  <p className="text-xs text-gray-400">Understand crisis communication best practices</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[#00d9ff]/30 bg-card/50 glow-cyan">
              <CardHeader>
                <CardTitle className="text-lg">Common Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full text-left p-2 rounded-lg hover:bg-card/50 transition-colors text-sm text-gray-400 hover:text-[#00d9ff]">
                  How to coordinate evacuation?
                </button>
                <button className="w-full text-left p-2 rounded-lg hover:bg-card/50 transition-colors text-sm text-gray-400 hover:text-[#00d9ff]">
                  Resource allocation strategies
                </button>
                <button className="w-full text-left p-2 rounded-lg hover:bg-card/50 transition-colors text-sm text-gray-400 hover:text-[#00d9ff]">
                  Emergency communication protocols
                </button>
                <button className="w-full text-left p-2 rounded-lg hover:bg-card/50 transition-colors text-sm text-gray-400 hover:text-[#00d9ff]">
                  Disaster severity assessment
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
