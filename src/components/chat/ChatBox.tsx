import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import type { Components } from 'react-markdown';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatBoxProps {
  onSendMessage: (message: string) => Promise<string>;
  isLoading: boolean;
}

const MessageContent = ({ content }: { content: string }) => {
  const components: Components = {
    p: ({ children }) => <p className="text-sm leading-relaxed mb-4 text-slate-100">{children}</p>,
    h1: ({ children }) => (
      <h1 className="text-xl font-bold mb-4 text-emerald-400 border-b border-emerald-400/20 pb-2">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg font-semibold mb-3 text-emerald-300 border-b border-emerald-300/20 pb-1">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-medium mb-2 text-emerald-200">{children}</h3>
    ),
    ul: ({ children }) => <ul className="list-none space-y-2 mb-4 ml-4">{children}</ul>,
    ol: ({ children }) => (
      <ol className="list-decimal space-y-2 mb-4 ml-6 text-slate-100 [&>li]:mt-2">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="text-sm flex items-start gap-2 text-slate-100">
        <span className="text-emerald-400 mt-1">•</span>
        <span className="flex-1 whitespace-pre-wrap">{children}</span>
      </li>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-slate-300 bg-slate-300/5 px-1.5 py-0.5 rounded">{children}</em>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-emerald-400/50 pl-4 my-4 italic text-slate-300 bg-slate-800/30 py-2 rounded-r">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-slate-800 px-2 py-0.5 rounded text-emerald-300 text-sm font-mono">
        {children}
      </code>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-slate-800/50 text-emerald-300">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-slate-700/50">{children}</tbody>,
    tr: ({ children }) => <tr className="hover:bg-slate-800/30">{children}</tr>,
    th: ({ children }) => <th className="px-4 py-2 text-left font-medium">{children}</th>,
    td: ({ children }) => <td className="px-4 py-2 text-slate-100">{children}</td>,
    hr: () => <hr className="border-slate-700/50 my-6" />,
    img: (props) => (
      <img
        {...props}
        className="rounded-lg shadow-lg max-w-full h-auto my-4 border border-slate-700/50"
        alt={props.alt || ''}
      />
    ),
  };

  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export const ChatBox = ({ onSendMessage, isLoading: parentIsLoading }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isSending && !parentIsLoading) {
      const userMessage: Message = {
        id: Date.now().toString(),
        content: input,
        role: 'user',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      const currentInput = input.trim();
      setInput('');
      setIsSending(true);

      try {
        const response = await onSendMessage(currentInput);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error: any) {
        // Show error message in chat
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: '⚠️ ' + (error.message || 'An error occurred while processing your message.'),
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        // Also show toast
        toast.error(error.message || 'Failed to send message. Please try again.');
      } finally {
        setIsSending(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)] bg-slate-900/50 border-slate-700/50">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-3 group transition-opacity duration-200',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 ring-2 ring-emerald-500/20 transition-transform duration-200 group-hover:scale-105">
                  <AvatarImage src="/bot-avatar.png" alt="AI Assistant" />
                  <AvatarFallback className="bg-emerald-950">
                    <Bot className="h-5 w-5 text-emerald-400" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'rounded-lg px-4 py-3 shadow-lg transition-all duration-200',
                  message.role === 'user'
                    ? 'bg-emerald-500/20 text-emerald-100 shadow-emerald-900/20 hover:bg-emerald-500/30'
                    : 'bg-slate-800/50 text-slate-100 shadow-slate-900/20 hover:bg-slate-800/70'
                )}
              >
                <MessageContent content={message.content} />
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="w-1 h-1 rounded-full bg-slate-400" />
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {message.role === 'user' && (
                <Avatar className="h-8 w-8 ring-2 ring-emerald-500/20 transition-transform duration-200 group-hover:scale-105">
                  <AvatarImage src="/user-avatar.png" alt="User" />
                  <AvatarFallback className="bg-emerald-950">
                    <User className="h-5 w-5 text-emerald-400" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {(isSending || parentIsLoading) && (
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 ring-2 ring-emerald-500/20">
                <AvatarImage src="/bot-avatar.png" alt="AI Assistant" />
                <AvatarFallback className="bg-emerald-950">
                  <Bot className="h-5 w-5 text-emerald-400" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-lg px-4 py-3 bg-slate-800/50 shadow-lg shadow-slate-900/20">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isSending || parentIsLoading}
            className="flex-1 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-400 focus-visible:ring-emerald-500"
          />
          <Button
            type="submit"
            disabled={isSending || parentIsLoading || !input.trim()}
            onClick={handleSubmit}
            className="h-10 w-10 p-0 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
