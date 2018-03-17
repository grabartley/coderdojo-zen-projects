FROM anapsix/alpine-java:8_jdk
RUN apk --update add git
WORKDIR /usr/src/app
COPY docker-entrypoint /usr/src
CMD ["/bin/bash", "/usr/src/docker-entrypoint"]