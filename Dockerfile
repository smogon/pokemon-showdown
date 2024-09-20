
FROM node:alpine

EXPOSE 8000

WORKDIR /pokemon-espanol-server

RUN ["apk", "add", "git"]

RUN ["git", "init", "."]

RUN ["git", "remote", "add", "origin", "https://github.com/nzkdevsaider/pokemon-showdown.git"]

ENV NODE_ENV=production
ENV SERVERID=pokemonespanol
ENV SERVERTOKEN=token
ENV PROXYIP=127.0.0.1
ENV LOGINSERVER=http://play.pokemonshowdown.com/
ENV LOGINSERVERKEYALGO=RSA-SHA1
ENV LOGINSERVERPUBLICKEYID=4
ENV LOGINSERVERPUBLICKEY="-----BEGIN PUBLIC KEY-----\
	MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAzfWKQXg2k8c92aiTyN37\
	dl76iW0aeAighgzeesdar4xZT1A9yzLpj2DgR8F8rh4R32/EVOPmX7DCf0bYWeh3\
	QttP0HVKKKfsncJZ9DdNtKj1vWdUTklH8oeoIZKs54dwWgnEFKzb9gxqu+z+FJoQ\
	vPnvfjCRUPA84O4kqKSuZT2qiWMFMWNQPXl87v+8Atb+br/WXvZRyiLqIFSG+ySn\
	Nwx6V1C8CA1lYqcPcTfmQs+2b4SzUa8Qwkr9c1tZnXlWIWj8dVvdYtlo0sZZBfAm\
	X71Rsp2vwEleSFKV69jj+IzAfNHRRw+SADe3z6xONtrJOrp+uC/qnLNuuCfuOAgL\
	dnUVFLX2aGH0Wb7ZkriVvarRd+3otV33A8ilNPIoPb8XyFylImYEnoviIQuv+0VW\
	RMmQlQ6RMZNr6sf9pYMDhh2UjU11++8aUxBaso8zeSXC9hhp7mAa7OTxts1t3X57\
	72LqtHHEzxoyLj/QDJAsIfDmUNAq0hpkiRaXb96wTh3IyfI/Lqh+XmyJuo+S5GSs\
	RhlSYTL4lXnj/eOa23yaqxRihS2MT9EZ7jNd3WVWlWgExIS2kVyZhL48VA6rXDqr\
	Ko0LaPAMhcfETxlFQFutoWBRcH415A/EMXJa4FqYa9oeXWABNtKkUW0zrQ194btg\
	Y929lRybWEiKUr+4Yw2O1W0CAwEAAQ==\
	-----END PUBLIC KEY-----"
ENV PSBACKDOOR=true

ENTRYPOINT ["git", "pull", "origin", "master", "&&", "node", "pokemon-showdown"]

CMD ["-c"]