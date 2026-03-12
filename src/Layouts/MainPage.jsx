import { Result, Button } from "antd";
import React from "react";
import { clearServerStatus, getServerStatus } from "../Stores/server.store";

const MainPage = ({ children }) => {
  // clearServerStatus()
  const server_status = Number(getServerStatus());
  if (server_status === 401 || server_status === 500 || server_status === 404) {
    // Map status codes to appropriate Result props
    const getResultProps = (status) => {
      switch (status) {
        case 401:
          return {
            status: "403", // Ant Design uses 403 for unauthorized
            title: "401",
            subTitle: "Sorry, you are not authorized to access this page.",
          };
        case 404:
          return {
            status: "404",
            title: "404",
            subTitle: "Sorry, the page you visited does not exist.",
          };
        case 500:
          return {
            status: "500",
            title: "500",
            subTitle: "Sorry, something went wrong.",
          };
        default:
          return {
            status: "error",
            title: "Error",
            subTitle: "Some title",
          };
      }
    };

    const resultProps = getResultProps(server_status);

    return (
      <Result
        className="bg-white rounded-2xl m-8"
        status={resultProps.status}
        title={resultProps.title}
        subTitle={resultProps.subTitle}
        extra={
          server_status === 401 && (
            <Button
              type="primary"
              onClick={() => (window.location.href = "/login")}
            >
              Go to Login
            </Button>
          )
        }
      />
    );
  }

  return (
    <>
      <h1>Header</h1>
      <div>{children}</div>
    </>
  );
};

export default MainPage;
