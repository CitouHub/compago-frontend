import React, { forwardRef, useContext, useState, createContext, useRef } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import commonStyles from "../../section/style/common.module.css";
import { TransitionProps } from '@mui/material/transitions';
import { AdditionalText, DialogContextType, DialogType, TextType } from './dialog-context-type';
import { hashCode } from "../../utils/string-helper";
import { Alert } from "@mui/material";

const DialogContext = createContext<DialogContextType>(null!);

export interface DialogDefinition {
    dialogType: DialogType
    title: string,
    text: AdditionalText[],
    open: boolean,
}

const Transition = forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function DialogProvider({ children }: { children: React.ReactNode }) {
    const [dialog, setDialog] = useState<DialogDefinition>({
        dialogType: DialogType.INFORMATION,
        title: "",
        text: [] as AdditionalText[],
        open: false
    });
    const choiceFn = useRef<any>(undefined);

    const openDialog = (dialogType: DialogType, title: string, text: AdditionalText[]) => {
        return new Promise<boolean>((resolve) => {
            setDialog({ dialogType, title, text, open: true });
            choiceFn.current = (choice: boolean) => {
                resolve(choice)
                setDialog({ ...dialog, open: false });
            }
        })
    }

    return (
        <DialogContext.Provider value={{ openDialog }}>
            {children}
            <Dialog
                open={dialog.open}
                TransitionComponent={Transition}
                keepMounted
            >
                <DialogTitle>{dialog.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <span>
                            {dialog.text.filter(_ => _.textType === TextType.INFORMATION).map(textSegment => {
                                return (<li
                                    key={hashCode(textSegment.text)}
                                    style={{ paddingTop: '1rem', listStyleType: 'none' }}
                                    dangerouslySetInnerHTML={{ __html: textSegment.text }}>
                                </li>)
                            })}
                        </span>
                    </DialogContentText>
                    {dialog.text.filter(_ => _.textType === TextType.WARNING).map(textSegment => {
                        return <div key={`${Math.random()}-warning`} style={{ paddingTop: '1rem' }}>
                            <Alert className={commonStyles.alert} severity="warning">
                                <span
                                    dangerouslySetInnerHTML={{ __html: textSegment.text }}>
                                </span>
                            </Alert>
                        </div>
                    })}
                </DialogContent>
                <DialogActions sx={{padding: '1.5rem'}}>
                    {dialog.dialogType === DialogType.INFORMATION &&
                        <Button variant="contained" onClick={() => choiceFn.current(true)}>OK</Button>
                    }
                    {dialog.dialogType === DialogType.CONFIRM &&
                        <React.Fragment>
                            <Button variant="outlined" onClick={() => choiceFn.current(true)}>Yes</Button>
                            <Button variant="contained" onClick={() => choiceFn.current(false)}>No</Button>
                        </React.Fragment>
                    }
                </DialogActions>
            </Dialog>
        </DialogContext.Provider>
    );
}

export function useDialog() {
    return useContext(DialogContext);
}