import React, { useState } from 'react';
import styled from 'styled-components';
import CommentInput from './CommentInput';

// Define prop interfaces for styled components
interface VoteButtonProps {
  active?: boolean;
}

interface VoteCountProps {
  color?: string;
}

interface CommentSectionProps {
  expanded: boolean;
}

interface CommentProps {
  level: number;
}

interface AvatarProps {
  color?: string;
}

interface CommentAvatarProps {
  color?: string;
}

// Define data types
interface CommentType {
  id: number;
  username: string;
  content: string;
  timestamp: string;
  avatar: string;
  likes: number;
  level?: number;
  replies?: CommentType[];
}

interface RedditThreadProps {
  id: number;
  username: string;
  community: string;
  timestamp: string;
  title?: string;
  content: string;
  media?: string;
  likes: number;
  comments: CommentType[];
  avatar?: string;
}

// Styled components matching Frame11 visual style
const ThreadContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 1px 2px 4px rgba(73, 217.90, 234, 0.50);
  outline: 1px var(--TEXTColor, #04C4D5) solid;
  outline-offset: -1px;
  margin-bottom: 12px;
  overflow: hidden;
`;

const ThreadHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  justify-content: flex-start;
  gap: 10px;
`;

const Avatar = styled.div<AvatarProps>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: \${props => props.color || '#FCDF4D'};
  flex-shrink: 0;
`;

const UserInfoContainer = styled.div`
  flex: 1 1 0;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
  display: inline-flex;
`;

const UserInfoRow = styled.div`
  align-self: stretch;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  display: inline-flex;
`;

const UsernameContainer = styled.div`
  flex: 1 1 0;
  align-self: stretch;
  padding-top: 2px;
  padding-bottom: 2px;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  display: flex;
`;

const Username = styled.span`
  color: var(--Primary, #148BAF);
  font-size: 12px;
  font-family: Happy Monkey;
  font-weight: 400;
  text-transform: lowercase;
  line-height: 16px;
  word-wrap: break-word;
`;

const CommunityTag = styled.div`
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 2px;
  padding-bottom: 2px;
  background: #FAF8EC;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: flex;
`;

const CommunityText = styled.span`
  color: var(--Primary, #148BAF);
  font-size: 12px;
  font-family: Happy Monkey;
  font-weight: 400;
  text-transform: lowercase;
  line-height: 16px;
  word-wrap: break-word;
`;

const PostTime = styled.div`
  color: var(--Primary, #148BAF);
  font-size: 12px;
  font-family: Happy Monkey;
  font-weight: 400;
  text-transform: lowercase;
  line-height: 16px;
  word-wrap: break-word;
  margin-top: 2px;
`;

const ThreadContent = styled.div`
  padding: 8px 10px;
  color: var(--Primary, #148BAF);
  font-size: 16px;
  font-family: Happy Monkey;
  font-weight: 400;
  text-transform: lowercase;
  line-height: 18px;
  word-wrap: break-word;
`;

const MediaContent = styled.div`
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  
  img {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
`;

const ThreadActions = styled.div`
  display: flex;
  padding: 8px 10px;
  align-items: center;
  gap: 10px;
`;

const VoteContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const VoteButton = styled.button<VoteButtonProps>`
  background: none;
  border: none;
  cursor: pointer;
  color: \${props => props.active ? '#04C4D5' : 'var(--Primary, #148BAF)'};
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(4, 196, 213, 0.1);
  }
`;

const VoteCount = styled.span<VoteCountProps>`
  font-size: 12px;
  font-family: Happy Monkey;
  font-weight: 400;
  color: var(--Primary, #148BAF);
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px 8px;
  color: var(--Primary, #148BAF);
  font-size: 12px;
  font-family: Happy Monkey;
  font-weight: 400;
  text-transform: lowercase;
  border-radius: 4px;
  gap: 4px;
  
  &:hover {
    background-color: rgba(4, 196, 213, 0.1);
  }
`;

const CommentSection = styled.div<CommentSectionProps>`
  padding: 8px 10px 12px 10px;
  max-height: \${props => props.expanded ? '1000px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

const Comment = styled.div<CommentProps>`
  margin-left: \${props => props.level * 16}px;
  padding: 8px 0;
  border-left: 2px solid rgba(4, 196, 213, 0.3);
  padding-left: 8px;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const CommentAvatar = styled.div<CommentAvatarProps>`
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background-color: \${props => props.color || '#FCDF4D'};
  margin-right: 8px;
  flex-shrink: 0;
`;

const CommentUsername = styled.div`
  color: var(--Primary, #148BAF);
  font-size: 11px;
  font-family: Happy Monkey;
  font-weight: 400;
  text-transform: lowercase;
  margin-right: 8px;
`;

const CommentTime = styled.div`
  color: var(--Primary, #148BAF);
  font-size: 10px;
  font-family: Happy Monkey;
  font-weight: 400;
  text-transform: lowercase;
  opacity: 0.7;
`;

const CommentContent = styled.div`
  color: var(--Primary, #148BAF);
  font-size: 14px;
  font-family: Happy Monkey;
  font-weight: 400;
  text-transform: lowercase;
  line-height: 16px;
  word-wrap: break-word;
  margin: 4px 0;
`;

const CommentActions = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
  gap: 8px;
`;

const CommentAction = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 2px 6px;
  color: var(--Primary, #148BAF);
  font-size: 10px;
  font-family: Happy Monkey;
  font-weight: 400;
  text-transform: lowercase;
  border-radius: 4px;
  gap: 2px;
  
  &:hover {
    background-color: rgba(4, 196, 213, 0.1);
  }
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: block;
  width: 100%;
  text-align: center;
  color: var(--Primary, #148BAF);
  font-size: 12px;
  font-family: Happy Monkey;
  font-weight: 400;
  text-transform: lowercase;
  padding: 8px 0;
  margin-top: 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(4, 196, 213, 0.1);
  }
`;

const RedditThread: React.FC<RedditThreadProps> = ({
  username,
  community,
  timestamp,
  title,
  content,
  media,
  likes: initialLikes,
  comments,
  avatar
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [threadComments, setThreadComments] = useState(comments);
  const [commentCount, setCommentCount] = useState(comments.length);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const handleUpvote = () => {
    if (voteStatus === 'up') {
      setLikes(likes - 1);
      setVoteStatus(null);
    } else {
      setLikes(voteStatus === 'down' ? likes + 2 : likes + 1);
      setVoteStatus('up');
    }
  };

  const handleDownvote = () => {
    if (voteStatus === 'down') {
      setLikes(likes + 1);
      setVoteStatus(null);
    } else {
      setLikes(voteStatus === 'up' ? likes - 2 : likes - 1);
      setVoteStatus('down');
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const addComment = (content: string) => {
    const newComment = {
      id: Date.now(),
      username: 'you', // In a real app, would be the current user's username
      content,
      timestamp: 'just now',
      avatar: '#04C4D5', // Could be customized per user
      likes: 0
    };
    
    setThreadComments([...threadComments, newComment]);
    setCommentCount(commentCount + 1);
  };

  const addReply = (commentId: number, content: string) => {
    const updatedComments = threadComments.map(comment => {
      if (comment.id === commentId) {
        const replies = comment.replies || [];
        return {
          ...comment,
          replies: [
            ...replies,
            {
              id: Date.now(),
              username: 'you', // In a real app, would be the current user's username
              content,
              timestamp: 'just now',
              avatar: '#04C4D5', // Could be customized per user
              likes: 0
            }
          ]
        };
      } else if (comment.replies) {
        // Check in nested replies
        const nestedReply = findAndAddNestedReply(comment.replies, commentId, content);
        if (nestedReply) {
          return {
            ...comment,
            replies: nestedReply
          };
        }
      }
      return comment;
    });
    
    setThreadComments(updatedComments);
    setCommentCount(commentCount + 1);
    setReplyingTo(null);
  };

  const findAndAddNestedReply = (replies: CommentType[], targetId: number, content: string): CommentType[] | null => {
    let found = false;
    const updatedReplies = replies.map(reply => {
      if (reply.id === targetId) {
        found = true;
        const nestedReplies = reply.replies || [];
        return {
          ...reply,
          replies: [
            ...nestedReplies,
            {
              id: Date.now(),
              username: 'you',
              content,
              timestamp: 'just now',
              avatar: '#04C4D5',
              likes: 0
            }
          ]
        };
      } else if (reply.replies) {
        const nestedResult = findAndAddNestedReply(reply.replies, targetId, content);
        if (nestedResult) {
          found = true;
          return {
            ...reply,
            replies: nestedResult
          };
        }
      }
      return reply;
    });
    
    return found ? updatedReplies : null;
  };

  const renderComments = (commentsToRender: CommentType[], level = 0) => {
    return commentsToRender.map(comment => (
      <Comment key={comment.id} level={level} data-level={level}>
        <CommentHeader>
          <CommentAvatar color={comment.avatar} />
          <CommentUsername>{comment.username}</CommentUsername>
          <CommentTime>{comment.timestamp}</CommentTime>
        </CommentHeader>
        
        <CommentContent>{comment.content}</CommentContent>
        
        <CommentActions>
          <VoteContainer>
            <VoteButton>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L20 16H4L12 4Z" fill="currentColor" />
              </svg>
            </VoteButton>
            <VoteCount>{comment.likes}</VoteCount>
            <VoteButton>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20L4 8H20L12 20Z" fill="currentColor" />
              </svg>
            </VoteButton>
          </VoteContainer>
          
          <CommentAction onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2C16.75 2 21 6.25 21 11.5Z" stroke="currentColor" strokeWidth="2" />
              <path d="M22 22L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {replyingTo === comment.id ? 'Cancel' : 'Reply'}
          </CommentAction>
          <CommentAction>Share</CommentAction>
        </CommentActions>
        
        {/* Show reply input when replying to this comment */}
        {replyingTo === comment.id && (
          <div style={{ marginTop: '8px', marginLeft: '24px' }}>
            <CommentInput 
              onSubmit={(content) => addReply(comment.id, content)}
              placeholder={`Reply to ${comment.username}...`}
              avatarColor={avatar}
            />
          </div>
        )}
        
        {/* Render nested replies */}
        {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, level + 1)}
      </Comment>
    ));
  };

  return (
    <ThreadContainer className="caktus-reddit-thread">
      <ThreadHeader>
        <Avatar color={avatar} />
        <UserInfoContainer>
          <UserInfoRow>
            <UsernameContainer>
              <Username>{username}</Username>
            </UsernameContainer>
            <CommunityTag>
              <CommunityText>{community}</CommunityText>
            </CommunityTag>
          </UserInfoRow>
          <PostTime>{timestamp}</PostTime>
        </UserInfoContainer>
      </ThreadHeader>
      
      {title && <ThreadContent style={{ fontWeight: 500, paddingBottom: 0 }}>{title}</ThreadContent>}
      <ThreadContent>{content}</ThreadContent>
      
      {media && (
        <MediaContent>
          <img src={media} alt="Post media" />
        </MediaContent>
      )}
      
      <ThreadActions>
        <VoteContainer>
          <VoteButton active={voteStatus === 'up'} data-active={voteStatus === 'up'} onClick={handleUpvote}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L20 16H4L12 4Z" fill="currentColor" />
            </svg>
          </VoteButton>
          <VoteCount color={
            voteStatus === 'up' ? '#FF4500' : 
            voteStatus === 'down' ? '#7193FF' : 
            '#1c1c1c'
          }>{likes}</VoteCount>
          <VoteButton active={voteStatus === 'down'} data-active={voteStatus === 'down'} onClick={handleDownvote}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20L4 8H20L12 20Z" fill="currentColor" />
            </svg>
          </VoteButton>
        </VoteContainer>
        
        <ActionButton onClick={toggleComments}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Comment {commentCount > 0 && `(${commentCount})`}
        </ActionButton>
        
        <ActionButton>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 10H4V20H18V10H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 3V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 7L12 3L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Share
        </ActionButton>
        
        <ActionButton>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 14C20.6569 14 22 12.6569 22 11C22 9.34315 20.6569 8 19 8C18.7348 8 18.4804 8.04032 18.2424 8.11508C18.3293 7.76 18.375 7.38728 18.375 7C18.375 4.51625 16.3587 2.5 13.875 2.5C11.8497 2.5 10.1625 3.80878 9.64218 5.61884C9.20878 5.24222 8.63428 5 8 5C6.61929 5 5.5 6.11929 5.5 7.5C5.5 7.64172 5.51612 7.78139 5.54713 7.91747C3.60122 8.28137 2.125 9.99764 2.125 12.0625C2.125 14.3441 3.93086 16.15 6.2125 16.15H19Z" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Join
        </ActionButton>
      </ThreadActions>
      
      {showComments && (
        <CommentSection expanded={showComments} data-expanded={showComments}>
          {renderComments(threadComments)}
          <CommentInput 
            onSubmit={addComment}
            avatarColor={avatar}
            placeholder="Add a comment..."
          />
        </CommentSection>
      )}
      
      {!showComments && commentCount > 0 && (
        <ExpandButton onClick={toggleComments}>
          Show {commentCount} Comments
        </ExpandButton>
      )}
    </ThreadContainer>
  );
};

export default RedditThread;
