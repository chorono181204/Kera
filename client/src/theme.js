import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
const APP_BAR_HEIGHT = '58px'
const BOARD_BAR_HEIGHT = '60px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${BOARD_BAR_HEIGHT} - ${APP_BAR_HEIGHT})`
const theme = extendTheme({
  customProperties: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT
  },
  typography: {
    allVariants: {
      textTransform: 'none' // Loại bỏ tự động viết hoa cho tất cả các kiểu chữ
    }
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          light: '#4C78E8', // Gần với xanh nhạt của Jira
          main: '#0052CC', // Màu chính của Jira light mode
          dark: '#003087', // Tối hơn
          contrastText: '#fff' // Văn bản trắng
        },
        background: {
          default: '#F4F5F7', // Nền nhạt của Jira
          paper: '#fff'
        },
        text: {
          primary: '#172B4D', // Văn bản đậm
          secondary: '#5E6C84'
        }
      }
    },
    dark: {
      palette: {
        primary: {
          light: '#4C9AFF', // Xanh sáng hơn cho dark mode
          main: '#2684FF', // Màu chính của Jira dark mode
          dark: '#0059CC', // Tối hơn
          contrastText: '#fff' // Văn bản trắng
        },
        background: {
          default: '#172B4D', // Nền tối
          paper: '#253858'
        },
        text: {
          primary: '#DEEBFF', // Văn bản sáng
          secondary: '#B3BAC5'
        }
      }
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: '8px',
            height: '8px'
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#bdc3c7',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'darkgray'
          }
        }
      }
    },
    // Name of the component
    MuiButton: {
      styleOverrides: {
        // Name of the slot
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({theme}) => ({
          color: theme.palette.primary.main,
          fontSize: '0.875 rem'
        })
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({theme}) => ({
          color: theme.palette.text.primary,
          fontSize: '0.875 rem',
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.primary,
          },
          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.text.primary
            }
          },
          '& fieldset': {
            borderWidth: '1px !important'
          },


        })
      }
    }
    ,
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': {
            fontSize: '0.875rem'
          }
        }
      }
    }
  }
})

export default theme