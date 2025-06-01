// Script to diagnose blank screen issues
console.log('====== BLANK SCREEN DIAGNOSTIC SCRIPT ======');

// DOM checks
console.log('1. DOM STRUCTURE:');
console.log('- Document ready state:', document.readyState);
console.log('- Root element exists:', document.getElementById('root') !== null);
console.log('- Root element children:', document.getElementById('root')?.childElementCount || 0);
console.log('- Root element innerHTML length:', document.getElementById('root')?.innerHTML?.length || 0);
console.log('- Body children count:', document.body.childElementCount);

// CSS checks
console.log('\n2. CSS ISSUES:');
if (document.getElementById('root')) {
  const rootStyles = window.getComputedStyle(document.getElementById('root'));
  console.log('- Root display:', rootStyles.display);
  console.log('- Root visibility:', rootStyles.visibility);
  console.log('- Root opacity:', rootStyles.opacity);
  console.log('- Root height:', rootStyles.height);
  console.log('- Root width:', rootStyles.width);
}

// React checks
console.log('\n3. REACT STATUS:');
console.log('- React defined:', typeof React !== 'undefined');
console.log('- ReactDOM defined:', typeof ReactDOM !== 'undefined');

// Error checks
console.log('\n4. ERRORS:');
console.log('- Any errors on window:', window.hasOwnProperty('__REACT_ERROR__') ? 'YES - ' + window.__REACT_ERROR__ : 'NO');

// Render attempt
console.log('\n5. ATTEMPTING RENDER:');
try {
  const testDiv = document.createElement('div');
  testDiv.id = 'diagnostic-test';
  testDiv.style.position = 'fixed';
  testDiv.style.top = '10px';
  testDiv.style.right = '10px';
  testDiv.style.padding = '10px';
  testDiv.style.background = 'rgba(255,0,0,0.8)';
  testDiv.style.color = 'white';
  testDiv.style.zIndex = '9999';
  testDiv.style.borderRadius = '5px';
  testDiv.innerText = 'DOM Manipulation Works!';
  document.body.appendChild(testDiv);
  console.log('- Test element added to DOM successfully');
  
  setTimeout(() => {
    testDiv.style.background = 'rgba(0,128,0,0.8)';
    testDiv.innerText = 'JavaScript works!';
    console.log('- JavaScript execution works');
  }, 2000);
} catch (err) {
  console.error('- Error creating test element:', err);
}

console.log('\n====== END DIAGNOSTIC ======');
