import axios from "axios";
import store from "../../store";
import { message } from "ant-design-vue";
import { i18n } from "@/assets/js/vue-i18n-init";
import { tokenKey } from "@/assets/js/helper";

const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 60000,
    headers: {
        // "Content-Type": "application/json",
        //   CO: "A",
        "Accept-Language": i18n.locale || "ru",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem(tokenKey);
        if (token) {
            config.headers["Authorization"] = "Bearer " + token;
        } else {
            delete config.headers["Authorization"];
        }

        if (!config.headers["Accept-Language"] == "") {
            config.headers["Accept-Language"] = i18n.locale || "ru";
        }

        // console.log("req", config);

        // if(config.headers['CO'] == '') {
        // 	delete config.headers['CO']
        // }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (res) => Promise.resolve(res),
    (error) => {
        // console.log('error', error.response)
        let result = {};
        if (
            error &&
            error.response &&
            error.response.data &&
            error.response.status === 400
        ) {
            // console.log(error.response.data);
            Promise.resolve(error.response.data);
            result = {
                code: 400,
                text: "Отправленный вами запрос неверный",
            };
        }

        if (error.response && error.response.status === 401) {
            sessionStorage.removeItem("token");
            delete axiosInstance.defaults.headers.common["Authorization"];
            // window.location.href = "/#/login";
            store.commit("setToken", "");
            result = {
                code: 401,
                text: "Требуется авторизация на сайте",
            };

            window.location.href = `${process.env.VUE_APP_PREFIX}/#/login`;
        }

        if (error.response && error.response.status === 404) {
            // console.log(error);
            result = {
                code: 404,
                text: "Не найдено",
            };
        }

        if (
            (error.response && error.response.status === 408) ||
            error.code === "ECONNABORTED"
        ) {
            // console.log(`A timeout happend on url ${ error.response }`);
            result = {
                code: 408,
                text: "Истекло время для ожидания запроса",
            };
        }

        if (error.response && error.response.status >= 500) {
            // alert("Ошибка 500: внутренняя ошибка сервера")
            // errStr = "Ошибка 500: внутренняя ошибка сервера";
            message.error("Внутренняя ошибка сервера");
            result = {
                code: 500,
                text: "Ошибка 500: внутренняя ошибка сервера",
            };
        }

        if (
            result &&
            result.code &&
            result.code != 400 &&
            error.response &&
            error.response.config &&
            error.response.config.url.indexOf("check-slug") == -1
        ) {
            message.error(result.text);
        }

        Promise.resolve(result);
        return result;
    }
);

export default axiosInstance;