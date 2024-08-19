const interval = Number(Bun.argv[2]);
if (isNaN(interval)) putear();
console.info("interval =", interval);
let command = "";
let actionCompleted = false;

const putear = () => {
  console.error(`${Bun.argv[0]} ${Bun.argv[1]} <interval>`);
  process.exit(1);
};

if (Bun.argv.length != 3) putear();

const waitForClientAction = () => {
  return new Promise((resolve) => {
    const check = () => {
      if (actionCompleted) {
        actionCompleted = false; // Reset after acknowledging the action
        resolve("Action completed");
      } else {
        setTimeout(check, 100); // Check every 100 ms
      }
    };

    check();
  });
};

const waitForESPCommand = () => {
  return new Promise((resolve) => {
    const check = () => {
      if (command) {
        const currentCommand = command;
        command = ""; // Reset command after reading
        resolve(currentCommand);
      } else {
        setTimeout(check, 100); // Check every 100 ms
      }
    };

    check();
  });
};

const server = Bun.serve({
  port: 12000,
  async fetch(request) {
    const url = new URL(request.url);
    console.log(request.method, url.href);

    if (url.pathname === "/client/waitForAction") {
      if (request.method === "GET") {
        // Respond with "Action completed" or wait for it to complete
        const response = await waitForClientAction();
        return new Response(response);
      }
    } else if (url.pathname === "/esp/checkCommand") {
      if (request.method === "GET") {
        // Respond with command or wait for it to be set
        const response = await waitForESPCommand();
        return new Response(response);
      }
    } else if (url.pathname === "/esp/confirmAction") {
      if (request.method === "POST") {
        const formData = await request.formData();
        const content = formData.get("value");

        if (content === "completed") {
          actionCompleted = true; // Set flag to notify client
          return new Response("Action confirmed");
        }
      }
    } else if (url.pathname === "/submitCommand") {
      if (request.method === "POST") {
        const formData = await request.formData();
        const content = formData.get("value");

        if (content === "turn on") {
          command = content; // Store the command for ESP
          return new Response("Command sent");
        }
      }
    } else if (url.pathname === "/form") {
      if (request.method === "GET") {
        const headers = new Headers();
        headers.set("content-type", "text/html");
        const file = Bun.file("./views/index.html");
        const content = await file.text();
        return new Response(content, { headers });
      }
    }

    return Response.redirect("https://www.nasa.gov", 302);
  },
});

console.log(`Listening on ${server.url}`);

