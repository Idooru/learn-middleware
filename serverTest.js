const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const multer = require("multer");
const index = require("./routes");
const user = require("./routes/user");
const morgan = require("morgan");
const app = express();

try {
    fs.readdirSync("uploads");
} catch (err) {
    console.error(err);
    fs.mkdirSync("uploads");
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, "uploads/");
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(
                null,
                path.basename(file.originalname, ext) + Date.now() + ext
            );
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

// app.post("/upload", upload.array("many"), (req, res) => {
//     console.log(req.file, req.body);
//     res.send("ok");
// });

dotenv.config();
app.set("port", process.env.PORT || 3007);
app.set("view engine", "html");
nunjucks.configure("views", {
    express: app,
    watch: true,
});

app.use("/index", index);
app.use("/user", user);
app.use(morgan("dev"));
app.use(express.json()); // post메서드로 받은 json형식의 데이터를 처리함
app.use(express.urlencoded({ extended: false })); // post메서드로 받은 url형식의 데이터를 처리함
app.use(bodyParser.raw()); // post메서드로 받은 버퍼형식의 데이터를 처리함
app.use(bodyParser.text()); // post메서드로 받은 text형식의 데이터를 처리함
app.use(cookieParser(process.env.COOKIE_SECRET)); // cookie를 해석해서 req.cookies 객체 형식으로 만듦, 매개변수를 비밀키로 이용가능
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: false,
            secure: false,
        },
        name: "session-cookie", // 세션 쿠키의 이름 설정
    })
);

app.get("/upload", (req, res) => {
    res.sendFile(path.join(__dirname, "./multipart.html"));
});

app.post("/upload", upload.single("image"), (req, res) => {
    console.log(req.file, req.body);
    res.send("ok");
});

function sayHello(word) {
    console.log(`Hello ${word}!`);
}

app.use("/routing", (req, res, next) => {
    const string = "routing";
    sayHello(string);
    next();
});

// app.get("*", (req, res) => {
//     res.send("날 막아봐라");
// });

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"));
});

app.use(
    "/postHerePlease",
    express.json()
); /* 상위 디렉터리에 미들웨어를 삽입해서 하위 디렉터리 
(/postHerePlease/I_must_need_first, /postHerePlease/:id)까지 영향을 끼침 */

app.post("/postHerePlease", (req, res) => {
    res.send(`값을 잘 받았습니다! \
    \n ${JSON.stringify(req.body)}`);
    // res.send(req.body);
    console.log(
        `${JSON.stringify(req.url)}에 ${JSON.stringify(req.body)}를 받았습니다!`
    );
});

app.post("/postHerePlease/I_must_need_first", (req, res) => {
    res.send(`보내주셔서 감사합니다! \
    \n ${JSON.stringify(req.body)}`);
    console.log(
        `${JSON.stringify(req.url)}에 ${JSON.stringify(req.body)}를 받았습니다!`
    );
});

app.post("/postHerePlease/json", (req, res) => {
    res.json(req.body);
});

app.post("/postHerePlease/:id", (req, res) => {
    res.send(`${req.params.id}로 값을 잘 받았습니다! \
    \n ${JSON.stringify(req.body)}`);
    console.log(
        `${JSON.stringify(req.url)}에 ${JSON.stringify(req.body)}를 받았습니다!`
    );
});

app.get("/cookie", (req, res) => {
    // 쿠키를 생성하는 메서드
    res.cookie("name1", "zerocho", {
        expires: new Date(Date.now() + 9000000), // 유효기간
        httpOnly: true, // http 이외의 다른 수단으로 쿠키에 접근 불가
        secure: true, // https일때만 쿠키 전송
    }).cookie("name2", "idooru", {
        // 쿠키는 한개만 생성 할 수 있는게 아님
        expires: new Date(Date.now() + 9000000),
        httpOnly: true,
        secure: true,
    });
    res.send(`쿠키 받아라!\
    <br>받은 쿠키 : ${JSON.stringify(req.cookies)}`);
    // Cookies that have not been signed
    console.log("Cookies: ", req.cookies.name1);
    console.log("Cookies: ", req.cookies.name2);
    // Cookies that have been signed
    // console.log("Signed Cookies: ", req.signedCookies);
});

app.get("/cookieRemover", (req, res) => {
    res.clearCookie("name1", "zerocho", { httpOnly: true, secure: true });
    res.send("쿠키가 지워졌습니다.");
});

app.get("/session-test", (req, res) => {
    req.session.name = "Idooru";
    res.send("세션 테스트");
});

app.get("/session-remover", (req, res) => {
    req.session.destroy();
    res.send("세션 삭제");
});

app.post("/post", function (req, res) {
    var post = req.body;
    console.log(post);
    res.send();
});

// s%3AsQGF6d9yOxX3N0xRQBz2bahvfNqGHOSC.VVAAIGSwI%2Bw%2FiDhVpExLV0qfyM%2Fwr5B0PVVRXKVe7lk
// s%3Ara-SvluJF49aTyyosuUUJToYqpjJg-c9.gdGbIFo6VX2xsjRPir4pBlqBgIoXdDg8L%2Fu%2BhH40Xgc

app.get("/query-test/:id", (req, res) => {
    console.log(req.params);
    console.log(req.query);
    res.send("query test");
});

app.get(
    "/routing",
    (req, res, next) => {
        res.send("routing");
        if (true) {
            next("route");
        } else {
            next();
        }
    },
    (req, res) => {
        console.log("라우팅 실패");
        throw new Error("에러 발생"); // 라우팅 실패시 에러 발생 상황
    }
);

app.get("/Header", (req, res) => {
    res.setHeader(200, { "Content-Type": "text/html; chatset=utf-8" }).send(
        "Header Test"
    );
});

app.set("ID", process.env.ID);

app.get("/var", (req, res) => {
    res.send(app.get("ID"));
});

app.get("/send", (req, res) => {
    res.data.value = 1;
});

app.get("/receive", (req, res) => {
    res.send(res.data.value);
});

app.get("/routing", (req, res) => {
    console.log("라우팅 성공");
});

app.get("/error", (req, res) => {
    throw new Error("갑자기 에러?!");
});

app.use((req, res, next) => {
    // 라우터 보다 아래 그리고 에러 처리 미들웨어 보다는 위에 404처리 미들웨어로 만듦
    res.status(404).send("<h1>404 Error!</h1>");
    throw new Error("404");
});

app.use((err, req, res, next) => {
    // console.log(" ### Error Detected ### ");
    // if (err.message === "404") {
    //     console.error(err);
    // } else if (err.message === "에러 발생") {
    //     // 라우팅 실패시 발생한 에러가 여기서 처리됨
    //     console.error(err);
    // } else {
    //     res.status(500).send(err.message);
    // }
    // setTimeout(() => {
    //     console.error(err);
    // }, 2500);
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV != "production" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

app.listen(app.get("port"), () => {
    console.log(`server is running at http://localhost:${app.get("port")}`);
});
