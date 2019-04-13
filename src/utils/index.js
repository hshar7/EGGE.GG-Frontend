import axios from "axios";
import { base } from "../constants";

let onboardUser = (assistInstance) => {
    return new Promise((resolve, reject) => {
        assistInstance.onboard().then(() => {
            assistInstance.getState().then(state => {
                axios.post(`${base}/user`, {
                    accountAddress: state.accountAddress
                }).then(response => {
                    if (isEmpty(response.data.name) || isEmpty(response.data.organization) || isEmpty(response.data.email)) {
                        window.location.href = "/editUser";
                    } else {
                        localStorage.setItem('userName', response.data.name);
                        resolve(response.data);
                    }
                })
            })
        }).catch(e => { console.log({ e }) && reject(e); });
    });
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

export { onboardUser };
