import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HomeIcon from '@mui/icons-material/Home';
import LabelIcon from '@mui/icons-material/Label';
import ReceiptIcon from '@mui/icons-material/Receipt';
import {
    HOME,
    USER_MANAGEMENT_LIST,
    USER_MANAGEMENT_ADD,
    USER_MANAGEMENT_EDIT,
    TAG_MANAGEMENT_LIST,
    TAG_MANAGEMENT_ADD,
    TAG_MANAGEMENT_EDIT,
    INVOICE_MANAGEMENT_LIST,
    INVOICE_MANAGEMENT_ADD_TAGS
} from "./route";
import { RouteCategory } from './route-category';
import Home from '../section/home';
import InvoiceList from '../section/-invoice/-invoice/-invoice-list/invoice-list';
import InvoiceView from '../section/-invoice/-invoice/invoice-view';
import { Role } from '../common/role';
import { hasRouteAccess } from './route-access';
import UserList from '../section/-account/-user/-user-list/user-list';
import UserView from '../section/-account/-user/user-view';
import TagList from '../section/-invoice/-tag/-tag-list/tag-list';
import TagView from '../section/-invoice/-tag/tag-view';

export const ROUTE_CATEGORY_DASHBOARD_TITLE = "Dashboard";
export const ROUTE_CATEGORY_ACCOUNT_TITLE = "Account management";
export const ROUTE_CATEGORY_INVOICE_TITLE = "Invoice management";

export const ROUTE_SETUP: RouteCategory[] = [
    {
        title: ROUTE_CATEGORY_DASHBOARD_TITLE,
        routes: [
            {
                index: true,
                menu: true,
                name: "Home",
                roles: [],
                paths: [HOME],
                icon: <HomeIcon />,
                component: <Home />
            }
        ]
    },
    {
        title: ROUTE_CATEGORY_ACCOUNT_TITLE,
        routes: [
            {
                index: false,
                menu: true,
                name: "User",
                roles: [Role.Admin],
                paths: [USER_MANAGEMENT_LIST],
                icon: <PeopleAltIcon />,
                component: <UserList />,
                description: "Under User you can see and manage all Users."
            },
            {
                index: false,
                menu: false,
                name: "Add user",
                roles: [Role.Admin],
                paths: [USER_MANAGEMENT_ADD],
                component: <UserView />
            },
            {
                index: false,
                menu: false,
                name: "Edit user",
                roles: [Role.Admin],
                paths: [USER_MANAGEMENT_EDIT],
                component: <UserView />
            }
        ]
    },
    {
        title: ROUTE_CATEGORY_INVOICE_TITLE,
        routes: [
            {
                index: false,
                menu: true,
                name: "Tags",
                roles: [Role.Admin, Role.User],
                paths: [TAG_MANAGEMENT_LIST],
                icon: <LabelIcon />,
                component: <TagList />,
                description: "Under Tags you can see and manage all Tags."
            },
            {
                index: false,
                menu: false,
                name: "Add tag",
                roles: [Role.Admin, Role.User],
                paths: [TAG_MANAGEMENT_ADD],
                component: <TagView />
            },
            {
                index: false,
                menu: false,
                name: "Edit tag",
                roles: [Role.Admin, Role.User],
                paths: [TAG_MANAGEMENT_EDIT],
                component: <TagView />
            },
            {
                index: false,
                menu: true,
                name: "Invoices",
                roles: [Role.Admin, Role.User],
                paths: [INVOICE_MANAGEMENT_LIST],
                icon: <ReceiptIcon />,
                component: <InvoiceList />,
                description: "Under Invoices you can see and tag invoices."
            },
            {
                index: false,
                menu: false,
                name: "Invoice tags",
                roles: [Role.Admin, Role.User],
                paths: [INVOICE_MANAGEMENT_ADD_TAGS],
                component: <InvoiceView />
            }
        ]
    }
]

export const getAccessibleRoutes = (roleId: Role) => {
    return ROUTE_SETUP.flatMap(_ => _.routes)
        .filter(route => route.menu && route.description && hasRouteAccess(route.roles, roleId));
}