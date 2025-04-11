/* Anime And Manga Commands - Adult Content Filtering
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
  rating: string | null;
}

interface JikanManga {
  mal_id: number;
  title: string;
  title_english: string | null;
  chapters: number | null;
  volumes: number | null;
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
  rating: string | null;
}


/* Adult content filter */
const adultRatings = ['Rx - Hentai', 'R+ - Mild Nudity', 'R - 17+ (Violence & Profanity)'];

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

async function fetchMangaInfoJikan(query: string): Promise<JikanManga | null> {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=1`);
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return data.data[0] as JikanManga;
    } else {
      console.log(`No manga found for '${query}' on Jikan.`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching data from Jikan API:', error);
    return null;
  }
}

async function fetchUpcomingAnime(): Promise<JikanAnime[]> {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/seasons/upcoming`);
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return data.data.slice(0, 5) as JikanAnime[]; // Return top 5 upcoming anime
    } else {
      console.log(`No upcoming anime found.`);
      return [];
    }
  } catch (error) {
    console.error('Error fetching upcoming anime from Jikan API:', error);
    return [];
  }
}

function truncateSynopsis(synopsis: string, maxLength: number): string {
  if (synopsis.length <= maxLength) return Chat.escapeHTML(synopsis);
  const truncated = synopsis.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  return Chat.escapeHTML(truncated.slice(0, lastSpaceIndex)) + '...';
}

function createReplyBox(info: JikanAnime | JikanManga, type: 'anime' | 'manga'): string {
  if (info.rating && adultRatings.includes(info.rating)) {
    return `Warning: The ${type} '${Chat.escapeHTML(info.title)}' may contain mature content (rated ${Chat.escapeHTML(info.rating)}). Viewer discretion is advised.`;
  }

  let reply = `<div style="display: flex; border: 1px solid #ccc; border-radius: 5px; padding: 5px; margin: 5px; overflow: hidden;">`;

  if (info.images?.jpg?.image_url) {
    reply += `<div style="flex: 0 0 auto; margin-right: 10px;">`;
    reply += `<img src="${Chat.escapeHTML(info.images.jpg.image_url)}" alt="Cover Image" style="width: 100px; height: 150px;">`;
    reply += `</div>`;
  }

  reply += `<div style="flex: 1 1 auto; font-size: 0.9em;">`;
  reply += `<strong>${Chat.escapeHTML(info.title)}`;
  if (info.title_english) {
    reply += ` / ${Chat.escapeHTML(info.title_english)}`;
  }
  reply += `</strong><br>`;

  reply += `<strong>Status:</strong> ${Chat.escapeHTML(info.status || 'N/A')}<br>`;
  if (type === 'anime') {
    reply += `<strong>Episodes:</strong> ${(info as JikanAnime).episodes || 'N/A'}<br>`;
  } else {
    reply += `<strong>Chapters:</strong> ${(info as JikanManga).chapters || 'N/A'}<br>`;
    reply += `<strong>Volumes:</strong> ${(info as JikanManga).volumes || 'N/A'}<br>`;
  }

  if (info.genres && info.genres.length > 0) {
    reply += `<strong>Genres:</strong> ${info.genres.map(g => Chat.escapeHTML(g.name)).join(', ')}<br>`;
  }

  if (info.synopsis) {
    const truncatedSynopsis = truncateSynopsis(info.synopsis, 500);
    reply += `<strong>Synopsis:</strong> ${truncatedSynopsis}`;
    if (info.synopsis.length > 500) {
      reply += ` <a href="https://myanimelist.net/${type}/${info.mal_id}" target="_blank">Read more</a>`;
    }
    reply += `<br>`;
  }

  reply += `<a href="https://myanimelist.net/${type}/${info.mal_id}" target="_blank" style="text-decoration: none;">View on MyAnimeList</a>`;
  reply += `</div></div>`;
  return reply;
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
        this.sendReplyBox(createReplyBox(animeInfo, 'anime'));
      } else {
        this.sendReplyBox(`No information found for '${Chat.escapeHTML(animeName)}' on Jikan.`);
      }
    },
    help: [
      `/anime [anime name] - Searches Jikan for information about the specified anime and displays it in a compact layout.`,
    ],
  },

  manga: {
    '': async function (target, room, user) {
      if (!this.runBroadcast()) return;
      if (!target) {
        return this.sendReply('Usage: /manga [manga name]');
      }
      const mangaName = target.trim();
      this.sendReply(`Searching Jikan for manga: ${mangaName}...`);
      const mangaInfo = await fetchMangaInfoJikan(mangaName);
      if (mangaInfo) {
        this.sendReplyBox(createReplyBox(mangaInfo, 'manga'));
      } else {
        this.sendReplyBox(`No manga information found for '${Chat.escapeHTML(mangaName)}' on Jikan.`);
      }
    },
    help: [
      `/manga [manga name] - Searches Jikan for information about the specified manga and displays it in a compact layout.`,
    ],
  },

  upcominganime: {
    '': async function (target, room, user) {
      if (!this.runBroadcast()) return;

      const genreQuery = target.trim().toLowerCase(); // Extract genre from the target
      this.sendReply(`Fetching upcoming anime${genreQuery ? ` with genre "${genreQuery}"` : ''}...`);

      const upcomingAnime = await fetchUpcomingAnime();
      if (upcomingAnime.length > 0) {
        // Filter anime by genre if a genre is specified
        const filteredAnime = genreQuery
          ? upcomingAnime.filter(anime =>
              anime.genres.some(genre => genre.name.toLowerCase() === genreQuery)
            )
          : upcomingAnime;

        if (filteredAnime.length === 0) {
          return this.sendReplyBox(
            `No upcoming anime found with the genre "${Chat.escapeHTML(genreQuery)}".`
          );
        }

        let reply = `<div style="max-height: 350px; overflow-y: auto; border: 1px solid #ccc; border-radius: 5px; padding: 10px;">`;
        reply += `<strong>Top Upcoming Anime${genreQuery ? ` in "${Chat.escapeHTML(genreQuery)}"` : ''}:</strong><br>`;
        for (const [index, anime] of filteredAnime.entries()) {
          reply += `<div style="display: flex; padding: 5px 0;">`;

          if (anime.images?.jpg?.image_url) {
            reply += `<div style="flex: 0 0 auto; margin-right: 10px;">`;
            reply += `<img src="${Chat.escapeHTML(anime.images.jpg.image_url)}" alt="Anime Cover" style="width: 100px; height: 150px;">`;
            reply += `</div>`;
          }

          reply += `<div style="flex: 1 1 auto; font-size: 0.9em;">`;
          reply += `<strong>${Chat.escapeHTML(anime.title)}`;
          if (anime.title_english) {
            reply += ` / ${Chat.escapeHTML(anime.title_english)}`;
          }
          reply += `</strong><br>`;
          reply += `<strong>Status:</strong> ${Chat.escapeHTML(anime.status || 'N/A')}<br>`;
          reply += `<strong>Genres:</strong> ${anime.genres.map(g => Chat.escapeHTML(g.name)).join(', ') || 'N/A'}<br>`;

          // Display the release date if available
          if (anime.aired?.from) {
            const releaseDate = new Date(anime.aired.from).toLocaleDateString();
            reply += `<strong>Release Date:</strong> ${releaseDate}<br>`;
          }

          if (anime.synopsis) {
            const truncatedSynopsis = truncateSynopsis(anime.synopsis, 200);
            reply += `<strong>Synopsis:</strong> ${truncatedSynopsis}`;
            if (anime.synopsis.length > 200) {
              reply += ` <a href="https://myanimelist.net/anime/${anime.mal_id}" target="_blank">Read more</a>`;
            }
            reply += `<br>`;
          }

          reply += `<a href="https://myanimelist.net/anime/${anime.mal_id}" target="_blank" style="text-decoration: none;">View on MyAnimeList</a>`;
          reply += `</div></div>`;

          // Add a horizontal line between anime, except for the last one
          if (index < filteredAnime.length - 1) {
            reply += `<hr style="border: 0; border-top: 1px solid #ccc; margin: 10px 0;">`;
          }
        }
        reply += `</div>`;
        this.sendReplyBox(reply);
      } else {
        this.sendReplyBox(`No upcoming anime found.`);
      }
    },
    help: [
      `/upcominganime [genre] - Fetches and displays the top upcoming anime from MyAnimeList, filtered by the specified genre (optional).`,
      `Examples:`,
      `- /upcominganime action`,
      `- /upcominganime romance`,
    ],
  },
};
