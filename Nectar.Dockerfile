FROM govtechsg/apex-proxy-node:0.37.15

EXPOSE 1337
ENTRYPOINT ["yarn", "serve"]
