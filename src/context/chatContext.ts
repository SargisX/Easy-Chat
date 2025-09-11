import React from "react";
import type { IContext } from "./types";

export const ChatContext = React.createContext<IContext|undefined>(undefined)