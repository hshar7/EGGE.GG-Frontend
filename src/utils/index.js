import axios from "axios";
import { base } from "../constants";

let onboardUser = assistInstance => {
  return new Promise((resolve, reject) => {
    assistInstance
      .onboard()
      .then(() => {
        assistInstance.getState().then(state => {
          axios
            .post(`${base}/user`, {
              accountAddress: state.accountAddress
            })
            .then(response => {
              if (
                isEmpty(response.data.name) ||
                isEmpty(response.data.organization) ||
                isEmpty(response.data.email)
              ) {
                if (window.location.pathname !== "/editUser") {
                  window.location.href = "/editUser";
                }
              } else {
                localStorage.setItem("userName", response.data.name);
                localStorage.setItem(
                  "publicAddress",
                  response.data.publicAddress
                );
                localStorage.setItem("userId", response.data.id);
              }
              resolve(response.data);
            });
        });
      })
      .catch(e => {
        console.log({ e }) && reject(e);
      });
  });
};

function isEmpty(str) {
  return !str || 0 === str.length;
}

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export { onboardUser, sleep };
