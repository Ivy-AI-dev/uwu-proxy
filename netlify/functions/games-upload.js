export const handler = async () => {
  return {
    statusCode: 501,
    body: JSON.stringify({ error: 'Game upload not available on Netlify — add game files directly to public/games/' }),
  };
};
