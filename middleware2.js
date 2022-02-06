const express = require("express");
const path = require("path");
const app = express();

app.set("port", process.env.PORT || 3002);

// app.use((req, res, next) => {
//     // 예시를 위한 모든 요청에 대한 미들웨어, 모든 요청에 오류를 발생시킨다.
//     throw new Error("갑자기 에러?!");
// });

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"));
});

app.use(
    "/about",
    (req, res, next) => {
        // "/about"에 대한 모든 요청이 들어 올 때 실행된다.
        console.log("about에서만 실행");
        res.write("<h1>only in about</h1>");
        res.write("of course");
        next();
    },
    (req, res, next) => {
        // 미들웨어는 한 라우터안에 여러 개 선언 할 수 있다.
        console.log("about에서만 실행되는 두번째 미들웨어");
        next();
    }
);

// app.get("/about/:id", (req, res, next) => {
//     // 위에 있던 미들 웨어가 use로 사용되어서 res.send를 사용하면 요청을 두번 보내버리는 효과가 있어 오류가 난다.
//     try {
//         const exceptErr = res.send(`<h1> ${req.params.id} </h1>`);
//     } catch (err) {
//         next(exceptErr);
//     }
// });

app.get("/error", (req, res) => {
    throw new Error("갑자기 에러?!");
});

app.use((req, res) => {
    // 라우터 보다 아래 그리고 에러 처리 미들웨어 보다는 위에 404처리 미들웨어로 만듦
    res.status(404).send("<h1>404 Error!</h1>");
});

app.use((err, req, res, next) => {
    // 상단 미들웨어에서 에러가 났을 경우 여기서 에러가 처리된다.
    // 에러 처리 미들웨어는 가능한 상단에서 에러가 날 경우를 대비해서 웬만하면 아래에서 선언한다.
    res.status(500).send(err.message + "당황하지 마시고 페이지를 나가세요");
    console.log("Error detected"); // 에러가 났음을 콘솔로 알린다.
    setTimeout(() => {
        // setTimeout() 비동기 함수를 사용하여 처음에 콘솔로 에러가 난것을 확인하고
        // 약 3초 뒤에 에러내용을 출력한다.
        console.error(err);
    }, 2000);
});

app.listen(app.get("port"), () => {
    console.log("익스프레스 서버 실행 중");
});
