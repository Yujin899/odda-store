const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: 'd:/PROGRAMMING/WEB/odda/odda-web/.env.local' });

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log('Using API Key (last 4):', apiKey ? apiKey.slice(-4) : 'MISSING');
  
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY not found');
    return;
  }

  // Attempt generation via REST with gemini-flash-latest
  const modelId = 'gemini-flash-latest';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{
      parts: [{ text: 'Say "Working!"' }]
    }]
  };

  try {
    console.log(`Attempting generation with ${modelId}...`);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('REST API Error:', JSON.stringify(data.error, null, 2));
      return;
    }

    console.log('Success! Response:');
    if (data.candidates && data.candidates[0].content.parts[0].text) {
        console.log(data.candidates[0].content.parts[0].text);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Fetch Failed:', err.message);
  }
}

test();
