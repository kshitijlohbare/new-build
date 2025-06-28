import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePractices } from '../context/PracticeContext';
import { ArrowLeft } from 'lucide-react';

const PracticeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { practices } = usePractices();
  const practice = practices.find(p => p.id === Number(id));

  if (!practice) return <div className="p-8 text-center">Practice not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10 bg-white min-h-screen rounded-xl shadow-lg border border-gray-100 mt-8 mb-8">
      <button
        className="flex items-center gap-2 text-[#148BAF] mb-6 hover:underline text-base font-medium"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} /> Back
      </button>
      <h1 className="text-4xl font-extrabold mb-3 text-[#148BAF] tracking-tight leading-tight">{practice.name}</h1>
      <div className="mb-6 text-gray-700 text-lg leading-relaxed">{practice.description}</div>
      {/* Steps */}
      {practice.steps && practice.steps.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold text-xl mb-3 text-[#148BAF]">Steps</h2>
          <ol className="list-decimal pl-8 space-y-3">
            {practice.steps.map((step, idx) => (
              <li key={idx} className="mb-1">
                <div className="font-bold text-base text-[#148BAF]">{step.title}</div>
                <div className="text-gray-800 text-sm">{step.description}</div>
              </li>
            ))}
          </ol>
        </div>
      )}
      {/* Comments Section */}
      <div className="border-t border-[rgba(4,196,213,0.2)] pt-6 mt-8">
        <h3 className="font-bold text-xl mb-3 text-[#148BAF]">Comments</h3>
        <textarea
          className="w-full p-3 border border-gray-200 rounded-lg mb-3 text-black focus:outline-none focus:ring-2 focus:ring-[#04C4D5] transition"
          rows={3}
          placeholder="Add a comment... (not yet saved)"
          disabled
        />
        <button
          className="px-5 py-2 bg-[#04C4D5] text-white rounded-lg disabled:opacity-50 font-semibold shadow hover:bg-[#148BAF] transition"
          disabled
        >
          Post Comment
        </button>
        <div className="text-xs text-gray-500 mt-2">(Commenting coming soon!)</div>
      </div>
    </div>
  );
};

export default PracticeDetailPage;
