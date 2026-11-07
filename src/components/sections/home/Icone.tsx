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
