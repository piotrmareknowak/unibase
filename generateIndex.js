const fs = require("fs");
const path = "./data/universities";

// Read all files in /data/universities
const files = fs
  .readdirSync(path)
  .filter(file => file.endsWith(".txt"))
  .map(file => "universities/" + file);

// Write index.json
fs.writeFileSync(
  "./data/index.json",
  JSON.stringify(files, null, 2)
);

console.log("index.json generated successfully!");
