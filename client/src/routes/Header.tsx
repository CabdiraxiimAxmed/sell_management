import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../app/store';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import SellIcon from '@mui/icons-material/Sell';
import GroupIcon from '@mui/icons-material/Group';
import AddIcon from '@mui/icons-material/Add';
import InventoryIcon from '@mui/icons-material/Inventory';
import FlagIcon from '@mui/icons-material/Flag';
import ShopIcon from '@mui/icons-material/Shop';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BorderClearIcon from '@mui/icons-material/BorderClear';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { styled, useTheme, Theme, CSSObject, makeStyles } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import PersonIcon from '@mui/icons-material/Person';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

const drawerWidth = 190;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);
interface MiniProps {
  children: any,
}
const MiniDrawer:React.FC<MiniProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.user.value);
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const gotPermission = (page: string) => {
    if(user.role == 'admin') return true;
    if(user.permissions.length === 0 || user.permissions[0] == '') return false;
    let permissions = user.permissions[0].split(',');
    for (let allowedPage of permissions) {
      console.log({allowedPage});
      if (allowedPage === page) return true;
    };
    return false;
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Mini variant drawer
          </Typography>
          {/* <Typography variant="h6" noWrap component="div" style={{ transform: 'translateX(60rem)'}}>
              <PersonIcon />{user.username}
              </Typography> */}
          <Button variant="contained" startIcon={<PersonIcon />} style={{fontWeight: 'bold', transform: 'translateX(55rem)'}}>
            {user.username}
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }} component ={Link} to="/user-management" className={gotPermission('user-management')? '': 'inactive'}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <AccessibilityIcon color="secondary" />
              </ListItemIcon>
              <ListItemText primary={'cinwaanada'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding sx={{ display: 'block' }} component ={Link} to="/supplier" className={gotPermission('supplier')? '': 'inactive'}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <ShopIcon color="secondary" />
              </ListItemIcon>
              <ListItemText primary={'supplier'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding sx={{ display: 'block' }} component ={Link} to="/purchase-order" className={gotPermission('purchase-order')? '': 'inactive'}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <ShoppingCartIcon color="secondary" />
              </ListItemIcon>
              <ListItemText primary={'alaab dalbo'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }} component ={Link} to="/orders" className={gotPermission('orders')? '': 'inactive'}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <ReceiptIcon color="secondary"  />
              </ListItemIcon>
              <ListItemText primary={'dalabkaaga'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding sx={{ display: 'block' }} component ={Link} to="/sell" className={gotPermission('sell')? '': 'inactive'}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <SellIcon color="secondary"  />
              </ListItemIcon>
              <ListItemText primary={'iibi'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }} component ={Link} to="/sells" className={gotPermission('sell-list')? '': 'inactive'}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <BorderClearIcon color="secondary"  />
              </ListItemIcon>
              <ListItemText primary={'sells'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding sx={{ display: 'block' }} component ={Link} to="/customers" className={gotPermission('customers')? '': 'inactive'}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <GroupIcon color="secondary"  />
              </ListItemIcon>
              <ListItemText primary={'macamiisha'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <Divider />
          <ListItem disablePadding sx={{ display: 'block' }} component ={Link} to="/inventory" className={gotPermission('inventory')? '': 'inactive'}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <InventoryIcon color="secondary"  />
              </ListItemIcon>
              <ListItemText primary={'alaabta'} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <Divider />
        </List>
        <ListItem disablePadding sx={{ display: 'block' }} component ={Link} to="/" className={gotPermission('home')? '': 'inactive'}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <FlagIcon color="secondary"  />
            </ListItemIcon>
            <ListItemText primary={'report'} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, padding: 3}}>
        <DrawerHeader/>
        {children}
      </Box>
    </Box>
  );
}
export default MiniDrawer;
export {DrawerHeader};
