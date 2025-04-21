export function convertRequestToNode(req) {
    const contentType = req.headers.get("content-type") || "";
    const contentLength = req.headers.get("content-length") || "0";
  
    const duplex = req.body;
  
    return {
      headers: {
        "content-type": contentType,
        "content-length": contentLength,
      },
      method: req.method,
      url: req.url,
      body: duplex,
      on: (...args) => duplex.on(...args),
      pipe: (...args) => duplex.pipe(...args),
    };
  }
  