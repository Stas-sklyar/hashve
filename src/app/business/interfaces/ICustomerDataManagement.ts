


export interface ICustomerDataManagement {
        enableSMS: boolean;
        status: boolean;
        phoneChecked: boolean;
        emailChecked: boolean;
        tokenPhone: string;
        tokenEmail: string;
        smsCount: number;
}


export const  EmptyICustomerDataManagement =  {
    enableSMS: false,
    status: false,
    phoneChecked: false,
    emailChecked: false,
    tokenPhone: "",
    tokenEmail: "",
    smsCount: 0,
}