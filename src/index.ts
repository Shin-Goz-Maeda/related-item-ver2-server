const express = require("express");
const cors = require("cors");
const { db } = require("./db/index.ts");
const { CLIENT_REQUEST_DOMAIN } = require("./constants/index");
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: CLIENT_REQUEST_DOMAIN,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.get("/", (req: Request, res: { send: (arg0: string) => void }) => {
  try {
    res.send("<div>hello</div>");
    return;
  } catch (error) {
    console.log(error);
  }
});

app.get(
  "/getImgMainPage",
  (req: Request, res: { send: (arg0: string | number) => void }) => {
    try {
      console.log(req);
      const columns: string[] = [
        "brand",
        "item_category",
        "item_name",
        "item_img_url",
        "id",
      ];

      const table: string = "items_info";

      const sql = `SELECT ${columns} FROM ${table}`;

      db.query(sql, (err: string, result: string | number) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
