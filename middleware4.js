const express = require("express");
const path = require("path");
const app = express();

app.set("port", process.env.PORT || 3004);

// app.use((req, res, next) => {
//     console.log("모든 요청에 실행됩니다!");
//     next();
// });

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"));
});

app.get(
    "/err",
    (req, res, next) => {
        res.send("err1");
        next();
    },
    (req, res, next) => {
        res.send("err2");
    }
);

app.use("/test", (req, res, next) => {
    if (req.method === "GET") {
        console.log(
            `${req.originalUrl} 디렉터리에 ${req.method}요청이 들어왔습니다!`
        );
        next();
    } else if (req.method === "POST") {
        console.log(
            `${req.originalUrl} 디렉터리에 ${req.method}요청이 들어왔습니다!`
        );
        next();
    } else if (req.method === "PUT") {
        console.log(
            `${req.originalUrl} 디렉터리에 ${req.method}요청이 들어왔습니다!`
        );
        next();
    }
});

app.route("/test") // /test url에 대한 여러 요청을 받을 수 있게 .route()메서드를 사용한다.
    .get((req, res) => {
        res.send("Hello get request!");
    })
    .post((req, res) => {
        res.send("Hello post request!");
    })
    .put((req, res) => {
        res.send("Hello put request!");
    });

app.use("/dir", express.static(path.join(__dirname, "public")), (req, res) => {
    console.log("난 실행이 될까?");
}); // /dir 경로에 서버 폴더의 파일이름이 들어갈 시, 파일의 내용을 제공해준다.

app.use((req, res, next) => {
    res.status(404).send("<h1>404 Not Found</h1>");
    throw new Error(404);
});

app.use((err, req, res, next) => {
    console.log(" ### Error Detected! ### ");
    setTimeout(() => {
        console.error(err);
    }, 2000);
});

app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
});
