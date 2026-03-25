import extendedRouter from './api/src/extended-routes.js';

// Create a mock request
const url = new URL('http://localhost:3000/gallery?seed=test&category=focus');
const request = new Request(url);

// Try to call the extended router
const response = await extendedRouter(request, {});
const statusText = response?.status ? `status: ${response.status}` : 'No response';
console.log('Extended router response:', statusText);
if (response?.ok) {
  const body = await response.text();
  console.log('Body:', body.substring(0, 200));
} else {
  const body = await response.text();
  console.log('Error body:', body);
}
