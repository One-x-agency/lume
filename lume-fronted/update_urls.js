// const fs = require('fs');

// const filesToUpdate = [
//   'e:/lume/lume-fronted/src/services/api.js',
//   'e:/lume/lume-fronted/src/pages/user/Home.jsx',
//   'e:/lume/lume-fronted/src/pages/admin/admincagegory.jsx'
// ];

// filesToUpdate.forEach(file => {
//   let data = fs.readFileSync(file, 'utf8');
  
//   // Replace base URLs
//   if (file.includes('api.js')) {
//     data = data.replace(/http:\/\/localhost:3000/g, 'https://lume-delta-gold.vercel.app');
//   } else {
//     data = data.replace(/http:\/\/localhost:3000/g, 'https://lume-delta-gold.vercel.app');
//   }
  
//   fs.writeFileSync(file, data);
//   console.log(`Updated ${file}`);
// });
