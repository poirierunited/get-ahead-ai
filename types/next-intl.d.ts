import type { NextIntlClientConfig } from "next-intl";

declare module "next-intl" {
  interface Messages {
    [key: string]: any;
  }
}

declare module "next-intl/server" {
  interface RequestConfig {
    messages: Promise<Messages>;
  }
}
