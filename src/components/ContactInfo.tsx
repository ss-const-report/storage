import React from 'react';

const ContactInfo = () => {
  return (
    <div className="contact-info text-gray-500">
      <h2 className=' mb-5 m-1'>お問い合わせはこちら</h2>

      <p className=' mb-5 m-1'>スマートソーラー株式会社 施工店サポート</p>
      <p className='ml-5 m-1'>営業時間 平日9時ー18時</p>
      <p className='ml-5 m-1'>Email: <a href="mailto:sekou@smartsolar.co.jp">sekou@smartsolar.co.jp</a></p>
      <p className='ml-5 m-1'>Tel: <a href="tel:050-1746-9333">050-1746-9333</a></p>

      <p className=' mt-5 m-1'>自動音声の途中でもダイヤル可能</p>
      <p className=' m-1'>短縮ダイヤル1：施工・設置完了報告書に関するお問い合わせ</p>
      <p className=' m-1'>短縮ダイヤル2：施工ID研修・その他のお問い合わせ</p>
    </div>
  );
}

export default ContactInfo;
