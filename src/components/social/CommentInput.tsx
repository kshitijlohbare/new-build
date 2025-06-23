import React, { useState } from 'react';
import styled from 'styled-components';

const CommentInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
  padding: 8px 0;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: 20px;
  background-color: #f6f7f8;
  padding: 2px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.color || '#FCDF4D'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  font-weight: bold;
  color: white;
  font-size: 14px;
`;

const StyledInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px 12px;
  font-size: 14px;
  font-family: 'Happy Monkey', cursive;
  color: #1c1c1c;
  outline: none;
  
  &::placeholder {
    color: #787c7e;
  }
`;

const PostButton = styled.button<{ active: boolean }>`
  background-color: ${props => props.active ? 'var(--Primary, #148BAF)' : '#ccc'};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 6px;
  cursor: ${props => props.active ? 'pointer' : 'default'};
  opacity: ${props => props.active ? 1 : 0.7};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#0f7a9d' : '#ccc'};
  }
`;

interface CommentInputProps {
  avatarColor?: string;
  onSubmit: (comment: string) => void;
  placeholder?: string;
  username?: string;
  isReply?: boolean;
}

const CommentInput: React.FC<CommentInputProps> = ({
  avatarColor = '#FCDF4D',
  onSubmit,
  placeholder = 'Add a comment...',
  username = 'u',
  isReply = false
}) => {
  const [comment, setComment] = useState('');
  
  const handleSubmit = () => {
    if (comment.trim() !== '') {
      onSubmit(comment);
      setComment('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && comment.trim() !== '') {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  return (
    <CommentInputContainer>
      <InputWrapper>
        <UserAvatar color={avatarColor}>
          {username[0].toUpperCase()}
        </UserAvatar>
        <StyledInput
          placeholder={placeholder}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <PostButton 
          active={comment.trim() !== ''}
          onClick={handleSubmit}
          disabled={comment.trim() === ''}
        >
          {isReply ? 'Reply' : 'Comment'}
        </PostButton>
      </InputWrapper>
    </CommentInputContainer>
  );
};

export default CommentInput;
