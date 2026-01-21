import { useEffect, useState } from "react";
import { Card, Avatar, Descriptions, Button, message, Spin } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, LogoutOutlined } from '@ant-design/icons';
import { getUserProfile } from "../services/api.ts";
import type { IUserProfile } from "../types/account/IUserProfile.ts";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const [profile, setProfile] = useState<IUserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const userProfile = await getUserProfile();
            setProfile(userProfile);
        } catch (error: any) {
            console.error('Error loading profile:', error);
            message.error('Помилка завантаження профілю');
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        message.success('Ви вийшли з системи');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <Spin size="large" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <Card>
                    <p>Профіль не знайдено</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Card className="shadow-2xl">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
                        <div className="flex flex-col items-center">
                            <Avatar 
                                size={120} 
                                src={profile.image} 
                                icon={<UserOutlined />}
                                className="mb-4"
                            />
                            <h1 className="text-3xl font-bold text-gray-900 text-center">
                                {profile.first_name} {profile.last_name}
                            </h1>
                            <p className="text-gray-600 mt-2">@{profile.username}</p>
                        </div>
                        
                        <div className="flex-1">
                            <Descriptions 
                                column={{ xs: 1, sm: 1, md: 1 }} 
                                bordered
                                className="w-full"
                            >
                                <Descriptions.Item 
                                    label={<span><MailOutlined className="mr-2" />Електронна пошта</span>}
                                >
                                    {profile.email}
                                </Descriptions.Item>
                                
                                <Descriptions.Item 
                                    label={<span><PhoneOutlined className="mr-2" />Телефон</span>}
                                >
                                    {profile.phone}
                                </Descriptions.Item>
                                
                                <Descriptions.Item 
                                    label={<span><UserOutlined className="mr-2" />Логін</span>}
                                >
                                    {profile.username}
                                </Descriptions.Item>
                                
                                {profile.date_joined && (
                                    <Descriptions.Item label="Дата реєстрації">
                                        {new Date(profile.date_joined).toLocaleDateString('uk-UA', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                        <Button 
                            type="default"
                            icon={<LogoutOutlined />}
                            onClick={handleLogout}
                            size="large"
                        >
                            Вийти
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;



