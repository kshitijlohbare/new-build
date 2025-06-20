import { Link } from "react-router-dom";

const MobileBookSessionSection = () => {
  return (
    <div
      className="therapy-section">
      {/* Title section */}
      <div 
        className="title"
        style={{
          alignSelf: 'stretch',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          display: 'flex'
        }}
      >
        <div 
          style={{
            textAlign: 'center',
            color: 'var(--Primary, #148BAF)',
            fontSize: '16px',
            fontFamily: 'Righteous',
            fontWeight: 400,
            textTransform: 'uppercase',
            lineHeight: '18px',
            wordWrap: 'break-word',
            width: '100%'
          }}
        >
          Book your first free session
        </div>
      </div>

      {/* Therapist cards section */}
      <div 
        className="therapist-cards"
      >
        {/* Banner */}
        <div 
          className="therapist-banner"
        >
          <div 
            style={{
              width: '172px',
              color: 'var(--Primary, #148BAF)',
              fontSize: '16px',
              fontFamily: 'Righteous',
              fontWeight: 400,
              textTransform: 'uppercase',
              lineHeight: '18px',
              wordWrap: 'break-word'
            }}
          >
            Get your free session with our best of the therapist
          </div>
          <Link to="/therapist-listing">
            <div 
              className="therapy-page-button"
              style={{
                padding: '10px',
                background: 'var(--Primary, #148BAF)',
                overflow: 'hidden',
                borderRadius: '10px',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '10px',
                display: 'flex',
                marginTop: '15px'
              }}
            >
              <div 
                style={{
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'var(--Secondary-button, #F7FFFF)',
                  fontSize: '16px',
                  fontFamily: 'Righteous',
                  fontWeight: 400,
                  textTransform: 'uppercase',
                  lineHeight: '18px',
                  wordWrap: 'break-word'
                }}
              >
                Discover Therapist
              </div>
            </div>
          </Link>
        </div>

        {/* Card 1 */}
        <div 
          className="therapist-card"
        >
          <div 
            className="profile-photo"
            style={{
              alignSelf: 'stretch',
              height: '100px',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '4px',
              backgroundImage: 'url(https://placehold.co/280x100)',
              backgroundSize: 'cover'
            }}
          >
            <div 
              style={{
                padding: '6px',
                left: '10px',
                top: '9px',
                position: 'absolute',
                background: 'var(--DARKBGColor, black)',
                overflow: 'hidden',
                borderRadius: '10px',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '10px',
                display: 'inline-flex'
              }}
            >
              <div 
                style={{
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'var(--BGColor, white)',
                  fontSize: '12px',
                  fontFamily: 'Happy Monkey',
                  fontWeight: 400,
                  textTransform: 'lowercase',
                  lineHeight: '16px',
                  wordWrap: 'break-word'
                }}
              >
                Top rated
              </div>
            </div>
          </div>
          <div 
            className="name"
            style={{
              alignSelf: 'stretch',
              color: 'var(--DARKBGColor, black)',
              fontSize: '16px',
              fontFamily: 'Righteous',
              fontWeight: 400,
              textTransform: 'uppercase',
              lineHeight: '18px',
              wordWrap: 'break-word'
            }}
          >
            Andrew schulz (online)
          </div>
          <div 
            className="description"
            style={{
              alignSelf: 'stretch',
              color: 'var(--Primary, #148BAF)',
              fontSize: '12px',
              fontFamily: 'Happy Monkey',
              fontWeight: 400,
              textTransform: 'lowercase',
              lineHeight: '16px',
              wordWrap: 'break-word'
            }}
          >
            Some parameters for users to make decision
          </div>
          <div 
            className="degree"
            style={{
              alignSelf: 'stretch',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '2px',
              display: 'flex'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 3V18.02H6.25304V16.518H5.50204V4.50207H16.0161V16.518H11.5102V18.02H17.518V3H4Z" fill="var(--TEXTColor, #04C4D5)"/>
              <path d="M6.9292 6.00391H14.5143V7.50591H6.9292V6.00391Z" fill="var(--TEXTColor, #04C4D5)"/>
              <path d="M6.9292 9.00781H14.5143V10.5098H6.9292V9.00781Z" fill="var(--TEXTColor, #04C4D5)"/>
              <path d="M8.88141 11.2608C7.82993 11.2608 7.00391 12.0868 7.00391 13.1383C7.00391 13.7391 7.30436 14.2648 7.75491 14.6403V18.0197L8.88141 16.8932L10.0079 18.0197V14.6401C10.4585 14.2646 10.7589 13.7389 10.7589 13.2132C10.7589 12.0868 9.93271 11.2608 8.88141 11.2608Z" fill="var(--TEXTColor, #04C4D5)"/>
            </svg>
            <div 
              style={{
                flex: '1 1 0',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                color: 'var(--Primary, #148BAF)',
                fontSize: '12px',
                fontFamily: 'Happy Monkey',
                fontWeight: 400,
                textTransform: 'lowercase',
                lineHeight: '16px',
                wordWrap: 'break-word'
              }}
            >
              Masters in psychology
            </div>
          </div>
          <div 
            className="ratings-and-price"
            style={{
              alignSelf: 'stretch',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              display: 'flex'
            }}
          >
            <div 
              className="reviews"
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '2px',
                display: 'flex'
              }}
            >
              <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.57342 1.39057C7.02244 0.00860715 8.97756 0.00861025 9.42659 1.39058L10.1329 3.56434C10.3337 4.18237 10.9096 4.60081 11.5595 4.60081H13.8451C15.2982 4.60081 15.9023 6.46024 14.7268 7.31434L12.8777 8.6578C12.3519 9.03976 12.1319 9.71681 12.3328 10.3348L13.0391 12.5086C13.4881 13.8906 11.9064 15.0398 10.7308 14.1857L8.88168 12.8422C8.35595 12.4602 7.64405 12.4602 7.11832 12.8422L5.26921 14.1857C4.09364 15.0398 2.51192 13.8906 2.96095 12.5086L3.66725 10.3348C3.86806 9.71681 3.64807 9.03976 3.12234 8.6578L1.27322 7.31434C0.0976527 6.46023 0.701818 4.60081 2.1549 4.60081H4.44053C5.09037 4.60081 5.66631 4.18237 5.86712 3.56434L6.57342 1.39057Z" fill="var(--TEXTColor, #04C4D5)"/>
              </svg>
              <div 
                style={{
                  width: '118.38px',
                  color: 'var(--Primary, #148BAF)',
                  fontSize: '12px',
                  fontFamily: 'Happy Monkey',
                  fontWeight: 400,
                  textTransform: 'lowercase',
                  lineHeight: '16px',
                  wordWrap: 'break-word'
                }}
              >
                4.3 (4 reviews)
              </div>
            </div>
            <div 
              className="price-per-session"
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                display: 'flex'
              }}
            >
              <div 
                style={{
                  width: '127.62px',
                  textAlign: 'right',
                  color: 'var(--DARKBGColor, black)',
                  fontSize: '12px',
                  fontFamily: 'Happy Monkey',
                  fontWeight: 400,
                  textTransform: 'lowercase',
                  lineHeight: '16px',
                  wordWrap: 'break-word'
                }}
              >
                $ 900/session
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 with "new" tag */}
        <div 
          className="therapist-card"
        >
          <div 
            className="profile-photo"
            style={{
              alignSelf: 'stretch',
              height: '100px',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '4px',
              backgroundImage: 'url(https://placehold.co/280x100)',
              backgroundSize: 'cover'
            }}
          >
            <div 
              style={{
                padding: '6px',
                left: '10px',
                top: '9px',
                position: 'absolute',
                background: 'var(--DARKBGColor, black)',
                overflow: 'hidden',
                borderRadius: '10px',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '10px',
                display: 'inline-flex'
              }}
            >
              <div 
                style={{
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'var(--BGColor, white)',
                  fontSize: '12px',
                  fontFamily: 'Happy Monkey',
                  fontWeight: 400,
                  textTransform: 'lowercase',
                  lineHeight: '16px',
                  wordWrap: 'break-word'
                }}
              >
                new
              </div>
            </div>
          </div>
          <div 
            className="name"
            style={{
              alignSelf: 'stretch',
              color: 'var(--DARKBGColor, black)',
              fontSize: '16px',
              fontFamily: 'Righteous',
              fontWeight: 400,
              textTransform: 'uppercase',
              lineHeight: '18px',
              wordWrap: 'break-word'
            }}
          >
            Andrew schulz (online)
          </div>
          <div 
            className="description"
            style={{
              alignSelf: 'stretch',
              color: 'var(--Primary, #148BAF)',
              fontSize: '12px',
              fontFamily: 'Happy Monkey',
              fontWeight: 400,
              textTransform: 'lowercase',
              lineHeight: '16px',
              wordWrap: 'break-word'
            }}
          >
            Some parameters for users to make decision
          </div>
          <div 
            className="degree"
            style={{
              alignSelf: 'stretch',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '2px',
              display: 'flex'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 3V18.02H6.25304V16.518H5.50204V4.50207H16.0161V16.518H11.5102V18.02H17.518V3H4Z" fill="var(--TEXTColor, #04C4D5)"/>
              <path d="M6.9292 6.00391H14.5143V7.50591H6.9292V6.00391Z" fill="var(--TEXTColor, #04C4D5)"/>
              <path d="M6.9292 9.00781H14.5143V10.5098H6.9292V9.00781Z" fill="var(--TEXTColor, #04C4D5)"/>
              <path d="M8.88141 11.2608C7.82993 11.2608 7.00391 12.0868 7.00391 13.1383C7.00391 13.7391 7.30436 14.2648 7.75491 14.6403V18.0197L8.88141 16.8932L10.0079 18.0197V14.6401C10.4585 14.2646 10.7589 13.7389 10.7589 13.2132C10.7589 12.0868 9.93271 11.2608 8.88141 11.2608Z" fill="var(--TEXTColor, #04C4D5)"/>
            </svg>
            <div 
              style={{
                flex: '1 1 0',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                color: 'var(--Primary, #148BAF)',
                fontSize: '12px',
                fontFamily: 'Happy Monkey',
                fontWeight: 400,
                textTransform: 'lowercase',
                lineHeight: '16px',
                wordWrap: 'break-word'
              }}
            >
              Masters in psychology
            </div>
          </div>
          <div 
            className="ratings-and-price"
            style={{
              alignSelf: 'stretch',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              display: 'flex'
            }}
          >
            <div 
              className="reviews"
              style={{
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '2px',
                display: 'flex'
              }}
            >
              <div 
                style={{
                  width: '118.38px',
                  color: 'var(--Primary, #148BAF)',
                  fontSize: '12px',
                  fontFamily: 'Happy Monkey',
                  fontWeight: 400,
                  textTransform: 'lowercase',
                  lineHeight: '16px',
                  wordWrap: 'break-word'
                }}
              >
                4.3 (4 reviews)
              </div>
            </div>
            <div 
              className="price-per-session"
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                display: 'flex'
              }}
            >
              <div 
                style={{
                  width: '127.62px',
                  textAlign: 'right',
                  color: 'var(--DARKBGColor, black)',
                  fontSize: '12px',
                  fontFamily: 'Happy Monkey',
                  fontWeight: 400,
                  textTransform: 'lowercase',
                  lineHeight: '16px',
                  wordWrap: 'break-word'
                }}
              >
                $ 900/session
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBookSessionSection;
