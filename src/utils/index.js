import axios from "axios";
import { base } from "../constants";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

let onboardUser = (assistInstance, web3) => {
  return new Promise((resolve, reject) => {
    assistInstance.onboard().then(() => {
      assistInstance.getState().then(state => {
        web3.personal.sign(
          web3.sha3("hello world"),
          web3.eth.accounts[0],
          (error, result) => {
            if (!error) {
              console.log(result);
              axios
                .post(`${base}/user`, {
                  accountAddress: web3.eth.accounts[0],
                  signature: result
                })
                .then(response => {
                  localStorage.setItem("userName", response.data.userName);
                  localStorage.setItem(
                    "publicAddress",
                    response.data.publicAddress
                  );
                  localStorage.setItem("userId", response.data.userId);
                  localStorage.setItem("jwtToken", response.data.accessToken);
                  resolve(response.data);
                })
                .catch(e => {
                  console.log({ e });
                  reject(e);
                });
            } else {
              console.log(error);
              reject(error);
            }
          }
        );
      });
    });
  });
};

let checkUserData = (assistInstance, web3) => {
  return new Promise((resolve, reject) => {
    assistInstance.onboard().then(() => {
      assistInstance.getState().then(state => {
        web3.personal.sign(
          web3.sha3("hello world"),
          web3.eth.accounts[0],
          (error, result) => {
            if (!error) {
              console.log(result);
              axios
                .post(`${base}/user`, {
                  accountAddress: web3.eth.accounts[0],
                  signature: result
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
                })
                .catch(e => {
                  console.log({ e }) && reject(e);
                });
            } else {
              console.log(error);
            }
          }
        );
      });
    });
  });
};

function isEmpty(str) {
  return !str || 0 === str.length;
}

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

const apolloClient = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  link: new HttpLink({
    uri: "http://localhost:8080/graphql",
    headers: { Authorization: "Bearer " + localStorage.getItem("jwtToken") }
  }),
  cache: new InMemoryCache()
});

export { apolloClient, onboardUser, sleep };
