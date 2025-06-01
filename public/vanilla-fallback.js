// Vanilla JavaScript fallback (no dependencies)
console.log('Loading vanilla fallback...');

// Wait for the DOM to be ready
function onDOMReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}

// Main function to create vanilla UI
function createVanillaUI() {
  // Clear the root element
  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found!');
    document.body.innerHTML = '<div style="color: red; padding: 20px;">Root element not found</div>';
    return;
  }
  
  root.innerHTML = '';
  
  // Create a simple UI
  const container = document.createElement('div');
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.maxWidth = '800px';
  container.style.margin = '0 auto';
  container.style.padding = '2rem';
  container.style.textAlign = 'center';
  
  // Add a heading
  const heading = document.createElement('h1');
  heading.textContent = 'Vanilla JavaScript Fallback';
  heading.style.color = '#333';
  container.appendChild(heading);
  
  // Add description
  const description = document.createElement('p');
  description.textContent = 'This is a pure JavaScript fallback without any dependencies.';
  container.appendChild(description);
  
  // Add time display
  const timeDisplay = document.createElement('div');
  timeDisplay.style.margin = '2rem 0';
  timeDisplay.style.padding = '1rem';
  timeDisplay.style.backgroundColor = '#f0f0f0';
  timeDisplay.style.borderRadius = '5px';
  
  // Update time function
  function updateTime() {
    timeDisplay.textContent = 'Current time: ' + new Date().toLocaleTimeString();
  }
  updateTime();
  setInterval(updateTime, 1000);
  
  container.appendChild(timeDisplay);
  
  // Add a button
  const button = document.createElement('button');
  button.textContent = 'Click Me';
  button.style.background = '#4b6cb7';
  button.style.color = 'white';
  button.style.border = 'none';
  button.style.padding = '0.5rem 1rem';
  button.style.borderRadius = '4px';
  button.style.cursor = 'pointer';
  button.style.margin = '1rem';
  
  button.addEventListener('click', function() {
    alert('Vanilla JavaScript is working!');
  });
  
  container.appendChild(button);
  
  // Add links to other diagnostic pages
  const linksDiv = document.createElement('div');
  linksDiv.style.marginTop = '2rem';
  
  const createLink = (text, href) => {
    const link = document.createElement('a');
    link.textContent = text;
    link.href = href;
    link.style.display = 'inline-block';
    link.style.margin = '0.5rem';
    link.style.padding = '0.5rem 1rem';
    link.style.backgroundColor = '#333';
    link.style.color = 'white';
    link.style.textDecoration = 'none';
    link.style.borderRadius = '4px';
    return link;
  };
  
  linksDiv.appendChild(createLink('Static Test', '/static-test.html'));
  linksDiv.appendChild(createLink('React Test', '/react-test.html'));
  linksDiv.appendChild(createLink('Emergency Fallback', '/fallback-index.html'));
  
  container.appendChild(linksDiv);
  
  // Add to the DOM
  root.appendChild(container);
  
  console.log('Vanilla UI rendered successfully');
}

// Run when the DOM is ready
onDOMReady(createVanillaUI);
