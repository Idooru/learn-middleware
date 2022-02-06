const e = require("express");
const express = require("express");
const session = require("express-session");

const app = express();

app.set("port", process.env.PORT || 3008);
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: "cookie_secret",
        cookie: {
            httpOnly: true,
            secure: false,
        },
        name: "Idooru_session",
    })
);

app.get("/", (req, res) => {
    res.send("hello world");
});

app.get("/makeSession", (req, res) => {
    if (req.session.test) {
        res.send("세션이 이미 존재");
        console.log("session is already exist");
    } else {
        req.session.test = "test string";
        req.session.save(() => {
            res.send("세션 생성 완료");
            console.log("session is created");
        });
    }
});

app.get("/confirmSession", (req, res) => {
    if (req.session.test) {
        console.log(req.session);
        res.send("세션 o");
    } else {
        console.log("no session");
        res.send("세션 x");
    }
});

app.get("/deleteSession", (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.send();
    } else {
        console.log("no session for delete");
        res.send("제거할 세션이 없습니다.");
    }
});

app.listen(app.get("port"), () => {
    console.log(`server is running at http://localhost:${app.get("port")}`);
});
