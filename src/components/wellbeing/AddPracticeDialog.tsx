import { useState } from 'react';
import { X } from 'lucide-react'; 
import { usePractices } from '@/context/PracticeContext';
import { useToast } from '@/hooks/useToast';

interface AddPracticeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddPracticeDialog: React.FC<AddPracticeDialogProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("5"); // Default duration as string
  const [benefits, setBenefits] = useState("");
  const { practices, addPractice } = usePractices();
  const { toast } = useToast();
  
  if (!isOpen) return null;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new practice with the next ID
    const nextId = Math.max(...practices.map(p => p.id)) + 1;
    const benefitsArray = benefits.split(',').map(b => b.trim()).filter(Boolean);
    
    const newPractice = {
      id: nextId,
      name,
      description,
      duration: parseInt(duration) || 5, // Parse duration string to number
      benefits: benefitsArray.length > 0 ? benefitsArray : ["Customized for you"],
      completed: false,
      streak: 0,
      userCreated: true, // Mark as user-created
      isDaily: true, // New practices are automatically added to daily practices
      isSystemPractice: false // Not a system practice
      // createdByUserId will be set in the addPractice function
    };
    
    // Add the new practice
    addPractice(newPractice);
    
    // Reset form and close dialog
    setName("");
    setDescription("");
    setDuration("5"); // Reset to default string value
    setBenefits("");
    onClose();
    
    // Show success message using useToast instead of alert
    // alert("New practice added successfully!");
    toast({
      title: "Success!",
      description: "New practice added successfully!",
      variant: "success"
    });
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-4">
      <div className="bg-white rounded-xl p-4 md:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-[#148BAF]">Add New Practice</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X size={22} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 md:space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Practice Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 md:p-2 border border-gray-300 rounded-md text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent"
                required
                placeholder="Enter practice name"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 md:p-2 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent resize-none"
                required
                placeholder="Describe your practice"
              />
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="text"
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 5"
                className="w-full p-3 md:p-2 border border-gray-300 rounded-md text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                Benefits (comma separated)
              </label>
              <input
                type="text"
                id="benefits"
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="Improves focus, Reduces stress, etc."
                className="w-full p-3 md:p-2 border border-gray-300 rounded-md text-base min-h-[44px] focus:outline-none focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent"
              />
            </div>
            
            <div className="pt-4 md:pt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all active:scale-95 font-medium min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 text-white bg-[#088BAF] rounded-lg hover:bg-[#067a9c] transition-all hover:shadow-md active:scale-95 font-medium min-h-[44px]"
              >
                Add Practice
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPracticeDialog;
