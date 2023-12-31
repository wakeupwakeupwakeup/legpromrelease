import {useEffect} from 'react';
import {useLocation} from "react-router-dom";
import yandexAPI from "@/utils/services/auth/yandexAPI.js";

const Yatokenpage = () => {
    // Хук для парсинга URL
    let location = useLocation()

    async function handleYaRegister(data) {
        try {
            if (await yandexAPI(data, 'register')) {
                return true
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }

    useEffect(() => {
        //  Подключение скрипта от Yandex ID
        const yandexScript = document.createElement('script');
        yandexScript.src = 'https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-token-with-polyfills-latest.js';
        yandexScript.async = true;
        yandexScript.defer = true;
        document.head.appendChild(yandexScript);

        yandexScript.onload = () => {

            // Парсинг URL
            const urlParams = new URLSearchParams(location.hash);
            const accessToken = urlParams.get('#access_token')
            const data = {
                access_token: accessToken,
            }

            handleYaRegister(data)

            window.YaSendSuggestToken(
                'https://legpromrfreact.vercel.app/',
                {}
            );
        }
    }, [location.hash]);

    return (
        <>
        </>
    );
};

export default Yatokenpage;
