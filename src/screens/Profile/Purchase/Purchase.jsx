import HeaderProfile from '@components/HeaderProfile/HeaderProfile';
import styles from './Purchase.module.scss'
import { useForm, Controller } from 'react-hook-form'
import TitleProfile from "@components/TitleProfile/TitleProfile";
import Layout from "@layout/Layout";
import {useCallback, useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import getPropObject from "@/utils/services/createOrder/fetchOrderData.js";
import {useDispatch, useSelector} from "react-redux";
import {purchaseSuccess, updateFormData} from "@store/orderForm/form.slice.js";
import Select from "react-select";
import Skeleton from "react-loading-skeleton";

const Purchase = () => {
    const {
        control,
        handleSubmit,
        getValues,
        watch,
        formState: { errors}
    } = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [formOptions, setFormOptions] = useState([])
    const [loading, setLoading] = useState(true)
    const purchase = useSelector((state) => state.form.purchaseStep)
    const technology = useSelector((state) => state.form.technologyStep)
    const conditions = useSelector((state) => state.form.conditionsStep)
    const contacts = useSelector((state) => state.form.contactsStep)

    const loadOptions = useCallback( async () => {
        try {
            const options = await getPropObject('purchase');
            console.log(options);
            const labels = {
                spr_price_nds: "с/без НДС",
                tz_reg_post: "Регион",
            };

            const updatedOptions = Object.entries(labels).map(([propName, label]) => {
                return {
                    propName,
                    label,
                    options: options[propName]
                };
            });

            console.log(updatedOptions)
            setLoading(false)
            setFormOptions(updatedOptions)
        } catch (error) {
            console.log(error);
        }
    }, [getPropObject])

    useEffect(() => {
        loadOptions();
    }, []);

    const firstFieldValue = watch('count') || 0;
    const secondFieldValue = watch('price_one') || 0;
    const sum = (parseFloat(firstFieldValue) * parseFloat(secondFieldValue)).toFixed(2)

    async function onSubmit() {
        dispatch(updateFormData(getValues()))
        dispatch(updateFormData({price_part: sum }))
        dispatch(purchaseSuccess())
        console.log(getValues())
        navigate("/profile/order/technology")
    }

    const SkeletonItem = () => (
        <div className={styles.form__skeleton}>
            <Skeleton width={"50%"}/>
            <Skeleton height={"35px"} />
        </div>
    )

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
                                {
                                    <form
                                        className={styles.form}
                                        onSubmit={handleSubmit(onSubmit)}

                                    >
                                        <div className={styles.form__content}>
                                            <div className={styles.form__row}>
                                                <div className={styles.form__items}>
                                                    {
                                                        formOptions && formOptions.map((values, index) => (
                                                            <div key={index} className={styles.form__item}>
                                                                {
                                                                    values.options['РОССИЯ'] ? (
                                                                            <div>
                                                                                <h3 className={styles.form__itemLabel}>
                                                                                    <span>Регион поставки</span>
                                                                                    {/*<span className={styles.form__itemLabel_star}>*</span>*/}
                                                                                </h3>
                                                                                <Controller
                                                                                    name="tz_reg_post"
                                                                                    control={control}
                                                                                    rules={{
                                                                                        required: 'Обязательное поле'
                                                                                    }}
                                                                                    render={({ field }) => (
                                                                                        <Select
                                                                                            {...field}
                                                                                            isClearable={true}
                                                                                            required={true}
                                                                                            closeMenuOnSelect={false}
                                                                                            options={Object.entries(values.options['РОССИЯ']).map(([county, region]) => ({
                                                                                                label: county,
                                                                                                options: Object.entries(region).map(([item, index]) => ({
                                                                                                    label: item,
                                                                                                    value: index
                                                                                                }))
                                                                                            }))}
                                                                                            styles={{
                                                                                                control: (provided) => ({
                                                                                                    ...provided,
                                                                                                    width: 'auto', // Устанавливайте нужную вам ширину
                                                                                                }),
                                                                                            }}
                                                                                            placeholder="нажмите для выбора"
                                                                                            onChange={(selectedOption) => field.onChange(selectedOption)}
                                                                                        />
                                                                                    )}
                                                                                />
                                                                            </div>
                                                                    ):
                                                                    (
                                                                        <div>
                                                                            <h3 className={styles.form__itemLabel}>
                                                                                <span>с/без НДС</span>
                                                                                {/*<span className={styles.form__itemLabel_star}>*</span>*/}
                                                                            </h3>
                                                                            <Controller
                                                                                name={values.propName}
                                                                                control={control}
                                                                                rules={{
                                                                                    required: 'Обязательное поле'
                                                                                }}
                                                                                render={({ field }) => (
                                                                                    <Select
                                                                                        {...field}
                                                                                        isClearable={true}
                                                                                        required={true}
                                                                                        isMulti={values.label === 'Регион'}
                                                                                        closeMenuOnSelect={false}
                                                                                        options={
                                                                                            Object.entries(values.options).map(([value, index]) => (
                                                                                                    {
                                                                                                        value: index,
                                                                                                        label: value,
                                                                                                    }
                                                                                                )
                                                                                            )
                                                                                        }
                                                                                        styles={{
                                                                                            control: (provided) => ({
                                                                                                ...provided,
                                                                                                width: 'auto', // Устанавливайте нужную вам ширину
                                                                                            }),
                                                                                        }}
                                                                                        placeholder="нажмите для выбора"
                                                                                        onChange={(selectedOption) => field.onChange(selectedOption)}
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    )
                                                                }
                                                            </div>
                                                        ))
                                                    }
                                                    {
                                                        formOptions && formOptions.map((values, index) => (
                                                            values.options['РОССИЯ'] && (
                                                                <div key={index} className={styles.form__item}>
                                                                    <h3 className={styles.form__itemLabel}>
                                                                        <span>Регион производства</span>
                                                                        {/*<span className={styles.form__itemLabel_star}>*</span>*/}
                                                                    </h3>
                                                                    {

                                                                        <div>
                                                                            <Controller
                                                                                name="tz_reg_prod"
                                                                                control={control}
                                                                                rules={{
                                                                                    required: 'Обязательное поле'
                                                                                }}
                                                                                render={({ field }) => (
                                                                                    <Select
                                                                                        {...field}
                                                                                        isClearable={true}
                                                                                        isMulti={true}
                                                                                        required={true}
                                                                                        closeMenuOnSelect={false}
                                                                                        options={Object.entries(values.options['РОССИЯ']).map(([county, region]) => ({
                                                                                            label: county,
                                                                                            options: Object.entries(region).map(([item, index]) => ({
                                                                                                label: item,
                                                                                                value: index
                                                                                            }))
                                                                                        }))}
                                                                                        styles={{
                                                                                            control: (provided) => ({
                                                                                                ...provided,
                                                                                                width: 'auto', // Устанавливайте нужную вам ширину
                                                                                            }),
                                                                                        }}
                                                                                        placeholder="нажмите для выбора"
                                                                                        onChange={(selectedOption) => field.onChange(selectedOption)}
                                                                                    />
                                                                                )}
                                                                            />
                                                                        </div>
                                                                    }
                                                                </div>
                                                            )
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                            <div className={styles.form__row}>
                                                <div className={styles.form__items}>
                                                    <div className={styles.form__item}>
                                                        <h3 className={styles.form__itemLabel}>
                                                            <span>Взять в производство не позднее</span>
                                                            {/*<span className={styles.form__itemLabel_star}>*</span>*/}
                                                        </h3>
                                                        <Controller
                                                            name="data_start"
                                                            control={control}
                                                            rules={{
                                                                required: {
                                                                    value: true,
                                                                    message: 'Это поле обязательно'
                                                                }
                                                            }}
                                                            render={({ field }) => (
                                                                <div className={styles.form__textField}>
                                                                    <input type={"date"} {...field} placeholder="Введите целое число" />
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className={styles.form__item}>
                                                        <h3 className={styles.form__itemLabel}>
                                                            <span>Срок исполнения заказа с момента получения аванса/сырья</span>
                                                            {/*<span className={styles.form__itemLabel_star}>*</span>*/}
                                                        </h3>
                                                        <Controller
                                                            name="sroki"
                                                            control={control}
                                                            rules={{
                                                                required: {
                                                                    value: true,
                                                                    message: 'Это поле обязательно'
                                                                },

                                                            }}
                                                            render={({ field }) => (
                                                                <div className={styles.form__textField}>
                                                                    <input type={"text"} {...field} placeholder="Например: 2 недели" />
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className={styles.form__item}>
                                                        <h3 className={styles.form__itemLabel}>
                                                            <span>Срок поставки не позднее</span>
                                                            {/*<span className={styles.form__itemLabel_star}>*</span>*/}
                                                        </h3>
                                                        <Controller
                                                            name="data_finish"
                                                            control={control}
                                                            rules={{
                                                                required: {
                                                                    value: true,
                                                                    message: 'Это поле обязательно'
                                                                },

                                                            }}
                                                            render={({ field }) => (
                                                                <div className={styles.form__textField}>
                                                                    <input type={"date"} {...field} placeholder="Введите ссылку на TG" />
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.form__row}>
                                                <div className={styles.form__items}>
                                                    <div className={styles.form__item}>
                                                        <h3 className={styles.form__itemLabel}>
                                                            <span>Количество</span>
                                                            {/*<span className={styles.form__itemLabel_star}>*</span>*/}
                                                        </h3>
                                                        <Controller
                                                            name="count"
                                                            control={control}
                                                            rules={{
                                                                required: {
                                                                    value: true,
                                                                    message: 'Это поле обязательно'
                                                                },
                                                                pattern: {
                                                                    value: /^[0-9]*$/,
                                                                    message: 'Введите целое число'
                                                                }
                                                            }}
                                                            render={({ field }) => (
                                                                <div className={styles.form__textField}>
                                                                    <input type={"number"} {...field} placeholder="Введите целое число" />
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className={styles.form__item}>
                                                        <h3 className={styles.form__itemLabel}>
                                                            <span>Цена за шт.</span>
                                                            {/*<span className={styles.form__itemLabel_star}>*</span>*/}
                                                        </h3>
                                                        <Controller
                                                            name="price_one"
                                                            control={control}
                                                            rules={{
                                                                required: {
                                                                    value: true,
                                                                    message: 'Это поле обязательно'
                                                                },
                                                                pattern: {
                                                                    value: /^\d+(\.\d{1,2})?$/,
                                                                    message: 'Введите число с двумя знаками после запятой',
                                                                }
                                                            }}
                                                            render={({ field }) => (
                                                                <div className={styles.form__textField}>
                                                                    <input type={"number"} step={0.01} {...field} placeholder="Введите цену" />
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                                    <div className={styles.form__item}>
                                                        <h3 className={styles.form__itemLabel}>
                                                            <span>Возможно взять заказ частично (от шт.).</span>
                                                            {/*<span className={styles.form__itemLabel_star}>*</span>*/}
                                                        </h3>
                                                        <Controller
                                                            name="min_part"
                                                            control={control}
                                                            rules={{
                                                                required: {
                                                                    value: true,
                                                                    message: 'Это поле обязательно'
                                                                },
                                                                pattern: {
                                                                    value: /^\d+(\.\d{1,2})?$/,
                                                                    message: 'Введите число',
                                                                }
                                                            }}
                                                            render={({ field }) => (
                                                                <div className={styles.form__textField}>
                                                                    <input type={"number"} {...field} placeholder="Введите количество" />
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.form__row}>
                                                <div className={styles.form__items}>
                                                    <div className={styles.form__item}>
                                                        <div className={styles.form__sumWrapper}>
                                                            <h3 className={styles.form__sumTitle}>
                                                                <span>Общий бюджет:</span>
                                                            </h3>
                                                            <div className={styles.form__sum}>
                                                                <span>{sum} руб.</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            Object.keys(errors).length > 0 && (
                                                <div>
                                                    {
                                                        Object.entries(errors).map(([fieldName, fieldError]) => (
                                                            <div key={fieldName}>
                                                                {`${fieldName}: ${fieldError.message}`}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            )
                                        }
                                        <div className={styles.form__button}>
                                            <Link
                                                to={"/profile/order/createorder"}
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
                                    </form>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

export default Purchase