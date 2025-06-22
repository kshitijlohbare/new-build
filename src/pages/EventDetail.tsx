import React from 'react';
import '@/styles/EventDetail.css';

// Define the Event interface
export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  attendees: number;
  imageUrl?: string;
  groupName: string;
}

interface EventDetailProps {
  event: Event;
  onBack: () => void;
  onJoin: (event: Event) => void;
  onLeave: (event: Event) => void;
  isJoined: boolean;
}

const EventDetail: React.FC<EventDetailProps> = ({ 
  event, 
  onBack, 
  onJoin, 
  onLeave, 
  isJoined 
}) => {
  return (
    <div className="event-detail-container">
      {/* Back button */}
      <div className="event-detail-header">
        <button className="back-button" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="#148BAF"/>
          </svg>
          <span>back to events</span>
        </button>
      </div>

      {/* Event image */}
      <div className="event-detail-image">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} />
        ) : (
          <div className="event-image-placeholder">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 12H12V17H17V12ZM16 1V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3H18V1H16ZM19 19H5V8H19V19Z" fill="#148BAF"/>
            </svg>
          </div>
        )}
      </div>

      {/* Event details */}
      <div className="event-detail-content">
        <h1 className="event-title">{event.title}</h1>
        <div className="event-group">by {event.groupName}</div>
        
        <div className="event-detail-info">
          <div className="event-info-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10.5 5H9V11L14.2 14.2L15 12.9L10.5 10.2V5Z" fill="#148BAF"/>
            </svg>
            <div>
              <div className="info-label">Date & Time</div>
              <div className="info-value">{event.date} · {event.time}</div>
            </div>
          </div>
          
          <div className="event-info-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10.5 5H9V11L14.2 14.2L15 12.9L10.5 10.2V5Z" fill="#148BAF"/>
            </svg>
            <div>
              <div className="info-label">Location</div>
              <div className="info-value">{event.location}</div>
            </div>
          </div>
          
          <div className="event-info-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10.5 5H9V11L14.2 14.2L15 12.9L10.5 10.2V5Z" fill="#148BAF"/>
            </svg>
            <div>
              <div className="info-label">Organizer</div>
              <div className="info-value">{event.organizer}</div>
            </div>
          </div>
          
          <div className="event-info-item">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM10.5 5H9V11L14.2 14.2L15 12.9L10.5 10.2V5Z" fill="#148BAF"/>
            </svg>
            <div>
              <div className="info-label">Attendees</div>
              <div className="info-value">{event.attendees} people attending</div>
            </div>
          </div>
        </div>
        
        <div className="event-description">
          <h2>About this event</h2>
          <p>{event.description}</p>
        </div>
        
        {/* Join or Leave button */}
        <div className="event-actions">
          {isJoined ? (
            <button 
              className="leave-button" 
              onClick={() => onLeave(event)}
            >
              Leave Event
            </button>
          ) : (
            <button 
              className="join-button" 
              onClick={() => onJoin(event)}
            >
              Join Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
