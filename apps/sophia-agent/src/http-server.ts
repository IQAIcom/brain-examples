import http from "node:http";

// Create a simple HTTP server to keep the container alive in Cloud Run
const server = http.createServer((req, res) => {
	res.writeHead(200);
	res.end("sophia agent is running");
});

export function startServer() {
	const port = process.env.SERVER_PORT || 3000;
	server.listen(port, () => {
		console.log(`HTTP server listening on port ${port}`);
	});
}
