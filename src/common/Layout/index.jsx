import React, { useState } from "react";
import { Avatar, Layout, Menu, theme, Dropdown } from "antd";
import routes from "../../routes";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { RiLogoutCircleRLine } from "react-icons/ri";

const { Header, Content, Footer } = Layout;

const Layer = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLogout = () => {
    // Eliminar token de autenticación
    localStorage.removeItem('authToken');
    // Redirigir a la página de login
    navigate('/login');
  };

  return (
    <Layout className="w-screen h-screen">
      <Header
        className="bg-[#fff]"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <img size={50} src="newLogo.png" alt="" />
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {routes.map((route, index) => (
            <Link
              key={index}
              style={{
                color: activeLink === route.path ? "#1EAF8E" : "#0A0B0A",
                fontSize: '15px',
                lineHeight: '21.6px',
                fontWeight: 600,
                margin: '0 10px'
              }}
              to={route.path}
              onClick={() => setActiveLink(route.path)}
            >
              {route.name}
            </Link>
          ))}
          <Dropdown
            menu={{
              items: [
                {
                  key: "1",
                  label: <a onClick={handleLogout}>Logout</a>,
                  icon: <RiLogoutCircleRLine style={{ color: '#1EAF8E' }} />,
                },
              ],
            }}
            placement="bottomLeft"
          >
            <Avatar size={40} icon={<UserOutlined style={{ color: '#1EAF8E' }} />} style={{ backgroundColor: 'transparent' }} />
          </Dropdown>
        </div>
      </Header>
      <Content className="flex flex-col w-full h-full px-10 mt-4">
        <div
          className="flex flex-col w-full h-full overflow-hidden border rounded-md shadow-lg border-slate-200"
          style={{
            background: colorBgContainer,
          }}
        >
          {children}
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Desarrollado por RetinaRx
      </Footer>
    </Layout>
  );
};

export default Layer;
