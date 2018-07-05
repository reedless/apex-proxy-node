"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const connect_1 = __importDefault(require("connect"));
const dotenv_1 = require("dotenv");
const http_1 = __importDefault(require("http"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const lodash_1 = require("lodash");
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const handler_1 = require("./handler");
// Populate environment variable from dotenv file if applicable
try {
    dotenv_1.config({ path: path_1.default.join(__dirname, '../.env') });
}
catch (ex) {
    console.log('Unable to load dotenv', ex);
}
const config = config_1.getConfig();
const proxy = http_proxy_1.default.createProxyServer({
    // tslint:disable-next-line:max-line-length
    target: `https://${config.gateway1Host}:${config.gateway1Port}/${config.gateway1UrlPrefix}/${config.gateway2UrlPrefix}`,
    secure: config.secure,
});
proxy.on('proxyReq', (proxyReq, req) => {
    handler_1.proxyHandler(proxyReq, req, config);
});
proxy.on('proxyRes', (proxyRes) => {
    if (config.debug) {
        console.log(lodash_1.get(proxyRes, 'req._header'));
    }
});
proxy.on('error', (err, req) => {
    console.log(err);
    console.log(req);
});
const app = connect_1.default();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((req, res) => proxy.web(req, res, {
    changeOrigin: true,
}));
exports.server = http_1.default.createServer(app);
config_1.printConfig();
exports.server.listen(config.localPort);
//# sourceMappingURL=server.js.map