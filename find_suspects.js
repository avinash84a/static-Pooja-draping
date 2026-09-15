const fs = require('fs');
const lines = fs.readFileSync('wordpress/ai-course-cms.php', 'utf8').split('\n');

const suspects = ['API', 'Agents', 'Audience', 'Automate', 'Automation', 'Batches', 'Briefcase', 'Challenge', 'Challenges', 'Code', 'Communicate', 'Course', 'Create', 'Customizations', 'Endpoints', 'Everywhere', 'Govt', 'GraduationCap', 'Home', 'Landmark', 'Laptop', 'Leads', 'Office', 'Offline', 'Online', 'Pillars', 'Profession', 'Public', 'Rocket', 'Target', 'Tools', 'Toos', 'Understand', 'Users', 'WPCode', 'Work'];

lines.forEach((line, idx) => {
  suspects.forEach(s => {
    // Look for s followed by ( where it is NOT inside a string or comment
    const regex = new RegExp(`(?<![\\w$'"])${s}\\s*\\(`, 'g');
    if (regex.test(line)) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  });
});
