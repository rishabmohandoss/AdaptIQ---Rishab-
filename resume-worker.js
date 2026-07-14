// === ADAPTIQ RESUME WORKER === //
// Runs off the main thread: given already-extracted resume plain text
// (pdf.js/mammoth do the PDF/DOCX parsing on the main thread, since pdf.js
// already dispatches its own heavy lifting to its internal worker), this
// scans for known languages/frameworks and estimates tenure — CPU-bound
// dictionary/regex work that would otherwise add latency to the setup screen.

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',
  'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL', 'HTML',
  'CSS', 'Shell', 'Bash', 'Perl', 'Objective-C', 'Dart', 'Elixir', 'Haskell',
];

const FRAMEWORKS = [
  'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django',
  'Flask', 'FastAPI', 'Spring', 'Spring Boot', 'Rails', 'Laravel', '.NET',
  'ASP.NET', 'TensorFlow', 'PyTorch', 'Keras', 'scikit-learn', 'Pandas',
  'NumPy', 'Redux', 'GraphQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Firebase', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Jenkins',
  'Terraform', 'Webpack', 'jQuery', 'Bootstrap', 'Tailwind', 'Svelte',
  'Flutter', 'Unity',
];

function findMatches(text, dictionary) {
  const found = new Set();
  dictionary.forEach(term => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?<![a-zA-Z0-9])${escaped}(?![a-zA-Z0-9])`, 'i');
    if (re.test(text)) found.add(term);
  });
  return [...found];
}

function estimateTenureYears(text) {
  // Explicit mentions ("5+ years experience")
  let years = 0;
  const explicit = text.match(/(\d+(?:\.\d+)?)\+?\s*years?/gi) || [];
  explicit.forEach(m => {
    const n = parseFloat(m);
    if (!isNaN(n) && n < 50) years = Math.max(years, n);
  });

  // Date-range durations in work history ("2019 - 2022", "2019-Present")
  const ranges = text.match(/(19|20)\d{2}\s*[-–—]\s*((19|20)\d{2}|present|current)/gi) || [];
  let rangeTotal = 0;
  const now = new Date().getFullYear();
  ranges.forEach(r => {
    const parts = r.match(/(19|20)\d{2}|present|current/gi) || [];
    const start = parseInt(parts[0], 10);
    const end = /present|current/i.test(parts[1]) ? now : parseInt(parts[1], 10);
    if (!isNaN(start) && !isNaN(end) && end >= start) rangeTotal += (end - start);
  });

  return Math.round(Math.max(years, rangeTotal) * 10) / 10;
}

function extractResumeEntities(text) {
  return {
    languages: findMatches(text, LANGUAGES),
    frameworks: findMatches(text, FRAMEWORKS),
    tenureYears: estimateTenureYears(text),
  };
}

self.onmessage = (e) => {
  const { text } = e.data || {};
  self.postMessage(text ? extractResumeEntities(text) : { languages: [], frameworks: [], tenureYears: 0 });
};
