const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
const nunjucks = require("nunjucks");

dotenv.config();
const app = express();

app.set("port", process.env.PORT || 3001); // port를 3001으로 설정한다.
app.set("view engine", "html");
nunjucks.configure("views", {
    express: app,
    watch: true,
});

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
        name: "Idooru Session",
    })
);

// app.use((req, res, next) => {
//     // 모든 요청에 이 미들웨어를 실행한다.
//     console.log("모든 요청에 실행하고 싶어요");
//     next(); // next()를 호출함으로써 다음 미들웨어를 호출 할 수 있게 한다.
// });

// app.get("*", (req, res) => {
//     // 모든 get요청에 대하여 작동한다. 이전에 get 라우터를 만들어 두었다면 그 라우터들은 무시된다.
//     // "*" 경로가 포함된 라우터를 제일 앞에 두는 것은 효율적이지 못하다. 쓰지말자.
//     res.send("Hello everybody");
// });

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"));
});

app.post("/giveMeData", (req, res) => {
    if (req.body === undefined) {
        res.send("값을 못받았어요!");
        console.log("does not get value");
    } else {
        res.send(`${JSON.stringify(req.body)}를 잘 받았습니다!`);
        console.log(req.body);
    }
});

app.get("/category/Javascript", (req, res) => {
    // "/category/Javascript" 경로로 get요청을 보낸다.
    res.send("Hello Javascript");
});

app.get("/category/:name", (req, res) => {
    // "/category/:name"에서 ':' 뒤에 있는 값을 매개변수로 받는다.
    res.send(`Hello ${req.params.name} !`); // ':' 뒤에 매개변수를 받아 값으로 출력한다.
});

app.get("/about", (req, res) => {
    // "/about" 경로로 get 요청을 보낸다.
    res.send("Hello express");
});

app.use((req, res, next) => {
    // 404 처리 미들웨어
    const error = new Error(`${req.method} ${req.url}에 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    // 전체 에러에 대한 에러 처리 미들웨어
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});

app.listen(app.get("port"), () => {
    // 서버가 app.get("port")라는 포트에서 대기 중이라는 것을 알린다.
    console.log("익스프레스 서버 실행");
});
