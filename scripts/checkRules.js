const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getStagedFiles() {
  try {
    const out = execSync('git diff --cached --name-only', { encoding: 'utf8' });
    return out.split(/\r?\n/).filter(Boolean);
  } catch (e) {
    console.error('Could not get staged files:', e.message);
    process.exit(2);
  }
}

function main() {
  const staged = getStagedFiles();
  const rules = staged.filter(f => f.startsWith('rules/') && f.endsWith('.mdc'));
  if (rules.length === 0) {
    console.log('No staged rules files found.');
    process.exit(0);
  }

  // Read commit message from .git/COMMIT_EDITMSG if available
  const gitDir = path.join(process.cwd(), '.git');
  const commitMsgFile = path.join(gitDir, 'COMMIT_EDITMSG');
  let commitMsg = '';
  if (fs.existsSync(commitMsgFile)) {
    commitMsg = fs.readFileSync(commitMsgFile, 'utf8');
  } else {
    // fallback to reading from env or args
    commitMsg = process.env.COMMIT_MSG || '';
  }

  const missing = rules.filter(r => !commitMsg.includes(path.basename(r)));
  if (missing.length > 0) {
    console.error('Commit message must reference staged rules files by filename:');
    missing.forEach(m => console.error(' - ' + m));
    console.error('\nPlease include the rule file name(s) in your commit message.');
    process.exit(1);
  }

  console.log('All staged rules files are referenced in the commit message.');
}

main();
