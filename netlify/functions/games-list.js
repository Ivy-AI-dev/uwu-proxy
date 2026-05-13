import { readFileSync } from 'fs';
import { join } from 'path';

export const handler = async () => {
  try {
    const p = join(process.cwd(), 'public', 'games', 'games.json');
    const games = JSON.parse(readFileSync(p, 'utf8'));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(games),
    };
  } catch {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: '[]' };
  }
};
