import axios from "axios";
import {base} from "../constants";
import {ApolloClient} from "apollo-client";
import {HttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import gql from "graphql-tag";


const GET_MY_PROFILE = gql` {
    myProfile {
        id
        name
        email
        publicAddress
        organization {
            id
            name
        }
        avatar
    }
}`;

const signOnUser = (assistInstance, web3) => {
    return new Promise((resolve, reject) => {
        assistInstance.onboard().then(() => {
            assistInstance.getState().then(state => {
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
                                    localStorage.setItem("userAvatar", response.data.userAvatar);
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

const prepUserForContract = (assistInstance, history) => {
    return new Promise((resolve, reject) => {
        assistInstance.onboard().then(() => {
            apolloClient
                .query({
                    query: GET_MY_PROFILE
                }).then(response => {
                const responseData = response.data.myProfile;
                if (
                    isEmpty(responseData.name) ||
                    isEmpty(responseData.organization.name) ||
                    isEmpty(responseData.email)
                ) {
                    if (window.location.pathname !== "/editUser") {
                        history.push("/editUser");
                    }
                } else {
                    resolve(responseData);
                }
            })
                .catch(e => {
                    if (e.response.status === 401) {
                        if (window.location.pathname !== "/editUser") {
                            history.push("/editUser");
                        }
                    }
                    console.log({e});
                    reject(e);
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
    link: new HttpLink({
        uri: "https://api.egge.gg/graphql",
        headers: {Authorization: "Bearer " + localStorage.getItem("jwtToken")}
    }),
    cache: new InMemoryCache()
});

export {apolloClient, prepUserForContract, signOnUser, sleep};
