import http, { IncomingMessage, ServerResponse } from "http";
import fs from "node:fs/promises";

const readFile = async (domain: string, pathName: string | undefined) => {
  return await fs.readFile(`./output/${domain}/${pathName}`);
};
type Role = "firstParty" | "thirdParty";
const httpServer = (role: Role, domain: string, port: number) => {
  const server = http.createServer();
  server.on("request", async (req: IncomingMessage, res: ServerResponse) => {
    if (req.url === "/favicon.ico") {
      res.writeHead(200, { "Content-Type": "image/x-icon" });
    } else if (req.url === "/") {
      try {
        const response = await fs.readFile(`./output/${domain}/index.html`);
        res.write(response);
      } catch (e) {
        res.write("");
      }
    } else {
      const pathName = req.url!.split("/").pop();
      if (role == "firstParty") {
        res.writeHead(200, { "Content-Type": "application/json" });
        try {
          const response = await readFile(domain, pathName);
          res.write(response);
        } catch (e) {
          res.write("");
        }
      } else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(200, { "Content-Type": "application/json" });
        try {
          const response = await readFile(domain, pathName);
          res.write(response);
        } catch (e) {
          res.write("");
        }
      }
    }
    res.end();
  });
  server.listen(port, domain);
};

httpServer("firstParty", "example-1st-party1.com", 9001);
httpServer("thirdParty", "example-3rd-party1.com", 9002);
httpServer("thirdParty", "example-3rd-party2.com", 9003);
httpServer("firstParty", "example-1st-party2.com", 9004);
