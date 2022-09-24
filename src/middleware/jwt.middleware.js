const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const { response, errResponse } = require('../utility/response');
const userService = require('../service/user.service');
const baseResponse = require('../utility/baseResponseStatus');

const jwtMiddleware = (req, res, next) => {
    
    let accessToken = req.headers['x-access-token'] || req.headers['authorization'];
    if (!accessToken){
        return res.send(errResponse(baseResponse.TOKEN_EMPTY));
    }
    
    const token = accessToken.replace(/^Bearer\s+/, '');
    if (!token){
        return res.send(errResponse(baseResponse.TOKEN_EMPTY));
    }

    //토큰 검증
    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET , (error, verifiedToken) => {
                if (error) {
                    console.log('jwtMiddlwareError');
                    reject(error);
                }
                //검증 성공하면 verifiedToken으로 넘기기
                resolve(verifiedToken);
            })
        }
    );

    const onError = (error) => {
        return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
    }

    p.then( async (verifiedToken) => {
        // 비번 변경시 추가할 곳
        // DB에서 jwt 토큰 유무 검사(로그인 시 생성하며, 로그아웃 시 제거할 것)
        const loginCheckbyToken = await userService.checkValidAccess(verifiedToken.userIdx);

        // 로그아웃/회원탈퇴한 유저에 대해 접근하려는 경우
        if(loginCheckbyToken == null){
            return res.send(errResponse(baseResponse.TOKEN_WRONG_ACCESS));
        }
        // 현재 로그인되어있는 유저의 이전 로그인 jwt로 접근하려는 경우
        else if(loginCheckbyToken != token) {
            return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
        }
        else
            req.verifiedToken = verifiedToken;
            next();
    }).catch(onError);
};

module.exports = jwtMiddleware;