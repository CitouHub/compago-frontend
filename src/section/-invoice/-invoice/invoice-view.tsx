import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ViewLoader from "../../../component/misc/view-loader";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useCache } from "../../../context/cache/cache-provider";
import { PARAMETER_INVOICE_ID } from "../../../infrastructure/route";
import { Invoice } from "../../model/invoice";
import { getInvoice } from "../../service/invoice-service";
import { SupportedExternalSource } from "../../../common/supported-external-source";
import InvoiceHandler from "./-invoice-handler/invoice-handler";

export const INVOICE_TAB_STATE: string = "INVOICE_TAB_STATE";
export const INVOICE_TAB_STATE_TAG_EDIT: string = "INVOICE_TAB_STATE_TAG_EDIT";

export default function InvoiceView() {
    const { supportedExternalSource, invoiceId, currency } = useParams();

    const [tab, setTab] = useState<string>(localStorage.getItem(INVOICE_TAB_STATE) ?? INVOICE_TAB_STATE_TAG_EDIT);
    const [loading, setLoading] = useState(true);
    const [invoice, setInvoice] = useState<Invoice>({} as Invoice);

    const cache = useCache();

    useEffect(() => {
        cache.update({ key: PARAMETER_INVOICE_ID, value: invoice?.id });
    }, [cache, invoice]);

    useEffect(() => {
        var source = SupportedExternalSource[supportedExternalSource as keyof typeof SupportedExternalSource];
        setLoading(true);
        getInvoice(SupportedExternalSource[source], invoiceId!, currency).then(result => {
            setInvoice(result);
            setLoading(false);
        })
    }, [supportedExternalSource, invoiceId, currency]);

    const changeTab = (newTab: string) => {
        localStorage.setItem(INVOICE_TAB_STATE, newTab);
        setTab(newTab);
    }

    return (
        <React.Fragment>
            <ViewLoader loading={loading} />
            {loading === false && <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={(_event: React.SyntheticEvent, newTab: string) => changeTab(newTab)}>
                        <Tab label="Edit" value={INVOICE_TAB_STATE_TAG_EDIT} />
                    </TabList>
                </Box>
                <TabPanel value={INVOICE_TAB_STATE_TAG_EDIT}>
                    <InvoiceHandler
                        convertedCurrency={invoice.exchangeRate !== undefined && invoice.exchangeRate !== 1}
                        invoice={invoice}
                        setInvoice={setInvoice}
                    />
                </TabPanel>
            </TabContext>}
        </React.Fragment>
    );
}
