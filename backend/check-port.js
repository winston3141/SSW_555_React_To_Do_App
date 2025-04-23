const http = require('http');

// Ports to check
const portsToCheck = [5000, 5001, 5002, 5003, 5004, 5005];

// Function to check a single port
function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      console.log(`Port ${port} - Status Code: ${res.statusCode}`);
      
      if (res.statusCode === 200) {
        resolve(port);
      } else {
        resolve(null);
      }
    });
    
    req.on('error', (err) => {
      console.log(`Port ${port} - Not available (${err.message})`);
      resolve(null);
    });
    
    req.setTimeout(1000, () => {
      req.destroy();
      console.log(`Port ${port} - Timeout`);
      resolve(null);
    });
  });
}

// Check all ports in parallel
async function checkAllPorts() {
  console.log('Checking for active backend server...');
  
  const results = await Promise.all(
    portsToCheck.map(port => checkPort(port))
  );
  
  const activePort = results.find(port => port !== null);
  
  if (activePort) {
    console.log(`\nBackend server is running on port ${activePort}`);
  } else {
    console.log('\nNo active backend server found on expected ports');
  }
}

checkAllPorts(); 