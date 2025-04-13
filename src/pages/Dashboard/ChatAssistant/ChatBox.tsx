import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { sendMessage } from '@/services/api';
import { toast } from 'sonner';

interface ChatBoxProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatBox = ({ onSendMessage, isLoading }: ChatBoxProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      try {
        await sendMessage(message.trim());
        onSendMessage(message.trim());
        setMessage('');
      } catch (error) {
        toast.error('Failed to send message. Please try again.');
      }
    }
  };

  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-400 focus-visible:ring-emerald-500"
        />
        <Button
          type="submit"
          disabled={isLoading || !message.trim()}
          onClick={handleSubmit}
          className="h-10 w-10 p-0 bg-emerald-500 hover:bg-emerald-600 text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
