import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Bot, 
  User, 
  FileText, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Paperclip,
  Loader2,
  KeyRound,
  Settings
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { sendChatCompletion, ChatMessage } from '@/lib/novita-ai';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Add a proper interface for the user prop
interface User {
  name?: string;
  preferredCountries?: string[];
  academicInterests?: string[];
  budget?: string;
  novitaApiKey?: string;
}

// Define message type
type Message = {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  category?: string;
};

const VisaChatbot = ({ user }: { user?: User }) => {
  // State for chat messages
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const scrollAreaRef = useRef(null);

  // Initialize chat with a greeting message
  useEffect(() => {
    if (messages.length === 0) {
      const greetingMessage: Message = {
      id: 1,
      type: 'bot',
        content: `Hello ${user?.name || 'there'}! 👋 I'm your study abroad assistant. I'm here to help you with everything about studying abroad - from choosing universities and courses to visa requirements, accommodation, scholarships, and student life${user?.preferredCountries?.length ? ` in ${user.preferredCountries.join(', ')}` : ''}. What would you like to know?`,
      timestamp: new Date(),
      category: 'greeting'
    };
      setMessages([greetingMessage]);
    }
  }, [messages.length, user?.name, user?.preferredCountries]);

  // Quick questions for the user to select
  const quickQuestions = [
    "What documents do I need for a US student visa?",
    "How long does visa processing take?",
    "What are the financial requirements?",
    "How to prepare for visa interview?",
    "Can I work while studying?",
    "What if my visa gets rejected?"
  ];

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to the chat
    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      category: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Prepare conversation history for the AI
      const conversationHistory: ChatMessage[] = [
        {
          role: 'system',
          content: `You are an AI study abroad assistant. 
          The user's name is ${user?.name || 'Unknown'} and they are interested in studying in ${user?.preferredCountries?.join(', ') || 'various countries'}. 
          Their academic interests are ${user?.academicInterests?.join(', ') || 'not specified'}. 
          Their budget is ${user?.budget || 'not specified'}. 
          Provide helpful, accurate information about studying abroad, including university selection, visa requirements, application processes, documentation, interviews, and other related topics. 
          Be conversational but professional. Keep responses concise but informative.`
        }
      ];

      // Add previous messages to maintain conversation context (limit to last 10 messages)
      const recentMessages = messages.slice(-10);
      recentMessages.forEach(msg => {
        if (msg.type === 'user') {
          conversationHistory.push({ role: 'user', content: msg.content });
        } else if (msg.type === 'bot' && msg.category !== 'greeting') {
          conversationHistory.push({ role: 'assistant', content: msg.content });
        }
      });

      // Add the current user message
      conversationHistory.push({ role: 'user', content: inputMessage });

      // Only add thinking message if showThinking is true
      if (showThinking) {
      const tempBotMessage: Message = {
        id: messages.length + 2,
        type: 'bot',
        content: 'Thinking...',
        timestamp: new Date(),
        category: 'processing'
      };
      setMessages(prev => [...prev, tempBotMessage]);
      }

      // Check if user has provided an API key
      const apiKey = user?.novitaApiKey || import.meta.env.VITE_NOVITA_API_KEY;
      if (!apiKey) {
        toast({
          title: 'API Key Missing',
          description: 'Please add your Novita AI API key in your profile settings or environment variables.',
          variant: 'destructive'
        });
        throw new Error('API key not found');
      }

      // Get the response from Novita AI
      try {
        const response = await sendChatCompletion(
          conversationHistory,
          {
            temperature: 0.7,
            max_tokens: 1024
          },
          apiKey
        );

        // Process the response and update messages
        setMessages(prev => [...prev, {
          id: messages.length + 2,
          type: 'bot',
          content: response.content,
          timestamp: new Date(),
          category: determineCategory(response.content)
        }]);
      } catch (error) {
        console.error('Error generating response:', error);

        const errorMessage = error.toString();
        if (errorMessage.includes('API key') || errorMessage.includes('authentication') || errorMessage.includes('401')) {
          toast({
            title: 'API Key Error',
            description: 'There was an issue with your Novita AI API key. Please check that it is valid.',
            variant: 'destructive'
          });
        } else if (errorMessage.includes('CORS')) {
          toast({
            title: 'Connection Error',
            description: 'Unable to connect to the AI service. Please try again later.',
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Error',
            description: 'Failed to generate a response. Please try again.',
            variant: 'destructive'
          });
        }

        if (showThinking) {
          setMessages(prev => prev.filter(msg => msg.content !== 'Thinking...'));
        }
      }
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Check if the error is related to API key
      const errorMessage = error.toString();
      if (errorMessage.includes('API key') || errorMessage.includes('authentication') || errorMessage.includes('401')) {
        toast({
          title: 'API Key Error',
          description: 'There was an issue with your Novita AI API key. Please check that it is valid.',
          variant: 'destructive'
        });
      } else if (errorMessage.includes('CORS')) {
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to the AI service. Please try again later.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to generate a response. Please try again.',
          variant: 'destructive'
        });
      }

      // Remove the temporary bot message if there was an error and thinking state is shown
      if (showThinking) {
      setMessages(prev => prev.filter(msg => msg.content !== 'Thinking...'));
      }
    } finally {
      setIsTyping(false);
    }
  };

  // Function to handle quick question selection
  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Get icon for message category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'documents': return <FileText className="h-4 w-4" />;
      case 'interview': return <User className="h-4 w-4" />;
      case 'financial': return <CheckCircle className="h-4 w-4" />;
      case 'timeline': return <Clock className="h-4 w-4" />;
      case 'rejection': return <AlertCircle className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  // Get color for message category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'documents': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-green-100 text-green-800';
      case 'financial': return 'bg-yellow-100 text-yellow-800';
      case 'timeline': return 'bg-purple-100 text-purple-800';
      case 'rejection': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Added determineCategory function
  const determineCategory = (content: string): string => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('document') || lowerContent.includes('requirement')) return 'documents';
    if (lowerContent.includes('interview')) return 'interview';
    if (lowerContent.includes('financial') || lowerContent.includes('money') || lowerContent.includes('fund')) return 'financial';
    if (lowerContent.includes('reject') || lowerContent.includes('denied')) return 'rejection';
    if (lowerContent.includes('work') || lowerContent.includes('job')) return 'work';
    if (lowerContent.includes('timeline') || lowerContent.includes('time') || lowerContent.includes('when')) return 'timeline';
    return 'general';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col lg:col-span-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
              <CardTitle>Chatbot Assistant</CardTitle>
            {!user?.novitaApiKey && (
              <Badge variant="outline" className="ml-2 text-xs flex items-center gap-1">
                <KeyRound className="h-3 w-3" />
                API Key Missing
              </Badge>
            )}
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="show-thinking" className="text-sm text-gray-500">Show thinking state</Label>
              <Switch
                id="show-thinking"
                checked={showThinking}
                onCheckedChange={setShowThinking}
              />
            </div>
          </div>
          <CardDescription>
            Get instant help with visa requirements and documentation
            {!user?.novitaApiKey && (
              <span className="block text-xs mt-1 text-amber-600">
                Add your Novita AI API key in profile settings for enhanced responses
              </span>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.type === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <div className={`rounded-lg p-3 max-w-[80%] ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                        <p className="whitespace-pre-line text-sm">{message.content}</p>
                    </div>
                    
                    <div className={`flex items-center gap-2 mt-1 text-xs text-gray-500 ${
                      message.type === 'user' ? 'justify-end' : ''
                    }`}>
                      <span>{message.timestamp.toLocaleTimeString()}</span>
                      {message.category !== 'user' && message.category !== 'greeting' && message.category !== 'processing' && (
                        <Badge variant="secondary" className={`${getCategoryColor(message.category)} text-xs`}>
                          {getCategoryIcon(message.category)}
                          <span className="ml-1 capitalize">{message.category}</span>
                        </Badge>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about visa requirements, documents, or processes..."
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim() || isTyping}
              >
                {isTyping ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sidebar */}
      <div className="space-y-6">
      {/* Quick Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Questions</CardTitle>
          <CardDescription>Click on common questions to get instant answers</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto p-3"
                onClick={() => handleQuickQuestion(question)}
                disabled={isTyping}
              >
                {question}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Document Checklist</CardTitle>
          <CardDescription>Essential documents for your visa application</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">Core Documents</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-3 w-3" />
                  <span>Valid Passport</span>
                </div>
                <div className="flex items-center gap-2">
                  <Paperclip className="h-3 w-3" />
                  <span>University Acceptance Letter</span>
                </div>
                <div className="flex items-center gap-2">
                  <Paperclip className="h-3 w-3" />
                  <span>Financial Documentation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Paperclip className="h-3 w-3" />
                  <span>Academic Transcripts</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Additional Requirements</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-3 w-3" />
                  <span>English Proficiency Test</span>
                </div>
                <div className="flex items-center gap-2">
                  <Paperclip className="h-3 w-3" />
                  <span>Statement of Purpose</span>
                </div>
                <div className="flex items-center gap-2">
                  <Paperclip className="h-3 w-3" />
                  <span>Medical Examination</span>
                </div>
                <div className="flex items-center gap-2">
                  <Paperclip className="h-3 w-3" />
                  <span>Police Clearance Certificate</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default VisaChatbot;
