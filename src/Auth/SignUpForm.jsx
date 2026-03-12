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
  Select,
} from "antd";
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined, 
  GoogleOutlined,
  PhoneOutlined,
  GithubOutlined 
} from "@ant-design/icons";

const { Title, Text, Link } = Typography;
const { Option } = Select;

const SignUpForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const onFinish = (values) => {
    setLoading(true);
    setError("");
    setSuccess("");

    // Simulate API call
    console.log("Sign up values:", values);

    // Simulate sign up process
    setTimeout(() => {
      setLoading(false);
      setSuccess("Account created successfully! Please check your email to verify.");
      // Handle success/error here
    }, 1500);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error("Please input your password!"));
    }
    if (value.length < 8) {
      return Promise.reject(new Error("Password must be at least 8 characters!"));
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(new Error("Password must contain at least one uppercase letter!"));
    }
    if (!/[0-9]/.test(value)) {
      return Promise.reject(new Error("Password must contain at least one number!"));
    }
    return Promise.resolve();
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-5">
      <Card 
        bordered={false} 
        className="w-full max-w-2xl rounded-3xl shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden"
      >
        {/* Decorative header bar */}
        <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        <div className="px-8 py-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-purple-300">
              <span className="text-3xl font-bold text-white">J</span>
            </div>
            <Title level={2} className="!mb-2 !text-gray-800 font-bold">
              Create Account
            </Title>
            <Text type="secondary" className="text-gray-500">
              Join us today! Please fill in your details
            </Text>
          </div>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              className="mb-6 rounded-xl"
              onClose={() => setError("")}
            />
          )}

          {success && (
            <Alert
              message={success}
              type="success"
              showIcon
              closable
              className="mb-6 rounded-xl"
              onClose={() => setSuccess("")}
            />
          )}

          <Form
            form={form}
            name="signup"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            size="large"
            requiredMark={false}
            scrollToFirstError
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="firstName"
                label={<span className="text-gray-700 font-medium">First Name</span>}
                rules={[{ required: true, message: "Please input your first name!" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="John"
                  className="rounded-xl border-gray-200 hover:border-purple-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-100 transition-all duration-300"
                />
              </Form.Item>

              <Form.Item
                name="lastName"
                label={<span className="text-gray-700 font-medium">Last Name</span>}
                rules={[{ required: true, message: "Please input your last name!" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="Doe"
                  className="rounded-xl border-gray-200 hover:border-purple-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-100 transition-all duration-300"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="email"
              label={<span className="text-gray-700 font-medium">Email Address</span>}
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="john.doe@example.com"
                className="rounded-xl border-gray-200 hover:border-purple-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-100 transition-all duration-300"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label={<span className="text-gray-700 font-medium">Phone Number</span>}
              rules={[
                { required: true, message: "Please input your phone number!" },
                { pattern: /^[0-9+\-\s]+$/, message: "Please enter a valid phone number!" }
              ]}
            >
              <Input
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="+1 234 567 8900"
                className="rounded-xl border-gray-200 hover:border-purple-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-100 transition-all duration-300"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-gray-700 font-medium">Password</span>}
              rules={[{ validator: validatePassword }]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Create a strong password"
                className="rounded-xl border-gray-200 hover:border-purple-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-100 transition-all duration-300"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span className="text-gray-700 font-medium">Confirm Password</span>}
              dependencies={['password']}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Re-enter your password"
                className="rounded-xl border-gray-200 hover:border-purple-400 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-100 transition-all duration-300"
              />
            </Form.Item>

            <Form.Item
              name="country"
              label={<span className="text-gray-700 font-medium">Country</span>}
              rules={[{ required: true, message: "Please select your country!" }]}
            >
              <Select
                placeholder="Select your country"
                className="rounded-xl"
                size="large"
              >
                <Option value="us">United States</Option>
                <Option value="uk">United Kingdom</Option>
                <Option value="ca">Canada</Option>
                <Option value="au">Australia</Option>
                <Option value="in">India</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('You must accept the terms and conditions')),
                },
              ]}
            >
              <Checkbox className="text-gray-600">
                I agree to the <Link href="#" className="text-purple-600 hover:text-purple-700">Terms of Service</Link> and{' '}
                <Link href="#" className="text-purple-600 hover:text-purple-700">Privacy Policy</Link>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 border-none hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5 active:translate-y-0"
                loading={loading}
                block
              >
                Create Account
              </Button>
            </Form.Item>

            <Divider plain className="text-gray-400 text-sm my-6">Or sign up with</Divider>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Button 
                icon={<GoogleOutlined />} 
                className="h-11 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-300"
                block
              >
                Google
              </Button>
              <Button 
                icon={<GithubOutlined />} 
                className="h-11 rounded-xl border-2 border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 hover:border-purple-300 hover:text-purple-600 transition-all duration-300"
                block
              >
                GitHub
              </Button>
            </div>

            <div className="text-center mt-4">
              <Text type="secondary" className="text-gray-500">Already have an account? </Text>
              <Link href="/auth/login" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                Sign in
              </Link>
            </div>
          </Form>

          {/* Password requirements hint */}
          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <Text className="text-gray-700 font-medium block mb-2">Password requirements:</Text>
            <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
              <li className={form.getFieldValue('password')?.length >= 8 ? 'text-green-600' : ''}>
                At least 8 characters long
              </li>
              <li className={/[A-Z]/.test(form.getFieldValue('password')) ? 'text-green-600' : ''}>
                Contains at least one uppercase letter
              </li>
              <li className={/[0-9]/.test(form.getFieldValue('password')) ? 'text-green-600' : ''}>
                Contains at least one number
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignUpForm;