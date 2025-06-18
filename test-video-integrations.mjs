/**
 * Video Platform Integration Test Utility
 * 
 * This utility helps test each video platform integration to ensure
 * they are working correctly in production environment.
 * 
 * To run: node test-video-integrations.mjs
 */

import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import chalk from 'chalk';

// Load environment variables
dotenv.config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

// Set up mock appointment data for testing
const mockAppointmentData = {
  appointmentId: Date.now(),
  hostEmail: process.env.TEST_HOST_EMAIL || 'practitioner@example.com',
  guestEmail: process.env.TEST_GUEST_EMAIL || 'patient@example.com',
  topic: 'Test Therapy Session',
  agenda: 'Integration test appointment',
  startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
  durationMinutes: 60,
};

// Test results storage
const testResults = {
  zoom: { success: false, url: null, error: null },
  googleMeet: { success: false, url: null, error: null },
  teams: { success: false, url: null, error: null },
};

// Utility function to log results
const logResult = (platform, success, message) => {
  if (success) {
    console.log(chalk.green(`✓ ${platform}: ${message}`));
  } else {
    console.log(chalk.red(`✗ ${platform}: ${message}`));
  }
};

// Test Zoom integration
async function testZoomIntegration() {
  try {
    console.log(chalk.blue('\nTesting Zoom integration...'));
    
    const response = await fetch(`${API_BASE_URL}/create-zoom-meeting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockAppointmentData),
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    
    if (!data.join_url) {
      throw new Error('No meeting URL returned');
    }
    
    testResults.zoom = {
      success: true,
      url: data.join_url,
      id: data.id,
      password: data.password,
    };
    
    logResult('Zoom', true, `Created meeting: ${data.join_url}`);
    return true;
  } catch (error) {
    testResults.zoom = {
      success: false,
      url: null,
      error: error.message,
    };
    
    logResult('Zoom', false, error.message);
    return false;
  }
}

// Test Google Meet integration
async function testGoogleMeetIntegration() {
  try {
    console.log(chalk.blue('\nTesting Google Meet integration...'));
    
    const response = await fetch(`${API_BASE_URL}/create-google-meet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...mockAppointmentData,
        summary: mockAppointmentData.topic,
        description: mockAppointmentData.agenda,
        startDateTime: mockAppointmentData.startTime,
        duration: mockAppointmentData.durationMinutes,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    
    if (!data.meetingUrl) {
      throw new Error('No meeting URL returned');
    }
    
    testResults.googleMeet = {
      success: true,
      url: data.meetingUrl,
      id: data.meetingId,
    };
    
    logResult('Google Meet', true, `Created meeting: ${data.meetingUrl}`);
    return true;
  } catch (error) {
    testResults.googleMeet = {
      success: false,
      url: null,
      error: error.message,
    };
    
    logResult('Google Meet', false, error.message);
    return false;
  }
}

// Test Microsoft Teams integration
async function testTeamsIntegration() {
  try {
    console.log(chalk.blue('\nTesting Microsoft Teams integration...'));
    
    const response = await fetch(`${API_BASE_URL}/create-teams-meeting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...mockAppointmentData,
        subject: mockAppointmentData.topic,
        description: mockAppointmentData.agenda,
        startDateTime: mockAppointmentData.startTime,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    
    if (!data.joinUrl) {
      throw new Error('No meeting URL returned');
    }
    
    testResults.teams = {
      success: true,
      url: data.joinUrl,
      id: data.id,
    };
    
    logResult('Teams', true, `Created meeting: ${data.joinUrl}`);
    return true;
  } catch (error) {
    testResults.teams = {
      success: false,
      url: null,
      error: error.message,
    };
    
    logResult('Teams', false, error.message);
    return false;
  }
}

// Generate test report
async function generateTestReport() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const report = {
    timestamp: new Date().toISOString(),
    results: testResults,
    environment: process.env.NODE_ENV || 'development',
    apiBaseUrl: API_BASE_URL,
  };
  
  console.log(chalk.blue('\n\n=== VIDEO INTEGRATION TEST RESULTS ==='));
  
  const platforms = ['zoom', 'googleMeet', 'teams'];
  const overallSuccess = platforms.some(p => testResults[p].success);
  
  platforms.forEach(platform => {
    const result = testResults[platform];
    if (result.success) {
      console.log(chalk.green(`✓ ${platform}: Success`));
      console.log(`  Meeting URL: ${result.url}`);
    } else {
      console.log(chalk.red(`✗ ${platform}: Failed - ${result.error}`));
    }
  });
  
  if (overallSuccess) {
    console.log(chalk.green('\n✓ At least one integration is working, booking can proceed'));
  } else {
    console.log(chalk.red('\n✗ All integrations failed, booking will use fallback manual option'));
  }
  
  // Save test results to file
  await fs.writeFile(
    `./video-integration-test-${timestamp}.json`, 
    JSON.stringify(report, null, 2)
  );
  
  console.log(chalk.blue(`\nTest report saved to video-integration-test-${timestamp}.json`));
}

// Run all tests
async function runTests() {
  console.log(chalk.yellow('=== Starting Video Platform Integration Tests ==='));
  
  await testZoomIntegration();
  await testGoogleMeetIntegration();
  await testTeamsIntegration();
  
  await generateTestReport();
}

// Execute tests
runTests().catch(error => {
  console.error(chalk.red('Error running tests:'), error);
  process.exit(1);
});
