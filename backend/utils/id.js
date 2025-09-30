import { randomUUID as _uuid } from "crypto";
export const uuid = () => (_uuid ? _uuid() : Math.random().toString(36).slice(2));
