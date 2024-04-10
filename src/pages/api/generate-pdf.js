// pages/api/generate-pdf.js

import PDFDocument, { fontSize } from 'pdfkit';
const path = require('path');
const fs = require('fs');

import { getStreamBuffer } from '../../utils/pdf-helper';
import { supabase } from "@/components/Supabase/client";

import {
    commonCheckList, commmonCheckPoint, storageCheckList, storageCheckPoint, conditionerCheckList, conditionerCheckPoint,
    switchCheckList, switchCheckPoint, smartCheckList, smartCheckPoint, summaryCheckList
} from "../../utils/pdf-helper"

// Import your page generation functions

export default async function handler(req, res) {
    try {
        const doc = new PDFDocument({ margin: 50 });

        const { reportId } = req.query;

        // Call your page-specific functions
        const fontPath = path.join(process.cwd(), 'public', 'fonts', 'NotoSansJP-Regular.otf');
        doc.font(fontPath);

        await generateFirstPageFromSupabase(doc, reportId);
        doc.addPage();
        console.log("1 page made")
        await generateSecondPageFromSupabase(doc, reportId);
        doc.addPage();
        console.log("2 page made")
        await generateThirdPageFromSupabase(doc, reportId);
        doc.addPage();
        console.log("3 page made")
        await generateForthPageFromSupabase(doc, reportId);
        doc.addPage();
        console.log("4 page made")
        await generateFifthPageFromSupabase(doc, reportId);
        doc.addPage();
        console.log("5 page made")
        await generateSixthPageFromSupabase(doc, reportId);
        doc.addPage();
        console.log("6 page made")

        // ... call other page functions as needed ...

        doc.end();

        const buffer = await getStreamBuffer(doc);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating PDF');
    }
}

// const drawCell = (doc, text, x, y, width, height, fillColor, columnIndex) => {
//     if (fillColor && columnIndex === 0) { // Fill only the first column
//         doc.fillColor(fillColor).rect(x, y, width, height).fillAndStroke(fillColor, 'black');
//     } else {
//         doc.strokeColor('black').rect(x, y, width, height).stroke();
//     }

//     // Calculate vertical center
//     const textHeight = doc.currentLineHeight();
//     const textY = y + (height / Math.floor(height / textHeight) - textHeight) / 2;

//     doc.fillColor('black'); // Reset fill color for text
//     doc.text(text, x + 5, textY, { width: width - 10, align: 'center' });

// };

async function generateFirstPageFromSupabase(doc, reportId) {
    const { data: CreateDateData, error: CreateDateError } = await supabase
        .from('create_date')
        .select()
        .eq('report_id', reportId)
        .single();
    if (CreateDateError) {
        throw CreateDateError;
    }

    const { data: ClientData, error: ClientError } = await supabase
        .from('client_basic_info')
        .select()
        .eq('report_id', reportId)
        .single();
    if (ClientError) {
        throw ClientError;
    }

    const { data: SalesData, error: SalesError } = await supabase
        .from('sales_basic_info')
        .select()
        .eq('report_id', reportId)
        .single();
    if (SalesError) {
        throw SalesError;
    }

    const { data: ConstructData, error: ConstructError } = await supabase
        .from('construct_basic_info')
        .select()
        .eq('report_id', reportId)
        .single();
    if (ConstructError) {
        throw ConstructError;
    }

    const { data: ProductData, error: ProductError } = await supabase
        .from('product_info')
        .select()
        .eq('report_id', reportId)
        .single();
    if (ProductError) {
        throw ProductError;
    }

    const { data: CompleteDatetData, error: CompleteDateError } = await supabase
        .from('complete_date')
        .select()
        .eq('report_id', reportId)
        .single();
    if (CompleteDateError) {
        throw CompleteDateError;
    }


    doc.text('スマートソーラー株式会社　殿', {
        align: 'left',
        indent: 10,
        paragraphGap: 5
    });

    // up content
    if (CreateDateData) {
        const formattedDate = `作成日 ${CreateDateData.year} 年 ${CreateDateData.month} 月 ${CreateDateData.date} 日`;
        // Set the right alignment and margins in the text method
        doc.fontSize(10).text(formattedDate, {
            align: 'right',
            margin: 50
        });
    }
    doc.fontSize(12).text('ハイブリッドシステム　設置完了報告書 謙 保証申請書', {
        align: 'center',
    });
    doc.fontSize(9).text('以下の通り、不備なく設置完了したことを報告いたします', {
        align: 'center',
    });

    // client table
    doc.text('【お客様情報】', {
        align: 'left',
        indent: 5,
        paragraphGap: 5
    });
    const clientrows = [
        ["お客様", ClientData.name],
        ["住所（住居表示） ", ClientData.address],
        ["電話番号", ClientData.phone],
        // More rows
    ];
    const cellHeight = 15;
    const columnWidths = [120, 380];
    const totalTableWidth = columnWidths.reduce((acc, val) => acc + val, 0);
    const startX = (doc.page.width - totalTableWidth) / 2;
    drawTable(doc, clientrows, columnWidths, startX, cellHeight);
    doc.y += doc.currentLineHeight() / 2;
    // sales table
    doc.x = 50;
    doc.text('【販売会社情報】　　当社D2Cのお客様の場合は、販売会社情報は記入不要です。', {
        align: 'left',
        indent: 5,
        paragraphGap: 5
    });
    const salesrows = [
        ["会社名", SalesData.name],
        ["住所", SalesData.address],
        ["会社電話番号", SalesData.phone],
    ];
    drawTable(doc, salesrows, columnWidths, startX, cellHeight);
    doc.y += doc.currentLineHeight() / 2;
    // construct table
    doc.x = 50;
    doc.text('【施工会社情報】　　※施工ID認定店以外は施工できません。', {
        align: 'left',
        indent: 5,
        paragraphGap: 5
    });
    const constructsrows = [
        ["会社名", ConstructData.name],
        ["住所", ConstructData.address],
        ["会社電話番号", ConstructData.phone],
        ["施工ID認定番号 ", ConstructData.id_number],
        ["施工IDカード所持者氏名", ConstructData.id_owner],
    ];
    drawTable(doc, constructsrows, columnWidths, startX, cellHeight);
    doc.moveDown();
    // sending place table
    doc.x = 50;
    let sendingPlace;
    if (ProductData.sent_place == 'sentplace-1') {
        sendingPlace = 'お客様'
    }
    else if (ProductData.sent_place == 'sentplace-2') {
        sendingPlace = '販売会社'
    }
    else if (ProductData.sent_place == 'sentplace-3') {
        sendingPlace = '施工会社'
    }
    else {
        sendingPlace = ''
    }
    const sendingsrows = [
        ["保証書送付先", sendingPlace],
    ];
    drawTable(doc, sendingsrows, columnWidths, startX, cellHeight);
    doc.y += doc.currentLineHeight() / 2;
    // complete date
    doc.x = 50;
    if (CompleteDatetData) {
        const formattedDate = `工事完了日  ${CompleteDatetData.year} 年 ${CompleteDatetData.month} 月 ${CompleteDatetData.date} 日`;
        // Set the right alignment and margins in the text method
        doc.fontSize(10).text(formattedDate, {
            align: 'right',
            margin: 50
        });
    }
    doc.fontSize(9);
    //description
    doc.text('<添付必要書類>　※保証書発行に必ず必要です', {
        align: 'left',
        paragraphGap: 3
    });
    doc.fontSize(8).text('②-③ 設置状況写真・・・機器の設置状況に問題が無いか確認します。', {
        align: 'left',
        indent: 10,
        paragraphGap: 3
    });
    doc.text('②-③ 各機器シリアル番号写真・・・出荷機器と相違が無いか確認します。', {
        align: 'left',
        indent: 10,
        paragraphGap: 3
    });
    doc.text('④ PV情報・・・ハイブリッドPCSの接続に問題が無いか確認します。', {
        align: 'left',
        indent: 20,
        paragraphGap: 3
    });
    doc.text('④ 単線結線図・・・機器が正しく接続構成されているか確認します。', {
        align: 'left',
        indent: 20,
        paragraphGap: 3
    });
    doc.text('④ 測定値(記入)・・・①接地抵抗　②絶縁抵抗(線間)　③動作電圧　機器の動作に問題が無いか確認します。', {
        align: 'left',
        indent: 20,
        paragraphGap: 3
    });
    doc.text('⑤ 各種設定画面・・・①機器の設定　②機器の動作状況を確認します。', {
        align: 'left',
        indent: 20,
        paragraphGap: 3
    });
    doc.text('⑥ 竣工検査チェックリスト・・・機器の設定及び工事が正常に完了しているか確認します。', {
        align: 'left',
        indent: 20,
        paragraphGap: 6
    });
    doc.fontSize(9);
    // product table
    doc.x = 50;
    doc.text('【製品情報】', {
        align: 'left',
        indent: 5,
        paragraphGap: 5
    });
    let smartBase;
    if (ProductData.smart_base == 'smartbase-1') {
        smartBase = '使用：N（スマートベース）'
    }
    else if (ProductData.smart_base == 'smartbase-2') {
        smartBase = '使用：H（嵩上げ架台）'
    }
    else if (ProductData.smart_base == 'smartbase-3') {
        smartBase = '使用なし'
    }
    else {
        smartBase = ''
    }
    let saltProtection;
    if (ProductData.salt_protection == 'saltprotect-1') {
        saltProtection = '使用'
    }
    else if (ProductData.salt_protection == 'saltprotect-2') {
        saltProtection = '使用なし'
    }
    else {
        saltProtection = ''
    }
    const productrows = [
        ["パワーコンディショナ", ProductData.power_conditioner],
        ["スマートスイッチボックス", ProductData.switch_box],
        ["コントロールユニット", ProductData.control_unit],
        ["電池ユニット①", ProductData.battery_unit_one],
        ["電池ユニット②", ProductData.battery_unit_two],
        ["電池ユニット③ ", ProductData.battery_unit_three],
        ["カバー・アクセサリ", ProductData.cover_acc],
        ["測定ユニット", ProductData.measure_unit],
        ["HEMSコントローラ ", ProductData.hems_controller],
        ["スマートベース該当する箇所に〇をして下さい", smartBase],
        ["重塩害カバー該当する箇所に〇をして下さい", saltProtection],
    ];
    drawTable(doc, productrows, columnWidths, startX, cellHeight);
}


async function generateSecondPageFromSupabase(doc, reportId) {

    const { data: SpaceIssueData, error: SpaceIssueError } = await supabase
        .from('space_issue')
        .select()
        .eq('report_id', reportId)
        .single();
    if (SpaceIssueError) {
        throw SpaceIssueError;
    }
    doc.text('【写真貼付】機器の設置状況　各機器の設置状況が分かる写真を確認し、貼付して下さい', {
        align: 'center',
    });

    doc.y += doc.currentLineHeight() / 2;

    doc.fontSize(8).text('蓄電システム　全体設置状況', {
        align: 'center',
    });

    doc.y += doc.currentLineHeight() / 2;

    // reason check
    const reasoncheckrows = [
        ["設置スペースに問題なければ右欄に〇を選択し入力してください", SpaceIssueData.reason ? 'あり' : 'なし'],
        ["隔,PCS高さを確保できない理由", SpaceIssueData.reason],
    ];
    const cellHeight = 15;
    const columnWidths = [260, 260];
    const totalTableWidth = columnWidths.reduce((acc, val) => acc + val, 0);

    const startX = (doc.page.width - totalTableWidth) / 2;
    drawTable(doc, reasoncheckrows, columnWidths, startX, cellHeight);
    doc.moveDown();

    // local image
    doc.x = 46;
    doc.text('※設置要件が満たされていない場合、アフターメンテナンスができない場合があります。', {
        align: 'center',
    });
    const localImagePath = path.join(process.cwd(), 'public', 'img', '1.png');
    doc.image(localImagePath, 46, doc.y + 10, { fit: [500, 210], align: 'center', valign: 'center' })
        .rect(46, doc.y + 10, 520, 220).stroke()

    const conditionerImage = SpaceIssueData.conditioner_image_url;

    if (conditionerImage) {
        const base64String = conditionerImage.split(',')[1];
        const conditionerBuffer = Buffer.from(base64String, 'base64');
        doc.image(conditionerBuffer, 46 + 5, 400, { fit: [250, 170], align: 'center', valign: 'center' })
            .rect(46, 395, 260, 180).stroke()
            .text('パワーコンディショナの設置状況写真', 46 + 5, 380);
    }

    const conditionerSerialImage = SpaceIssueData.conditioner_serial_image_url;
    if (conditionerSerialImage) {
        const base64String = conditionerImage.split(',')[1];
        const conditionerSerialBuffer = Buffer.from(base64String, 'base64');
        doc.image(conditionerSerialBuffer, 46 + 5 + 260, 400, { fit: [250, 170], align: 'center', valign: 'center' })
            .rect(46 + 260, 395, 260, 180).stroke()
            .text('機種銘板の写真(シリアルNO.が読み取れるもの)', 46 + 260 + 5, 380);
    }

    const storageImage = SpaceIssueData.storage_image_url;

    if (storageImage) {
        const base64String = storageImage.split(',')[1];
        const storageBuffer = Buffer.from(base64String, 'base64');
        doc.image(storageBuffer, 46 + 5, 400 + 198, { fit: [250, 170], align: 'center', valign: 'center' })
            .rect(46, 395 + 198, 260, 180).stroke()
            .text('蓄電池の設置状況写真', 46 + 5, 380 + 198);
    }

    const storageSerialImage1 = SpaceIssueData.storage_serial_control_image_url;
    if (storageSerialImage1) {
        const base64String = storageSerialImage1.split(',')[1];
        const storageSerialBuffer1 = Buffer.from(base64String, 'base64');
        doc.image(storageSerialBuffer1, 46 + 5 + 260, 400 + 198, { width: 250, height: 170 })
            .rect(46+260, 395 + 198, 260, 180).stroke()
            .text('機種銘板の写真(シリアルNO.が読み取れるもの)', 46 + 5 + 260, 380 + 198);
    }
    doc.addPage();
    const storageSerialImage2 = SpaceIssueData.storage_serial_one_image_url;
    if (storageSerialImage2) {
        const base64String = storageSerialImage2.split(',')[1];
        const storageSerialBuffer2 = Buffer.from(base64String, 'base64');
        doc.image(storageSerialBuffer2, 46 + 5, 50, { width: 250, height: 170 })
        .rect(46, 45, 260, 180).stroke()
    }
    const storageSerialImage3 = SpaceIssueData.storage_serial_two_image_url;
    if (storageSerialImage3) {
        const base64String = storageSerialImage3.split(',')[1];
        const storageSerialBuffer3 = Buffer.from(base64String, 'base64');
        doc.image(storageSerialBuffer3, 46 + 5 + 260, 50, { width: 250, height: 170 })
        .rect(46+260, 45, 260, 180).stroke()
    }
    const storageSerialImage4 = SpaceIssueData.storage_serial_three_image_url;
    if (storageSerialImage4) {
        const base64String = storageSerialImage4.split(',')[1];
        const storageSerialBuffer4 = Buffer.from(base64String, 'base64');
        doc.image(storageSerialBuffer4, 46 + 5, 50 + 198, { width: 250, height: 170 })
        .rect(46, 45 + 198, 260, 180).stroke()
    }
    // .rect(46+260, 475, 260, 150).stroke()
}

async function generateThirdPageFromSupabase(doc, reportId) {

    const { data: TotalSpaceIssueData, error: TotalSpaceIssueError } = await supabase
        .from('total_space_issue')
        .select()
        .eq('report_id', reportId)
        .single();
    if (TotalSpaceIssueError) {
        throw TotalSpaceIssueError;
    }

    doc.fontSize(8).text('蓄電システム　全体設置状況', {
        align: 'center',
    });

    doc.y += doc.currentLineHeight() / 2;

    // reason check
    const reasoncheckrows = [
        ["設置スペースに問題なければ右欄に〇を選択し入力してください", TotalSpaceIssueData.reason ? 'あり' : 'なし'],
        ["離隔を確保できない理由", TotalSpaceIssueData.reason],
    ];
    const cellHeight = 15;
    const columnWidths = [260, 260];
    const totalTableWidth = columnWidths.reduce((acc, val) => acc + val, 0);

    const startX = (doc.page.width - totalTableWidth) / 2;
    drawTable(doc, reasoncheckrows, columnWidths, startX, cellHeight);
    doc.moveDown();

    // local image
    doc.x = 46;
    doc.text('※設置要件が満たされていない場合、アフターメンテナンスができない場合があります。', {
        align: 'center',
    });
    const localImagePath = path.join(process.cwd(), 'public', 'img', '2.png');
    doc.image(localImagePath, 46, doc.y + 5, { fit: [500, 110], align: 'center', valign: 'center' })
        .rect(46, doc.y + 5, 520, 120).stroke()

    const switchImage = TotalSpaceIssueData.switch_image_url;

    if (switchImage) {
        const base64String = switchImage.split(',')[1];
        const switchBuffer = Buffer.from(base64String, 'base64');
        doc.image(switchBuffer, 46 + 5, 270, { fit: [250, 170], align: 'center', valign: 'center' })
            .rect(46, 265, 260, 170).stroke()
            .text('スマートスイッチボックスの設置状況写真', 46 + 5, 250);
    }

    const switchSerialImage = TotalSpaceIssueData.switch_serial_image_url;
    if (switchSerialImage) {
        const base64String = switchSerialImage.split(',')[1];
        const switchSerialBuffer = Buffer.from(base64String, 'base64');
        doc.image(switchSerialBuffer, 46 + 5 + 260, 270, { fit: [250, 170], align: 'center', valign: 'center' })
            .rect(46 + 260, 265, 260, 170).stroke()
            .text('機種銘板の写真(シリアルNO.が読み取れるもの)', 46 + 260 + 5, 250);
    }

    const localImagePath2 = path.join(process.cwd(), 'public', 'img', '3.png');
    doc.image(localImagePath2, 46, 275 + 170, { fit: [500, 110], align: 'center', valign: 'center' })
        .rect(46, 270 + 170, 520, 120).stroke()

    const smartImage = TotalSpaceIssueData.smart_image_url;
    if (smartImage) {
        const base64String = smartImage.split(',')[1];
        const smartBuffer = Buffer.from(base64String, 'base64');
        doc.image(smartBuffer, 46, 280 + 170 + 130, { fit: [173, 170], align: 'center', valign: 'center' })
            .rect(46, 280 + 170 + 130, 173, 170).stroke()
            .text('スマートAIの設置状況写真', 46 + 5, 265 + 170 + 130);
    }

    const smartBreakerImage = TotalSpaceIssueData.smart_breaker_image_url;
    if (smartBreakerImage) {
        const base64String = smartBreakerImage.split(',')[1];
        const smartBreakerBuffer = Buffer.from(base64String, 'base64');
        doc.image(smartBreakerBuffer, 46 + 173, 280 + 170 + 130, { fit: [174, 170], align: 'center', valign: 'center' })
            .rect(46 + 173, 280 + 170 + 130, 173, 170).stroke()
            .text('スマートAIの設置状況写真', 46 + 5 + 173, 265 + 170 + 130);
    }

    const smartSerialImage = TotalSpaceIssueData.smart_serial_image_url;
    if (smartSerialImage) {
        const base64String = smartSerialImage.split(',')[1];
        const smartSeialBuffer = Buffer.from(base64String, 'base64');
        doc.image(smartSeialBuffer, 46 + 173 + 174, 280 + 170 + 130, { fit: [173, 170], align: 'center', valign: 'center' })
            .rect(46 + 173 + 174, 280 + 170 + 130, 173, 170).stroke()
            .text('スマートAIの設置状況写真', 46 + 5 + 173 + 174, 265 + 170 + 130);
    }
}

async function generateForthPageFromSupabase(doc, reportId) {
    const { data: dcMakerData, error: dcMakerError } = await supabase
        .from('dc_maker')
        .select()
        .eq('report_id', reportId)
        .single();
    if (dcMakerError) {
        throw dcMakerError;
    }

    const { data: dcFormatData, error: dcFormatError } = await supabase
        .from('dc_format')
        .select()
        .eq('report_id', reportId)
        .single();
    if (dcFormatError) {
        throw dcFormatError;
    }

    const { data: dcSerialData, error: dcSerialError } = await supabase
        .from('dc_serial')
        .select()
        .eq('report_id', reportId)
        .single();
    if (dcSerialError) {
        throw dcSerialError;
    }

    const { data: dcParallelData, error: dcParallelError } = await supabase
        .from('dc_parallel')
        .select()
        .eq('report_id', reportId)
        .single();
    if (dcParallelError) {
        throw dcParallelError;
    }

    const { data: dcConnectionData, error: dcConnectionError } = await supabase
        .from('dc_connection')
        .select()
        .eq('report_id', reportId)
        .single();
    if (dcConnectionError) {
        throw dcConnectionError;
    }

    const { data: dcOpenVoltageData, error: dcOpenVoltageError } = await supabase
        .from('dc_openvoltage')
        .select()
        .eq('report_id', reportId)
        .single();
    if (dcOpenVoltageError) {
        throw dcOpenVoltageError;
    }

    const { data: dcDiagramData, error: dcDiagramError } = await supabase
        .from('dc_diagram')
        .select()
        .eq('report_id', reportId)
        .single();
    if (dcDiagramError) {
        throw dcDiagramError;
    }

    const { data: dcResistanceData, error: dcResistanceError } = await supabase
        .from('dc_resistance')
        .select()
        .eq('report_id', reportId)
        .single();
    if (dcResistanceError) {
        throw dcResistanceError;
    }

    const { data: dcTerminalData, error: dcTerminalError } = await supabase
        .from('dc_terminal')
        .select()
        .eq('report_id', reportId)
        .single();
    if (dcTerminalError) {
        throw dcTerminalError;
    }

    doc.fontSize(8)
    doc.text('2.直流回路の施工確認　※PID非対応パネルまたは蓄電システム設置前の発電量低下について、当社による責任は負えません。', {
        align: 'left',
        indent: 10,
        paragraphGap: 5
    });
    doc.text(' ※未記入の場合、電圧の妥当性が確認できず、アフター対応時の調査に時間を要します。', {
        align: 'left',
        indent: 10,
        paragraphGap: 5
    });

    let CellHeight = 15;
    const corfirmColumnWidth = [100, 100, 100, 100, 100]
    const totalConfrimTableWidth = 500;
    const confirmStartX = (doc.page.width - totalConfrimTableWidth) / 2
    let confirmHeaderPosition = confirmStartX;
    const confrimSummaryText = '確認事項：ストリング定格開放電圧が450V以下　かつ　定格動作電流が12.5A/回路以下(一括入力の場合37.5A以下)であること'
    drawCell(doc, confrimSummaryText, confirmHeaderPosition, doc.y, totalConfrimTableWidth, CellHeight, 'lightgrey', 0)
    let currentHeaderY = doc.y;
    const confirmHeader = ['回路', 'PV1', 'PV2', 'PV3', 'PV一括入力の場合']
    confirmHeader.forEach((header, index) => {
        drawCell(doc, header, confirmHeaderPosition, currentHeaderY, corfirmColumnWidth[index], CellHeight, 'lightgrey', 0);
        confirmHeaderPosition += corfirmColumnWidth[index]
    });

    doc.y += 2.84;
    const confirmRows = [
        ['メーカー', dcMakerData.pv1, dcMakerData.pv2, dcMakerData.pv3, dcMakerData.combine],
        ['型式', dcFormatData.pv1, dcFormatData.pv2, dcFormatData.pv3, dcFormatData.combine],
        ['直列数', dcSerialData.pv1, dcSerialData.pv2, dcSerialData.pv3, dcSerialData.combine],
        ['並列数', dcParallelData.pv1, dcParallelData.pv2, dcParallelData.pv3, dcParallelData.combine],
        ['接続箱の有無', dcConnectionData.pv, dcConnectionData.pv, dcConnectionData.pv, dcConnectionData.combine],
        ['ストリング開放電圧実測値 - (V)', dcOpenVoltageData.pv1, dcOpenVoltageData.pv2, dcOpenVoltageData.pv3, dcOpenVoltageData.combine],
    ]

    let rowY = drawTable(doc, confirmRows, corfirmColumnWidth, confirmStartX, CellHeight);

    doc.x = confirmStartX
    doc.moveDown();

    // diagram
    doc.text('3.単線結線図', {
        align: 'left',
        indent: 10,
        paragraphGap: 5
    });
    doc.text('電力申請時の回路図または手書きの単線図を添付して下さい。蓄電システムの機器、ブレーカ種類、容量を必ず記入して下さい', {
        align: 'left',
        indent: 10,
        paragraphGap: 5
    });

    const diagramText = '単線結線図'
    drawCell(doc, diagramText, confirmStartX, doc.y, totalConfrimTableWidth, CellHeight, 'lightgrey', 0)

    const diagramImgage = dcDiagramData.diagram_image_url;

    if (diagramImgage) {
        const base64String = diagramImgage.split(',')[1];
        const diagramBuffer = Buffer.from(base64String, 'base64');
        let diagramY = doc.y + 2.84;
        doc.image(diagramBuffer, confirmStartX, diagramY, { fit: [500, 150], align: 'center', valign: 'center' })
            .rect(confirmStartX, diagramY, 500, 150).stroke()
    }

    doc.y += 150
    doc.moveDown();
    doc.moveDown();
    // capacity
    const capacityRows = [['お客様の契約アンペア容量', dcDiagramData.capacity_value, dcDiagramData.capacity_unit]]
    const capacityColumnWidth = [200, 200, 100]
    rowY = drawTable(doc, capacityRows, capacityColumnWidth, confirmStartX, CellHeight);
    doc.moveDown();

    doc.x = confirmStartX
    // terminal
    doc.text('交流系の端子電圧の測定', {
        align: 'left',
        indent: 10,
        paragraphGap: 5
    });
    const terminalColumnWidth = [50, 100, 100, 50, 100, 100]
    const terminalSummaryText = '※判定基準：U-O(N)、W-O(N)間101±6V U-W(N)間202±20V'
    let terminalPosition = confirmStartX;
    drawCell(doc, terminalSummaryText, terminalPosition, doc.y, totalConfrimTableWidth, CellHeight, 'lightgrey', 0)
    currentHeaderY = doc.y + 3
    const terminalCols = ['U-O間(V)', 'O-W間(V)', 'U-W間(V)'];
    const terminalAloneCols = [dcTerminalData.alone_uo, dcTerminalData.alone_ow, dcTerminalData.alone_uw];
    const terminalDependantCols = [dcTerminalData.related_uo, dcTerminalData.related_ow, dcTerminalData.related_uw];
    terminalCols.forEach((header, index) => {
        drawCell(doc, header, terminalPosition + 50, currentHeaderY + CellHeight * index, terminalColumnWidth[1], CellHeight, 'lightgrey', 1);
    });
    doc.y = currentHeaderY;
    terminalCols.forEach((header, index) => {
        drawCell(doc, header, terminalPosition + 300, currentHeaderY + CellHeight * index, terminalColumnWidth[4], CellHeight, 'lightgrey', 1);
    });
    doc.y = currentHeaderY;
    terminalAloneCols.forEach((header, index) => {
        drawCell(doc, header, terminalPosition + 150, currentHeaderY + CellHeight * index, terminalColumnWidth[2], CellHeight, 'lightgrey', 1);
    });
    doc.y = currentHeaderY;
    terminalDependantCols.forEach((header, index) => {
        drawCell(doc, header, terminalPosition + 400, currentHeaderY + CellHeight * index, terminalColumnWidth[5], CellHeight, 'lightgrey', 1);
    });
    doc.y = currentHeaderY;
    drawCell(doc, '自立', terminalPosition, currentHeaderY, 50, CellHeight * 3, 'lightgrey', 1);
    doc.y = currentHeaderY;
    drawCell(doc, '連系', terminalPosition + 250, currentHeaderY, 50, CellHeight * 3, 'lightgrey', 1);

    doc.moveDown();
    doc.addPage();
    // 4 ground
    doc.text('4.交流系の端子電圧の確認', {
        align: 'left',
        indent: 10,
        paragraphGap: 5
    });
    let groundPosition = confirmStartX;

    const groundColumnWidth = [200, 100, 100, 100]
    const groundSummaryText = '気設備技術基準の解釈　第29条\n※　C種接地工事：300Vを超える低圧用設置工事→10Ω以下(0.5秒以内に動作する遮断装置を設置した場合は、500Ωまで緩和\n※　D種接地工事：300Vを超える低圧用接地工事→100Ω以下(0.5秒以内に動作する遮断装置を設置した場合は、500Ωまで緩和'
    drawCell(doc, groundSummaryText, groundPosition, doc.y, totalConfrimTableWidth, CellHeight * 3, 'lightgrey', 0)
    currentHeaderY = doc.y + 3;
    const groundHeader = ['対象箇所', '接地種別', '判定基準 ', '測定値-(Ω)']
    groundHeader.forEach((header, index) => {
        drawCell(doc, header, groundPosition, currentHeaderY, groundColumnWidth[index], CellHeight, 'lightgrey', 1);
        groundPosition += groundColumnWidth[index]
    });

    currentHeaderY = doc.y + 3
    const groundRows = ['単独接地 ', 'C種またはD種', '10Ω以下(C種)\nまたは\n100Ω以下(D種)', dcDiagramData.ground_value,]
    groundPosition = confirmStartX
    groundRows.forEach((header, index) => {
        drawCell(doc, header, groundPosition, currentHeaderY, groundColumnWidth[index], CellHeight * 3, 'lightgrey', 1);
        groundPosition += groundColumnWidth[index]
    });

    groundPosition = confirmStartX
    doc.y += 3;
    const groundSummaryText2 = '絶縁抵抗測定(線間）\n※絶縁抵抗を測定する場合は必ず電池側の端子を外してから実施して下さい。'
    drawCell(doc, groundSummaryText2, groundPosition, doc.y, totalConfrimTableWidth, CellHeight * 2, 'lightgrey', 0);

    currentHeaderY = doc.y + 6;
    const groundHeader2 = ['対象場所', '検査対象', '判定基準 ', '測定値-(Ω)']
    groundHeader2.forEach((header, index) => {
        drawCell(doc, header, groundPosition, currentHeaderY, groundColumnWidth[index], CellHeight, 'lightgrey', 1);
        groundPosition += groundColumnWidth[index]
    });

    groundPosition = confirmStartX;


    const resistanceCols = ['U-O間', 'O-W間', 'U-W間', 'U-O間', 'O-W間', 'U-W間', '(+)-(-)間', '(+)-(E)間', '(-)-(E)間'];
    const resistanceValCols = [dcResistanceData.alone_uo, dcResistanceData.alone_ow, dcResistanceData.alone_uw, dcResistanceData.related_uo,
    dcResistanceData.related_ow, dcResistanceData.related_uw, dcResistanceData.conditioner_uo, dcResistanceData.conditioner_ow, dcResistanceData.conditioner_uw,]

    currentHeaderY = doc.y + 3;
    resistanceCols.forEach((header, index) => {
        drawCell(doc, header, groundPosition + 200, currentHeaderY + CellHeight * index, groundColumnWidth[1], CellHeight, 'lightgrey', 1);
    });
    doc.y = currentHeaderY;
    resistanceValCols.forEach((header, index) => {
        drawCell(doc, header, groundPosition + 400, currentHeaderY + CellHeight * index, groundColumnWidth[3], CellHeight, 'lightgrey', 1);
    });
    doc.y = currentHeaderY;
    const delta = 50;
    drawCell(doc, 'パワーコンディショナ\n～\nスイッチボックス-H', groundPosition, currentHeaderY, groundColumnWidth[0] - delta, CellHeight * 6, 'lightgrey', 1);
    doc.y = currentHeaderY;
    drawCell(doc, '自立', groundPosition + groundColumnWidth[0] - delta, currentHeaderY, delta, CellHeight * 3, 'lightgrey', 1);
    drawCell(doc, '連系', groundPosition + groundColumnWidth[0] - delta, currentHeaderY + CellHeight * 3, delta, CellHeight * 3, 'lightgrey', 1);
    doc.y = currentHeaderY;
    drawCell(doc, 'パワーコンディショナ～蓄電池', groundPosition, currentHeaderY + CellHeight * 6, groundColumnWidth[0], CellHeight * 3, 'lightgrey', 1);
    doc.y = currentHeaderY;
    drawCell(doc, '印加電圧 DC500V\n0.2MΩ以上\n(電気設備技術基準58条)', groundPosition + groundColumnWidth[0] + groundColumnWidth[1], currentHeaderY, groundColumnWidth[3], CellHeight * 9, 'lightgrey', 1);

    doc.x = confirmStartX
    doc.moveDown();

}


async function generateFifthPageFromSupabase(doc, reportId) {

    const { data: SetParamData, error: SetParamError } = await supabase
        .from('set_param')
        .select()
        .eq('report_id', reportId)
        .single();
    if (SetParamError) {
        throw SetParamError;
    }

    doc.fontSize(10);

    const systemImage = SetParamData.system_image_url;

    if (systemImage) {
        const base64String = systemImage.split(',')[1];
        const systemBuffer = Buffer.from(base64String, 'base64');
        doc.image(systemBuffer, 46, doc.y + 18, { fit: [520, 145], align: 'center', valign: 'center' })
            .rect(46, doc.y + 18, 520, 145).stroke()
            .text('①システムパラメータ', 46 + 5, doc.y);
    }

    const protectImage = SetParamData.protect_image_url;

    if (protectImage) {
        const base64String = protectImage.split(',')[1];
        const protectBuffer = Buffer.from(base64String, 'base64');
        doc.image(protectBuffer, 46, doc.y + 150 + 18, { fit: [520, 145], align: 'center', valign: 'center' })
            .rect(46, doc.y + 150 + 18, 520, 145).stroke()
            .text('②保護パラメータ', 46 + 5, doc.y + 150);
    }

    const INVImage = SetParamData.inv_image_url;

    if (INVImage) {
        const base64String = INVImage.split(',')[1];
        const INVBuffer = Buffer.from(base64String, 'base64');
        doc.image(INVBuffer, 46, doc.y + 150 + 18, { fit: [520, 145], align: 'center', valign: 'center' })
            .rect(46, doc.y + 150 + 18, 520, 145).stroke()
            .text('④INV情報-PV', 46 + 5, doc.y + 150);
    }

    const INVSImage = SetParamData.inv_s_image_url;

    if (INVSImage) {
        const base64String = INVSImage.split(',')[1];
        const INVSBuffer = Buffer.from(base64String, 'base64');
        doc.image(INVSBuffer, 46, doc.y + 150 + 18, { fit: [520, 145], align: 'center', valign: 'center' })
            .rect(46, doc.y + 150 + 18, 520, 145).stroke()
            .text('⑤INV情報-電池', 46 + 5, doc.y + 150);
    }
}

async function generateSixthPageFromSupabase(doc, reportId) {

    const columnWidths = [180, 280, 30]
    const colheader = ['対象機器', 'チェック項目・内容', 'ポイント', 'チェック']
    const rowHeader = ['共通', '蓄電池', 'パワーコンディショナ', 'スマートスイッチボックス', 'スマートAI']

    const headerColumnWidths = [50, 180, 280, 30]
    const totalTableWidth = 540;

    const headerStartX = (doc.page.width - totalTableWidth) / 2
    doc.fontSize(10).text('6.各機器の試運転開始前点検', {
        align: 'left',
        indent: 15,
        paragraphGap: 5
    });

    const headerCellHeight = 24;
    let incrementalStart = headerStartX;
    let currentHeaderY = doc.y
    colheader.forEach((header, index) => {
        if (index == 3) doc.fontSize(8)
        drawCell(doc, header, incrementalStart, currentHeaderY, headerColumnWidths[index], headerCellHeight, 'lightgrey', 0);
        incrementalStart += headerColumnWidths[index]
    });

    doc.fontSize(7.5)

    const cellHeight = 10;

    const startX = (doc.page.width - totalTableWidth) / 2 + headerColumnWidths[0];
    let rows = commonCheckList.map((item, index) => [item, commmonCheckPoint[index], 'O']);
    let prevrowY = doc.y;
    let rowY = drawTable(doc, rows, columnWidths, startX, cellHeight);
    doc.fontSize(10);
    drawCell(doc, rowHeader[0], headerStartX, prevrowY, headerColumnWidths[0], rowY - prevrowY, 'lightgrey', 0);
    doc.fontSize(7.5);
    doc.y = rowY

    rows = storageCheckList.map((item, index) => [item, storageCheckPoint[index], 'O']);
    prevrowY = doc.y;
    rowY = drawTable(doc, rows, columnWidths, startX, cellHeight);
    doc.fontSize(10);
    drawCell(doc, rowHeader[1], headerStartX, prevrowY, headerColumnWidths[0], rowY - prevrowY, 'lightgrey', 0);
    doc.fontSize(7.5);
    doc.y = rowY

    rows = conditionerCheckList.map((item, index) => [item, conditionerCheckPoint[index], 'O']);
    prevrowY = doc.y;
    rowY = drawTable(doc, rows, columnWidths, startX, cellHeight);
    doc.fontSize(10);
    drawCell(doc, rowHeader[1], headerStartX, prevrowY, headerColumnWidths[0], rowY - prevrowY, 'lightgrey', 0);
    doc.fontSize(7.5);
    doc.y = rowY

    rows = switchCheckList.map((item, index) => [item, switchCheckPoint[index], 'O']);
    prevrowY = doc.y;
    rowY = drawTable(doc, rows, columnWidths, startX, cellHeight);
    doc.fontSize(10);
    drawCell(doc, rowHeader[1], headerStartX, prevrowY, headerColumnWidths[0], rowY - prevrowY, 'lightgrey', 0);
    doc.fontSize(7.5);
    doc.y = rowY
    rows = smartCheckList.map((item, index) => [item, smartCheckPoint[index], 'O']);
    prevrowY = doc.y;
    rowY = drawTable(doc, rows, columnWidths, startX, cellHeight);
    doc.fontSize(10);
    drawCell(doc, rowHeader[1], headerStartX, prevrowY, headerColumnWidths[0], rowY - prevrowY, 'lightgrey', 0);
    doc.fontSize(7.5);
    doc.y = rowY
}

function drawTable(doc, rows, columnWidths, startX, cellHeight) {
    let currentY = doc.y;
    let startY = doc.y; // Define startY at the beginning of the function

    rows.forEach(rowData => {
        let rowHeight = cellHeight; // Default cell height
        let currentX = startX;
        // Calculate required height for each cell and find max height
        const maxTextHeight = rowData.reduce((maxHeight, text, index) => {
            const cellWidth = columnWidths[index] - 6; // Subtract padding
            const textHeight = doc.heightOfString(text, { width: cellWidth }) + 2; // Add padding
            return Math.max(maxHeight, textHeight);
        }, rowHeight);

        // Use the max height for all cells in this row
        rowHeight = maxTextHeight;

        // Draw each cell in the row with the calculated height
        rowData.forEach((text, index) => {
            const fillColor = index === 0 ? 'lightgrey' : null;
            drawCell(doc, text, currentX, currentY, columnWidths[index], rowHeight, fillColor, index);
            currentX += columnWidths[index];
        });
        currentY += rowHeight; // Move to the next row position
    });
    doc.y = currentY
    const totalTableWidth = columnWidths.reduce((sum, width) => sum + width, 0);
    doc.lineWidth(1.2); // Set thicker line width for the outer border
    doc.rect(startX, startY, totalTableWidth, currentY - startY).stroke();

    // Reset line width to default
    doc.lineWidth(1);
    return currentY;
}

const drawCell = (doc, text, x, y, width, height, fillColor, columnIndex) => {
    if (fillColor && columnIndex === 0) { // Fill only the first column
        doc.fillColor(fillColor).rect(x, y, width, height).fillAndStroke(fillColor, 'black');
    } else {
        doc.strokeColor('black').rect(x, y, width, height).stroke();
    }
    // Calculate vertical center
    const textHeight = doc.currentLineHeight();
    const totalHeight = doc.heightOfString(text, { width: width }) + 2; // Add padding
    const textY = y + Math.round((height - totalHeight) / textHeight) * textHeight / 2;
    doc.fillColor('black'); // Reset fill color for text
    doc.text(text, x + 5, textY, { width: width - 6, align: 'center' });
};

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '20mb', // Set desired value here
        },
        responseLimit: false,
    },
    maxDuration: 240,
};



