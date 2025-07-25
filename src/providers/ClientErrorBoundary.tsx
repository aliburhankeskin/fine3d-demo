"use client";

import { Component, ReactNode } from "react";
import { logClientError } from "@helpers/Common/clientLogger";

export class ClientErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    logClientError(error);
  }

  render() {
    return this.props.children;
  }
}
