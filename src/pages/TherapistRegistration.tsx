import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface TherapistFormData {
  name: string;
  specialty: string;
  education: string;
  degree: string;
  price: number;
  location_type: "online" | "in-person" | "both";
  conditions: string[];
  image_url?: string;
}

const availableConditions = [
  { id: "depression", label: "Depression" },
  { id: "adhd", label: "ADHD" },
  { id: "ocd", label: "OCD" },
  { id: "anxiety", label: "Anxiety" },
  { id: "postpartum", label: "Postpartum Depression" },
  { id: "bipolar", label: "Bi-Polar Disorder" },
  { id: "anger", label: "Anger Management" },
  { id: "grief", label: "Grief & Loss" },
  { id: "trauma", label: "Trauma" }
];

const TherapistRegistration = () => {
  const [formData, setFormData] = useState<TherapistFormData>({
    name: "",
    specialty: "",
    education: "",
    degree: "",
    price: 0,
    location_type: "both",
    conditions: [],
    image_url: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const price = parseInt(e.target.value) || 0;
    setFormData(prev => ({
      ...prev,
      price
    }));
  };
  
  const handleConditionToggle = (conditionId: string) => {
    setFormData(prev => {
      const exists = prev.conditions.includes(conditionId);
      const updatedConditions = exists 
        ? prev.conditions.filter(id => id !== conditionId)
        : [...prev.conditions, conditionId];
        
      return {
        ...prev,
        conditions: updatedConditions
      };
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Add some default values for the initial version
      const practitionerData = {
        ...formData,
        rating: 5.0, // Default rating for new therapists
        reviews: 0,  // No reviews yet
        badge: "new" as const // Mark as new
      };
      
      const { data, error } = await supabase
        .from('practitioners')
        .insert([practitionerData])
        .select();
        
      if (error) {
        throw new Error(error.message);
      }
      
      setSuccess(true);
      setFormData({
        name: "",
        specialty: "",
        education: "",
        degree: "",
        price: 0,
        location_type: "both",
        conditions: [],
        image_url: ""
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-center text-[#04C4D5] text-3xl font-happy-monkey lowercase mb-8">
        Register as a Therapist
      </h2>
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <p className="font-happy-monkey">Registration successful! Your profile will be reviewed by our team.</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-happy-monkey">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[#148BAF] font-happy-monkey lowercase mb-2">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-[#04C4D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#04C4D5]"
                placeholder="Enter your full name"
              />
            </div>
            
            {/* Specialty */}
            <div>
              <label className="block text-[#148BAF] font-happy-monkey lowercase mb-2">
                Your Specialty
              </label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-[#04C4D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#04C4D5]"
                placeholder="e.g., Cognitive Behavioral Therapy"
              />
            </div>
            
            {/* Education */}
            <div>
              <label className="block text-[#148BAF] font-happy-monkey lowercase mb-2">
                Education
              </label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-[#04C4D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#04C4D5]"
                placeholder="e.g., Masters in Psychology"
              />
            </div>
            
            {/* Degree */}
            <div>
              <label className="block text-[#148BAF] font-happy-monkey lowercase mb-2">
                Degree Obtained
              </label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-[#04C4D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#04C4D5]"
                placeholder="e.g., PhD, PsyD, LMFT"
              />
            </div>
            
            {/* Price */}
            <div>
              <label className="block text-[#148BAF] font-happy-monkey lowercase mb-2">
                Session Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handlePriceChange}
                required
                min="0"
                className="w-full p-2 border border-[#04C4D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#04C4D5]"
                placeholder="Enter price per session"
              />
            </div>
            
            {/* Location Type */}
            <div>
              <label className="block text-[#148BAF] font-happy-monkey lowercase mb-2">
                Session Type
              </label>
              <select
                name="location_type"
                value={formData.location_type}
                onChange={handleInputChange}
                required
                className="w-full p-2 border border-[#04C4D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#04C4D5]"
              >
                <option value="online">Online Only</option>
                <option value="in-person">In-Person Only</option>
                <option value="both">Both Online and In-Person</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Image URL */}
            <div>
              <label className="block text-[#148BAF] font-happy-monkey lowercase mb-2">
                Profile Image URL
              </label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="w-full p-2 border border-[#04C4D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#04C4D5]"
                placeholder="Enter URL to your professional photo"
              />
              <p className="text-sm text-gray-500 mt-1">
                If you don't have an image URL, leave this blank and we'll add a default image.
              </p>
            </div>
            
            {/* Conditions */}
            <div>
              <label className="block text-[#148BAF] font-happy-monkey lowercase mb-2">
                Conditions You Specialize In
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableConditions.map(condition => (
                  <div 
                    key={condition.id}
                    onClick={() => handleConditionToggle(condition.id)}
                    className={`p-2 border border-[#04C4D5] rounded-md cursor-pointer text-center transition-colors ${
                      formData.conditions.includes(condition.id)
                        ? 'bg-[#148BAF] text-white'
                        : 'bg-white text-[#04C4D5]'
                    }`}
                  >
                    <span className="font-happy-monkey lowercase">{condition.label}</span>
                  </div>
                ))}
              </div>
              {formData.conditions.length === 0 && (
                <p className="text-red-500 text-sm mt-1">Please select at least one condition</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={loading || formData.conditions.length === 0}
            className={`bg-[#148BAF] text-white py-3 px-8 rounded-md font-happy-monkey lowercase text-lg ${
              (loading || formData.conditions.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#0e6d89]'
            }`}
          >
            {loading ? 'Submitting...' : 'Register as a Therapist'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TherapistRegistration;