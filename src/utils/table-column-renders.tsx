import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';
import dayjs, { Dayjs } from 'dayjs';
import { Role } from '../common/role';

export const renderChecked = (checked: boolean) => {
    if (checked === true) {
        return <CheckIcon color="primary" />
    } else {
        return <span></span>
    }
}

export const renderActive = (active: boolean) => {
    if (active === true) {
        return <CheckCircleIcon color="primary" />
    } else {
        return <BlockIcon color="error" />
    }
}

export const renderDate = (date?: Dayjs | undefined, includeTime?: boolean | undefined) => {
    const format = includeTime === true ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
    return date !== undefined ? dayjs(date).format(format) : '';
}

export const renderHoursTimeSpan = (hours: number) => {
    return `${Math.floor(hours / 24)}d ${hours % 24}h`
}

export const renderRoles = (roles: Role[]) => {
    return roles.map(_ => Role[_]).join(", ")
}