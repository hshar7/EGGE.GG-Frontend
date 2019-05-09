import axios from "axios";
import {base} from "../constants";
import {ApolloClient} from "apollo-client";
import {HttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";

let signOnUser = (assistInstance, web3) => {
    return new Promise((resolve, reject) => {
        assistInstance.onboard().then(() => {
            assistInstance.getState().then(state => {
                console.log(state);
                console.log(web3);
                web3.personal.sign(
                    web3.sha3("hello world"), state.accountAddress,
                    (error, result) => {
                        if (!error) {
                            console.log(result);
                            axios
                                .post(`${base}/user`, {
                                    accountAddress: state.accountAddress,
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
                                    console.log({e});
                                    reject(e);
                                });
                        } else {
                            console.log(error);
                            reject(error);
                        }
                    });
            });
        });
    });
};

let prepUserForContract = (assistInstance) => {
    return new Promise((resolve, reject) => {
        assistInstance.onboard().then(() => {
            assistInstance.getState().then(state => {
                axios
                    .get(`${base}/user/me`)
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
                            resolve(response.data);
                        }
                    })
                    .catch(e => {
                        if (e.response.status === 401) {
                            if (window.location.pathname !== "/editUser") {
                                window.location.href = "/editUser";
                            }
                        }
                        console.log({e});
                        reject(e);
                    });
            });
        });
    })
};

function isEmpty(str) {
    return !str || 0 === str.length;
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

const apolloClient = new ApolloClient({
    link: new HttpLink({
        uri: "http://localhost:8080/graphql",
        headers: {Authorization: "Bearer " + localStorage.getItem("jwtToken")}
    }),
    cache: new InMemoryCache()
});

export {apolloClient, prepUserForContract, signOnUser, sleep};
