const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("src/todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo(
  "0.0.0.0:4040",
  grpc.credentials.createInsecure()
);

const text = process.argv[2];

client.createTodo(
  {
    id: -1,
    text: text,
  },
  (err, response) => {
    console.log("Recieved from server ", JSON.stringify(response));
  }
);

client.readTodos({}, (err, response) => {
  console.log("Received list from server ", JSON.stringify(response));
  if (!response.items) {
    response.items.forEach((a) => console.log(a.text));
  }
});

const call = client.readTodosStream();
call.on("data", (item) => {
  console.log("received item from server " + JSON.stringify(item));
});

call.on("end", (e) => console.log("server done!"));
