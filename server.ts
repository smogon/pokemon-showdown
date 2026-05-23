import express from "express";
import http from "http";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (_, res) => {
	res.send(`<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>KONIVRER</title>
	<script>
		window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
	</script>
	<script defer src="/_vercel/insights/script.js"></script>
</head>
<body>
	<h1>KONIVRER online</h1>
</body>
</html>`);
});

const server = http.createServer(app);

server.listen(PORT, () => {
	console.log(`KONIVRER running on port ${PORT}`);
});
