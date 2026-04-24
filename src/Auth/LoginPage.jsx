import React from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Typography,
  Divider,
  Alert,
  message,
  Spin,
} from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { request } from "../utils/request";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "../Stores/profileStore";
import { useState } from "react";

const { Title, Text, Link } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const setAccessToken = useProfileStore((state) => state.setAccessToken);
  const setProfile = useProfileStore((state) => state.setProfile);
  const [loanding, setLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const param = {
        email: values.email,
        password: values.password,
      };

      const res = await request("auth/login", "post", param);

      if (res?.access_token) {
        // alert(JSON.stringify(res));
        // Save token
        setAccessToken(res.access_token);
        setProfile(res.profile);

        message.success("Login successfully!");

        // Redirect to dashboard
        navigate("/dashboard");
        setLoading(false);
      } else {
        message.error("Invalid email or password.");
      }
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 401) {
        message.error("Unauthorized. Email or password incorrect.");
      } else if (error.response?.status === 500) {
        message.error("Server error. Please try again later.");
      } else {
        message.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Spin spinning={loanding}>
      <div className="min-h-screen flex justify-center items-center p-5 relative overflow-hidden">
        {/* Background Image with Blur - Separate div */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-[7px] scale-110"
          style={{
            backgroundImage: `url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjo8mYvh4Aw3OAHw106Xm65KEoG-W6d2RAV-2jSSX4xpvWCBwCErMJJ6I_Xkv-CY0eABSLZ7MqUqxCA-OKGXDyAbKMWL855-nOgI1fo2dWKm9qqnoTcnu4aYw-eDILaP4LwBbwuP68haqU/s1600/RUPP-Royal-University-of-Phnom-Penh1.jpg')`,
          }}
        />

        {/* Optional overlay for better contrast */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Card (stays sharp) */}
        <Card className="w-full max-w-md rounded-2xl shadow-2xl bg-white/95 backdrop-blur-sm relative z-10">
          <div className="text-center mb-8">
            <Title level={2} className="!mb-2 !text-gray-800">
              Welcome Back
            </Title>
            <Text type="secondary" className="text-base text-gray-500">
              Please sign in to your account
            </Text>
          </div>

          <Form
            form={form}
            name="login"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            size="large"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="Email Address"
                className="rounded-lg border-gray-200 hover:border-purple-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200 transition-all duration-300"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Password"
                className="rounded-lg border-gray-200 hover:border-purple-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-200 transition-all duration-300"
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" noStyle>
              <div className="flex justify-between items-center my-4 w-full">
                <Checkbox className="text-gray-600">Remember me</Checkbox>
                <Link
                  href="#"
                  className="text-purple-600 text-sm hover:text-purple-700 transition-colors duration-300"
                >
                  Forgot password?
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Sign In
              </Button>
            </Form.Item>

            <div className="text-center mt-2">
              <Text type="secondary" className="text-gray-500">
                Don't have an account?{" "}
              </Text>
              <Link
                href="/auth/signup"
                className="text-purple-600 font-medium hover:text-purple-700 transition-colors duration-300"
              >
                Sign up now
              </Link>
            </div>
          </Form>
        </Card>
      </div>
    </Spin>
  );
};

export default LoginPage;
