import React from "react";
import { Avatar, Layout, Menu, theme, Dropdown } from "antd";
import routes from "../../routes";
import { useLocation, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { RiLogoutCircleRLine } from "react-icons/ri";

const { Header, Content, Footer } = Layout;

const Layer = ({ children }) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const location = useLocation();
  const navigate = useNavigate();

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
        }}
      >
        <img size={50} src="newLogo.png" alt="" />
        
        <Menu
          className="w-full ml-7 bg-[#fff]"
          mode="horizontal"
          items={routes.map((route, index) => {
            return {
              key: String(index + 1),
              label: (
                <a
                  style={{
                    color:
                      route.path === location.pathname ? "black" : "black",
                  }}
                  href={route.path}
                >
                  {route.name}
                </a>
              ),
            };
          })}
        />
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: <a onClick={handleLogout}>Logout</a>,
                icon: <RiLogoutCircleRLine />
              },
            ],
            
          }}
          placement="bottomLeft"
        >
          <Avatar size={30} icon={<UserOutlined />} />
        </Dropdown>
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
        Developed by RetinaRx
      </Footer>
    </Layout>
  );
};

export default Layer;
