import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth/auth-provider';
import { ROUTE_SETUP } from '../../infrastructure/route-setup';
import { hasCategoryAccess, hasRouteAccess } from '../../infrastructure/route-access';
import { DialogType, informationText } from '../../context/dialog/dialog-context-type';
import { useDialog } from '../../context/dialog/dialog-provider';
import { Role } from '../../common/role';

export default function MenuMobile() {
    const [menuAnchorElement, setMenuAnchorElement] = React.useState<null | HTMLElement>(null);
    const open = Boolean(menuAnchorElement);

    const auth = useAuth();
    const navigate = useNavigate();
    const dialog = useDialog();

    const handleCloseMenu = () => {
        setMenuAnchorElement(null);
    };

    const openProfileDialog = () => {
        dialog.openDialog(DialogType.INFORMATION, auth.userSecurityCredentials?.username ?? 'Profile', [
            informationText(`Hi ${auth.userSecurityCredentials?.username},<br />you have the role:`),
            informationText(`<b>${Role[auth.userSecurityCredentials?.roleId!]}</b>`)
        ]);
    }

    return (
        <React.Fragment>
            <IconButton
                onClick={(e) => setMenuAnchorElement(e.currentTarget)}
                size="small"
                sx={{ ml: 1 }}
                aria-controls={open ? 'mobile-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <MenuIcon color="primary" />
            </IconButton>
            <Menu
                anchorEl={menuAnchorElement}
                id="mobile-menu"
                open={open}
                onClose={handleCloseMenu}
                onClick={handleCloseMenu}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&::before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            left: 4,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => {
                    handleCloseMenu();
                    openProfileDialog();
                }}>
                    <ListItemIcon>
                        <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText>
                        Profile
                    </ListItemText>
                </MenuItem>
                {ROUTE_SETUP.filter(_ => hasCategoryAccess(_, auth.userSecurityCredentials?.roleId!)).map(category => (
                    <div key={category.title}>
                        <Divider />
                        {category.routes.filter(route => route.menu && hasRouteAccess(route.roles, auth.userSecurityCredentials?.roleId || Role.NoRole))
                            .map(route => 
                                route.paths.map(path => (
                                    <MenuItem key={route.name} onClick={() => {
                                        handleCloseMenu();
                                        navigate(path)
                                    }}>
                                        <ListItemIcon>
                                            {route.icon}
                                        </ListItemIcon>
                                        <ListItemText>
                                            {route.name}
                                        </ListItemText>
                                    </MenuItem>
                                )
                            )
                        )}
                    </div>
                ))}
            </Menu>
        </React.Fragment>
    );
}