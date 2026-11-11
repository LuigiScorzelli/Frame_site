// Stroke icons from the production home (main), shared by the home sections.
const base = { className: "h-6 w-6", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const IconaFulmine = () => <svg {...base}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>;
export const IconaCodice = () => (
  <svg {...base}><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14.5" y1="4" x2="9.5" y2="20" /></svg>
);
export const IconaAssistente = () => (
  <svg {...base}>
    <path d="M12 2a9 9 0 0 0-9 9c0 3.9 2.5 7.1 6 8.4V21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.6c3.5-1.3 6-4.5 6-8.4a9 9 0 0 0-9-9z" />
    <path d="M9 14c0-1.7 1.3-3 3-3s3 1.3 3 3" /><line x1="9" y1="10" x2="9.01" y2="10" /><line x1="15" y1="10" x2="15.01" y2="10" />
  </svg>
);
export const IconaScudo = () => <svg {...base}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
export const IconaRazzo = () => (
  <svg {...base}><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22.4 22.4 0 0 1-4 2z" /><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0" /><path d="M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5" /></svg>
);
export const IconaStella = () => <svg {...base}><polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2" /></svg>;
export const IconaCollegamento = () => (
  <svg {...base}><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></svg>
);
export const IconaSpunta = () => <svg {...base}><polyline points="20 6 9 17 4 12" /></svg>;
export const IconaCroce = () => <svg {...base}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
