import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const filePath = path.resolve("./code.json");

  if (req.method === "GET") {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.setHeader("Content-Type", "text/plain");
    res.send(data.lua);
  }

  else if (req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        if (typeof parsed.lua === "string") {
          fs.writeFileSync(filePath, JSON.stringify({ lua: parsed.lua }, null, 2));
          res.status(200).send("Updated successfully");
        } else {
          res.status(400).send("Invalid JSON (expected { lua: \"code\" })");
        }
      } catch (e) {
        res.status(400).send("Invalid JSON");
      }
    });
  }

  else {
    res.status(405).send("Method not allowed");
  }
}
