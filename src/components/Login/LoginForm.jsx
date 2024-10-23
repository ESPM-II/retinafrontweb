import React, { useState, useContext } from 'react';
import { Form, Input, Button, Alert, Layout, Row, Col } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import AuthContext from '../../context/AuthContext';

const { Content } = Layout;

const LoginForm = () => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const { login: authLogin } = useContext(AuthContext);

  const onFinish = async (values) => {
    console.log('Valores enviados desde el formulario:', values); // Verificar datos

    try {
      await authLogin({
        login: values.email,
        password: values.password,
      });
    } catch (error) {
      console.error('Error en la autenticación:', error); // Captura errores
      console.log('Detalles del error:', error.networkError?.result || error); // Detalles adicionales

      setAlertMessage(
        'Error al intentar iniciar sesión. Revise sus credenciales o contacte soporte.'
      );
      setAlertType('error');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#14755F' }}>
      <Content>
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
          <Col>
            <div
              style={{
                backgroundColor: '#FAFAFA',
                padding: '0px',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'stretch',
                maxWidth: '800px',
                minHeight: '400px',
              }}
            >
              <div style={{ flex: 1 }}>
                <img
                  src="https://i.ibb.co/V2q10Q4/close-up-medical-team-ready-work-1.png"
                  alt="Medical team"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px 0 0 8px',
                  }}
                />
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Form
                  name="login"
                  onFinish={onFinish}
                  layout="vertical"
                  style={{ width: '100%' }}
                >
                  <Form.Item
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src="https://i.ibb.co/bH4F8DH/LOGOS-DESKTOP.png"
                      alt="Logo"
                      style={{
                        maxWidth: '100%',
                        marginLeft: '35px',
                        borderRadius: '24px',
                        height: 'auto',
                        marginBottom: '16px',
                      }}
                    />
                    <strong style={{ fontSize: '24px', color: '#0A0B0A' }}>
                      Ingresa tus datos
                    </strong>
                  </Form.Item>
                  {alertMessage && (
                    <Form.Item>
                      <Alert message={alertMessage} type={alertType} showIcon />
                    </Form.Item>
                  )}
                  <Form.Item
                    label="Correo electrónico"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: 'Por favor ingresa tu correo electrónico',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Contraseña"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: 'Por favor ingresa tu contraseña',
                      },
                    ]}
                  >
                    <Input.Password
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={false}
                      style={{
                        width: '100%',
                        borderRadius: '25px',
                        backgroundColor: '#199276',
                        borderColor: '#199276',
                        marginTop: '24px',
                      }}
                    >
                      Ingresar
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default LoginForm;
