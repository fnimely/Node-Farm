const fs = require("fs");
const http = require("http");
const url = require("url");
// requiring third party modules
const slugify = require("slugify");
// requiring own module
const replaceTemplate = require("./modules/replaceTemplate");

// read and return data from a file - sync
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut = `This is what we know about avocados: ${textIn}.\nCreated on ${Date.now()}`;
// // write to a file
// fs.writeFileSync("./txt/input.txt", textOut);
// console.log("Files written!");

// async file read - callback hell
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR");

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile(
//         "./txt/final.txt",
//         `${data2}\n${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("File has been written to.😄");
//         }
//       );
//     });
//   });
// });
// console.log("Will read file");

/////////////////
// SERVER

// read a file sync to be send to client
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

// returns a string
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
// convert that string to an obj
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  // console.log(url.req);
  // console.log(url.parse(req.url, true));
  const { query, pathname } = url.parse(req.url, true);

  // overview page
  if (pathname === "/" || pathname === "/overview") {
    // send a response header
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el)) // create a card template for each obj
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    // console.log(cardsHtml);
    res.end(output);

    // product
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    // url.pathname = slugify(el.productName, { lower: true });

    console.log("url.req: ", url.req);

    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    // tell the browser what's being sent back - json in this case
    res.writeHead(200, { "Content-type": "application/json" });

    // end needs to send back a string
    res.end(data);
  } else {
    // the response header
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });

    res.end("<h1>Page not found</h1>");
  }
});

// listen to request from the client
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
