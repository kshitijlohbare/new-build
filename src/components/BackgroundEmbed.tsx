import React from 'react';

interface BackgroundEmbedProps {
  src: string;
  title?: string;
  allowFullScreen?: boolean;
  className?: string;
  overlayColor?: string;
  overlayOpacity?: number;
}

const BackgroundEmbed: React.FC<BackgroundEmbedProps> = ({ 
  src, 
  title = "Background Embed", 
  allowFullScreen = true,
  className = "",
  overlayColor = "transparent",
  overlayOpacity = 0
}) => {
  const overlayStyle = {
    position: 'absolute' as 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: overlayColor,
    opacity: overlayOpacity,
    zIndex: 1
  };
  
  return (
    <div className={`background-embed-container ${className}`}>
      <iframe 
        src={src}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen={allowFullScreen}
        className="background-embed-iframe"
      ></iframe>
      {overlayOpacity > 0 && <div style={overlayStyle}></div>}
    </div>
  );
};

export default BackgroundEmbed;
