import express from "express";
import http from "http";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (_, res) => {
	res.send("KONIVRER online");
});

const server = http.createServer(app);

server.listen(PORT, () => {
	console.log(`KONIVRER running on port ${PORT}`);
});
