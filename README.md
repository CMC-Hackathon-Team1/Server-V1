# 2회 너디너리 해커톤 Team1 - 온앤오프
## Package Structure
```
📂 git@CMC-HACKATHON-TEAM1/Server
  ┣📂 asset
  ┣📂 src
    ┣📂 config # db connection option
    ┣📂 controller # req->검사->service && service->검사->res, Controller Layer
    ┣📂 DAO # DB 접근하는 디렉토리, DataManager Layer
    ┣📂 router # 메서드 종류와 요청에 따른 분기를 다루는 곳
    ┣📂 service # Controller에서 비즈니스 로직만을 빼낸 곳, Service Layer
    ┣📂 utilitiy # response 관련 status와 함수들
    ┣📜 index.js 
  ┣📂 swagger
  ┣ package.json 

```

## 개발시
```
npm run start(nodemon)
```

##  Swagger
```
http://3.36.187.9:5050/docs
```
