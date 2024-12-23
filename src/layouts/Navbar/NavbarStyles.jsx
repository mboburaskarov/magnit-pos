import makeStyles from '@mui/styles/makeStyles'

const drawerWidth = '296px'

export const navbarStyles = makeStyles((theme) => {
  return {
    root: {
      zIndex: 15,
      display: 'flex',
      // width: '400px',
      '& .MuiPaper-root': {
        border: 0,
        overflowX: 'hidden',
        margin: 20,
        height: 'calc(100% - 40px)',

        padding: ({ isOpen }) => (isOpen ? '24px 16px' : '30px 0'),
        borderRadius: 20,
        backgroundColor: theme.palette.background.gray,
      },
      '& nav': {
        // width: '330px',
      },
      position: 'relative',
    },
    list: {
      padding: 0,
      marginTop: '32px',
      '&:hover': {
        '& .popper': {
          display: 'block',
          opacity: 1,
          zIndex: 1010,
        },
      },
    },
    popper: {
      backgroundColor: theme.palette.background.gray,
      borderRadius: '16px',
      width: 280,
      backgroundColor: '#fff',
      boxShadow: '0px 4px 12px 0px #00000014',
      border: '1px solid',
      borderColor: theme.palette.bunker[100],
      outline: '0',
      minHeight: 402,
      '& > a': {
        margin: '5px auto 0',
      },
    },
    popperParent: {
      position: 'fixed !important',
      left: `96px !important`,
      top: `90px !important`,
      width: 268,
      opacity: 0,
      borderLeft: '36px solid transparent',
      display: 'none',
    },
    close_icon: {
      // position: 'absolute',
      right: ({ isOpen }) => (isOpen ? 20 : 0),
      top: 40,
      '& > span > svg > path': {
        // fill: theme.palette.gray[400],
      },
      zIndex: 9999999,
      width: 32,
      height: 32,
      backgroundColor: 'transparent',
      // display: 'flex',
      // alignItems: 'center',
      // justifyContent: 'center',
      outline: '0',
      border: '0',
      top: 0,
      bottom: 0,
      marginBottom: '1px',
      cursor: 'pointer',
      '& span': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: '0.5s',
      },
    },
    right_faced: {
      transform: 'rotate(0deg)',
    },
    left_faced: {
      transform: 'rotate(-180deg)',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      '&::-webkit-scrollbar': {
        background: 'transparent',
        width: 6,
      },
      '&::-webkit-scrollbar-thumb': {
        background: theme.palette.gray[300],
        width: 6,
        borderRadius: 2,
      },
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: 96,
      '& .drawer_icon': {
        paddingRight: 50,
      },
      '& .drawer_list_item': {
        padding: '0 32px',
      },
      '& .drawer_user_avatar': {
        padding: ({ isOpen }) => (isOpen ? '8px 32px' : '12px 16px'),
        transition: '0.3s',
      },
      '& .drawer_user_avatar > div > div:nth-child(1)': {
        width: 32,
        height: 32,
        marginRight: 32,
        fontSize: 12,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    listItem: {
      width: '100%',
      height: 48,
      fontSize: 18,
      padding: '10px 20px',
      '&.active': {
        backgroundColor: theme.palette.orange[500],
        '& .itemLabel': {
          color: '#fff',
        },
      },
      '&:first-child': {
        margin: '0 0 8px',
      },
      '&:last-child': {
        margin: '8px 0 0px',
      },
      margin: '8px 0',
      borderRadius: 50,
      // paddingLeft: '32px !important',
      // paddingRight: '32px !important',
      fontWeight: 600,
      lineHeight: '28px',
      color: theme.palette.dark[500],
      fontFamily: theme.fontFamily.Gilroy,
      transition: '0.3s',
      cursor: 'pointer',
      '&.Mui-selected': {
        backgroundColor: theme.palette.orange[500],
        color: theme.palette.white,
      },
      '&.Mui-selected:hover': {
        backgroundColor: theme.palette.orange[500],
        color: theme.palette.white,
      },
      '&:hover': {
        backgroundColor: theme.palette.orange[500],
        color: theme.palette.white,
        '& .bottomIcon > svg > path': {
          fill: '#fff',
        },
        '&.bottomIcon > svg > path': {
          fill: '#fff',
        },
      },
      '& svg': {
        marginRight: 10,
        // height: 20,
        transition: '0.3s',
      },
      '&:hover > div': {
        color: theme.palette.white,
      },
      '&:hover > svg > .fill-icon': {
        fill: theme.palette.white,
      },
      '&:hover > svg > .stroke-icon': {
        stroke: theme.palette.white,
      },
      '&:hover .drawer_icon > svg > .fill-icon': {
        fill: theme.palette.white,
      },
      '&:hover .drawer_icon > svg > .stroke-icon': {
        stroke: theme.palette.white,
      },
      '& .drawer_icon> svg > .stroke-icon': {
        stroke: theme.palette.black,
        strokeWidth: 1.5,
      },
      '& .drawer_icon> svg > .fill-icon': {
        fill: theme.palette.black,
        strokeWidth: 1.5,
      },
      '&.active .drawer_icon > svg > .fill-icon': {
        fill: theme.palette.white,
      },
      '&.active .drawer_icon > svg > .stroke-icon': {
        stroke: theme.palette.white,
      },
    },
    listItemPopper: {
      cursor: 'pointer',
      height: 56,
      fontSize: 18,
      padding: '16px 20px',
      fontWeight: 600,
      lineHeight: '28px',
      color: theme.palette.dark[500],
      fontFamily: theme.fontFamily.Gilroy,
      transition: '0.3s',
      '& svg': {
        marginRight: 10,
        height: 24,
        width: 24,
        transition: '0.3s',
      },
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: ({ isOpen }) => (isOpen ? 'space-between' : 'center'),
      position: 'relative',
      padding: ({ isOpen }) => (isOpen ? '0 7px 0 0px' : '0 0 0 0'),
    },
    brandLogo: {
      height: 50,
      display: 'flex',
      alignItems: 'center',
      '& > svg > path': {
        // fill: theme.mode === 'dark' && 'white',
      },
    },
    logo_letter_main: {
      marginTop: '3px',
    },
    logo_main: {
      marginRight: 0,
      display: 'flex',
      // width: '50px',
      alignItems: 'center',
      '& > svg > path': {
        // fill: theme.mode === 'dark' && 'white',
      },
      '& > svg > path:nth-child(2)': {
        fill: theme.mode === 'dark' && '#1D1D1B',
      },
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    currentUser: {
      cursor: 'pointer',
      width: 'calc(100% - 32px) !important',
      marginTop: 'auto !important',
      // marginBottom: ({ isOpen }) => (isOpen ? 20 : 0) + 'px !important',
      marginLeft: '16px !important',
      padding: '12px 16px !important',
      borderRadius: '32px !important',
      '&:hover': {
        backgroundColor: theme.palette.green[200],
        '& p': {
          color: theme.palette.green[500],
        },
        '& .shopname': {
          color: theme.palette.gray[600],
        },
      },
      marginBottom: '24px !important',
    },
    avatarPlaceholder: {
      position: 'relative',
      height: 40,
      width: 40,
      borderRadius: 20,
      marginRight: 12,
      fontWeight: 600,
      fontSize: 16,
      backgroundColor: theme.palette.green[600],
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#fff',
      transition: '0.3s',
    },
    shopname: {
      width: 130,
      margin: 0,
      lineHeight: '19px',
      fontWeight: 600,
      fontFamily: "'Gilroy', sans-serif",
      color: theme.palette.gray[400],
      fontSize: 16,
      transition: 'all .2s',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'left',
    },
    username: {
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      color: theme.palette.gray[600],
    },
    itemIcon: {
      flex: '0 0 17%',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
      transition: '0.3s',
      paddingRight: 16,
      '& svg': {
        width: 24,
        height: 24,
        margin: 0,
      },
    },
    itemLabel: {
      flex: '1 0 73%',
      lineHeight: '28px',
      fontSize: 18,
      fontWeight: 600,

      color: theme.palette.dark[500],
    },
    itemArrow: {
      flex: '0 0 10%',
      display: 'flex',
      alignItems: 'center',
      height: '100%',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    avatar: {
      position: 'relative',
      marginLeft: ({ isOpen }) => (isOpen ? 0 : -4),
      marginTop: ({ isOpen }) => (isOpen ? 0 : -4),
      height: 40,
      width: 40,
      borderRadius: 20,
      overflow: 'hidden',
      '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
    },
    settingsIcon: {
      position: 'absolute',
      top: -4,
      right: -4,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      borderRadius: '50%',
      '& svg': {
        fontSize: 8,
      },
    },
    hr: {
      height: 1,

      border: `1px solid ${theme.palette.bunker[100]}`,
    },
    activeChild: {
      transform: 'translateX(0) !important',
    },

    parent: {
      position: 'relative',
      width: '100%',
      '& > div > svg': {
        height: 20,
      },
    },
    child: {
      minHeight: '370px',

      backgroundColor: 'tramsparent',
      transform: 'translateX(100%)',
      // transition: 'transform .4s cubic-bezier(.4, .0, .2, 1)',
    },
    skeleton: {
      width: 'calc(100% - 32px)',
      marginTop: 'auto',
      marginBottom: ({ isOpen }) => (isOpen ? 20 : 0),
      marginLeft: 16,
      borderRadius: 32,
      transform: 'none',
      height: 64,
    },
    fakeImage: {
      position: 'absolute',
      height: 40,
      width: 40,
      borderRadius: 20,
      marginRight: 12,
      fontWeight: 600,
      fontSize: 16,
      backgroundColor: theme.palette.green[600],
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      left: 28,
      top: 12,
    },
  }
})
