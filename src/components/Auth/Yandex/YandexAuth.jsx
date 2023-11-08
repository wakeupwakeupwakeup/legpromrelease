import {useEffect} from 'react';
import {createSelector} from "@reduxjs/toolkit";
import {useSelector} from "react-redux";
import yandexAPI from "@/utils/services/auth/yandexAPI.js";
import styles from "@layout/Modal/ModalAuth/ModalAuth.module.scss";

const YandexAuth = () => {

    const selectAuthModal = (state) => state.authModal
    const selectAuthModalData = createSelector(selectAuthModal, (authModal) => ({
        authMode: authModal.authMode,
    }))
    const authMode = useSelector(selectAuthModalData)

    useEffect(() => {
        const yandexScript = document.createElement('script');
        yandexScript.src = 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js';
        yandexScript.async = true;
        document.head.appendChild(yandexScript);
        yandexScript.onload = () => {
            window.YaAuthSuggest.init(
                {
                    client_id: 'a6273e01cb89483dbecc90c845a8360a',
                    response_type: 'token',
                },
                `https://legprom-rf.vercel.app/tokenpage/`,
                {
                    view: "button",
                    parentId: "yandex",
                    buttonSize: 'xs',
                    buttonView: 'main',
                    buttonTheme: 'light',
                    buttonBorderRadius: "18",
                    buttonIcon: 'ya',
                }
            )
                .then(function(result) {
                    return result.handler()
                })
                .then(function(data) {
                    yandexAPI(data, authMode)
                    console.log('Сообщение с токеном: ', data);
                    document.body.innerHTML += `Сообщение с токеном: ${JSON.stringify(data)}`;
                })
                .catch(function(error) {
                    console.log('Что-то пошло не так: ', error);
                    document.body.innerHTML += `Что-то пошло не так: ${JSON.stringify(error)}`;
                });
        };
    }, []);

    return (
        <div
            className={styles.form__ID}
            id="yandex"
        ></div>
    );
};

export default YandexAuth