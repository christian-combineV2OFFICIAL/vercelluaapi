let currentCode = ""; 

export default async function handler(req, res) {
  if (req.method === "GET") {

    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(currentCode);
  } 
  else if (req.method === "POST") {
    try {
      let body = "";
      req.on("data", chunk => { body += chunk; });
      req.on("end", () => {
        const parsed = JSON.parse(body);
        if (typeof parsed.code === "string") {
          currentCode = parsed.code; 
          res.status(200).send("Updated successfully");
        } else {
          res.status(400).send("Invalid JSON (expected { code: \"lua code\" })");
        }
      });
      req.on("error", err => {
        res.status(500).send("Failed to read request");
      });
    } catch {
      res.status(400).send("Invalid JSON");
    }
  } else {
    res.status(405).send("Method not allowed");
  }
}
