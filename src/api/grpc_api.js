import {UserServicerClient} from "../../proto/user/user_pb_service";
import {RegisterBeginRequest} from "../../proto/user/user_pb";

export default {
  install (app) {
    const grpcUserClient = new UserServicerClient(process.env.VUE_APP_GRPC_SERVICER, {
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
        exception = new Error(JSON.stringify(err));
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
      }
    };
  }
}