let latestCode = ""; 

export default async function handler(req, res) {
  if (req.method === "GET") {
    
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send(latestCode || "");
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

      if (typeof parsed.code === "string") {
        latestCode = parsed.code; // store code in memory
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
