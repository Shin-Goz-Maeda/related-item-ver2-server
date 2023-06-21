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
  (req: any, res: { send: (arg0: string | number) => void }) => {
    try {
      const columns: string[] = [
        "brand",
        "item_category",
        "item_name",
        "item_img_url",
        "id",
      ];
      const table: string = "items_info";
      const sql: string = `SELECT ${columns} FROM ${table}`;

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
      const sql: string = `SELECT ${columns} FROM ${table} INNER JOIN ${joinTable} ON ${table}.item_id = ${joinTable}.item_id WHERE ${joinTable}.item_id = ?`;

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

app.post("/user-check", (req: any, res: any) => {
  try {
    const userId = req.body.data;
    const table: string = "users";
    const column: string = "uuid";
    const sql: string = `SELECT ${column} FROM ${table} WHERE ${column} = ?`;

    db.query(sql, [userId], (error: any, result: any) => {
      if (error) {
        console.log(error);
      } else {
        res.status(200).send({ success: result });
      }
    });
  } catch (error: any) {
    console.log(error);
  }
});

app.post(
  "/email-signUp",
  (
    req: {
      body: {
        data: {
          providerId: string | null;
          email: string;
          emailVerified: boolean;
          userId: string;
        };
      };
    },
    res: any
  ) => {
    try {
      // リクエスト情報
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

      // テーブル1
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
      const sql: string = `INSERT INTO ${table} (${columns}) VALUE (${numOfColumns})`;

      db.query(sql, [
        providerId,
        email,
        emailVerified,
        userId,
        USER_STATE.user_subscribed,
        DATE.created_at,
        DATE.updated_at,
      ]);

      // テーブル2
      const userName = null;
      const sex = null;
      const birthDay = null;
      const table2: string = "users_info";
      const columns2: string[] = [
        "uuid",
        "user_name",
        "sex",
        "birth_date",
        "created_at",
        "updated_at",
      ];
      const numOfColumns2: string[] = ["?", "?", "?", "?", "?", "?"];
      const sql2: string = `INSERT INTO ${table2} (${columns2}) VALUE (${numOfColumns2})`;

      db.query(sql2, [
        userId,
        userName,
        sex,
        birthDay,
        DATE.created_at,
        DATE.updated_at,
      ]);

      // テーブル3
      const wantToItem = null;
      const table3: string = "users_want_to_item";
      const columns3: string[] = [
        "uuid",
        "want_to_item",
        "created_at",
        "updated_at",
      ];
      const numOfColumns3: string[] = ["?", "?", "?", "?"];
      const sql3: string = `INSERT INTO ${table3} (${columns3}) VALUE (${numOfColumns3})`;

      db.query(sql3, [userId, wantToItem, DATE.created_at, DATE.updated_at]);
    } catch (error) {
      console.log(error);
    }
  }
);

// TODO: any型を修正
app.post(
  "/google-signUp",
  (
    req: {
      body: {
        data: {
          providerId: string | null;
          email: string;
          emailVerified: boolean;
          userId: string;
        };
      };
    },
    res: any
  ) => {
    try {
      let providerId = req.body.data.providerId;
      const email = req.body.data.email;
      let emailVerified = req.body.data.emailVerified;
      const userId = req.body.data.userId;

      if (providerId === "google.com") {
        providerId = "google";
      }
      if (emailVerified === false) {
        emailVerified = MAIL_VERIFIED_STATE.not_email_verified;
      } else {
        emailVerified = MAIL_VERIFIED_STATE.ok_email_verified;
      }
      // テーブル1
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
      const sql: string = `INSERT INTO ${table} (${columns}) VALUE (${numOfColumns})`;

      db.query(sql, [
        providerId,
        email,
        emailVerified,
        userId,
        USER_STATE.user_subscribed,
        DATE.created_at,
        DATE.updated_at,
      ]);

      // テーブル2
      const userName = null;
      const sex = null;
      const birthDay = null;
      const table2: string = "users_info";
      const columns2: string[] = [
        "uuid",
        "user_name",
        "sex",
        "birth_date",
        "created_at",
        "updated_at",
      ];
      const numOfColumns2: string[] = ["?", "?", "?", "?", "?", "?"];
      const sql2: string = `INSERT INTO ${table2} (${columns2}) VALUE (${numOfColumns2})`;

      db.query(sql2, [
        userId,
        userName,
        sex,
        birthDay,
        DATE.created_at,
        DATE.updated_at,
      ]);

      // テーブル3
      const wantToItem = null;
      const table3: string = "users_want_to_item";
      const columns3: string[] = [
        "uuid",
        "want_to_item",
        "created_at",
        "updated_at",
      ];
      const numOfColumns3: string[] = ["?", "?", "?", "?"];
      const sql3: string = `INSERT INTO ${table3} (${columns3}) VALUE (${numOfColumns3})`;

      db.query(sql3, [userId, wantToItem, DATE.created_at, DATE.updated_at]);
    } catch (error) {
      console.log(error);
    }
  }
);

// TODO: any型を修正
app.post("/email-signIn", (req: any, res: any) => {
  try {
    const userId = req.body.data.userId;
    let emailVerified = req.body.data.emailVerified;

    if (emailVerified) {
      emailVerified = MAIL_VERIFIED_STATE.ok_email_verified;
      const table: string = "users";
      const column1: string = "mail_verified_state";
      const column2: string = "updated_at";
      const whereColumn: string = "uuid";
      const sql: string = `UPDATE ${table} SET ${column1} = ?, ${column2} = ? WHERE ${whereColumn} = ?`;

      db.query(sql, [emailVerified, DATE.updated_at, userId]);
      res.status(200).send({ success: "success!!" });
    } else {
      res.status(401).send({ error: "not_mail_verified" });
    }
  } catch (error) {
    console.log(error);
  }
});

// TODO: any型を修正
app.post("/account-info-setUp", (req: any, res: any) => {
  try {
    const userId = req.body.data.userId;
    const userName = req.body.data.accountData.userName;
    const sex = req.body.data.accountData.sex;
    const birthDay = req.body.data.accountData.birthDay;
    const category = req.body.data.accountData.category;

    // データベースの情報をアップデート
    const table: string = "users_info";
    const column1: string = "user_name";
    const column2: string = "sex";
    const column3: string = "birth_date";
    const column4: string = "updated_at";
    const whereColumn: string = "uuid";
    const sql: string = `UPDATE ${table} SET ${column1} = ?, ${column2} = ?, ${column3} = ?, ${column4} = ? WHERE ${whereColumn} = ?`;

    db.query(sql, [userName, sex, birthDay, DATE.updated_at, userId]);

    const table2: string = "users_want_to_item";
    const column5: string = "want_to_item";
    const column6: string = "updated_at";
    const sql2: string = `UPDATE ${table2} SET ${column5} = ?, ${column6} = ? WHERE ${whereColumn} = ?`;

    db.query(sql2, [category, DATE.updated_at, userId]);
  } catch (error) {
    console.log(error);
  }
});

app.post("/account-info", (req: any, res: any) => {
  try {
    const userId = req.body.data;
    const columns: string[] = [
      "user_name",
      "sex",
      "birth_date",
      "want_to_item",
    ];
    const table: string = "users_info";
    const joinTable: string = "users_want_to_item";
    const whereColumn: string = "uuid";
    const sql: string = `SELECT ${columns} FROM ${table} INNER JOIN ${joinTable} ON ${table}.${whereColumn} = ${joinTable}.${whereColumn} WHERE ${joinTable}.${whereColumn} = ?`;

    db.query(sql, [userId], (error: string, result: string | number) => {
      if (error) {
        console.log(error);
      } else {
        res.status(200).send({ success: result });
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.post(
  "/password-reset-before-signIn",
  (
    req: { body: { data: string } },
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: { (arg0: { success: any }): void; new (): any };
      };
    }
  ) => {
    try {
      const email: string = req.body.data;
      const columns: string[] = ["mail_address", "provider"];
      const table: string = "users";
      const whereColumn: string = "mail_address";
      const sql = `SELECT ${columns} FROM ${table} WHERE ${whereColumn}`;
      db.query(sql, [email], (error: string, result: string) => {
        if (error) {
          console.log(error);
        } else {
          res.status(200).send({ success: result });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
);

app.post(
  "/password-reset-after-signIn",
  (
    req: { body: { data: string } },
    res: {
      status: (arg0: number) => {
        (): any;
        new (): any;
        send: { (arg0: { success: any }): void; new (): any };
      };
    }
  ) => {
    try {
      const userId: string = req.body.data;
      const columns: string[] = ["mail_address", "provider"];
      const table: string = "users";
      const whereColumn: string = "uuid";
      const sql = `SELECT ${columns} FROM ${table} WHERE ${whereColumn} = ?`;

      db.query(sql, [userId], (error: string, result: string) => {
        if (error) {
          console.log(error);
        } else {
          res.status(200).send({ success: result });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
