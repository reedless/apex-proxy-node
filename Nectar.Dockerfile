FROM govtechsg/apex-proxy-node:0.37.44

EXPOSE 1337
ENTRYPOINT ["node", "dist/server.js"]
