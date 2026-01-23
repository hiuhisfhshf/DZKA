import { Button, Form, Input, message, Card } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import type { ILoginUser } from "../types/account/ILoginUser.ts";
import { loginUser } from "../services/api.ts";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
    const [form] = Form.useForm<ILoginUser>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: ILoginUser) => {
        setLoading(true);
        
        try {
            await loginUser({
                username: values.username,
                password: values.password,
            });

            message.success('Вхід успішний! Вітаємо!');
            navigate('/profile');
        } catch (error: any) {
            console.error('Login error:', error);
            
            if (error.response?.data) {
                const errorData = error.response.data;
                
                if (typeof errorData === 'object') {
                    Object.keys(errorData).forEach((field) => {
                        const fieldErrors = Array.isArray(errorData[field]) 
                            ? errorData[field] 
                            : [errorData[field]];
                        
                        fieldErrors.forEach((errorMsg: string) => {
                            message.error(`${field}: ${errorMsg}`);
                        });
                    });
                } else if (typeof errorData === 'string') {
                    message.error(errorData);
                } else {
                    message.error('Невірний логін або пароль');
                }
            } else {
                message.error('Помилка при вході. Спробуйте ще раз.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <Card className="shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Вхід в систему
                        </h1>
                        <p className="text-gray-600">
                            Введіть свої облікові дані для входу
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        size="large"
                    >
                        <Form.Item<ILoginUser>
                            label="Логін"
                            name="username"
                            rules={[
                                { required: true, message: 'Вкажіть логін' },
                            ]}
                        >
                            <Input 
                                prefix={<UserOutlined />} 
                                placeholder="Введіть логін"
                            />
                        </Form.Item>

                        <Form.Item<ILoginUser>
                            label="Пароль"
                            name="password"
                            rules={[
                                { required: true, message: "Вкажіть пароль" },
                            ]}
                        >
                            <Input.Password 
                                prefix={<LockOutlined />} 
                                placeholder="Введіть пароль"
                            />
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
                                {loading ? 'Вхід...' : 'Увійти'}
                            </Button>
                        </Form.Item>

                        <div className="text-center">
                            <p className="text-gray-600">
                                Немає акаунту?{' '}
                                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Зареєструватися
                                </Link>
                            </p>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;




