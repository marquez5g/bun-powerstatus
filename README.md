# bun-powerstatus

A server that waits for the command "turn on" to send an answer to a client. It checks every x miliseconds and timeouts with an y value, both provided as a command line argument. 

It uses long polling to keep the connection open for the client until the desired timeput.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts <client-timeout> <interval>
```

Where `client-timeout` is the time in miliseconds the conection remains open. The value `ìnterval` is how often in miliseconds you want to check for updates.
