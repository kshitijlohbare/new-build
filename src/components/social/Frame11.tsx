import React from "react";
import styled from "styled-components";

const StyledRandomusername = styled.span`
  color: var(--Primary, #148BAF);
  font-size: 12px;
  font-family: Happy Monkey;
  font-weight: 400;
  text-transform: lowercase;
  line-height: 16px;
  word-wrap: break-word;
`;

const StyledMorningrunninggroup = styled.span`
  color: var(--Primary, #148BAF);
  font-size: 12px;
  font-family: Happy Monkey;
  font-weight: 400;
  text-transform: lowercase;
  line-height: 16px;
  word-wrap: break-word;
`;

const StyledAchievedthesanitylevelwhichicravedforyearsofmylife = styled.span`
  color: var(--Primary, #148BAF);
  font-size: 16px;
  font-family: Happy Monkey;
  font-weight: 400;
  text-transform: lowercase;
  line-height: 18px;
  word-wrap: break-word;
`;

const StyledFrame165 = styled.div`
  flex: 1 1 0;
  align-self: stretch;
  padding-top: 2px;
  padding-bottom: 2px;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  display: flex;
`;

const StyledFrame164 = styled.div`
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

const StyledFrame163 = styled.div`
  align-self: stretch;
  justify-content: flex-start;
  align-items: center;
  gap: 4px;
  display: inline-flex;
`;

const StyledFrame130 = styled.div`
  flex: 1 1 0;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 4px;
  display: inline-flex;
`;

const StyledFrame11 = styled.div`
  align-self: stretch;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 8px;
  padding-bottom: 8px;
  box-shadow: 1px 2px 4px rgba(73, 217.90, 234, 0.50);
  overflow: hidden;
  border-radius: 8px;
  outline: 1px var(--TEXTColor, #04C4D5) solid;
  outline-offset: -1px;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  display: inline-flex;
`;

interface Frame11Props {
  username?: string;
  group?: string;
  content?: string;
  avatarColor?: string;
}

export const Frame11: React.FC<Frame11Props> = ({ 
  username = "random username", 
  group = "morning running group", 
  content = "achieved the sanity level which i craved for years of my life",
  avatarColor = "#FCDF4D"
}) => {
  return (
    <StyledFrame11>
      <div data-svg-wrapper data-layer="Frame 5">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill={`var(--Color, ${avatarColor})`}/>
        </svg>
      </div>
      <StyledFrame130>
        <StyledFrame163>
          <StyledFrame165>
            <StyledRandomusername>{username}</StyledRandomusername>
          </StyledFrame165>
          <StyledFrame164>
            <StyledMorningrunninggroup>{group}</StyledMorningrunninggroup>
          </StyledFrame164>
        </StyledFrame163>
        <StyledAchievedthesanitylevelwhichicravedforyearsofmylife>
          {content}
        </StyledAchievedthesanitylevelwhichicravedforyearsofmylife>
      </StyledFrame130>
    </StyledFrame11>
  );
};

export default Frame11;
