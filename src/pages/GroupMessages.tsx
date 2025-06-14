import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

// Define message type
interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  groupId?: string;
  groupName?: string;
  createdAt: string;
  avatar?: string;
}

// Mock data for demonstration
const mockMessages: Message[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'random username',
    content: 'achieved the sanity level which i craved for years of my life',
    groupId: 'group1',
    groupName: 'morning running group',
    createdAt: new Date().toISOString(),
    avatar: ''
  },
  {
    id: '2',
    userId: 'user2',
    username: 'random username',
    content: 'achieved the sanity level which i craved for years of my life',
    createdAt: new Date().toISOString(),
    avatar: ''
  }
];

export default function GroupMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Groups for the tabs at the top
  const groups = [
    { id: 'all', name: 'all groups', active: true },
    { id: 'group1', name: 'morning running group', active: false },
    { id: 'group2', name: 'yoga group', active: true },
    { id: 'group3', name: 'naval ravikant', active: false },
    { id: 'group4', name: 'andrew huberman', active: false }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      userId: user.id || 'unknown',
      username: user.email?.split('@')[0] || 'anonymous',
      content: newMessage,
      groupId: selectedGroup === 'all' ? undefined : selectedGroup || undefined,
      groupName: selectedGroup === 'all' ? undefined : groups.find(g => g.id === selectedGroup)?.name,
      createdAt: new Date().toISOString(),
      avatar: ''
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const filteredMessages = messages.filter(msg => {
    if (!selectedGroup || selectedGroup === 'all') return true;
    return msg.groupId === selectedGroup;
  });

  return (
    <div className="community-messages-container min-h-screen bg-white pt-1">
      {/* Main Content */}
      <div className="community-messages-main mx-auto w-full max-w-md flex flex-col items-center">
        {/* Group Selection Tabs */}
        <div className="community-group-tabs-wrapper w-full px-5 pt-4 mb-4 overflow-x-auto">
          <div className="community-group-tabs-container flex gap-2 min-w-max pb-2">
            {groups.map((group) => (
              <button 
                key={group.id}
                onClick={() => setSelectedGroup(group.id)}
                className={`community-group-tab px-2.5 py-2.5 rounded-[20px] border border-[#04C4D5] whitespace-nowrap ${
                  selectedGroup === group.id || (group.id === 'all' && !selectedGroup)
                    ? 'community-group-tab-active bg-[rgba(83,252,255,0.1)]'
                    : 'bg-transparent'
                }`}
              >
                <span className="community-group-tab-text text-xs font-['Happy_Monkey'] text-[#148BAF] lowercase">
                  {group.name}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        {/* Message Feed List */}
        <div className="community-message-feed w-full px-5 pt-2.5 mb-[70px]">
          <div className="community-message-list flex flex-col space-y-3 w-full">
            {filteredMessages.map(message => (
              <div key={message.id} className="community-message-card w-full rounded-lg overflow-hidden border border-[#04C4D5] drop-shadow-[1px_2px_4px_rgba(73,218,234,0.5)] p-2.5 flex gap-2.5">
                {/* User Profile Picture */}
                <div className="community-message-avatar w-8 h-8 rounded-lg bg-[#D9D9D9]"></div>
                
                {/* Message Content Container */}
                <div className="community-message-content flex-1 flex flex-col gap-1">
                  {/* Username and Group Header */}
                  <div className="community-message-author text-xs font-['Happy_Monkey'] text-[#148BAF] lowercase">
                    {message.username} {message.groupName && `| ${message.groupName}`}
                  </div>
                  
                  {/* Message Text Body */}
                  <div className="community-message-text text-xs font-['Happy_Monkey'] text-[#148BAF] lowercase">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom Input/Compose Bar */}
      <div className="community-compose-bar-wrapper fixed w-full max-w-md h-[52px] left-1/2 -translate-x-1/2 bottom-5 px-5">
        <div className="community-compose-bar w-full h-full bg-[#DEFFFF] border border-white drop-shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[100px] flex items-center px-3 gap-2.5">
          {/* Message Input Field */}
          <input
            type="text"
            placeholder="share your thoughts (to all groups)"
            className="community-compose-input flex-1 h-full bg-transparent border-none outline-none text-[#0097AA] text-xs font-['Happy_Monkey'] lowercase"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          
          {/* Emoji Selection Button */}
          <button className="community-emoji-button w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#04C4D5" className="community-emoji-icon">
              <circle cx="12" cy="12" r="10" stroke="#04C4D5" strokeWidth="1" />
              <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#04C4D5" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8.5" cy="9.5" r="1.5" fill="#04C4D5" />
              <circle cx="15.5" cy="9.5" r="1.5" fill="#04C4D5" />
            </svg>
          </button>
          
          {/* Post/Submit Button */}
          <button 
            className="community-post-button h-8 px-2.5 bg-white rounded-full flex items-center justify-center"
            onClick={handleSendMessage}
          >
            <span className="community-post-text text-[#148BAF] text-xs font-['Happy_Monkey'] lowercase">post</span>
          </button>
        </div>
      </div>
    </div>
  );
}
