import Like from './Likes.js'
import Comment from './Comments.js'

export function createInteractionInstance(data) {
  if (!data) return [];

  // ✅ If data is a JSON string, parse it
  let interactions;
  try {
    interactions = typeof data === 'string' ? JSON.parse(data) : data;
  } catch (e) {
    console.error('Failed to parse interaction data:', e);
    return [];
  }

  if (!Array.isArray(interactions)) return [];

  return interactions
    .map((item) => {
      if (item.content === undefined) {
        return new Like(item);
      }

      if (item.content === null || item.content !== false) {
        return new Comment(item);
      }

      return null;
    })
    .filter(Boolean); // remove nulls
}
