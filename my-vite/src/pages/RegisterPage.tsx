import { Button, Form, Input, Upload, message, Card } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, PictureOutlined } from '@ant-design/icons';
import type { IRegisterUser } from "../types/account/IRegisterUser.ts";
import { registerUser } from "../services/api.ts";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const RegisterPage = () => {
    const [form] = Form.useForm<IRegisterUser>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: IRegisterUser) => {
        setLoading(true);
        
        try {
            // Обробка зображення
            let imageFile: File | undefined;
            if (Array.isArray(values.image) && values.image.length > 0) {
                imageFile = values.image[0].originFileObj as File;
            } else if (values.image && !Array.isArray(values.image)) {
                imageFile = values.image as File;
            }

            // Відправка даних на сервер
            const response = await registerUser({
                username: values.username,
                email: values.email,
                password: values.password,
                first_name: values.first_name,
                last_name: values.last_name,
                phone: values.phone,
                image: imageFile,
            });

            message.success('Реєстрація успішна! Вітаємо!');
            console.log('Registration successful:', response);
            
            // Перенаправлення на сторінку входу після успішної реєстрації
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error: any) {
            console.error('Registration error:', error);
            
            // Обробка помилок валідації
            if (error.response?.data) {
                const errors = error.response.data;
                
                // Відображення помилок для кожного поля
                if (typeof errors === 'object') {
                    Object.keys(errors).forEach((field) => {
                        const fieldErrors = Array.isArray(errors[field]) 
                            ? errors[field] 
                            : [errors[field]];
                        
                        fieldErrors.forEach((errorMsg: string) => {
                            message.error(`${field}: ${errorMsg}`);
                        });
                    });
                } else {
                    message.error('Помилка при реєстрації. Перевірте введені дані.');
                }
            } else {
                message.error('Помилка при реєстрації. Спробуйте ще раз.');
            }
        } finally {
            setLoading(false);
        }
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        const fileList = e?.fileList;
        if (!fileList || fileList.length < 1) return fileList;
        // Повертаємо лише останній вибраний файл
        return [fileList[fileList.length - 1]];
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full">
                <Card className="shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Реєстрація користувача
                        </h1>
                        <p className="text-gray-600">
                            Заповніть форму для створення нового акаунту
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        size="large"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item<IRegisterUser>
                                label="Логін"
                                name="username"
                                rules={[
                                    { required: true, message: 'Вкажіть логін' },
                                    { min: 3, message: 'Логін повинен містити мінімум 3 символи' },
                                    { 
                                        pattern: /^[a-zA-Z0-9_]+$/, 
                                        message: 'Логін може містити лише літери, цифри та підкреслення' 
                                    }
                                ]}
                            >
                                <Input 
                                    prefix={<UserOutlined />} 
                                    placeholder="Введіть логін"
                                />
                            </Form.Item>

                            <Form.Item<IRegisterUser>
                                label="Електронна пошта"
                                name="email"
                                rules={[
                                    { required: true, message: 'Вкажіть пошту' },
                                    { type: 'email', message: 'Введіть коректну електронну адресу' }
                                ]}
                            >
                                <Input 
                                    prefix={<MailOutlined />} 
                                    placeholder="example@email.com"
                                />
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item<IRegisterUser>
                                label="Ім'я"
                                name="first_name"
                                rules={[
                                    { required: true, message: "Вкажіть ім'я" },
                                    { min: 2, message: "Ім'я повинно містити мінімум 2 символи" },
                                    { 
                                        pattern: /^[А-Яа-яA-Za-z\s]+$/, 
                                        message: "Ім'я може містити лише літери" 
                                    }
                                ]}
                            >
                                <Input 
                                    prefix={<UserOutlined />} 
                                    placeholder="Введіть ім'я"
                                />
                            </Form.Item>

                            <Form.Item<IRegisterUser>
                                label="Прізвище"
                                name="last_name"
                                rules={[
                                    { required: true, message: 'Вкажіть прізвище' },
                                    { min: 2, message: 'Прізвище повинно містити мінімум 2 символи' },
                                    { 
                                        pattern: /^[А-Яа-яA-Za-z\s]+$/, 
                                        message: 'Прізвище може містити лише літери' 
                                    }
                                ]}
                            >
                                <Input 
                                    prefix={<UserOutlined />} 
                                    placeholder="Введіть прізвище"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item<IRegisterUser>
                            label="Телефон"
                            name="phone"
                            rules={[
                                { required: true, message: "Вкажіть телефон" },
                                { 
                                    pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, 
                                    message: "Вкажіть валідний номер телефона" 
                                }
                            ]}
                        >
                            <Input 
                                prefix={<PhoneOutlined />} 
                                placeholder="+380XXXXXXXXX"
                            />
                        </Form.Item>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Form.Item<IRegisterUser>
                                label="Пароль"
                                name="password"
                                rules={[
                                    { required: true, message: "Вкажіть пароль" },
                                    { min: 8, message: "Пароль повинен містити мінімум 8 символів" },
                                    { 
                                        pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 
                                        message: "Пароль має містити велику, малу літеру, цифру та спеціальний символ" 
                                    }
                                ]}
                            >
                                <Input.Password 
                                    prefix={<LockOutlined />} 
                                    placeholder="Введіть пароль"
                                />
                            </Form.Item>

                            <Form.Item<IRegisterUser>
                                label="Підтвердження паролю"
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: "Підтвердіть пароль" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Паролі не збігаються!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password 
                                    prefix={<LockOutlined />} 
                                    placeholder="Повторіть пароль"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item<IRegisterUser>
                            label="Фото профілю"
                            name="image"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            extra="Підтримуються формати: JPG, JPEG, PNG, GIF, WEBP (макс. 5MB)"
                        >
                            <Upload.Dragger
                                name="image"
                                multiple={false}
                                listType="picture"
                                accept="image/*"
                                beforeUpload={() => false}
                                maxCount={1}
                            >
                                <p className="ant-upload-drag-icon">
                                    <PictureOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                                </p>
                                <p className="ant-upload-text">
                                    Натисніть або перетягніть файл сюди для завантаження
                                </p>
                                <p className="ant-upload-hint">
                                    Підтримуються зображення у форматі JPG, PNG, GIF, WEBP
                                </p>
                            </Upload.Dragger>
                        </Form.Item>

                        <Form.Item className="mb-4">
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading}
                                block
                                size="large"
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                {loading ? 'Реєстрація...' : 'Зареєструватися'}
                            </Button>
                        </Form.Item>

                        <div className="text-center">
                            <p className="text-gray-600">
                                Вже маєте акаунт?{' '}
                                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Увійти
                                </Link>
                            </p>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default RegisterPage;
