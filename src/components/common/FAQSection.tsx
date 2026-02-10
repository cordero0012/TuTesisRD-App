import React from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    questions: FAQItem[];
    title?: string;
    className?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({
    questions,
    title = "Preguntas Frecuentes",
    className = ""
}) => {
    // Generar Schema.org JSON-LD para FAQPage
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": questions.map((item) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <section className={`py-12 ${className}`}>
            {/* Inyectar Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                    {title}
                </h2>

                <div className="space-y-6">
                    {questions.map((item, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
                            <h3 className="text-xl font-semibold mb-3 text-brand-orange">
                                {item.question}
                            </h3>
                            <div
                                className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                                dangerouslySetInnerHTML={{ __html: item.answer }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
