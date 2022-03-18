FROM node:16

LABEL author="Brandon Layton"

# Options to set in the environment
# We will make a user to run the app
# and a directory to have the app installed in
ARG PUID=900

ENV USER pokemon
ENV SHOWDOWNDIR "/showdown"

# Create user 
# Create the app dir we use and have the user own it
# git clone the latest release into the app dir
# create a sym link from /config to config/config.js 
# to simplify the syntax to mount a custom config
# copy config-example as defualt config to /config and chown it
RUN useradd -u "${PUID}" -m "${USER}" \
	&& mkdir -p ${SHOWDOWNDIR} \
	&& chown ${USER} ${SHOWDOWNDIR} \
	&& su "${USER}" -c \
		"git clone https://github.com/smogon/pokemon-showdown.git --branch `git ls-remote --tags https://github.com/smogon/pokemon-showdown | tail -1 | cut -d / -f 3` ${SHOWDOWNDIR} \
		&& ln -s /config.js ${SHOWDOWNDIR}/config/config.js" \
  && cp ${SHOWDOWNDIR}/config/config-example.js /config.js \
  && chown ${USER} /config.js

# switch to the user
USER ${USER}

# set the working dir
WORKDIR ${SHOWDOWNDIR}

# make 3 volumes where data is written to
VOLUME ${SHOWDOWNDIR}/logs ${SHOWDOWNDIR}/config ${SHOWDOWNDIR}/databases

# expose the port the application uses
EXPOSE 8000

# finally run the application
CMD [ "node", "pokemon-showdown" ]
