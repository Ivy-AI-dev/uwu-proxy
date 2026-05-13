export const handler = async () => {
  return {
    statusCode: 501,
    body: JSON.stringify({ error: 'Game delete not available on Netlify — remove game files directly from public/games/' }),
  };
};
