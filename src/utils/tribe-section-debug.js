/**
 * This script fixes tribe-section rendering issues by applying proper
 * stacking context and z-index to ensure all elements are visible.
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log('Applying tribe-section rendering fixes...');
  
  // Wait a moment for React to finish rendering
  setTimeout(function() {
    applyTribeSectionFixes();
  }, 500);
});

function applyTribeSectionFixes() {
  // Fix tribe-section container
  const tribeSection = document.querySelector('.tribe-section');
  if (tribeSection) {
    console.log('Found tribe-section, applying fixes');
    applyStyles(tribeSection, {
      position: 'relative',
      zIndex: '1',
      overflow: 'visible'
    });
  }
  
  // Fix tribe-content
  const tribeContent = document.querySelector('.tribe-content');
  if (tribeContent) {
    console.log('Found tribe-content, applying fixes');
    applyStyles(tribeContent, {
      position: 'relative',
      zIndex: '1',
      overflow: 'visible'
    });
  }
  
  // Fix tribe-cards-container
  const tribeCardsContainer = document.querySelector('.tribe-cards-container');
  if (tribeCardsContainer) {
    console.log('Found tribe-cards-container, applying fixes');
    applyStyles(tribeCardsContainer, {
      position: 'relative',
      zIndex: '1',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%'
    });
  }
  
  // Fix Frame13 elements (group cards)
  const groupCards = document.querySelectorAll('.Frame13, .fitness-group-card');
  if (groupCards.length > 0) {
    console.log(`Found ${groupCards.length} group cards, applying fixes`);
    groupCards.forEach(card => {
      applyStyles(card, {
        position: 'relative',
        zIndex: '1',
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        width: 'calc(100% - 20px)',
        maxWidth: '360px',
        background: 'rgba(83, 252, 255, 0.1)',
        boxShadow: '1px 2px 4px rgba(73, 218, 234, 0.5)',
        borderRadius: '8px',
        padding: '10px',
        margin: '0 auto 15px auto'
      });
    });
  }
  
  // Fix Frame135 elements (group content rows)
  const contentRows = document.querySelectorAll('.Frame135, .group-content');
  if (contentRows.length > 0) {
    console.log(`Found ${contentRows.length} content rows, applying fixes`);
    contentRows.forEach(row => {
      applyStyles(row, {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        zIndex: '1',
        gap: '10px',
        flexWrap: 'wrap'
      });
    });
  }
  
  // Fix Frame5 elements (category badges)
  const categoryBadges = document.querySelectorAll('.Frame5, .group-category');
  if (categoryBadges.length > 0) {
    console.log(`Found ${categoryBadges.length} category badges, applying fixes`);
    categoryBadges.forEach(badge => {
      applyStyles(badge, {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4px 8px',
        background: '#F5F5F5',
        borderRadius: '8px',
        position: 'relative',
        zIndex: '1'
      });
    });
  }
  
  // Fix join/leave buttons to ensure they're clickable
  const buttons = document.querySelectorAll('.join-button, .leave-button');
  if (buttons.length > 0) {
    console.log(`Found ${buttons.length} buttons, applying fixes`);
    buttons.forEach(button => {
      applyStyles(button, {
        position: 'relative',
        zIndex: '10',
        cursor: 'pointer'
      });
    });
  }
  
  console.log('Tribe section rendering fixes applied successfully');
}

function applyStyles(element, styles) {
  Object.keys(styles).forEach(property => {
    element.style[property] = styles[property];
  });
}
