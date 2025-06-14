

const SimpleFocusTimer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E7FCFF] to-[#DEFFFF]">
      <div className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#148BAF] mb-2">Focus Timer</h1>
          <p className="text-[#148BAF]">Stay focused and productive</p>
        </div>
        
        {/* Main content */}
        <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg">
          <div className="text-center text-[#04C4D5] text-lg font-bold mb-6">
            Temporary Focus Timer
          </div>
          
          <div className="w-64 h-64 rounded-full border-4 border-[#148BAF] flex items-center justify-center mb-8">
            <div className="text-[#148BAF] text-4xl font-bold">15:00</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-6">
            <button className="bg-white border border-[#04C4D5] text-[#148BAF] p-3 rounded-lg shadow-md">
              Quick Focus 1
            </button>
            <button className="bg-white border border-[#04C4D5] text-[#148BAF] p-3 rounded-lg shadow-md">
              Quick Focus 2
            </button>
            <button className="bg-white border border-[#04C4D5] text-[#148BAF] p-3 rounded-lg shadow-md">
              Quick Focus 3
            </button>
            <button className="bg-white border border-[#04C4D5] text-[#148BAF] p-3 rounded-lg shadow-md">
              Quick Focus 4
            </button>
          </div>
          
          <div className="flex justify-center gap-4">
            <button className="bg-[#DEFFFF] border border-white text-[#148BAF] p-3 rounded-full shadow-md">
              ▶️
            </button>
            <button className="bg-[#DEFFFF] border border-white text-[#148BAF] p-3 rounded-full shadow-md">
              ⏹️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleFocusTimer;
