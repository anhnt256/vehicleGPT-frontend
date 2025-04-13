import { useState } from 'react';
import { sendMessage as sendMessageApi } from '@/services/api';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string): Promise<string> => {
    try {
      setIsLoading(true);

      // Call API
      const response = await sendMessageApi(content);

      if (!response || !response.response || !response.response.output) {
        throw new Error('Invalid response format from server');
      }

      // Format the response output
      const formattedOutput = response.response.output
        // Remove redundant asterisks at the start of lines
        .replace(/^\s*\*/gm, '')
        // Remove redundant dots at the end of lines that have another dot in parentheses
        .replace(/\.\s*\([^)]*\)\./g, ' ($1)')
        // Keep bold markers
        .replace(/\*\*/g, '**')
        // Add line break before numbered items
        .replace(/(\d+)\.\s+/g, '\n$1. ')
        // Keep double line breaks
        .replace(/\n\n/g, '\n\n')
        // Format list items
        .replace(/^\s*[•●]/gm, '•')
        // Remove extra spaces at the start of lines
        .replace(/^\s+/gm, '')
        // Replace multiple line breaks with double
        .replace(/\n{3,}/g, '\n\n')
        // Clean up multiple spaces
        .replace(/\s{2,}/g, ' ')
        // Trim whitespace
        .trim();

      return formattedOutput;
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
};
