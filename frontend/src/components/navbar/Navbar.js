import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import menu2Fill from '@iconify/icons-eva/menu-2-fill';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, AppBar, Toolbar, IconButton, Button, Typography, Container } from '@mui/material';
// components
import MobileHidden from '../common/MobileHidden';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';
// recoil
import { useRecoilState, useRecoilValue } from 'recoil';
import { isLoggedState, isUserInfoUpdatedState, loggedUserState } from '../../atoms/atoms';

import { NavLogo } from './Logo';

import logo from '../../assets/images/pollar_logo.svg';

import sidebarConfig from './SidebarConfig';
import NavSection from './NavSection';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkUserLogged, getLoggedUserId, getLoggedUserInfo } from '../../utils/loggedUser';
import NotificationsPopover from '../notification/NotificationsPopover';
import SearchDrawer from './SearchDrawer';
import GradAnimatedButton from '../common/GradAnimatedButton';
import { getUserInfo } from '../../services/api/UserApi';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 280;
const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const RootStyle = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  backdropFilter: 'blur(1px)',
  WebkitBackdropFilter: 'blur(6px)', // Fix on Mobile
  backgroundColor: alpha(theme.palette.background.default, 0.72),
  // [theme.breakpoints.up('lg')]: {
  //   width: `calc(100% - ${DRAWER_WIDTH + 1}px)`,
  // },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_MOBILE,
  backgroundColor: 'transparent',
  [theme.breakpoints.up('lg')]: {
    minHeight: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

Navbar.propTypes = {
  onOpenSidebar: PropTypes.func,
};

export default function Navbar({ onOpenSidebar, isFullLayout }) {
  // todo ??????
  // const [loggedUser, setLoggedUser] = useRecoilState(loggedUserState);
  // ????????? ??????
  const isLogged = useRecoilValue(isLoggedState);

  const isUserInfoUpdated = useRecoilValue(isUserInfoUpdatedState);
  // (??????)
  //// ?????????: ???????????? ??? recoil state ????????? (line 90)
  // JWT ????????? ?????? ??????
  const [loggedUserInfo, setLoggedUserInfo] = useState();

  useEffect(() => {
    // localStorage?????? ?????? ?????????
    const localStorageUserInfo = getLoggedUserInfo();
    // ????????? ????????????, ????????? ????????? ?????????
    //? recoil??? ???????????? ??????, ???????????? ??? ???????????? ??????????????? ?????????, localstorage??? ?????? ??????
    if (isLogged || checkUserLogged()) {
      // localStorage?????? ?????? ??????
      setLoggedUserInfo(localStorageUserInfo);
      //// ????????? ??????????????? ?????? ??? check
      //// setIsUserInfoUpdated(false);
    } else {
      // ??????????????? ????????????, ????????? ?????? ?????????
      setLoggedUserInfo();
    }
  }, [isLogged, isUserInfoUpdated]); //? ???????????? ???, ????????? ?????? ????????? recoil??? deps??? ???????????? ???????????? ?????????

  return (
    <RootStyle sx={isFullLayout ? { backgroundColor: 'transparent' } : null}>
      <Container maxWidth="lg">
        <ToolbarStyle>
          <Box sx={{ flexGrow: 1 }}>
            <AppBar
              position="static"
              sx={{
                boxShadow: 'none',
                backgroundColor: 'transparent',
              }}
            >
              <Toolbar sx={{ backgroundColor: 'transparent' }}>
                <NavLogo component={Link} to="/">
                  {/* <NavIcon /> */}
                  <Box component="img" src={logo} sx={{ width: 35, height: 35 }} />
                  <Typography variant="h3" sx={{ pl: 1, pr: 2, fontStyle: 'bold' }}>
                    Pollar
                  </Typography>
                </NavLogo>
                <NavSection navConfig={sidebarConfig} mr={10} />
                <SearchDrawer user={loggedUserInfo} isUserLogged={isLogged || checkUserLogged()} />
                <Box sx={{ flexGrow: 1 }} />
                {loggedUserInfo ? (
                  <>
                    <NotificationsPopover />
                    <AccountPopover account={loggedUserInfo} />
                  </>
                ) : (
                  <>
                    <Button href="/users/login" variant="text" color="primary">
                      Login
                    </Button>
                    <Button href="/users/signup" variant="contained">
                      Sign Up
                    </Button>
                  </>
                )}
              </Toolbar>
            </AppBar>
          </Box>
        </ToolbarStyle>
      </Container>
    </RootStyle>
  );
}
