const express = require("express");
const cors = require("cors");
const { db } = require("./db/index.ts");
const { CLIENT_REQUEST_DOMAIN } = require("./constants/index");
const {
  PORT,
  USER_STATE,
  MAIL_VERIFIED_STATE,
  DATE,
} = require("./constants/index");
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: CLIENT_REQUEST_DOMAIN,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// サーバーが起動しているかチェックするため、パスを設定
app.get("/", (req: Request, res: { send: (arg0: string) => void }) => {
  try {
    res.send("<div>hello</div>");
    return;
  } catch (error) {
    console.log(error);
  }
});

// メインページからのリクエストに対し、すべてのアイテム情報を返す処理
app.get(
  "/getImgMainPage",
  (req: Request, res: { send: (arg0: string | number) => void }) => {
    try {
      const columns: string[] = [
        "brand",
        "item_category",
        "item_name",
        "item_img_url",
        "id",
      ];

      const table: string = "items_info";

      const sql = `SELECT ${columns} FROM ${table}`;

      db.query(sql, (error: string, result: string | number) => {
        if (error) {
          console.log(error);
        } else {
          res.send(result);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
);

// アイテムページからのリクエストに対し、該当するアイテムの詳細情報だけを返す処理
app.get(
  "/itemPage/:id",
  (
    req: { params: { id: number } },
    res: { send: (arg0: string | number) => void }
  ) => {
    try {
      const id = req.params.id;

      const columns: string[] = [
        "item_name",
        "brand",
        "item_category",
        "item_info",
        "item_url",
        "item_img_url",
        "instagram_embed_code",
      ];

      const table: string = "items_info";

      const joinTable: string = " instagram_items_info";

      const sql = `SELECT ${columns} FROM ${table} INNER JOIN ${joinTable} ON ${table}.item_id = ${joinTable}.item_id WHERE ${joinTable}.item_id = ?`;

      db.query(sql, [id], (error: string, result: string | number) => {
        if (error) {
          console.log(error);
        } else {
          res.send(result);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
);

app.post("/email-signUp", (req: any, res: any) => {
  try {
    let providerId = req.body.data.providerId;
    const email = req.body.data.email;
    let emailVerified = req.body.data.emailVerified;
    const userId = req.body.data.userId;

    if (providerId === null) {
      providerId = "email";
    }
    if (emailVerified === false) {
      emailVerified = MAIL_VERIFIED_STATE.not_email_verified;
    }

    const table: string = "users";

    const columns: string[] = [
      "provider",
      "mail_address",
      "mail_verified_state",
      "uuid",
      "user_state",
      "created_at",
      "updated_at",
    ];

    const numOfColumns: string[] = ["?", "?", "?", "?", "?", "?", "?"];

    const sql = `INSERT INTO ${table} (${columns}) VALUE (${numOfColumns})`;
    db.query(sql, [
      providerId,
      email,
      emailVerified,
      userId,
      USER_STATE.user_subscribed,
      DATE.created_at,
      DATE.updated_at,
    ]);
  } catch (error) {
    console.log(error);
  }
});

// TODO: any型を修正
app.get("/google-signUp", (req: any, res: any) => {
  try {
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
