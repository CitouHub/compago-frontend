import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

export default function MenuAction({
    handleEdit,
    handleDelete,
    handleRemove,
    handleMoveUp,
    handleMoveDown,
    editText,
    deleteText,
    removeText,
    moveUpText,
    moveDownText
}: {
        handleEdit?(): void | undefined,
        handleDelete?(): void | undefined,
        handleRemove?(): void | undefined,
        handleMoveUp?(): void | undefined,
        handleMoveDown?(): void | undefined,
        editText?: string | undefined,
        deleteText?: string | undefined,
        removeText?: string | undefined,
        moveUpText?: string | undefined,
        moveDownText?: string | undefined
}) {
    const [menuAnchorElement, setMenuAnchorElement] = React.useState<null | HTMLElement>(null);
    const open = Boolean(menuAnchorElement);

    const handleCloseMenu = () => {
        setMenuAnchorElement(null);
    };

    return (
        <React.Fragment>
            <IconButton
                onClick={(e) => setMenuAnchorElement(e.currentTarget)}
                size="small"
                aria-controls={open ? 'journal-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                anchorEl={menuAnchorElement}
                id="journal-menu"
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
                            right: 14,
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
                {handleEdit !== undefined && <MenuItem onClick={() => {
                    handleCloseMenu();
                    if (handleEdit !== undefined) {
                        handleEdit();
                    }
                }}>
                    <ListItemIcon>
                        <EditIcon />
                    </ListItemIcon>
                    <ListItemText>{editText ?? 'Edit'}</ListItemText>
                </MenuItem>}
                {handleDelete !== undefined && <MenuItem onClick={() => {
                    handleCloseMenu();
                    if (handleDelete !== undefined) {
                        handleDelete();
                    }
                }}>
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText>{deleteText ?? 'Delete'}</ListItemText>
                </MenuItem>}
                {handleRemove !== undefined && <MenuItem onClick={() => {
                    handleCloseMenu();
                    if (handleRemove !== undefined) {
                        handleRemove();
                    }
                }}>
                    <ListItemIcon>
                        <UndoIcon />
                    </ListItemIcon>
                    <ListItemText>{removeText ?? 'Remove'}</ListItemText>
                </MenuItem>}
                {handleMoveUp !== undefined && <MenuItem onClick={() => {
                    handleCloseMenu();
                    if (handleMoveUp !== undefined) {
                        handleMoveUp();
                    }
                }}>
                    <ListItemIcon>
                        <ArrowUpwardIcon />
                    </ListItemIcon>
                    <ListItemText>{moveUpText ?? 'Move up'}</ListItemText>
                </MenuItem>}
                {handleMoveDown !== undefined && <MenuItem onClick={() => {
                    handleCloseMenu();
                    if (handleMoveDown !== undefined) {
                        handleMoveDown();
                    }
                }}>
                    <ListItemIcon>
                        <ArrowDownwardIcon />
                    </ListItemIcon>
                    <ListItemText>{moveDownText ?? 'Move down'}</ListItemText>
                </MenuItem>}
            </Menu>
        </React.Fragment>
    );
}