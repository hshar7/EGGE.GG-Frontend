import axios from "axios";
import {base, bn_id} from "../constants";
import {ApolloClient} from "apollo-client";
import {HttpLink} from "apollo-link-http";
import {InMemoryCache} from "apollo-cache-inmemory";
import gql from "graphql-tag";
import Web3 from "web3";
import Portis from "@portis/web3";
import assist from "bnc-assist";

const GET_MY_PROFILE = gql` {
    myProfile {
        id
        name
        email
        publicAddress
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
                                .post(`${base}/api/user`, {
                                    accountAddress: state.accountAddress,
                                    signature: result
                                })
                                .then(response => {
                                    localStorage.setItem("username", response.data.username);
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
                    if (window.location.pathname !== "/editUser") {
                        history.push("/editUser");
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
        uri: `${base}/graphql`,
        headers: {Authorization: "Bearer " + localStorage.getItem("jwtToken")}
    }),
    cache: new InMemoryCache()
});

const initWeb3 = async config => {
    let provider;
    if (localStorage.getItem("walletType") === "WEB3_BROWSER") {
        if (window.web3) provider = window.web3.currentProvider;
        else window.alert("Browser is not web3 enabled");
    } else if (localStorage.getItem("walletType") === "PORTIS") {
        const portis = await initPortis();
        provider = portis.provider;
    }
    const web3 = await initWeb3Instance(provider);
    let bncAssistConfig = {
        dappId: bn_id,
        networkId: 4,
        web3: web3,
        messages: {
            txPending: () => {
                return `Creating ${this.state.title}.`;
            },
            txConfirmed: () => {
                return `Created ${this.state.title} Successfully.`;
            }
        }
    };
    if (config !== undefined) {
        bncAssistConfig = Object.assign({}, bncAssistConfig, config);
    }
    const assistInstance = await assist.init(bncAssistConfig);
    await assistInstance.onboard();
    return new Promise(resolve => resolve({web3, assistInstance}));
};

const initPortis = () => {
    return new Promise(resolve => {
        resolve(new Portis('f3b1dfa9-feee-44c9-8e41-3deca837c2e8', 'rinkeby'));
    });
}

const initWeb3Instance = (provider) => {
    return new Promise(resolve => {
        resolve(new Web3(provider));
    });
}

export {apolloClient, prepUserForContract, signOnUser, sleep, initWeb3};
