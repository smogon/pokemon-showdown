/* Anime And Manga Commands
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
}

interface JikanAnimeAiring {
  mal_id: number;
  title: string;
  title_english: string | null;
  episodes: number | null;
  status: string | null;
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

async function fetchAiringAnimeJikan(): Promise<JikanAnimeAiring[] | null> {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime?status=airing&limit=10`); // Adjust limit as needed
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return data.data as JikanAnimeAiring[];
    } else {
      console.log('No currently airing anime found on Jikan.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching airing anime data from Jikan API:', error);
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
        let reply = `<div style="display: flex; border: 1px solid #ccc; border-radius: 5px; padding: 5px; margin: 5px; overflow: hidden;">`;

        if (mangaInfo.images?.jpg?.image_url) {
          reply += `<div style="flex: 0 0 auto; margin-right: 10px;">`;
          reply += `<img src="${Chat.escapeHTML(mangaInfo.images.jpg.image_url)}" alt="Cover Image" style="width: 100px; height: 150px;">`;
          reply += `</div>`;
        }

        reply += `<div style="flex: 1 1 auto; font-size: 0.9em;">`;
        reply += `<strong>${Chat.escapeHTML(mangaInfo.title)}`;
        if (mangaInfo.title_english) {
          reply += ` / ${Chat.escapeHTML(mangaInfo.title_english)}`;
        }
        reply += `</strong><br>`;

        reply += `<strong>Status:</strong> ${Chat.escapeHTML(mangaInfo.status || 'N/A')}<br>`;
        reply += `<strong>Chapters:</strong> ${mangaInfo.chapters || 'N/A'}<br>`;
        reply += `<strong>Volumes:</strong> ${mangaInfo.volumes || 'N/A'}<br>`;
        if (mangaInfo.genres && mangaInfo.genres.length > 0) {
          reply += `<strong>Genres:</strong> ${mangaInfo.genres.map(g => Chat.escapeHTML(g.name)).join(', ')}<br>`;
        }

        if (mangaInfo.synopsis) {
          const truncatedSynopsis = mangaInfo.synopsis.length > 500
            ? `${Chat.escapeHTML(mangaInfo.synopsis.slice(0, 500))}...`
            : Chat.escapeHTML(mangaInfo.synopsis);

          reply += `<strong>Synopsis:</strong> ${truncatedSynopsis}`;
          if (mangaInfo.synopsis.length > 500) {
            reply += ` <a href="https://myanimelist.net/manga/${mangaInfo.mal_id}" target="_blank">Read more</a>`;
          }
          reply += `<br>`;
        }

        reply += `<a href="https://myanimelist.net/manga/${mangaInfo.mal_id}" target="_blank" style="text-decoration: none;">View on MyAnimeList</a>`;
        reply += `</div></div>`;

        this.sendReplyBox(reply);
      } else {
        this.sendReplyBox(`No manga information found for '${Chat.escapeHTML(mangaName)}' on Jikan.`);
      }
    },
    help: [
      `/manga [manga name] - Searches Jikan for information about the specified manga and displays it in a compact layout.`,
      `The displayed information includes Japanese and English titles, cover image (on the side), status, number of chapters and volumes, genres, truncated synopsis (with "Read More" link), and a link to MyAnimeList.`,
    ],
  },

	animenow: {
    '': async function (target, room, user) {
      if (!this.runBroadcast()) return;
      this.sendReply('Fetching currently airing anime from Jikan...');
      const airingAnime = await fetchAiringAnimeJikan();
      if (airingAnime && airingAnime.length > 0) {
        let reply = `<div style="border: 1px solid #ccc; border-radius: 5px; padding: 5px; margin: 5px;">`;
        reply += `<strong>Currently Airing Anime:</strong><br>`;
        for (const anime of airingAnime) {
          reply += `<div style="display: flex; align-items: center; margin-bottom: 5px;">`;
          if (anime.images?.jpg?.image_url) {
            reply += `<img src="${Chat.escapeHTML(anime.images.jpg.image_url)}" alt="Cover" style="width: 50px; height: 75px; margin-right: 10px;">`;
          }
          reply += `<a href="https://myanimelist.net/anime/${anime.mal_id}" target="_blank" style="text-decoration: none;">${Chat.escapeHTML(anime.title)}</a>`;
          if (anime.title_english) {
            reply += ` (${Chat.escapeHTML(anime.title_english)})`;
          }
          reply += `</div>`;
        }
        reply += `</div>`;
        this.sendReplyBox(reply);
      } else {
        this.sendReplyBox('Could not retrieve currently airing anime information from Jikan.');
      }
    },
    help: [
      `/animenow - Displays a list of currently airing anime from Jikan.`,
    ],
  },
};
