import React from "react";
import { Result, Button } from "antd";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {

    console.error("Feed ErrorBoundary:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle="The feed ran into an issue. Try reloading."
          extra={<Button onClick={this.handleReload}>Reload</Button>}
        />
      );
    }
    return this.props.children;
  }
}
