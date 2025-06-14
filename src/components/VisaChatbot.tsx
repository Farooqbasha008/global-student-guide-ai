
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
  Paperclip
} from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const VisaChatbot = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello ${user?.name}! I'm your visa assistant. I can help you with visa requirements, documentation, and application processes for ${user?.preferredCountries?.join(', ') || 'your preferred countries'}. What would you like to know?`,
      timestamp: new Date(),
      category: 'greeting'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef(null);

  // Mock knowledge base for RAG-style responses
  const knowledgeBase = {
    'usa-visa': {
      requirements: ['Valid passport', 'I-20 form from university', 'SEVIS fee payment', 'DS-160 form', 'Visa interview appointment'],
      documents: ['Academic transcripts', 'Financial documentation', 'Bank statements', 'Sponsor affidavit'],
      timeline: '2-4 months before travel',
      tips: ['Prepare for visa interview', 'Show strong ties to home country', 'Demonstrate financial stability']
    },
    'canada-visa': {
      requirements: ['Valid passport', 'Letter of acceptance', 'Proof of financial support', 'Medical exam', 'Police clearance'],
      documents: ['Academic records', 'Language test results', 'Statement of purpose', 'Financial statements'],
      timeline: '1-3 months processing time',
      tips: ['Apply online through IRCC', 'Provide biometrics', 'Show intent to leave Canada after studies']
    },
    'uk-visa': {
      requirements: ['CAS from university', 'Valid passport', 'TB test results', 'Financial evidence', 'English proficiency'],
      documents: ['Academic qualifications', 'ATAS certificate (if required)', 'Financial documents', 'Maintenance funds'],
      timeline: '3 weeks for standard processing',
      tips: ['Use gov.uk official website', 'Provide accurate information', 'Keep all original documents']
    }
  };

  const quickQuestions = [
    "What documents do I need for a US student visa?",
    "How long does visa processing take?",
    "What are the financial requirements?",
    "How to prepare for visa interview?",
    "Can I work while studying?",
    "What if my visa gets rejected?"
  ];

  const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    let response = "";
    let category = "general";

    // Simple keyword matching for demo purposes
    if (message.includes('document') || message.includes('requirement')) {
      const country = user?.preferredCountries?.[0]?.toLowerCase() || 'usa';
      const countryKey = `${country.replace(' ', '-')}-visa`;
      const info = knowledgeBase[countryKey] || knowledgeBase['usa-visa'];
      
      response = `For ${country.toUpperCase()} student visa, you'll need:\n\n${info.requirements.map(req => `• ${req}`).join('\n')}\n\nRequired documents:\n${info.documents.map(doc => `• ${doc}`).join('\n')}\n\nProcessing timeline: ${info.timeline}`;
      category = "documents";
    } else if (message.includes('interview')) {
      response = `Here are key tips for your visa interview:\n\n• Be honest and confident\n• Explain your study plans clearly\n• Show financial stability\n• Demonstrate ties to your home country\n• Practice common questions\n• Dress professionally\n• Arrive early with all documents\n\nWould you like specific interview questions to practice?`;
      category = "interview";
    } else if (message.includes('financial') || message.includes('money') || message.includes('fund')) {
      response = `Financial requirements vary by country and program:\n\n• Tuition fees (varies by university)\n• Living expenses (${user?.budget || '$20,000-$50,000'} annually)\n• Bank statements (3-6 months)\n• Sponsor affidavit (if applicable)\n• Scholarship documents (if any)\n\nTip: Maintain consistent bank balance and avoid large deposits just before application.`;
      category = "financial";
    } else if (message.includes('reject') || message.includes('denied') || message.includes('refuse')) {
      response = `If your visa application is rejected:\n\n• Review the rejection reason carefully\n• Address specific concerns mentioned\n• Gather additional supporting documents\n• Consider reapplying after strengthening your case\n• Consult with an immigration lawyer if needed\n\nCommon rejection reasons: Insufficient funds, weak ties to home country, incomplete documentation, or inconsistent information.`;
      category = "rejection";
    } else if (message.includes('work') || message.includes('job')) {
      response = `Work permissions for international students:\n\n• USA: 20 hours/week on-campus, OPT after graduation\n• Canada: 20 hours/week off-campus with study permit\n• UK: 20 hours/week during studies, graduate route available\n• Australia: Unlimited hours during breaks, 48 hours/fortnight during studies\n\nAlways check specific work conditions on your visa!`;
      category = "work";
    } else if (message.includes('timeline') || message.includes('time') || message.includes('when')) {
      response = `Visa application timeline:\n\n• Start 3-4 months before travel\n• Document preparation: 2-4 weeks\n• Application submission: 1 week\n• Processing time: 2-8 weeks (varies by country)\n• Interview scheduling: 1-4 weeks wait time\n\nApply early to avoid delays! Some countries have peak seasons with longer processing times.`;
      category = "timeline";
    } else {
      response = `I understand you're asking about "${userMessage}". Let me help you with that.\n\nFor specific visa guidance, I can assist with:\n• Document requirements\n• Application processes\n• Interview preparation\n• Financial requirements\n• Timeline planning\n\nCould you be more specific about what aspect you'd like to know more about?`;
      category = "general";
    }

    return { content: response, category };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
      category: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: botResponse.content,
        timestamp: new Date(),
        category: botResponse.category
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'documents': return <FileText className="h-4 w-4" />;
      case 'interview': return <User className="h-4 w-4" />;
      case 'financial': return <CheckCircle className="h-4 w-4" />;
      case 'timeline': return <Clock className="h-4 w-4" />;
      case 'rejection': return <AlertCircle className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'documents': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-green-100 text-green-800';
      case 'financial': return 'bg-yellow-100 text-yellow-800';
      case 'timeline': return 'bg-purple-100 text-purple-800';
      case 'rejection': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Chat Interface */}
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            Visa Assistant
          </CardTitle>
          <CardDescription>
            Get instant help with visa requirements and documentation
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
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
                  
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`rounded-lg p-3 ${
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
                      {message.category !== 'user' && message.category !== 'greeting' && (
                        <Badge variant="secondary" className={`${getCategoryColor(message.category)} text-xs`}>
                          {getCategoryIcon(message.category)}
                          <span className="ml-1 capitalize">{message.category}</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about visa requirements, documents, or processes..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Questions</CardTitle>
          <CardDescription>Click on common questions to get instant answers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start text-left h-auto p-3"
                onClick={() => handleQuickQuestion(question)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  );
};

export default VisaChatbot;
