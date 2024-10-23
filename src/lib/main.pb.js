routerAdd("GET", "/hello/:name", (c) => {
	console.log("Hello from inside the hook get");
	let name = c.pathParam("name");

	return c.json(200, { message: "Hello " + name });
});

routerAdd("POST", "/test/:testId", (c) => {
	console.log("Hello from inside the hook post");
	const testId = c.pathParam("testId");

	return c.json(200, {
		testId,
	});
});

console.log("outside event record after create");
onRecordAfterCreateRequest((e) => {
	console.log("inside event record after create");
	console.log(e.httpContext);
	console.log(e.record);
	console.log(e.uploadedFiles);
}, "dentaMax");
