import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const AppNavbar = () => {
  return (
    <nav className="bg-[#9CE7F9] sticky top-0 z-50 py-2">
      <div className="container flex h-12 items-center justify-between px-4">
        <div className="mr-4">
          <Link to="/" className="flex items-center">
            <span className="font-happy-monkey text-2xl font-bold text-black">CACTUS COCO</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-black font-medium">
            current streak : 12
          </div>
          
          <div className="flex items-center space-x-1">
            <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
              <span className="text-gray-500 text-lg">📝</span>
            </div>
            <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
              <span className="text-gray-500 text-lg">🔔</span>
            </div>
          </div>
          
          <div className="flex items-center bg-[#088BAF] text-white px-4 py-1 rounded-full">
            <span className="mr-1">hi, kshitij lohbare</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppNavbar;