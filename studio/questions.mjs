// Explicit template mode until the authenticated question-generation backend is live.
export function buildPracticeQuestions({company,role,description,resumeText}) {
  const skills=['Python','JavaScript','TypeScript','Java','SQL','React','AWS','Excel','data analysis','machine learning','customer service','project management','product strategy','user research','sales','marketing','communication','leadership'];
  const mentions=(text,skill)=>new RegExp(`(^|[^a-z0-9])${skill.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}([^a-z0-9]|$)`,'i').test(text);
  const required=skills.filter(skill=>mentions(description,skill));
  const shared=required.filter(skill=>mentions(resumeText,skill));
  const focus=shared[0]||required[0];
  const gap=required.find(skill=>!shared.includes(skill));
  return [
    `What interests you about the ${role} role at ${company}?`,
    focus?`Tell me about a time you used ${focus} to solve a problem.`:'Which experience from your resume best prepares you for this role?',
    `Describe a time you worked through a disagreement with a teammate.`,
    gap?`How would you build your skills in ${gap} for this role?`:`Tell me about a project where you had to learn something new under a deadline.`,
    `Which result from your past work would you want the team at ${company} to know about?`
  ];
}
