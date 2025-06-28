import DailyPracticesDisplay from '@/components/wellbeing/DailyPracticesDisplay';
import PracticesSelector from '@/components/wellbeing/PracticesSelector';
import '../styles/DailyPracticesEnhanced.css';
import '../styles/PracticesSelector.css';

/**
 * EnhancedPracticesPage combines the daily practice tracking and
 * practice selection components.
 */
export default function EnhancedPracticesPage() {
  return (
    <div className="enhanced-practices-page">
      <h1 className="page-title">Enhanced Practices</h1>
      
      <section className="page-section">
        <DailyPracticesDisplay />
      </section>
      
      <section className="page-section">
        <PracticesSelector />
      </section>
    </div>
  );
}

// Add some page-specific styles
const styles = `
.enhanced-practices-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--color-text-primary, #333);
  text-align: center;
}

.page-section {
  margin-bottom: 40px;
}

/* Add a subtle divider between sections */
.page-section:not(:last-child) {
  position: relative;
}

.page-section:not(:last-child):after {
  content: '';
  display: block;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--color-border, #dee2e6) 50%, transparent);
  margin: 40px 0;
}

/* Responsive styles */
@media (max-width: 768px) {
  .enhanced-practices-page {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
    margin-bottom: 16px;
  }
  
  .page-section:not(:last-child):after {
    margin: 24px 0;
  }
}
`;

// Inject the styles into the document
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}
