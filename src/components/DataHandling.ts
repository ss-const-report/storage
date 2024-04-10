import { supabase } from "@/components/Supabase/client";

interface params {
    userID?: string | undefined,
    userEmail?: string | undefined,
    userName?: string | undefined,
    myUUID: string | null,
    stage?: number | undefined,
    progress: string | undefined,
    toClient?: boolean | undefined,
    toSales?: boolean | undefined,
    toConstruct?: boolean | undefined,
    toSmartSolar?: boolean | undefined,
    client_name?: string | undefined,
    sales_name?: string | undefined,
    construct_name?: string | undefined,
    create_date?: Date | undefined,
    complete_date?: Date | undefined,
    memo?: string | undefined,
    address?: string | undefined,
    shouldIncrementStage?: boolean | undefined,

}

export async function updateUserTable({ userID, userEmail, userName, myUUID, stage, progress, toClient, toSales,
    toConstruct, toSmartSolar, client_name, sales_name, construct_name, create_date, complete_date, memo, address,
    shouldIncrementStage }: params) {
    // Create an object for the update
    const updateData: { [key: string]: any } = {
        user_id: userID,
        user_email: userEmail,
        user_name: userName,
        report_id: myUUID,
        complete_stage: stage,
        progress: progress,
    };

    if (userID !== undefined) updateData.user_id = userID;
    if (userEmail !== undefined) updateData.user_email = userEmail;
    if (userName !== undefined) updateData.user_name = userName;
    if (stage !== undefined) updateData.complete_stage = stage;
    if (toClient !== undefined) updateData.send_to_client = toClient;
    if (toSales !== undefined) updateData.send_to_sales = toSales;
    if (toConstruct !== undefined) updateData.send_to_construct = toConstruct;
    if (client_name !== undefined) updateData.client_name = client_name;
    if (sales_name !== undefined) updateData.sales_name = sales_name;
    if (construct_name !== undefined) updateData.construct_name = construct_name;
    if (create_date !== undefined) updateData.create_date = create_date;
    if (complete_date !== undefined) updateData.complete_date = complete_date;
    if (memo !== undefined) updateData.memo = memo;
    if (address !== undefined) updateData.address = address;

    console.log('shouldIncrementStage', shouldIncrementStage)
    if (shouldIncrementStage) {
        // Fetch the existing complete_stage value for the specified record
        const { data, error } = await supabase
            .from('user_table')
            .select('complete_stage')
            .eq('user_id', userID)
            .eq('report_id', myUUID)
            .single();
        // Increment the complete_stage value if the record exists
        if (data && data.complete_stage !== null) {
            console.log("data", data.complete_stage);
            console.log("updateData", updateData);
            updateData.complete_stage = data.complete_stage + 1;
        }
        else {
            updateData.complete_stage = 1;
        }
    }

    console.log("updateData", updateData)

    // Perform the upsert with the updated complete_stage value (if applicable)
    const { error: upsertError } = await supabase
        .from('user_table')
        .upsert(updateData, { onConflict: 'report_id' });

    if (upsertError) throw upsertError;

    console.log("❤❤❤ user_table SUCCESS");
}
