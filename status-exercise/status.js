console.log('Status: OK');
console.log(`Time: ${new Date().toISOString()}`);
console.log(`Uptime: ${process.uptime().toFixed(2)}s`);
console.log(`Memory: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`);
