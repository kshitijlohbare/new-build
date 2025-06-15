import { useState, useEffect } from 'react';
import { ThumbsUp, MessageCircle, Link2, Paperclip, X, Pin } from 'lucide-react';
import { KeyboardAwareInput, KeyboardAwareTextarea } from "@/components/ui/KeyboardAwareInput";

// Define a custom User interface
interface User {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
}

// Types for posts, comments, reactions
export interface GroupPost {
  id: number;
  group_id: number;
  user_id: string;
  content: string;
  image_url?: string;
  link_url?: string;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  is_deleted: boolean;
  user_profile?: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
  comments?: GroupPostComment[];
  reactions?: GroupPostReactionSummary[];
}

export interface GroupPostComment {
  id: number;
  post_id: number;
  user_id: string;
  content: string;
  created_at: string;
  is_deleted: boolean;
  user_profile?: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

export interface GroupPostReactionSummary {
  reaction_type: string;
  count: number;
  reacted: boolean;
}

interface GroupFeedProps {
  groupId: number;
  user: User;
}

const DEMO_POSTS: GroupPost[] = [
  {
    id: 1,
    group_id: 1,
    user_id: 'demo-user-1',
    content: 'Welcome to our group! Share your fitness journey, photos, and tips here. 💪',
    image_url: undefined,
    link_url: undefined,
    created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3600 * 1000).toISOString(),
    is_pinned: true,
    is_deleted: false,
    user_profile: { username: 'admin', display_name: 'Group Admin' },
    comments: [
      {
        id: 1,
        post_id: 1,
        user_id: 'demo-user-2',
        content: 'Excited to be here! Let’s motivate each other.',
        created_at: new Date(Date.now() - 3500 * 1000).toISOString(),
        is_deleted: false,
        user_profile: { username: 'fitfan', display_name: 'Fit Fan' }
      }
    ],
    reactions: [
      { reaction_type: 'like', count: 3, reacted: false },
      { reaction_type: 'love', count: 1, reacted: false }
    ]
  },
  {
    id: 2,
    group_id: 1,
    user_id: 'demo-user-2',
    content: 'Just finished a 5k run! 🏃‍♂️ Anyone else running today?',
    image_url: undefined,
    link_url: undefined,
    created_at: new Date(Date.now() - 1800 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1800 * 1000).toISOString(),
    is_pinned: false,
    is_deleted: false,
    user_profile: { username: 'fitfan', display_name: 'Fit Fan' },
    comments: [],
    reactions: [
      { reaction_type: 'like', count: 2, reacted: false }
    ]
  }
];

export default function GroupFeed({ groupId, user }: GroupFeedProps) {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [link, setLink] = useState('');

  // Demo mode: use static posts
  useEffect(() => {
    setPosts(DEMO_POSTS.map(p => ({ ...p, group_id: groupId })));
  }, [groupId]);

  const handlePost = () => {
    if (!newPost.trim() && !image && !link.trim()) return;
    // In real mode, upload image and create post in DB
    const demoPost: GroupPost = {
      id: Date.now(),
      group_id: groupId,
      user_id: user.id,
      content: newPost,
      image_url: image ? URL.createObjectURL(image) : undefined,
      link_url: link || undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_pinned: false,
      is_deleted: false,
      user_profile: { username: user.username, display_name: user.display_name },
      comments: [],
      reactions: []
    };
    setPosts([demoPost, ...posts]);
    setNewPost('');
    setImage(null);
    setLink('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-4 mb-8">
      {/* Post creation */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col gap-3">
        <KeyboardAwareTextarea
          className="w-full border rounded-lg p-3 font-happy-monkey text-base resize-none focus:ring-2 focus:ring-[#04C4D5]"
          placeholder="Share something with your group..."
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          rows={2}
        />
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 cursor-pointer text-[#148BAF]">
            <Paperclip className="w-4 h-4" />
            <input type="file" accept="image/*" className="hidden" onChange={e => setImage(e.target.files?.[0] || null)} />
            <span className="text-xs">Image</span>
          </label>
          <KeyboardAwareInput
            type="url"
            className="border rounded px-2 py-1 text-xs font-happy-monkey w-40"
            placeholder="Add a link (optional)"
            value={link}
            onChange={e => setLink(e.target.value)}
          />
          <button
            className="ml-auto px-4 py-2 rounded-lg bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white font-happy-monkey text-sm shadow hover:scale-105 transition-all"
            onClick={handlePost}
          >
            Post
          </button>
        </div>
        {image && (
          <div className="relative mt-2 w-32">
            <img src={URL.createObjectURL(image)} alt="preview" className="rounded-lg w-full" />
            <button className="absolute top-1 right-1 bg-white rounded-full p-1 shadow" onClick={() => setImage(null)}><X className="w-4 h-4 text-red-500" /></button>
          </div>
        )}
      </div>
      {/* Feed */}
      <div className="flex flex-col gap-5">
        {posts.length === 0 && (
          <div className="text-center text-gray-400 font-happy-monkey">No posts yet. Be the first to share!</div>
        )}
        {posts
          .sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0) || new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .map(post => (
          <div key={post.id} className={`bg-white rounded-xl shadow p-4 relative ${post.is_pinned ? 'border-2 border-[#04C4D5]' : ''}`}>
            {post.is_pinned && (
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[#04C4D5] font-happy-monkey text-xs"><Pin className="w-4 h-4" />Pinned</div>
            )}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-[#E6F9FA] flex items-center justify-center font-bold text-[#148BAF] text-lg">
                {post.user_profile?.display_name?.[0] || 'U'}
              </div>
              <div>
                <div className="font-happy-monkey text-[#148BAF] text-sm">{post.user_profile?.display_name || 'User'}</div>
                <div className="text-xs text-gray-400 font-happy-monkey">{new Date(post.created_at).toLocaleString()}</div>
              </div>
            </div>
            <div className="font-happy-monkey text-base mb-2 whitespace-pre-line">{post.content}</div>
            {post.image_url && (
              <img src={post.image_url} alt="post" className="rounded-lg mb-2 max-h-64 object-cover" />
            )}
            {post.link_url && (
              <a href={post.link_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#04C4D5] underline text-xs mb-2"><Link2 className="w-4 h-4" />{post.link_url}</a>
            )}
            <div className="flex items-center gap-4 mt-2">
              <button className="flex items-center gap-1 text-gray-500 hover:text-[#04C4D5] text-xs font-happy-monkey">
                <ThumbsUp className="w-4 h-4" />{post.reactions?.find(r => r.reaction_type === 'like')?.count || 0} Like
              </button>
              <button className="flex items-center gap-1 text-gray-500 hover:text-[#04C4D5] text-xs font-happy-monkey">
                <MessageCircle className="w-4 h-4" />{post.comments?.length || 0} Comment
              </button>
            </div>
            {/* Comments */}
            {post.comments && post.comments.length > 0 && (
              <div className="mt-3 border-t pt-2 flex flex-col gap-2">
                {post.comments.map(comment => (
                  <div key={comment.id} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#E6F9FA] flex items-center justify-center font-bold text-[#148BAF] text-sm">
                      {comment.user_profile?.display_name?.[0] || 'U'}
                    </div>
                    <div className="bg-[#F7FFFF] rounded-lg px-3 py-1 font-happy-monkey text-xs">
                      <span className="text-[#148BAF] font-bold mr-1">{comment.user_profile?.display_name || 'User'}:</span>
                      {comment.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
