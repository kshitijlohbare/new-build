import React, { useState } from "react";
import styled from "styled-components";

// Removed unused StyledPlaceholdertext styled component

const StyledPostspan = styled.span`
  color: #148BAF;
  font-size: 12px;
  font-family: Happy Monkey;
  font-weight: 400;
  text-transform: lowercase;
  line-height: 16px;
  word-wrap: break-word;
`;

const StyledPostbutton = styled.button`
  align-self: stretch;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 8px;
  padding-bottom: 8px;
  background: var(--BGColor, white);
  overflow: hidden;
  border-radius: 50px;
  outline: 1px var(--BGColor, white) solid;
  outline-offset: -1px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  display: flex;
  border: none;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const StyledInputbar = styled.div`
  width: 100%;
  max-width: 380px;
  padding: 10px;
  background: #FFD400;
  box-shadow: 1px 2px 4px rgba(73, 217.90, 234, 0.50);
  border-radius: 100px;
  outline: 1px var(--BGColor, white) solid;
  outline-offset: -1px;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  display: inline-flex;
  position: relative;
  box-sizing: border-box;
`;

const EmojiButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
`;

const StyledInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: var(--Secondary-button, #F7FFFF);
  font-size: 12px;
  font-family: Happy Monkey;
  font-weight: 400;
  text-transform: lowercase;
  line-height: 16px;
  width: 100%;
  
  &::placeholder {
    color: var(--Secondary-button, #F7FFFF);
  }
`;

interface InputBarProps {
  onSubmit?: (text: string) => void;
  onEmojiClick?: () => void;
  placeholder?: string;
  showEmojiButton?: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ 
  onSubmit, 
  onEmojiClick, 
  placeholder = "what delighted you today?",
  showEmojiButton = true
}) => {
  const [inputText, setInputText] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && onSubmit) {
      onSubmit(inputText);
      setInputText("");
    }
  };

  return (
    <StyledInputbar id="delights-input-container" data-testid="delights-input-container">
      <form 
        style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '10px' }} 
        onSubmit={handleSubmit}
        id="delight-submit-form"
        data-testid="delight-submit-form"
      >
        <StyledInput 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={placeholder}
          id="delight-input-field"
          data-testid="delight-input-field"
        />
        
        {showEmojiButton && (
          <EmojiButton 
            type="button" 
            onClick={onEmojiClick}
            id="emoji-toggle-button"
            data-testid="emoji-toggle-button"
            aria-label="Open emoji picker"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_623_676)">
                <path d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="#F7FFFF"/>
                <path d="M9.5 8.5C9.5 9.60457 8.60457 10.5 7.5 10.5C6.39543 10.5 5.5 9.60457 5.5 8.5C5.5 7.39543 6.39543 6.5 7.5 6.5C8.60457 6.5 9.5 7.39543 9.5 8.5Z" fill="#04C4D5"/>
                <path d="M18.5 8.5C18.5 9.60457 17.6046 10.5 16.5 10.5C15.3954 10.5 14.5 9.60457 14.5 8.5C14.5 7.39543 15.3954 6.5 16.5 6.5C17.6046 6.5 18.5 7.39543 18.5 8.5Z" fill="#04C4D5"/>
                <path d="M12 0.5C18.3513 0.5 23.5 5.64873 23.5 12C23.5 18.3513 18.3513 23.5 12 23.5C5.64873 23.5 0.5 18.3513 0.5 12C0.5 5.64873 5.64873 0.5 12 0.5ZM9 8.5C9 9.32843 8.32843 10 7.5 10C6.67157 10 6 9.32843 6 8.5C6 7.67157 6.67157 7 7.5 7C8.32843 7 9 7.67157 9 8.5ZM18 8.5C18 9.32843 17.3284 10 16.5 10C15.6716 10 15 9.32843 15 8.5C15 7.67157 15.6716 7 16.5 7C17.3284 7 18 7.67157 18 8.5ZM10 8.5C10 7.11929 8.88071 6 7.5 6C6.11929 6 5 7.11929 5 8.5C5 9.88071 6.11929 11 7.5 11C8.88071 11 10 9.88071 10 8.5ZM19 8.5C19 7.11929 17.8807 6 16.5 6C15.1193 6 14 7.11929 14 8.5C14 9.88071 15.1193 11 16.5 11C17.8807 11 19 9.88071 19 8.5Z" stroke="#04C4D5" strokeMiterlimit="1.05762" strokeLinecap="round"/>
              </g>
              <defs>
                <clipPath id="clip0_623_676">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </EmojiButton>
        )}
        
        <StyledPostbutton 
          type="submit"
          disabled={!inputText.trim()}
          id="delight-post-button"
          data-testid="delight-post-button"
          aria-label="Post your delight"
        >
          <StyledPostspan>POST</StyledPostspan>
        </StyledPostbutton>
      </form>
    </StyledInputbar>
  );
};

export default InputBar;
