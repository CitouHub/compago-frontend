import styles from '../style/component.module.css';
import { LoadingButton } from '@mui/lab';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useDialog } from '../../context/dialog/dialog-provider';
import { AdditionalText, DialogType, informationText } from '../../context/dialog/dialog-context-type';

export default function BaseOperations({
    primaryButtonText,
    primaryButtonIcon,
    primaryButtonLoading,
    priamryButtonDisable,
    onPrimaryButtonClick,
    primaryButtonConfirmationTexts,

    action1ButtonText,
    action1ButtonIcon,
    action1ButtonLoading,
    action1ButtonDisable,
    onAction1ButtonClick,
    action1ButtonConfirmationTexts,

    action2ButtonText,
    action2ButtonIcon,
    action2ButtonLoading,
    action2ButtonDisable,
    onAction2ButtonClick,
    action2ButtonConfirmationTexts,

    action3ButtonText,
    action3ButtonIcon,
    action3ButtonLoading,
    action3ButtonDisable,
    onAction3ButtonClick,
    action3ButtonConfirmationTexts,

    helpInfoButtonText,
    helpInfoTexts
}: {
    primaryButtonText?: string | undefined,
    primaryButtonIcon?: React.ReactNode | undefined,
    primaryButtonLoading?: boolean | undefined,
    priamryButtonDisable?: boolean | undefined,
    onPrimaryButtonClick?(): void | undefined,
    primaryButtonConfirmationTexts?: AdditionalText[] | undefined,

    action1ButtonText?: string | undefined,
    action1ButtonIcon?: React.ReactNode | undefined,
    action1ButtonLoading?: boolean | undefined,
    action1ButtonDisable?: boolean | undefined,
    onAction1ButtonClick?(): void | undefined,
    action1ButtonConfirmationTexts?: AdditionalText[] | undefined,

    action2ButtonText?: string | undefined,
    action2ButtonIcon?: React.ReactNode | undefined,
    action2ButtonLoading?: boolean | undefined,
    action2ButtonDisable?: boolean | undefined,
    onAction2ButtonClick?(): void | undefined,
    action2ButtonConfirmationTexts?: AdditionalText[] | undefined,

    action3ButtonText?: string | undefined,
    action3ButtonIcon?: React.ReactNode | undefined,
    action3ButtonLoading?: boolean | undefined,
    action3ButtonDisable?: boolean | undefined,
    onAction3ButtonClick?(): void | undefined,
    action3ButtonConfirmationTexts?: AdditionalText[] | undefined,

    helpInfoButtonText?: string | undefined,
    helpInfoTexts?: string[] | undefined
}) {
    const dialog = useDialog();

    const openHelpInformationDialog = () => {
        dialog.openDialog(DialogType.INFORMATION, "Help / Information", (helpInfoTexts ?? []).map(_ => informationText(_)));
    }

    const isDisabled = () => {
        return primaryButtonLoading === true || 
            action1ButtonLoading === true ||
            action2ButtonLoading === true ||
            action3ButtonLoading === true;
    }

    const handleOnClick = async (confirmationTexts?: AdditionalText[] | undefined, onClick?: () => void | undefined) => {
        if (onClick !== undefined) {
            if (confirmationTexts !== undefined) {
                const choice = await dialog.openDialog(DialogType.CONFIRM, "Are you sure?", confirmationTexts);
    
                if (choice === true) {
                    onClick();
                }
            } else {
                onClick();
            }
        }
    }

    return (
        <div className={styles.buttonList} >
            {helpInfoTexts !== undefined && <LoadingButton
                sx={{ float: "right" }}
                id={`info-button`}
                loadingPosition="start"
                startIcon={<HelpOutlineIcon />}
                variant="outlined"
                onClick={openHelpInformationDialog}
            >
                {helpInfoButtonText ?? 'Help / Info'}
            </LoadingButton>}
            {onAction3ButtonClick !== undefined && <LoadingButton
                sx={{ float: "right" }}
                id={`action3-button`}
                loadingPosition="start"
                startIcon={action3ButtonIcon}
                variant="outlined"
                loading={action3ButtonLoading}
                disabled={isDisabled() || action3ButtonDisable === true}
                onClick={() => handleOnClick(action3ButtonConfirmationTexts, onAction3ButtonClick)}
            >
                {action3ButtonText ?? 'Action 2'}
            </LoadingButton>}
            {onAction2ButtonClick !== undefined && <LoadingButton
                sx={{ float: "right" }}
                id={`action2-button`}
                loadingPosition="start"
                startIcon={action2ButtonIcon}
                variant="outlined"
                loading={action2ButtonLoading}
                disabled={isDisabled() || action2ButtonDisable === true}
                onClick={() => handleOnClick(action2ButtonConfirmationTexts, onAction2ButtonClick)}
            >
                {action2ButtonText ?? 'Action 2'}
            </LoadingButton>}
            {onAction1ButtonClick !== undefined && <LoadingButton
                sx={{ float: "right" }}
                id={`action1-button`}
                loadingPosition="start"
                startIcon={action1ButtonIcon}
                variant="outlined"
                loading={action1ButtonLoading}
                disabled={isDisabled() || action1ButtonDisable === true}
                onClick={() => handleOnClick(action1ButtonConfirmationTexts, onAction1ButtonClick)}
            >
                {action1ButtonText ?? 'Action 1'}
            </LoadingButton>}
            {onPrimaryButtonClick !== undefined && <LoadingButton
                sx={{ float: "right" }}
                id={`primary-button`}
                loadingPosition="start"
                startIcon={primaryButtonIcon}
                variant="contained"
                loading={primaryButtonLoading}
                disabled={isDisabled() || priamryButtonDisable === true}
                onClick={() => handleOnClick(primaryButtonConfirmationTexts, onPrimaryButtonClick)}
            >
                {primaryButtonText ?? 'Primary'}
            </LoadingButton>}
        </div>
    )
};