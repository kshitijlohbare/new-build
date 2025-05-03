import { Link } from "react-router-dom";

interface Practitioner {
  id: number;
  name: string;
  specialty: string;
  reviews: number;
  rating: number;
  price: number;
  image: string;
  badge: 'top rated' | 'new' | 'experienced' | null;
}

const practitioners: Practitioner[] = [
  {
    id: 1,
    name: "andrew schulz (online)",
    specialty: "some parameters for users to make decision",
    reviews: 4,
    rating: 4.3,
    price: 900,
    image: "/practitioners/andrew.jpg",
    badge: 'top rated'
  },
  {
    id: 2,
    name: "andrew schulz (online)",
    specialty: "some parameters for users to make decision",
    reviews: 4,
    rating: 4.3,
    price: 900,
    image: "/practitioners/sarah.jpg",
    badge: 'new'
  },
  {
    id: 3,
    name: "andrew schulz (online)",
    specialty: "some parameters for users to make decision",
    reviews: 4,
    rating: 4.3,
    price: 900,
    image: "/practitioners/michael.jpg",
    badge: 'experienced'
  },
  {
    id: 4,
    name: "andrew schulz (online)",
    specialty: "some parameters for users to make decision",
    reviews: 4,
    rating: 4.3,
    price: 900,
    image: "/practitioners/michael.jpg",
    badge: 'top rated'
  }
];

const BookSession = () => {
  return (
    <div className="flex flex-col items-start p-0 gap-5 w-full">
      <div className="w-full flex justify-center mb-4">
        <h2 className="text-3xl text-center text-black font-happy-monkey lowercase">
          book your first free session
        </h2>
      </div>

      <div className="flex flex-nowrap gap-2.5 w-full overflow-x-auto pb-6 max-w-full">
        {/* First banner with max-width 200px */}
        <div className="flex-shrink-0 w-full sm:w-auto max-w-[200px] bg-gradient-to-b from-[#49DADD] to-[rgba(195.50,253.79,255,0.20)] p-2.5 rounded-[10px] flex flex-col justify-between shadow-[1px_2px_4px_rgba(73,218,234,0.5)]">
          <p className="text-[#148BAF] font-happy-monkey lowercase">
            get your free session with our best of the therapist
          </p>
          <div className="mt-auto">
            <Link to="/therapist-listing">
              <button className="w-full py-2.5 bg-[#148BAF] text-white rounded-[10px] font-happy-monkey mt-5 lowercase">
                discover therapist
              </button>
            </Link>
          </div>
        </div>

        {practitioners.slice(0, 4).map((practitioner) => (
          <div 
            key={practitioner.id} 
            className="flex-shrink-0 w-full sm:w-[calc(50%-5px)] md:w-[calc(33.33%-7px)] lg:w-[calc(25%-7.5px)] bg-[rgba(83,252,255,0.1)] p-2.5 rounded-[10px] shadow-[1px_2px_4px_rgba(73,218,234,0.5)]"
          >
            <div className="h-[100px] bg-gray-200 relative rounded-[4px] mb-2.5">
              {practitioner.badge && (
                <div className="absolute top-2.5 left-2.5 bg-black px-1.5 py-1.5 rounded-[10px]">
                  <span className="text-white text-xs font-happy-monkey lowercase">{practitioner.badge}</span>
                </div>
              )}
            </div>
            <div className="text-base font-happy-monkey text-black lowercase mb-1">{practitioner.name}</div>
            <div className="text-xs text-[#148BAF] font-happy-monkey lowercase mb-1">{practitioner.specialty}</div>
            
            <div className="flex items-center gap-0.5 mb-1">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 3V18.02H6.25304V16.518H5.50204V4.50207H16.0161V16.518H11.5102V18.02H17.518V3H4Z" fill="#49DADD"/>
                <path d="M6.92908 6.00403H14.5142V7.50603H6.92908V6.00403Z" fill="#49DADD"/>
                <path d="M6.92908 9.00818H14.5142V10.5102H6.92908V9.00818Z" fill="#49DADD"/>
                <path d="M8.88141 11.2609C7.82993 11.2609 7.00391 12.087 7.00391 13.1384C7.00391 13.7392 7.30436 14.2649 7.75491 14.6404V18.0198L8.88141 16.8933L10.0079 18.0198V14.6403C10.4585 14.2648 10.7589 13.739 10.7589 13.2133C10.7589 12.0869 9.93271 11.2609 8.88141 11.2609Z" fill="#49DADD"/>
              </svg>
              <span className="flex-1 text-xs text-[#148BAF] font-happy-monkey lowercase">masters in psychology</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-0.5">
                <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.57342 1.39057C7.02244 0.00860715 8.97756 0.00861025 9.42659 1.39058L10.1329 3.56434C10.3337 4.18237 10.9096 4.60081 11.5595 4.60081H13.8451C15.2982 4.60081 15.9023 6.46024 14.7268 7.31434L12.8777 8.6578C12.3519 9.03976 12.1319 9.71681 12.3328 10.3348L13.0391 12.5086C13.4881 13.8906 11.9064 15.0398 10.7308 14.1857L8.88168 12.8422C8.35595 12.4602 7.64405 12.4602 7.11832 12.8422L5.26921 14.1857C4.09364 15.0398 2.51192 13.8906 2.96095 12.5086L3.66725 10.3348C3.86806 9.71681 3.64807 9.03976 3.12234 8.6578L1.27322 7.31434C0.0976527 6.46023 0.701818 4.60081 2.1549 4.60081H4.44053C5.09037 4.60081 5.66631 4.18237 5.86712 3.56434L6.57342 1.39057Z" fill="#49DADD"/>
                </svg>
                <span className="text-xs text-[#148BAF] font-happy-monkey lowercase">{practitioner.rating} ({practitioner.reviews} reviews)</span>
              </div>
              <span className="text-sm text-black font-happy-monkey lowercase">$ {practitioner.price}/session</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSession;