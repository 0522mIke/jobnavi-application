import React, { useState } from 'react';

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);


  const toggleAnswer = (index: number) => {
    setOpen(open === index ? null : index);
  };

  const faqData = [
    {
      question: '質問1: 料金はどのくらいかかりますか？',
      answer: '答え: 完全無料でご利用いただけます。',
    },
    {
      question: '質問2: どのようなサポートがありますか？',
      answer: '答え: チャットサポート、メールサポート、電話サポートが利用可能です。',
    },
    {
      question: '質問3: サービスはどの地域で提供されていますか？',
      answer: '答え: オンラインのため全国で提供されています。随時アップデートを予定しており、各種転職サイトとの自動同期を実装予定です。',
    },
  ];

  return (
    <div className="w-full py-24 bg-[#eafcf6]">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-4xl font-bold text-gray-800 mb-16 text-center">FAQ</h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6">
            <button
                onClick={() => toggleAnswer(index)}
                className="w-full text-left text-xl font-semibold text-gray-900 focus:outline-none flex justify-between items-center"
              >
                <span>{faq.question}</span>
                <span className="text-2xl">{open === index ? '−' : '＋'}</span>
              </button>
              {open === index && (
                <div className="mt-4 text-gray-700 text-lg">{faq.answer}</div>
              )}
            </div>
        ))}
      </div>
    </div>
  </div>
);
};
export default FAQ;
