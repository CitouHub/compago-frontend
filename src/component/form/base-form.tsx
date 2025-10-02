import { ReactElement, useEffect, useState } from 'react';
import { Autocomplete, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, InputAdornment, InputLabel, ListItemText, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material';
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import { FieldDefinition } from './field-definition';
import styles from '../style/component.module.css';
import commonStyles from '../../section/style/common.module.css';
import dayjs from 'dayjs';
import { SelectItem } from './select-item';
import { AdditionalText, informationText, warningText } from '../../context/dialog/dialog-context-type';
import BaseOperations from '../operations/base-operations';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePhone } from './input-validation';

export default function BaseForm({
    children,
    name,
    model,
    setModel,
    fields,

    submitButtonText,
    submitEntity,
    submitValidation,
    submitDisable,
    submitting,

    deleteButtonText,
    deleteConfirmationText,
    deleteWarnings,
    deleteEntity,
    deleting,

    cancelButtonText,
    cancel,

    customButtonText,
    customButtonConfirmationText,
    customButtonIcon,
    customAction,
    customActionLoading,

    knownValidationErrors,

    helpInformationText,
    inputFull
}: {
        children?: ReactElement | ReactElement[] | undefined,
        name?: string | undefined,
        model: any,
        setModel(model: any): void,
        fields: FieldDefinition[],

        submitButtonText?: string | undefined,
        submitEntity?(model: any): void | undefined,
        submitValidation?(model: any, errors: any): void | undefined,
        submitDisable?: boolean | undefined,
        submitting?: boolean | undefined,

        deleteButtonText?: string | undefined,
        deleteConfirmationText?: string | undefined,
        deleteWarnings?: string[] | undefined,
        deleteEntity?(): void | undefined,
        deleting?: boolean | undefined,

        cancelButtonText?: string | undefined,
        cancel?(): void | undefined,

        customButtonText?: string | undefined,
        customButtonConfirmationText?: AdditionalText[] | undefined,
        customButtonIcon?: React.ReactNode,
        customAction?(): void | undefined,
        customActionLoading?: boolean | undefined,

        knownValidationErrors?: any | undefined,

        helpInformationText?: string[] | undefined,
        inputFull?: boolean | undefined
}) {
    const [errors, setErrors] = useState<any>(knownValidationErrors ?? {});

    const navigate = useNavigate();

    useEffect(() => {
        setErrors(knownValidationErrors ?? {});
    }, [knownValidationErrors])

    const validateSubmit = () => {
        if (submitEntity !== undefined) {
            let foundErrors: any = knownValidationErrors ?? {};
            fields.forEach(field => {
                // Required
                if (field.required && (model[field.id] === undefined || model[field.id] === null || model[field.id] === "")) {
                    foundErrors = { ...foundErrors, [field.id]: `${field.name} is required` };

                // Required
                } else if (field.required && (model[field.id] as any[] === undefined || model[field.id] as any[] === null || (model[field.id] as any[]).length === 0)) {
                    foundErrors = { ...foundErrors, [field.id]: `${field.name} is required` };

                // Max
                } else if (field.max !== undefined && field.type === 'number' && model[field.id] as number > field.max) {
                    foundErrors = { ...foundErrors, [field.id]: `${field.name} must be less then or equal to ${field.max}` };
                } else if (field.max !== undefined && field.type === 'text' && (model[field.id] as string).length > field.max) {
                    foundErrors = { ...foundErrors, [field.id]: `${field.name} must be short then or equal to ${field.max} characters` };

                // Min
                } else if (field.min !== undefined && field.type === 'number' && model[field.id] as number < field.min) {
                    foundErrors = { ...foundErrors, [field.id]: `${field.name} must be larger then or equal to ${field.min}` };
                } else if (field.min !== undefined && field.type === 'text' && (model[field.id] as string).length < field.min) {
                    foundErrors = { ...foundErrors, [field.id]: `${field.name} must be longer then or equal to ${field.min} characters` };

                // Email
                } else if (field.type === 'email' && !validateEmail(model[field.id] as string)) {
                    foundErrors = { ...foundErrors, [field.id]: `${model[field.id]} is not a valid Email` };

                // Phone
                } else if (field.type === 'phone' && !validatePhone(model[field.id] as string)) {
                    foundErrors = { ...foundErrors, [field.id]: `${model[field.id]} is not a valid Phone number` };
                }
            })

            if (submitValidation !== undefined) {
                foundErrors = submitValidation(model, foundErrors);
            }

            setErrors(foundErrors);

            if (Object.values(foundErrors).length === 0) {
                submitEntity(model);
            }
        }
    }

    const isDisabled = (fieldDisabled: boolean) => {
        return fieldDisabled || submitting || deleting;
    }

    const renderInfo = (name: string, value?: any | undefined) => {
        if (value === undefined || value.length === 0) {
            return <p style={{color: 'lightgrey'}}><i>{name} missing</i></p>
        }

        if (value as Boolean === true) {
            return <p>Yes</p>
        }

        if (value as Boolean === false) {
            return <p>No</p>
        }

        if (value instanceof Date === true) {
            return dayjs(value as Date).format('YYYY-MM-DD');
        }

        return <p>{value}</p>
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.form}>
                {fields.filter(_ => _.hidden !== true).map(field => {

                    switch (field.type) {
                        case 'info':
                            return <div
                                key={field.id}
                                className={inputFull === true || field.fullInput === true ? styles.inputFull : styles.input}
                                id={`${field.id}-info`}
                            >
                                <p><b>{field.name}</b></p>
                                {renderInfo(field.name, model[field.id])}
                            </div>
                        case 'link':
                        case 'internalLink':
                            return <div
                                key={field.id}
                                className={inputFull === true || field.fullInput === true ? styles.inputFull : styles.input}
                                id={`${field.id}-link`}
                            >
                                <p><b>{field.name}</b></p>
                                {field.type === "link" && <a rel="noopener noreferrer" href={model[field.id]} target="_blank">{field.valueName ?? model[field.id]}</a>}
                                {field.type === "internalLink" && <p
                                    className={commonStyles.clickable}
                                    onClick={() => navigate(model[field.id] as string)} >
                                        {field.valueName ?? model[field.id]}
                                </p>}
                            </div>
                        case 'text':
                        case 'phone':
                        case 'email': {
                            return (<TextField
                                key={field.id}
                                className={inputFull === true || field.fullInput === true ? styles.inputFull : styles.input}
                                id={`${field.id}-text`}
                                label={field.name}
                                value={model[field.id] ?? ''}
                                disabled={isDisabled(field.disabled)}
                                error={errors[field.id] !== undefined}
                                helperText={errors[field.id]}
                                onChange={e => {
                                    setModel({ ...model, [field.id]: e.target.value });
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">{field.adornment}</InputAdornment>,
                                }}
                            />)
                        }
                        case 'number': {
                            return (<TextField
                                key={field.id}
                                type='number'
                                className={inputFull === true || field.fullInput === true ? styles.inputFull : styles.input}
                                id={`${field.id}-number`}
                                label={field.name}
                                value={model[field.id] ?? ''}
                                disabled={isDisabled(field.disabled)}
                                error={errors[field.id] !== undefined}
                                helperText={errors[field.id]}
                                onChange={e => {
                                    setModel({ ...model, [field.id]: e.target.value })
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">{field.adornment}</InputAdornment>,
                                }}
                            />)
                        }
                        case 'text-area': {
                            return (<TextField
                                key={field.id}
                                className={inputFull === true || field.fullInput === true ? styles.inputFull : styles.input}
                                id={`${field.id}-text-area`}
                                label={field.name}
                                value={model[field.id] ?? ''}
                                disabled={isDisabled(field.disabled)}
                                error={errors[field.id] !== undefined}
                                helperText={errors[field.id]}
                                onChange={e => {
                                    setModel({ ...model, [field.id]: e.target.value });
                                }}
                                multiline
                                minRows={4}
                                maxRows={4}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">{field.adornment}</InputAdornment>,
                                }}
                            />)
                        }
                        case 'select':
                        case 'number-select': {
                            return (
                                <FormControl
                                    key={field.id}
                                    id={`${field.id}-form-control`}
                                    className={inputFull === true || field.fullInput === true ? styles.inputFull : styles.input}
                                    error={errors[field.id] !== undefined}
                                >
                                    <InputLabel id={`${field.id}-label`}>{field.name}</InputLabel>
                                    <Select
                                        labelId={`${field.id}-label`}
                                        id={`${field.id}-select`}
                                        value={model[field.id] ?? ''}
                                        label={field.name}
                                        disabled={isDisabled(field.disabled)}
                                        onChange={e => {
                                            setModel({ ...model, [field.id]: e.target.value })
                                        }}
                                    >
                                        {field.type === 'select' && field.values?.map(item => {
                                            return <MenuItem
                                                key={item.id}
                                                id={`${field.id}-${item.id}-menu-item`}
                                                value={item.id}
                                            >
                                                {item.name}
                                            </MenuItem>
                                        })}
                                        {field.type === 'number-select' && Array.from(Array(field.max! + 1).keys()).filter(_ => _ >= field.min!).map(number => {
                                            if (number > 0) {
                                                return <MenuItem
                                                    key={`${field.type}-${number}`}
                                                    id={`${field.type}-${number}-menu-item`}
                                                    value={number}
                                                >
                                                    <div className={styles.numberSelect}>
                                                        {Array.from(Array(number)).map(() => {
                                                            return (
                                                                <span key={`${Math.random()}-select-icon`} >{field.icon}</span>
                                                            )
                                                        })}
                                                    </div>

                                                </MenuItem>
                                            } else {
                                                return <MenuItem
                                                    key={`${field.type}-${number}`}
                                                    id={`${field.type}-${number}-menu-item`}
                                                    value={number}
                                                >
                                                    <span key={`${Math.random()}-select-icon`} >None</span>
                                                </MenuItem>
                                            }
                                        })}
                                    </Select>
                                    {errors[field.id] !== undefined && <FormHelperText id={`${field.id}-form-helper-text`}>{errors[field.id]}</FormHelperText>}
                                </FormControl>
                            )
                        }
                        case 'boolean': {
                            return (
                                <FormGroup
                                    key={field.id}
                                    id={`${field.id}-form-group`}
                                    sx={{ marginTop: 'auto', marginBottom: 'auto' }}
                                    className={inputFull === true || field.fullInput === true ? styles.inputFull : styles.input}
                                >
                                    <FormControlLabel
                                        id={`${field.id}-form-control-label`}
                                        control={
                                            <Checkbox
                                                id={`${field.id}-checkbox`}
                                                checked={model[field.id] ?? true}
                                                disabled={isDisabled(field.disabled)}
                                                onChange={e => {
                                                    setModel({ ...model, [field.id]: e.target.checked });
                                                }}
                                            />
                                        } label={field.name} />
                                </FormGroup>
                            )
                        }
                        case 'multi-select': {
                            return (
                                <FormControl
                                    key={field.id}
                                    id={`${field.id}-form-control`}
                                    className={inputFull === true || field.fullInput === true ? styles.inputFull : styles.input}
                                    error={errors[field.id] !== undefined}
                                >
                                    <InputLabel id={`${field.id}-label`}>{field.name}</InputLabel>
                                    <Select
                                        labelId={`${field.id}-label`}
                                        id={`${field.id}-select`}
                                        multiple
                                        value={field.values?.filter(_ => (model[field.id] ?? []).includes(_.id)).map(_ => _.id) ?? []}
                                        renderValue={(selected) => selected.map(_ => field.values?.find(v => v.id === _)?.name).join(', ')}
                                        label={field.name}
                                        disabled={isDisabled(field.disabled)}
                                        onChange={e => {
                                            const selectedValues = (typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value);
                                            setModel({ ...model, [field.id]: selectedValues });
                                        }}
                                    >
                                        {field.values?.map(item => {
                                            return (
                                                <MenuItem
                                                    key={item.id}
                                                    id={`${field.id}-${item.id}-menu-item`}
                                                    value={item.id}
                                                >
                                                    <Checkbox
                                                        id={`${field.id}-${item.id}-checkbox`}
                                                        checked={(model[field.id] ?? []).indexOf(item.id) > -1}
                                                    />
                                                    <ListItemText
                                                        primary={item.name}
                                                        id={`${field.id}-${item.id}-list-item.text`}
                                                    />
                                                </MenuItem>
                                            )
                                        })}
                                    </Select>
                                    {errors[field.id] !== undefined && <FormHelperText id={`${field.id}-form-helper-text`}>{errors[field.id]}</FormHelperText>}
                                </FormControl>
                            )
                        }
                        case 'search-select': {
                            return (<Autocomplete
                                key={field.id}
                                className={inputFull === true || field.fullInput === true ? styles.inputFull : styles.input}
                                id={`${field.id}-search-select`}
                                disablePortal
                                disabled={isDisabled(field.disabled)}
                                options={field.values!}
                                value={field.values?.find(_ => _.id === model[field.id]) ?? null}
                                onChange={(_: any, newValue: SelectItem | null) => {
                                    setModel({ ...model, [field.id]: newValue?.id });
                                }}
                                renderInput={(params) =>
                                    <TextField {...params}
                                        key={`${field.id}-search-select-input`}
                                        error={errors[field.id] !== undefined}
                                        helperText={errors[field.id]} label={field.name}
                                    />}
                                getOptionLabel={(option) => option.name}
                                renderOption={(props, option) => <li {...props} key={`${field.id}-search-select-option-${option.id}`}>{option.name}</li>}
                            />)
                        }
                        case 'date': {
                            return (
                                <LocalizationProvider
                                    key={`${field.id}-localization-provider`}
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DatePicker
                                        className={inputFull === true || field.fullInput === true ? styles.inputFull : styles.input}
                                        label={field.name}
                                        disabled={isDisabled(field.disabled)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                variant: 'outlined',
                                                error: errors[field.id] !== undefined,
                                                helperText: errors[field.id]
                                            },
                                        }}
                                        disableFuture={field.disableFuture ?? true}
                                        disablePast={field.disablePast ?? false}
                                        value={(model[field.id] !== '' && model[field.id] !== undefined) ? dayjs(model[field.id]) : null}
                                        onChange={(newValue) => {
                                            setModel({ ...model, [field.id]: newValue ?? dayjs() })
                                        }}
                                        format="YYYY-MM-DD"
                                    />
                                </LocalizationProvider>
                            );
                        }
                        case 'radio': {
                            return (
                                <FormControl
                                    key={field.id}
                                    id={`${field.id}-form-control`}
                                    className={inputFull === true || field.fullInput === true ? styles.inputFull : styles.input}
                                    error={errors[field.id] !== undefined}
                                    disabled={isDisabled(field.disabled)}
                                >
                                    <FormLabel id={`${field.id}-form-label`}>{field.name}</FormLabel>
                                    <RadioGroup
                                        row
                                        value={model[field.id]}
                                        name={`${field.id}-radio-button-group`}
                                        onChange={(newValue) => {
                                            setModel({ ...model, [field.id]: isNaN(Number(newValue?.target.value)) ? newValue?.target.value : Number(newValue?.target.value) })
                                        }}
                                    >
                                        {field.values?.map(item => {
                                            return (
                                                <FormControlLabel
                                                    key={item.id}
                                                    id={`${field.id}-${item.id}-radio-button-item`}
                                                    value={item.id}
                                                    control={<Radio />}
                                                    label={item.name}
                                                />
                                            )
                                        })}
                                    </RadioGroup>
                                    {errors[field.id] !== undefined && <FormHelperText id={`${field.id}-form-helper-text`}>{errors[field.id]}</FormHelperText>}
                                </FormControl>
                            );
                        }
                        default: {
                            return null
                        }
                    }
                })}
            </div>
            {children}
            <BaseOperations
                primaryButtonText={submitButtonText ?? "Save"}
                primaryButtonIcon={<SaveIcon />}
                primaryButtonLoading={submitting}
                priamryButtonDisable={submitDisable}
                onPrimaryButtonClick={submitEntity !== undefined ? validateSubmit : undefined}

                action1ButtonText={deleteButtonText ?? "Delete"}
                action1ButtonIcon={<DeleteIcon />}
                action1ButtonLoading={deleting}
                action1ButtonConfirmationTexts={[
                    informationText(deleteConfirmationText ?? `Are you sure you want to delete <b>${name ?? 'This entity'}</b>?`)
                ].concat((deleteWarnings !== undefined ? deleteWarnings.map(_ => warningText(_)) : []))}
                onAction1ButtonClick={deleteEntity}

                action2ButtonText={cancelButtonText ?? "Cancel"}
                action2ButtonIcon={<BlockIcon />}
                onAction2ButtonClick={cancel}

                action3ButtonText={customButtonText}
                action3ButtonIcon={customButtonIcon}
                action3ButtonLoading={customActionLoading}
                action3ButtonConfirmationTexts={customButtonConfirmationText}
                onAction3ButtonClick={customAction}

                helpInfoTexts={helpInformationText}
            />
        </div>
    )
}