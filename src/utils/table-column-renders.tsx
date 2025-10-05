import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckIcon from '@mui/icons-material/Check';
import BlockIcon from '@mui/icons-material/Block';
import dayjs, { Dayjs } from 'dayjs';
import { Role } from '../common/role';
import { InvoiceTag } from '../section/model/invoice-tag';

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

export const renderColor = (color: string) => {
    return <div style={{ width: '100%', height: '100%', borderRadius: '5px', backgroundColor: color}}></div>
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

export const renderTags = (invoiceTags?: InvoiceTag[] | undefined) => {
    return <div>
        {invoiceTags?.map(_ => {
            return <span key={`${_.tagId}`} style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '5px', 
                backgroundColor: _.tagColor, 
                color: '#FFFFFF',
                fontWeight: '600',
                margin: '4px', 
                padding: '4px'}}>{_.tagName}</span>
        })}
    </div>
}