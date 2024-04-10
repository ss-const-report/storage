export interface RestrictTableData {
    conditionerIndependentUO?: number | undefined;
    conditionerIndependentOW?: number | undefined;
    conditionerIndependentUW?: number | undefined;
    conditionerDependentUO?: number | undefined;
    conditionerDependentOW?: number | undefined;
    conditionerDependentUW?: number | undefined;
    conditionerPM?: number | undefined;
    conditionerPE?: number | undefined;
    conditionerME?: number | undefined;
}

export interface TerminalVTableData {
    terminalIndependentUO?: number | undefined;
    terminalIndependentOW?: number | undefined;
    terminalIndependentUW?: number | undefined;
    terminalDependentUO?: number | undefined;
    terminalDependentOW?: number | undefined;
    terminalDependentUW?: number | undefined;
}

export interface DCTableData {
    maker: string[];
    format: string[];
    serialNumber: number[];
    parallelNumber: number[];
    hasConnection: boolean[];
    voltage: number[];
}

export interface IndividualManageListData {
    report_id?: string | undefined;
    client_name?: string | undefined;
    address?: string | undefined;
    complete_date: string | number | Date;
    create_date: string | number | Date;
    complete_stage?: number | undefined;
    progress?: string | undefined;
    memo?: string | undefined;
}

export interface AdminManageListData {
    report_id?: string | undefined;
    sales_name?: string | undefined;
    construct_name?: string | undefined;
    client_name?: string | undefined;
    address?: string | undefined;
    complete_date: string | number | Date;
    create_date: string | number | Date;
    complete_stage: number | undefined;
    progress?: string | undefined;
    memo?: string | undefined;
    send_to_client?: boolean | undefined;
    send_to_sales?: boolean | undefined;
    send_to_construct?: boolean | undefined;
}


export interface AdminManageListData {
    userName?: string | undefined;
    reportID?: string | undefined;
    savedDate?: Date | undefined;
    completeStage?: number | undefined;
    progress?: string | undefined;
}