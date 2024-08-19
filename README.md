# bun-powerstatus

A server that waits for the command "turn on" to send an answer to a client. It checks every x miliseconds provided as a command line argument. 

It uses long polling to keep the connection open for the client.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts <interval>
```

Where `ìnterval` is how often in miliseconds you want to check for updates.
