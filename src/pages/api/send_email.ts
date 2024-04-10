// pages/api/analyze-dashboard.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';
import { updateUserTable } from '@/components/DataHandling';
sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '');

export const dynamic = 'force-dynamic';

// export const runtime = 'edge';


const sendEmailWithLink = async (
    toEmail: string,
    userName: string,
    reportId: string,
    process: string
) => {
    let templateId;
    if (process === '承認') {
        templateId = 'd-ebc95985ff3c4e68b181e118fe46358e';
    } else if (process === '差し戻し') {
        templateId = 'd-23d3c1240b544f79a8b5041d29d02052';
    } else {
        // Handle unexpected process value
        console.error('Invalid Process Status Value');
        return { success: false, error: 'Invalid Process Status Value' };
    }

    const msg = {
        to: toEmail, // Recipient email address
        from: {
            email: 'report@smartsolar.co.jp',
            name: 'スマートソーラー施工管理',
        }, // Your verified sender address
        subject: 'レポートレビュー結果',
        templateId: templateId,
        dynamicTemplateData: {
            subject: `レポートレビュー結果`,
            username: userName,
            reportid: reportId,
            process: process
        },
        isMultiple: false,
    };

    try {
        await sgMail.send(msg);
        console.log('❤❤❤');
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Unknown error occurred' };
        // }
    }
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Check if the method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    console.log('❤❤❤❤');
    const processStatus = req.body.status; // Assuming image is sent in base64 format
    const toEmail = req.body.email;
    const reportId: string = req.body.reportid as string;
    const userName = req.body.username;
    console.log(req.body)
    if (!processStatus || !toEmail) {
        console.error('Invalid');
        return res.status(400).json({ message: 'No sender data provided' });
    }
    console.log('Status:', processStatus);
    console.log('Email:', toEmail);
    console.log('ReportID:', reportId)

    const emailResponse = await sendEmailWithLink(toEmail, userName, reportId, processStatus);
    if (emailResponse.success) {
        let progressString: string;
        if (processStatus === '承認') {
            progressString = '承認報告';
        } else if (processStatus === '差し戻し') {
            progressString = '差し戻し報告';
        } else {
            console.error('Invalid process value');
            return { success: false, error: 'Invalid process value' };
        }
        try {
            // Save user_table
            updateUserTable({
                myUUID: reportId,
                progress: progressString,
            })
                .then(() => console.log("Update successful."))
                .catch(err => console.error("Error in update:", err));
            res.status(200).json({
                success: true,
                message: "All process completed successfully",
            });
        } catch (error) {
            res.status(500).json({ error: error });
            console.error('Error saving data to Supabase:', error);
        }
    } else {
        res.status(500).json({ error: emailResponse.error });
        console.log('Unknown error occurred');
    }
}
