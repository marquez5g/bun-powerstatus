let command = "";

const putear = () => {
  console.error(`${Bun.argv[0]} ${Bun.argv[1]} <client-timeout> <interval>`);
  process.exit(1);
};

if (Bun.argv.length != 4) putear();

const clientTimeout = Number(Bun.argv[2]);
const interval = Number(Bun.argv[3]);

if (isNaN(clientTimeout) || isNaN(interval)) putear();

console.info("clientTimeout =", clientTimeout);
console.info("interval =", interval);

const waitForChange = (timeout: number) => {
  return new Promise<string>((resolve) => {
    const start = Date.now();

    const check = () => {
      if (command === "turn on") {
        command = "";
        resolve("on");
      } else if (Date.now() - start >= timeout) {
        resolve("timeout");
      } else {
        setTimeout(check, interval);
      }
    };

    check();
  });
};

const server = Bun.serve({
  port: 12000,
  async fetch(request, server) {
    const url = new URL(request.url);
    console.log("URL:", url.href);

    if (url.pathname === "/ask/powerstatus") {
      if (request.method === "GET") {
        const value = await waitForChange(clientTimeout); // 10000
        return new Response(value);
      } else if (request.method === "PUT") {
        const content = await request.text();
        if (content === "turn on") {
          command = content;
          return new Response();
        }
      }
    }

    return Response.redirect("https://www.nasa.gov", 302);
  },
});

console.log(`Listening on ${server.url}`);
