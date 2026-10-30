export type Token = { text: string; cls?: 'kw' | 'str' | 'fn' | 'comment' };

/** A short, plain-language snippet — easy to read at a glance, not a jargon demo. */
export const SNIPPET: Token[][] = [
  [{ text: 'function', cls: 'kw' }, { text: ' aboutMe', cls: 'fn' }, { text: '() {' }],
  [{ text: '  return', cls: 'kw' }, { text: ' {' }],
  [{ text: '    name: ' }, { text: "'Rudra Sharma'", cls: 'str' }, { text: ',' }],
  [{ text: '    role: ' }, { text: "'Software Engineer'", cls: 'str' }, { text: ',' }],
  [{ text: '    stack: [' }, { text: "'TypeScript'", cls: 'str' }, { text: ', ' }, { text: "'React'", cls: 'str' }, { text: ', ' }, { text: "'Node.js'", cls: 'str' }, { text: '],' }],
  [{ text: '    based: ' }, { text: "'Bhopal, India'", cls: 'str' }, { text: ',' }],
  [{ text: '    shipping: ' }, { text: 'true', cls: 'kw' }, { text: ',' }],
  [{ text: '  };' }],
  [{ text: '}' }],
  [],
  [{ text: 'console.log', cls: 'fn' }, { text: '(aboutMe());' }],
  [],
  [{ text: '// thanks for stopping by', cls: 'comment' }],
];

export const TOTAL_CHARS = SNIPPET.reduce((sum, line) => {
  const lineLen = line.reduce((n, t) => n + t.text.length, 0);
  return sum + lineLen + 1; // +1 for the newline between lines
}, 0);

export const TYPE_MS = 26;
export const HOLD_MS = 1800;

/** Hex equivalents of the Tailwind accent tokens, for canvas drawing (no DOM there). */
export const TOKEN_HEX: Record<NonNullable<Token['cls']>, string> = {
  kw: '#ffb627',
  str: '#ff8c42',
  fn: '#ffd166',
  comment: '#76706a',
};
export const DEFAULT_HEX = '#f6efe4';
