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
            return <span style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '5px', 
                backgroundColor: _.tagColor, 
                color: invertColor(_.tagColor),
                margin: '4px', 
                padding: '4px'}}>{_.tagName}</span>
        })}
    </div>
}

function invertColor(hex: string) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    // invert color components
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    // pad each with zeros and return
    return '#' + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str: string, len?: number | undefined) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}