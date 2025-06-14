import { Link } from "react-router-dom";

const BookSessionSimple = () => {
  return (
    <div
      className="book-session-container"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 10px 10px',
        gap: '20px',
        width: '360px',
        height: '155px',
        flex: 'none',
        order: 0,
        alignSelf: 'stretch',
        flexGrow: 0,
        margin: '0 auto'
      }}>
      {/* Session card */}
      <div className="session-card p-3 relative rounded-[15px] border border-[rgba(4,196,213,0.3)] shadow-[0px_3px_6px_rgba(73,218,234,0.3)] hover:shadow-[0px_4px_8px_rgba(73,218,234,0.4)] transition-all duration-300" style={{
        height: '155px',
        width: '160px',
        flex: 'none'
      }}>
        <div className="rounded-lg absolute left-1/2 transform -translate-x-1/2 top-[-12px] bg-white border border-[#04C4D5]" style={{
          borderRadius: '10px',
          boxShadow: '0px 2px 4px rgba(73,218,234,0.2)',
          padding: '4px 12px'
        }}>
          <span className="text-[#148BAF] inline-flex font-happy-monkey text-xs lowercase text-center font-medium">book session</span>
        </div>
        <div className="flex flex-col justify-between h-full">
          <p className="text-center text-[#148BAF] font-happy-monkey lowercase mt-5 text-xs leading-tight">
            connect with our therapists for personalized support
          </p>
          <Link to="/therapist-listing">
            <button className="w-full py-2 bg-[#148BAF] text-white rounded-[10px] font-happy-monkey lowercase text-xs min-h-[32px] hover:bg-[#0f7a99] active:scale-95 transition-all mt-4">
              find therapists
            </button>
          </Link>
        </div>
      </div>

      {/* Free session card */}
      <div className="free-session-card p-3 relative rounded-[15px] border border-[rgba(4,196,213,0.3)] shadow-[0px_3px_6px_rgba(73,218,234,0.3)] hover:shadow-[0px_4px_8px_rgba(73,218,234,0.4)] transition-all duration-300" style={{
        height: '155px',
        width: '160px',
        flex: 'none'
      }}>
        <div className="rounded-lg absolute left-1/2 transform -translate-x-1/2 top-[-12px] bg-white border border-[#04C4D5]" style={{
          borderRadius: '10px',
          boxShadow: '0px 2px 4px rgba(73,218,234,0.2)',
          padding: '4px 12px'
        }}>
          <span className="text-[#148BAF] inline-flex font-happy-monkey text-xs lowercase text-center font-medium">free first session</span>
        </div>
        <div className="flex flex-col justify-between h-full">
          <p className="text-center text-[#148BAF] font-happy-monkey lowercase mt-5 text-xs leading-tight">
            try your first therapy session at no cost
          </p>
          <Link to="/practitioner-listing">
            <button className="w-full py-2 bg-white text-[#148BAF] border border-[#04C4D5] rounded-[10px] font-happy-monkey lowercase text-xs min-h-[32px] hover:bg-[#F7FFFF] active:scale-95 transition-all mt-4">
              explore options
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookSessionSimple;
