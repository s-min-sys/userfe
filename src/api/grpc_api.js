import {UserServicerClient} from "../../proto/user/user_pb_service";
import {
  CheckTokenRequest,
  LoginBeginRequest,
  LoginCheckRequest, LoginEndRequest, LogoutRequest,
  RegisterBeginRequest,
  RegisterCheckRequest, RegisterEndRequest
} from "../../proto/user/user_pb";
import {AuthenticatorUserPassClient} from "../../proto/user/authenticator_userpass_pb_service";
import {LoginRequest, RegisterRequest} from "../../proto/user/authenticator_userpass_pb";
import {AuthenticatorGoogle2faClient} from "../../proto/user/authenticator_google2fa_pb_service";
import {DoSetupRequest, GetSetupInfoRequest, VerifyRequest} from "../../proto/user/authenticator_google2fa_pb";

import store from '@/store'

export default {
  install (app) {
    const grpcUserClient = new UserServicerClient(process.env.VUE_APP_GRPC_SERVICER, {
      withCredentials: true,
    })
    const grpcAuthenticatorUserPassClient = new AuthenticatorUserPassClient(process.env.VUE_APP_GRPC_SERVICER, {
      withCredentials: true,
    })
    const grpcAuthenticatorGoogle2FAClient = new AuthenticatorGoogle2faClient(process.env.VUE_APP_GRPC_SERVICER, {
      withCredentials: true,
    })

    const isJSON = (str) => {
      if (typeof str == "string") {
        try {
          const obj = JSON.parse(str);
          return typeof obj == "object" && obj;
        } catch (e) {
          return false;
        }
      }
      console.log("It is not a string!");
    };

    const checkGrpcException = (err, resp) => {
      let exception = null;

      if (err != null) {
        exception = err;
      } else if (resp == null) {
        exception = new Error("no resp");
      }

      if (exception !== null) {
        if (isJSON(exception.message)) {
          console.log(exception.message)
          const jsonObj = JSON.parse(exception.message);
          let msg = "";
          if (jsonObj["metadata"] !== undefined && jsonObj["metadata"]["headersMap"] !== undefined
            && jsonObj["metadata"]["headersMap"]["grpc-message"] !== undefined) {
            msg = decodeURIComponent(jsonObj["metadata"]["headersMap"]["grpc-message"][0])
          }
          if (jsonObj.code === 2) {
           console.log("连接服务失败！")
          } else if (jsonObj.code === 7) {
            if (msg === "") {
              msg = "无权限"
            }
           console.log(msg)
          } else if (jsonObj.code === 16) {
            if (msg !== "") {
             console.log(msg)
            }
            app.$store.commit("logout");
          } else if (jsonObj.code !== 0) {
            if (msg === "") {
              msg = "" + jsonObj.code+":未知错误"
            }
           console.log(msg)
          } else {
            if (msg === "") {
              msg = "未知错误"
            }
           console.log(msg)
          }
        } else {
         console.log(exception.message)
        }
      }

      return exception;
    };

    app.config.globalProperties.$grpc = {
      test() {
        console.log("*********************")
      },
      register() {
        return new Promise((resolve, reject) => {
          const req = new RegisterBeginRequest();
          grpcUserClient.registerBegin(req,{}, (err, resp) => {
            let exception = checkGrpcException(err, resp);
            if (exception !== null) {
              reject(exception);

              return;
            }

            resolve(resp);
          })
        })
      },
      registerCheck(bizID) {
        return new Promise((resolve, reject) => {
          const req = new RegisterCheckRequest();
          req.setBizId(bizID);
          grpcUserClient.registerCheck(req,{}, (err, resp) => {
            let exception = checkGrpcException(err, resp);
            if (exception !== null) {
              reject(exception);

              return;
            }

            resolve(resp);
          })
        })
      },
      registerEnd(bizID) {
        return new Promise((resolve, reject) => {
          const req = new RegisterEndRequest();
          req.setBizId(bizID);
          grpcUserClient.registerEnd(req,{}, (err, resp) => {
            let exception = checkGrpcException(err, resp);
            if (exception !== null) {
              reject(exception);

              return;
            }

            resolve(resp);
          })
        })
      },
      google2faGetSetupInfo(bizID) {
        return new Promise((resolve, reject) => {
          const req = new GetSetupInfoRequest();
          req.setBizId(bizID);
          grpcAuthenticatorGoogle2FAClient.getSetupInfo(req,{}, (err, resp) => {
            let exception = checkGrpcException(err, resp);
            if (exception !== null) {
              reject(exception);

              return;
            }

            resolve(resp);
          })
        })
      },
      google2faDoSetup(bizID, qrCode) {
        return new Promise((resolve, reject) => {
          const req = new DoSetupRequest();
          req.setBizId(bizID);
          req.setCode(qrCode);
          grpcAuthenticatorGoogle2FAClient.doSetup(req,{}, (err, resp) => {
            let exception = checkGrpcException(err, resp);
            if (exception !== null) {
              reject(exception);

              return;
            }

            resolve(resp);
          })
        })
      },
      google2faVerify(bizID, qrCode) {
        return new Promise((resolve, reject) => {
          const req = new VerifyRequest();
          req.setBizId(bizID);
          req.setCode(qrCode);
          grpcAuthenticatorGoogle2FAClient.verify(req,{}, (err, resp) => {
            let exception = checkGrpcException(err, resp);
            if (exception !== null) {
              reject(exception);

              return;
            }

            resolve(resp);
          })
        })
      },
      checkToken(token) {
        return new Promise((resolve, reject) => {
          const req = new CheckTokenRequest();
          grpcUserClient.checkToken(req,{
            'user_token': token,
          }, (err, resp) => {
            let exception = checkGrpcException(err, resp);
            if (exception !== null) {
              reject(exception);

              return;
            }

            resolve(resp);
          })
        })
      },
      login() {
        return new Promise((resolve, reject) => {
          const req = new LoginBeginRequest();
          grpcUserClient.loginBegin(req,{}, (err, resp) => {
            let exception = checkGrpcException(err, resp);
            if (exception !== null) {
              reject(exception);

              return;
            }

            resolve(resp);
          })
        })
      },
      loginCheck(bizID) {
        return new Promise((resolve, reject) => {
          const req = new LoginCheckRequest();
          req.setBizId(bizID);
          grpcUserClient.loginCheck(req,{}, (err, resp) => {
            let exception = checkGrpcException(err, resp);
            if (exception !== null) {
              reject(exception);

              return;
            }

            resolve(resp);
          })
        })
      },
      loginEnd(bizID) {
        return new Promise((resolve, reject) => {
          const req = new LoginEndRequest();
          req.setBizId(bizID);
          grpcUserClient.loginEnd(req,{}, (err, resp) => {
            let exception = checkGrpcException(err, resp);
            if (exception !== null) {
              reject(exception);

              return;
            }

            resolve(resp);
          })
        })
      },
      userPassRegister(bizID, userName, password) {
        return new Promise((resolve, reject) => {
          const req = new RegisterRequest();
          req.setBizId(bizID);
          req.setUserName(userName);
          req.setPassword(password);
          grpcAuthenticatorUserPassClient.register(req,{}, (err, resp) => {
            let exception = checkGrpcException(err, resp);
            if (exception !== null) {
              reject(exception);

              return;
            }

            resolve(resp);
          })
        })
      },
      userPassVerify(bizID, userName, password) {
        return new Promise((resolve, reject) => {
          const req = new LoginRequest();
          req.setBizId(bizID);
          req.setUserName(userName);
          req.setPassword(password);
          grpcAuthenticatorUserPassClient.login(req,{}, (err, resp) => {
            let exception = checkGrpcException(err, resp);
            if (exception !== null) {
              reject(exception);

              return;
            }

            resolve(resp);
          })
        })
      },
      logout() {
        const token = store.getters.token;

        store.commit('token', '');
        store.commit('userInfo', {});

        return new Promise((resolve, reject) => {
          if (typeof token !== 'string' || !token) {
            return
          }

          const req = new LogoutRequest();
          grpcUserClient.logout(req,{
            'user_token': token,
          }, (err, resp) => {
            let exception = checkGrpcException(err, resp);
            if (exception !== null) {
              reject(exception);

              return;
            }

            resolve(resp);
          })
        })
      }
    };
  }
}