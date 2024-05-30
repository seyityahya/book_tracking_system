import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import IconButton from '@mui/material/IconButton';
import { FaWindowClose } from 'react-icons/fa';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function TransitionDialog({
    open,
    setOpen,
    title,
    content,
    firstButtonLabel,
    secondButtonLabel,
    handleFirstButton,
    handleSecondButton,
    isTwoButton = true,
    buttonDisabled = false,
    isShowCloseButton = true,
    children
}) {

    const handleClose = () => {
        setOpen(false);
    };

    // Prevent dialog closure on backdrop click
    const handleBackdropClick = (event) => {
        event.stopPropagation(); // Stop event propagation to parent elements
    };

    return (
        <React.Fragment>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                onClick={handleBackdropClick}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{title}</DialogTitle>
                {isShowCloseButton &&
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <FaWindowClose />
                    </IconButton>}
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {content}
                    </DialogContentText>
                    {children}
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={buttonDisabled}
                        onClick={handleFirstButton}>
                        {firstButtonLabel}
                    </Button>
                    {isTwoButton && <Button onClick={handleSecondButton}>{secondButtonLabel}</Button>}
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}