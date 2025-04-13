import { ChatBox } from '@/components/chat/ChatBox';

export const ChatAssistant = () => {
  return (
    <div className="h-full p-4">
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Chat Assistant</h2>
          <p className="text-muted-foreground">Ask me anything</p>
        </div>
        <div className="flex-1">
          <ChatBox />
        </div>
      </div>
    </div>
  );
};
