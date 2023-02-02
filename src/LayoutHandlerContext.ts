import { createContext, useContext } from 'react';

type LayoutHandler = ((...args: unknown[]) => void) | undefined;

export const LayoutHandlerContext = createContext<LayoutHandler>(undefined);

export const useLayoutHandler = () => useContext(LayoutHandlerContext);
