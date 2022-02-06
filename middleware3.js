const express = require("express");
const path = require("path");
const app = express();

app.set("port", process.env.PORT || 3003);

app.use("/error", (req, res, next) => {
    try {
        throw new Error(ReferenceError()); // ReferenceError를 유발한다.
    } catch (error) {
        next(error); // next()에 인수가 들어갈 때 에러 처리 미들웨어로 넘어간다.
    }
});

app.get("/", (req, res) => {
    res.json({ hello: "zerocho" }); // res.메서드 형식은 응답을 완료하는 메서드이다. 함수가 종료되는 메서드가 아니다.
    console.log("hello zerocho"); // 따라서 위에 res.메서드가 있어도 잘 실행된다.
    // res.render(); // res.메서드이며 일단은 응답을 완료하는 메서드라고 알아두자
});

app.get(
    "/routing",
    (req, res, next) => {
        res.sendFile(path.join(__dirname, "index.html"));
        console.log("실행되나요?");
        if (10 > 5) {
            /* next() 함수에 "route" 매개변수를 넣어주면 라우터가 가리키는 주소와 동일한 주소를 가리키는 라우터를 찾아간다.*/
            next("route");
        } else {
            // 조건문이 false값이면 next() 함수가 호출되서 바로 다음 미들웨어가 실행된다.
            next();
        }
    },
    (req, res) => {
        console.log("안되는 거 같아요");
    }
);

app.get("/??", (req, res) => {
    // 위에 미들웨어를 테스트 해보기 위한 미들웨어이다.
    //
    console.log("나는 언제 실행되요?");
});

app.get("/routing", (req, res) => {
    console.log("실행되요");
});

app.use((req, res, next) => {
    res.status(404).send("<h1>404 Error!</h1>");
});

app.use((err, req, res, next) => {
    res.status(500).send(err.message + " 나가라~");
    console.log("Error Detected!");
    setTimeout(() => {
        console.error(err);
    }, 2500);
});

app.listen(app.get("port"), () => {
    console.log("익스프레스 서버 실행 중");
});
