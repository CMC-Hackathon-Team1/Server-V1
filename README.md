# GridgeTestChallenge  
#### 07.25 ~ 8.5 컴공선배팀 그릿지테스트

## Package Structure
```
📂 git@iamjooon2/GridgeTestChallenge
  ┣📂 src
    ┣📂 asset # 도커를 이용하여 데이터베이스 띄우는 디렉토리 
    ┣📂 controller # req->검사->service && service->검사->res, Controller Layer
    ┣📂 middleware # 미들웨어들을 짱박아둔 디렉토리
    ┣📂 repository # DB 접근하는 디렉토리, DataManager Layer
    ┣📂 router # 메서드 종류와 요청에 따른 분기를 다루는 곳
    ┣📂 service # Controller에서 비즈니스 로직만을 빼낸 곳, Service Layer
    ┣📂 utilitiy # response 관련 status와 함수들, 그 외 유틸관련 모아둔 곳
    ┣📜 index.js 
  ┣📂 swagger
  ┣ .env.example 
  ┣ docker-compose.yml # AWS 프리티어 안되서.. 도커로 로컬에서 디비 띄우자~
  ┣ package.json 

```
## API 로직

1. index.js(express) - 익스프레스가 띄운 서버로 접속
2. router/index.js - 도메인별 라우터로 분기
3. router/*.router.js - 해당하는 도메인 별 API로 넘김
4. controller/*.controller.js - 유효성 검사, 인증처리 등, Controller Layer
5. service/*.service.js - DB로 데이터 전달 혹은 DB에서 뽑아온 데이터 정제, Service Layer
6. repository/*.repository.js - DB 접근 쿼리들의 집합, DataManager Layer
7. DataBase


## How To Run
```
0. docker desktop 설치 후 실행
1. GridgeTestChallenge 경로로 이동
2. docker-compose up --build -d  // 도커 빌드
3. npm run db:init // 도커 데이터베이스 생성
4. npm run start // express 실행
5. npm run db:drop // 도커 데이터베이스 날리기...

```


## DB Scheme
https://drive.google.com/file/d/12tflQMZaL7TZuIMznBwQQKGe7IpBJMDD/view?usp=sharing


## Swagger
https://app.swaggerhub.com/apis-docs/iamjooon2/GridgeTestChallenge/1.0.0#/


## Feedback
 
- 게시글 좋아요/좋아요 취소의 경우 다중클릭시에도 계속 성공값이라는 reponse를 보내고 있습니다. type 값을 검사하는 형식적 validation 뿐만이 아니라, 로직적으로 이상을 감지하는 의미적 Validation 도 반드시 적용되어야 합니다.
- 서버 개발자로써 서버 코드를 작성하는 것이 중요한 것도 맞지만, 데이터베이스 쿼리 또한 중요한 영역이기 때문에 API기능개발에 익숙해지셨다면 쿼리를 더 효율적으로 작성하는법, 설계를 잘하는 법을 기르기 위해 SQL튜닝쪽도 공부해보시는 것을 추천드립니다