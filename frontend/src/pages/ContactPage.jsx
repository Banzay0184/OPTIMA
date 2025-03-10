"use client";

import {motion} from "framer-motion";

const ContactPage = () => {
    const branches = [
        {
            name: "Филиал в Каганском районе",
            address: "Каганский район, улица Адолат, дом 1",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3074.927!2d64.815!3d39.716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDQyJzU3LjYiTiA2NMKwNDgnNTQuMCJF!5e0!3m2!1sru!2s!4v1698765432100!5m2!1sru!2s",
        },
        {
            name: "Филиал в Самаркандском районе",
            address: "Самаркандский район, махалля Охалик Сой, дом 1",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3075.123!2d66.959!3d39.654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDM5JzE0LjQiTiA2NsKwNTcnMzMuNiJF!5e0!3m2!1sru!2s!4v1698765432100!5m2!1sru!2s",
        },
        {
            name: "Филиал в Ташкентской области",
            address: "Ташкентская область, улица Ахмад Яссавий Сигатгох, дом 17А",
            mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.789!2d69.240!3d41.299!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE3JzU3LjQiTiA2OcKwMTQnMjQuMCJF!5e0!3m2!1sru!2s!4v1698765432100!5m2!1sru!2s",
        },
    ];

    return (
        <div className="">
            <section className="bg-blue-600 py-20 text-white">
                <div className="max-w-7xl mx-auto pt-16 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Контакты</h1>
                    <p className="text-xl text-blue-100">Свяжитесь с нами для получения дополнительной информации</p>
                </div>
            </section>

            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Наши контакты</h2>
                            <p className="text-gray-600 mb-4">
                                Вы можете связаться с нами по телефону или электронной почте.
                            </p>
                            <ul className="space-y-2 mb-8">
                                <li className="text-gray-600">
                                    <a className="text-blue-600 hover:underline" href="tel:+998906111011">
                                        Тел: +998 (90) 611 10 11
                                    </a>
                                    <br/>
                                    <a className="text-blue-600 hover:underline" href="tel:+998973001009">
                                        Тел: +998 (97) 300 10 09
                                    </a>
                                </li>
                                <li className="text-gray-600">
                                    <a className="text-blue-600 hover:underline" href="mailto:info@optimapet.ru">
                                        Email: info@optimapet.ru
                                    </a>
                                </li>
                                <li className="text-gray-600">
                                    <a className="text-blue-600 hover:underline" href="https://t.me/optimapet">
                                        Telegram: @optimapet
                                    </a>
                                </li>

                            </ul>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Наши филиалы</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {branches.map((branch, index) => (
                                    <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{branch.name}</h3>
                                        <p className="text-gray-600 mb-4">{branch.address}</p>
                                        <iframe
                                            src={branch.mapUrl}
                                            width="100%"
                                            height="200"
                                            style={{border: 0}}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title={`Карта филиала ${branch.name}`}
                                        ></iframe>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;