const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = [
  // Primary
  { from: /\bbg-primary\b/g, to: 'bg-[var(--primary)]' },
  { from: /\btext-primary\b/g, to: 'text-[var(--primary)]' },
  { from: /\border-primary\b/g, to: 'border-[var(--primary)]' },
  { from: /\bring-primary\b/g, to: 'ring-[var(--primary)]' },
  { from: /\bshadow-primary\b/g, to: 'shadow-[var(--primary)]' },

  // Navy -> Navy var
  { from: /\bbg-navy\b/g, to: 'bg-[var(--navy)]' },
  { from: /\btext-navy\b/g, to: 'text-[var(--navy)]' },
  { from: /\border-navy\b/g, to: 'border-[var(--navy)]' },
  
  // Slate/Black foregrounds -> Foreground var
  { from: /\bbg-slate-900\b/g, to: 'bg-[var(--foreground)]' },
  { from: /\btext-slate-900\b/g, to: 'text-[var(--foreground)]' },
  { from: /\btext-black\b/g, to: 'text-[var(--foreground)]' },
  { from: /\border-slate-800\b/g, to: 'border-[var(--border)]' },
  
  // White backgrounds/text -> Background var
  { from: /\bbg-white\b/g, to: 'bg-[var(--background)]' },
  { from: /\btext-white\b/g, to: 'text-[var(--background)]' },
  { from: /\border-white\b/g, to: 'border-[var(--background)]' },
  
  // Muted background
  { from: /\bbg-slate-100\b/g, to: 'bg-[var(--muted)]' },
  { from: /\bbg-gray-100\b/g, to: 'bg-[var(--muted)]' },
  { from: /\bbg-slate-50\b/g, to: 'bg-[var(--accent)]' },
  
  // Muted foreground 
  { from: /\btext-slate-500\b/g, to: 'text-[var(--muted-foreground)]' },
  { from: /\btext-slate-600\b/g, to: 'text-[var(--muted-foreground)]' },
  { from: /\btext-slate-400\b/g, to: 'text-[var(--muted-foreground)]' },
  
  // Border
  { from: /\border-slate-200\b/g, to: 'border-[var(--border)]' },
  { from: /\border-slate-100\b/g, to: 'border-[var(--border)]' },

  // Warnings / Dangers / Success
  { from: /\bbg-red-500\b/g, to: 'bg-[var(--danger)]' },
  { from: /\bbg-fire-red\b/g, to: 'bg-[var(--danger)]' },
  { from: /\btext-red-500\b/g, to: 'text-[var(--danger)]' },
  { from: /\btext-emerald-600\b/g, to: 'text-[var(--success)]' },
  { from: /\btext-yellow-400\b/g, to: 'text-[var(--warning)]' },
];

walkDir(path.join(__dirname, 'src'), function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    replacements.forEach(({from, to}) => {
      content = content.replace(from, to);
    });
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Updated ' + filePath);
    }
  }
});

const cssPath = path.join(__dirname, 'src/app/globals.css');
let css = fs.readFileSync(cssPath, 'utf8');

const newVars = `:root {
  --primary: #0073E6;
  --navy: #0A192F;
  --background: #FFFFFF;
  --foreground: #0A192F;
  --muted: #F1F5F9;
  --muted-foreground: #64748B;
  --accent: #F8FAFC;
  --accent-foreground: #0A192F;
  --border: #E2E8F0;
  --danger: #ef4444;
  --warning: #facc15;
  --success: #059669;
  --card: #FFFFFF;
  --card-foreground: #0A192F;
  --popover: #FFFFFF;
  --popover-foreground: #0A192F;
  --primary-foreground: #FFFFFF;
  --secondary: #F1F5F9;
  --secondary-foreground: #0A192F;
  --destructive: #ef4444;
  --destructive-foreground: #FFFFFF;
  --input: #E2E8F0;
  --ring: #0073E6;
  --radius: 0.125rem;
}`;

css = css.replace(/:root\s*\{[\s\S]*?\}/, newVars);
fs.writeFileSync(cssPath, css);
console.log('Updated globals.css: Added all HEX custom properties to :root.');
