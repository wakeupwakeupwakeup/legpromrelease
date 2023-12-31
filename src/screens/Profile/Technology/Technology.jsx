import {Link, useNavigate} from 'react-router-dom';
import HeaderProfile from '@components/HeaderProfile/HeaderProfile';
import styles from './Technology.module.scss'
import { useForm, Controller } from 'react-hook-form'
import TitleProfile from "@components/TitleProfile/TitleProfile";
import Layout from "@layout/Layout";
import { useCallback, useEffect, useState } from "react";
import getPropObject from "@/utils/services/createOrder/fetchOrderData.js";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {technologySuccess, updateFormData} from "@store/orderForm/form.slice.js";

const Technology = () => {
    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors}
    } = useForm()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [formOptions, setFormOptions] = useState([])
    const [loading, setLoading] = useState(true)
    const purchase = useSelector((state) => state.form.purchaseStep)
    const technology = useSelector((state) => state.form.technologyStep)
    const conditions = useSelector((state) => state.form.conditionsStep)
    const contacts = useSelector((state) => state.form.contactsStep)

    const loadOptions = useCallback( async () => {
        try {
            const options = await getPropObject('technology');
            console.log(options);
            const labels = {
                spr_dop_uslugi: "Дополнительные услуги",
                spr_obraz_pay: "Оплата пошива образца",
                spr_obraz_poshiv: "Пошив образца",
                spr_tz_sirye: "Сырье",
                spr_tz_tehnolog: "Технологическая документация",
                spr_vid_tkani: "Вид сырья",
                spr_vid_uslug: "Вид нанесения",
                spr_tz_lekala: "Конструкторская документация"
            }

            const updatedOptions = Object.entries(labels).map(([propName, label]) => {
                return {
                    propName,
                    label,
                    options: options[propName]
                };
            });

            console.log(updatedOptions)

            setFormOptions(updatedOptions)

        } catch (error) {
            console.log(error);
        }
    }, [getPropObject])

    useEffect(() => {
        loadOptions();
    }, []);

    async function onSubmit() {
        dispatch(updateFormData(getValues()))
        dispatch(technologySuccess())
        console.log(getValues())
        navigate("/profile/order/conditions")
    }

    return (
        <>
            <Layout>
                <div className={styles.createOrder}>
                    <TitleProfile>Техническое задание</TitleProfile>

                    <div className={styles.createOrder__header}>
                        <HeaderProfile title="Изделие" number="1" href='/profile/order/createorder/' active={true}/>
                        <HeaderProfile title="Закупка" number="2" href='/profile/order/purchase' active={purchase}/>
                        <HeaderProfile title="Технология" number="3" href='/profile/order/technology' active={technology}/>
                        <HeaderProfile title="Условия" number="4" href='/profile/order/conditions' active={conditions}/>
                        <HeaderProfile title="Контакты" number="5" href='/profile/order/contacts' active={contacts}/>
                    </div>

                    <div className={styles.createOrder__order}>
                        <div className={styles.createOrder__content}>
                            <div className={styles.createOrder__body}>
                                <form
                                    className={styles.form}
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                        <div className={styles.form__content}>
                                            <div className={styles.form__row}>
                                                <div className={styles.form__items}>
                                                    {formOptions && formOptions.map((values, index) => (
                                                        <div key={index} className={styles.form__item}>
                                                            <h3 className={styles.form__itemLabel}>
                                                                <span>{values.label}</span>
                                                                {/*<span className={styles.form__itemLabel_star}>*</span>*/}
                                                            </h3>
                                                            {values.options && (
                                                                <Controller
                                                                    name={values.propName}
                                                                    control={control}
                                                                    render={({ field }) => (
                                                                        <Select
                                                                            {...field}
                                                                            isClearable={true}
                                                                            required={true}
                                                                            closeMenuOnSelect={false}
                                                                            isMulti={
                                                                            values.label === "Конструкторская документация" ||
                                                                                values.label === "Технологическая документация" ||
                                                                                values.label === "Сырье" ||
                                                                                values.label === "Вид сырья" ||
                                                                                values.label === "Вид нанесения" ||
                                                                                values.label === "Дополнительные услуги"
                                                                        }
                                                                            options={
                                                                                Object.entries(values.options).map(([value, num]) => ({
                                                                                    value: num,
                                                                                    label: value,
                                                                                }))
                                                                            }
                                                                            styles={{
                                                                                control: (provided) => ({
                                                                                    ...provided,
                                                                                    width: '100%', // Устанавливайте нужную вам ширину
                                                                                }),
                                                                            }}
                                                                            placeholder="нажмите для выбора"
                                                                            onChange={(selectedOption) => field.onChange(selectedOption)}
                                                                        />
                                                                    )}
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className={styles.form__row}>
                                                <div className={styles.form__items}>
                                                    <div className={styles.form__item}>
                                                        <h3 className={styles.form__itemLabel}>
                                                            <span>Плотность ткани</span>
                                                            {/*<span className={styles.form__itemLabel_star}>*</span>*/}
                                                        </h3>
                                                        <Controller
                                                            name="plotnost_tkani"
                                                            control={control}
                                                            rules={{
                                                                required: {
                                                                    value: true,
                                                                    message: 'Это поле обязательно'
                                                                },

                                                            }}
                                                            render={({ field }) => (
                                                                <div className={styles.form__textField}>
                                                                    <input type={"text"} {...field} placeholder="Введите плотность ткани" />
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className={styles.form__item}>
                                                        <h3 className={styles.form__itemLabel}>
                                                            <span>Размеры: сколько разных размеров/ростовок</span>
                                                            {/*<span className={styles.form__itemLabel_star}>*</span>*/}
                                                        </h3>
                                                        <Controller
                                                            name="razm"
                                                            control={control}
                                                            rules={{
                                                                required: {
                                                                    value: true,
                                                                    message: 'Это поле обязательно'
                                                                },

                                                            }}
                                                            render={({ field }) => (
                                                                <div className={styles.form__textField}>
                                                                    <input type={"text"} {...field} placeholder="Введите плотность ткани" />
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className={styles.form__item}>
                                                        <h3 className={styles.form__itemLabel}>
                                                            <span>Заказчик предоставляет образец</span>
                                                            {/*<span className={styles.form__itemLabel_star}>*</span>*/}
                                                        </h3>
                                                        <Controller
                                                            name="obraz_zak"
                                                            control={control}
                                                            rules={{
                                                                required: {
                                                                    value: true,
                                                                    message: 'Это поле обязательно'
                                                                },

                                                            }}
                                                            render={({ field }) => (
                                                                <div className={styles.form__radioWrapper}>
                                                                    <div className={styles.form__radio}>
                                                                        <label>Да</label>
                                                                        <input type="radio" {...field} value={true} />
                                                                    </div>
                                                                    <div className={styles.form__radio}>
                                                                        <label>Нет</label>
                                                                        <input type="radio" {...field} value={false} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.form__button}>
                                                <Link
                                                    to={"/profile/order/purchase"}
                                                    className={styles.form__buttonBack}
                                                >
                                                    Назад
                                                </Link>
                                                <button
                                                    type={"submit"}
                                                    className={errors ? styles.form__buttonForward : styles.form__buttonForward_disabled}
                                                >
                                                    Вперед
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Technology