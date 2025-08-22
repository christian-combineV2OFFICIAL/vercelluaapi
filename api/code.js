import fs from "fs";
import path from "path";



export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      res.setHeader("Content-Type", "text/plain");
      res.status(200).send(data.code || ""); // send `code` instead of `lua`
    } catch (e) {
      res.status(500).send("Failed to read code");
    }
  } 
  else if (req.method === "POST") {
    try {
      const body = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", chunk => { data += chunk; });
        req.on("end", () => resolve(data));
        req.on("error", err => reject(err));
      });

      const parsed = JSON.parse(body);

      if (typeof parsed.code === "string") { // check for `code`
        fs.writeFileSync(filePath, JSON.stringify({ code: parsed.code }, null, 2));
        res.status(200).send("Updated successfully");
      } else {
        res.status(400).send("Invalid JSON (expected { code: \"lua code\" })");
      }
    } catch (e) {
      res.status(400).send("Invalid JSON");
    }
  } else {
    res.status(405).send("Method not allowed");
  }
}

