/* Anime Commands
 * Initial Release
 * Credits: Prince Sky, TurboRx
 */

interface JikanAnime {
  mal_id: number;
  title: string;
  title_english: string | null;
  episodes: number | null;
  status: string | null;
  genres: {
    name: string;
  }[];
  synopsis: string | null;
  images: {
    jpg: {
      image_url: string;
    };
  };
}

async function fetchAnimeInfoJikan(query: string): Promise<JikanAnime | null> {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`);
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return data.data[0] as JikanAnime;
    } else {
      console.log(`No anime found for '${query}' on Jikan.`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching data from Jikan API:', error);
    return null;
  }
}

export const commands: Chat.ChatCommands = {
  anime: {
    '': async function (target, room, user) {
      if (!this.runBroadcast()) return;
      if (!target) {
        return this.sendReply('Usage: /anime [anime name]');
      }
      const animeName = target.trim();
      this.sendReply(`Searching Jikan for: ${animeName}...`);
      const animeInfo = await fetchAnimeInfoJikan(animeName);
      if (animeInfo) {
        let reply = `<div style="display: flex; border: 1px solid #ccc; border-radius: 5px; padding: 5px; margin: 5px; overflow: hidden;">`;

        if (animeInfo.images?.jpg?.image_url) {
          reply += `<div style="flex: 0 0 auto; margin-right: 10px;">`;
          reply += `<img src="${Chat.escapeHTML(animeInfo.images.jpg.image_url)}" alt="Cover Image" style="width: 100px; height: 150px;">`;
          reply += `</div>`;
        }

        reply += `<div style="flex: 1 1 auto; font-size: 0.9em;">`;
        reply += `<strong>${Chat.escapeHTML(animeInfo.title)}`;
        if (animeInfo.title_english) {
          reply += ` / ${Chat.escapeHTML(animeInfo.title_english)}`;
        }
        reply += `</strong><br>`;

        reply += `<strong>Status:</strong> ${Chat.escapeHTML(animeInfo.status || 'N/A')}<br>`;
        reply += `<strong>Episodes:</strong> ${animeInfo.episodes || 'N/A'}<br>`;
        if (animeInfo.genres && animeInfo.genres.length > 0) {
          reply += `<strong>Genres:</strong> ${animeInfo.genres.map(g => Chat.escapeHTML(g.name)).join(', ')}<br>`;
        }

        if (animeInfo.synopsis) {
          const truncatedSynopsis = animeInfo.synopsis.length > 500
            ? `${Chat.escapeHTML(animeInfo.synopsis.slice(0, 500))}...`
            : Chat.escapeHTML(animeInfo.synopsis);

          reply += `<strong>Synopsis:</strong> ${truncatedSynopsis}`;
          if (animeInfo.synopsis.length > 500) {
            reply += ` <a href="https://myanimelist.net/anime/${animeInfo.mal_id}" target="_blank">Read more</a>`;
          }
          reply += `<br>`;
        }

        reply += `<a href="https://myanimelist.net/anime/${animeInfo.mal_id}" target="_blank" style="text-decoration: none;">View on MyAnimeList</a>`;
        reply += `</div></div>`;

        this.sendReplyBox(reply);
      } else {
        this.sendReplyBox(`No information found for '${Chat.escapeHTML(animeName)}' on Jikan.`);
      }
    },
    help: [
      `/anime [anime name] - Searches Jikan for information about the specified anime and displays it in a compact layout.`,
      `The displayed information includes Japanese and English titles, cover image (on the side), status, number of episodes, genres, truncated synopsis (with "Read More" link), and a link to MyAnimeList.`,
    ],
  },
};
