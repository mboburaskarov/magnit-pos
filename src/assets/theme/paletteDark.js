const paletteDark = {
  white: '#111217', // Inverted from light theme
  black: '#ffffff', // Inverted from light theme
  red: '#FF4639', // Keep as is since it is a color that should draw attention
  green: '#28B95E', // Keep as is since it is a color that should draw attention
  common: {
    white: '#111217', // Inverted
  },
  background: {
    default: '#111217', // Darkened for dark theme
    defaultStrong: '#F48C33', // Adjusted from #FF6018
    paper: '#21232A', // Dark paper
    gray: '#323641', // Dark gray
  },
  primary: {
    main: '#F48C33', // Adjusted for dark theme
  },
  secondary: {
    main: '#444444', // Darker secondary
    light: '#777777', //Lighten slightly
    dark: '#90caf9', //Lighter to contrast the dark background
    contrastText: '#ffffff',
  },
  text: {
    primary: '#E0E0E0', // Lighter text for dark background
    secondary: '#757575', // Lighter text for dark background
  },
  border: {
    default: '#444444', // Dark border
  },
  action: {
    disabledBackground: '#3A3A3A', // Darker action background
  },
  bg: {
    10: '#3A3A3A', // Darker
  },
  bunker: {
    100: '#434961',
    200: '#677190',
    300: '#868FAA',
    400: '#B1B7C8',
    500: '#D5D7E2', // Inverse order
    700: '#ECEDF2',
    800: '#ffffff',
    950: '#F0F0F0',
  },
  gray: {
    10: '#404040',
    50: '#323641', //Darker background
    100: '#3A3A3A',
    101: '#545454',
    200: '#545454',
    300: '#616161',
    400: '#757575',
    500: '#A4A5AB', // keep as it is
    600: '#d1d1d1',
    700: '#c4c4c4', // Lighter
    800: '#f0f0f0',
    801: '#f0f0f0',
    900: '#eaeaea',
  },
  green: {
    10: '#14532d',
    50: '#166534', // keep as it is
    100: '#3FC28A1A', // keep as it is
    200: '#0E8064',
    300: '#119676',
    400: '#3CA98F',
    500: '#3FC28A',
    600: '#86efac',
    601: '#DFEEEA',
    700: '#28B95E',
    800: '#F1FFFB',
    900: '#E9F8EF',
  },
  bluegray: {
    50: '#0f172a',
    100: '#1e293b',
    200: '#334155',
    300: '#475569',
    400: '#64748b',
    401: 'linear-gradient(0deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07)), #455A64',
    500: '#94a3b8',
    600: '#cbd5e1',
    700: '#e0e7ee',
    800: '#EFF6F5',
    900: '#f8fafc',
  },
  blue: {
    50: '#0f172a',
    100: '#1e293b',
    200: '#334155',
    300: '#475569',
    400: '#64748b',
    401: 'linear-gradient(0deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.07)), #455A64',
    500: '#94a3b8',
    600: '#cbd5e1',
    700: '#e0e7ee',
    800: '#EFF6F5',
    900: '#f8fafc',
  },
  purple: {
    50: '#581c87',
    100: '#6b21a8',
    200: '#7e22ce',
    300: '#9333ea',
    400: '#2558FF',
    500: '#c084fc',
    600: '#d8b4fe',
    700: '#e9d5ff',
    800: '#f3e8ff',
    900: '#faf5ff',
  },
  violet: {
    50: '#4c1d95',
    100: '#5b21b6',
    200: '#6d28d9',
    300: '#7c3aed',
    400: '#8b5cf6',
    500: '#a78bfa',
    600: '#c4b5fd',
    700: '#ddd6fe',
    800: '#ede9fe',
    900: '#f5f3ff',
  },
  indigo: {
    50: '#312e81',
    100: '#3730a3',
    200: '#4338ca',
    300: '#4f46e5',
    400: '#6366f1',
    500: '#818cf8',
    600: '#a5b4fc',
    700: '#c7d2fe',
    800: '#e0e7ff',
    900: '#eef2ff',
  },
  lightblue: {
    50: '#0c4a6e',
    100: '#075985',
    200: '#0369a1',
    300: '#0284c7',
    400: '#0ea5e9',
    500: '#38bdf8',
    600: '#7dd3fc',
    700: '#bae6fd',
    800: '#e0f2fe',
    900: '#f0f9ff',
  },
  teal: {
    50: '#134e4a',
    100: '#115e59',
    200: '#0f766e',
    300: '#0d9488',
    400: '#14b8a6',
    500: '#2dd4bf',
    600: '#5eead4',
    700: '#99f6e4',
    800: '#ccfbf1',
    900: '#f0fdfa',
  },
  yellow: {
    50: '#713f12',
    100: '#854d0e',
    200: '#a16207',
    300: '#ca8a04',
    400: '#eab308',
    500: '#f2c94c',
    600: '#fde047',
    700: '#fef08a',
    800: '#fef9c3',
    900: '#fefce8',
  },
  orange: {
    50: '#7c2d12',
    100: '#9a3412',
    200: '#c2410c',
    300: '#ea580c',
    400: '#FF6018',
    500: '#fb923c',
    600: '#fdba74',
    700: '#FFCEA8',
    800: '#FFE9D4',
    1001: '#FE50000D',
    900: '#fff7ed',
  },
  red: {
    10: '#7f1d1d',
    50: '#991b1b',
    100: '#FF4639',
    200: '#ff0844',
    300: '#ff0844',
    400: '#db5151',
    500: '#F45B69',
    600: '#f87171',
    700: '#fca5a5',
    800: '#F45B691A',
    900: '#fecaca',
  },
  pink: {
    50: '#831843',
    100: '#9d174d',
    200: '#be185d',
    300: '#db2777',
    400: '#ec4899',
    500: '#f472b6',
    600: '#f9a8d4',
    700: '#fbcfe8',
    800: '#fce7f3',
    900: '#fdf2f8',
  },
  dark: { 500: '#ffffff' },
  boxShadow: {
    '64-16': '0px 0px 64px rgba(255, 255, 255, 0.16)', // Inverted shadow
    '32-12': '0px 0px 32px rgba(255, 255, 255, 0.12)', // Inverted shadow
    '16-8': '0px 0px 16px rgba(255, 255, 255, 0.08)', // Inverted shadow
    tableShadow: 'linear-gradient(180deg, rgba(17, 18, 23, 0) 0%, #111217 100%)',
  },
}

export default paletteDark
