import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { KeyboardAwareInput } from "@/components/ui/KeyboardAwareInput";
import PenIcon from "../assets/icons/News feed-Black.svg";
import DotsIcon from "../assets/icons/Community.svg";
import ProfileIcon from "../assets/icons/Profile.svg";

// Define message type
interface Message {
  id: string;
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
    username: 'random username',
    content: 'achieved the sanity level which i craved for years of my life',
    groupId: 'group1',
    groupName: 'morning running group',
    createdAt: new Date().toISOString(),
    avatar: ''
  },
  {
    id: '2',
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
    <div className="fitness-group-page min-h-screen bg-white flex flex-col items-center w-full">
      {/* Top Navigation Bar */}
      <div className="fitness-top-nav-container w-full flex justify-center pt-4 pb-2">
        <div className="fitness-top-nav-bar flex w-[95vw] max-w-[400px] h-[64px] bg-white rounded-[40px] shadow-md items-center px-2 gap-2">
          {/* Share Feelings Button */}
          <button className="fitness-share-button flex items-center gap-3 px-6 py-3 bg-[#FCDF4D] border border-white rounded-[500px] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] h-[56px] min-w-0 flex-shrink-0">
            <img src={PenIcon} alt="Share" className="fitness-share-icon w-8 h-8" />
            <span className="fitness-share-text font-['Happy_Monkey'] text-[22px] text-white lowercase leading-[18px] tracking-wide">share your feels</span>
          </button>
          
          {/* Community Button */}
          <button className="fitness-community-button flex items-center justify-center w-12 h-12 rounded-full">
            <img src={DotsIcon} alt="Community" className="fitness-community-icon w-8 h-8" />
          </button>
          
          {/* Profile Button */}
          <button className="fitness-profile-button flex items-center justify-center w-12 h-12 rounded-full">
            <img src={ProfileIcon} alt="Profile" className="fitness-profile-icon w-8 h-8" />
          </button>
        </div>
      </div>
      
      {/* Group Filter Tabs */}
      <div className="fitness-group-filters-container w-full flex justify-center">
        <div className="fitness-group-filters-scroll flex gap-3 px-2 w-full max-w-[400px] overflow-x-auto pb-2">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`fitness-group-filter-chip px-4 py-2 rounded-[20px] border border-[#04C4D5] whitespace-nowrap min-w-fit transition-all duration-150 font-['Happy_Monkey'] text-[#148BAF] text-[15px] lowercase ${
                selectedGroup === group.id || (group.id === 'all' && !selectedGroup)
                  ? 'fitness-group-filter-active bg-[rgba(83,252,255,0.1)] border-2' : 'bg-transparent border'
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Messages Feed */}
      <div className="fitness-messages-feed w-full flex flex-col items-center px-2 pt-2 pb-24">
        <div className="fitness-messages-list flex flex-col gap-4 w-full max-w-[400px]">
          {filteredMessages.map(message => (
            <div key={message.id} className="fitness-message-card flex flex-row items-center gap-3 w-full bg-white border border-[#04C4D5] rounded-[12px] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] px-3 py-2">
              {/* User Profile Picture */}
              <div className="fitness-message-avatar w-10 h-10 rounded-full bg-[#D9D9D9] flex-shrink-0" />
              
              {/* Message Content Container */}
              <div className="fitness-message-content flex flex-col justify-center gap-1 w-full">
                {/* Username and Group Info */}
                <div className="fitness-message-author font-['Happy_Monkey'] text-[#148BAF] text-[13px] lowercase leading-[16px]">
                  {message.username}{message.groupName ? ` | ${message.groupName}` : ''}
                </div>
                
                {/* Message Text */}
                <div className="fitness-message-text font-['Happy_Monkey'] text-[#148BAF] text-[13px] lowercase leading-[16px]">
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Message Compose Bar */}
      <div className="fitness-compose-wrapper fixed w-full max-w-md h-[52px] left-1/2 -translate-x-1/2 bottom-5 px-5">
        <div className="fitness-compose-bar w-full h-full bg-[#DEFFFF] border border-white drop-shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[100px] flex items-center px-3 gap-2.5">
          {/* Message Input Field */}
          <KeyboardAwareInput
            type="text"
            placeholder="share your thoughts (to all groups)"
            className="fitness-compose-input flex-1 h-full bg-transparent border-none outline-none text-[#0097AA] text-xs font-['Happy_Monkey'] lowercase"
            value={newMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          
          {/* Emoji Button */}
          <button className="fitness-emoji-button w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#04C4D5" className="fitness-emoji-icon">
              <circle cx="12" cy="12" r="10" stroke="#04C4D5" strokeWidth="1" />
              <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#04C4D5" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8.5" cy="9.5" r="1.5" fill="#04C4D5" />
              <circle cx="15.5" cy="9.5" r="1.5" fill="#04C4D5" />
            </svg>
          </button>
          
          {/* Post Button */}
          <button 
            className="fitness-post-button h-8 px-2.5 bg-white rounded-full flex items-center justify-center"
            onClick={handleSendMessage}
          >
            <span className="fitness-post-text text-[#148BAF] text-xs font-['Happy_Monkey'] lowercase">post</span>
          </button>
        </div>
      </div>
    </div>
  );
}
