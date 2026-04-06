import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: ${({ theme }) => theme.bg.tertiary};
    color: ${({ theme }) => theme.text.primary};
    font-size: 14px;
    line-height: 1.6;
    transition: background 0.2s, color 0.2s;
  }

  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }
  input, textarea, select { font-family: inherit; font-size: inherit; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.border.medium};
    border-radius: 3px;
  }
`;