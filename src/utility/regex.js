const regexDate = new RegExp(/(^(19|20)\d{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/); // YYYYMMDD 확인 정규표현식
const regexPassword = new RegExp(/^[a-zA-Z\\d`~!@#$%^&*()-_=+]{6,20}$/); // 특수문자 포함한 6~20자 허용하는 정규표현식
const regexPhone = new RegExp(/^01([0|1|6|7|8|9])-?([0-9]{4})-?([0-9]{4})$/); //전화번호 형식 확인 정규표현식
const regexDashDate = new RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/); // YYYY-MM-DD 날짜 정규표현식
const regexNum = new RegExp(/^[0-9]+$/);  // 숫자만 입력가능한 정규표현식