import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import SEO from '../../components/SEO';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { analyzeDocument, AuditResult } from '../../services/docx/analyzer';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

const DocumentAudit: React.FC = () => {
    const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploadedFile(file);
        setIsAnalyzing(true);
        setAuditResult(null);

        try {
            // Simulate processing delay for "Effect"
            setTimeout(async () => {
                const result = await analyzeDocument(file);
                setAuditResult(result);
                setIsAnalyzing(false);
            }, 1000);
        } catch (error) {
            console.error("Error analyzing document", error);
            setIsAnalyzing(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        maxFiles: 1
    });

    const generateReport = async () => {
        if (!auditResult || !uploadedFile) return;

        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        text: "Reporte de Auditoría TuTesisRD",
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        text: `Archivo analizado: ${uploadedFile.name}`,
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        text: `Puntuación General: ${auditResult.score}/100`,
                        heading: HeadingLevel.HEADING_2,
                    }),
                    new Paragraph({
                        text: `Palabras: ${auditResult.wordCount} | Citas Detectadas: ${auditResult.referenceCount}`,
                    }),
                    new Paragraph({
                        text: "Sugerencias:",
                        heading: HeadingLevel.HEADING_3,
                        spacing: { before: 200 },
                    }),
                    ...auditResult.suggestions.map(s => new Paragraph({
                        children: [new TextRun({ text: `• ${s}` })],
                    })),
                    new Paragraph({
                        text: "Este reporte fue generado automáticamente por TuTesisRD Tools.",
                        spacing: { before: 400 },
                    })
                ],
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `Reporte_Auditoria_${uploadedFile.name}`);
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-white transition-colors duration-300">
            <SEO title="Auditor de Tesis con IA" description="Sube tu tesis y recibe un diagnóstico automático gratis." />
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-20">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 animate-fade-in-up">Auditor de Tesis Gratuito</h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto animate-slide-up">
                        Analiza la estructura y formato de tu documento en segundos.
                    </p>
                </header>

                <div className="max-w-3xl mx-auto">
                    {!auditResult && !isAnalyzing && (
                        <div
                            {...getRootProps()}
                            className={`
                                border-4 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all
                                ${isDragActive ? 'border-brand-orange bg-brand-orange/5' : 'border-gray-300 dark:border-gray-700 hover:border-brand-orange/50'}
                            `}
                        >
                            <input {...getInputProps()} />
                            <span className="material-icons text-6xl text-slate-300 mb-4">cloud_upload</span>
                            <p className="text-xl font-bold text-slate-700 dark:text-slate-300">
                                {isDragActive ? "¡Suéltalo aquí!" : "Arrastra tu archivo .docx aquí"}
                            </p>
                            <p className="text-slate-500 mt-2">o haz clic para seleccionar</p>
                            <div className="mt-8">
                                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-500">Solo archivos .DOCX</span>
                            </div>
                        </div>
                    )}

                    {isAnalyzing && (
                        <Card className="p-12 text-center animate-pulse-slow">
                            <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                            <h3 className="text-2xl font-bold">Analizando documento...</h3>
                            <p className="text-slate-500">Buscando errores de formato y citas.</p>
                        </Card>
                    )}

                    {auditResult && (
                        <div className="animate-fade-in-up">
                            <Card variant="glass" className="p-8 mb-8 border-t-8 border-t-brand-orange">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <h2 className="text-3xl font-black mb-1">Diagnóstico Final</h2>
                                        <p className="text-slate-500">Basado en reglas APA 7ma Edición (Básico)</p>
                                    </div>
                                    <div className={`
                                        w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black border-4
                                        ${auditResult.score >= 80 ? 'border-green-500 text-green-500' : auditResult.score >= 50 ? 'border-yellow-500 text-yellow-500' : 'border-red-500 text-red-500'}
                                    `}>
                                        {auditResult.score}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
                                        <div className="text-xs text-slate-500 uppercase font-bold">Palabras</div>
                                        <div className="text-2xl font-bold">{auditResult.wordCount}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
                                        <div className="text-xs text-slate-500 uppercase font-bold">Párrafos</div>
                                        <div className="text-2xl font-bold">{auditResult.paragraphs}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
                                        <div className="text-xs text-slate-500 uppercase font-bold">Citas (Apx)</div>
                                        <div className="text-2xl font-bold">{auditResult.referenceCount}</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl">
                                        <div className="text-xs text-slate-500 uppercase font-bold">Título</div>
                                        <div className="text-2xl font-bold">{auditResult.hasTitle ? 'Sí' : 'No detectado'}</div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-4">Sugerencias de Mejora:</h3>
                                <ul className="space-y-3 mb-8">
                                    {auditResult.suggestions.length > 0 ? (
                                        auditResult.suggestions.map((s, i) => (
                                            <li key={i} className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300 rounded-lg">
                                                <span className="material-icons text-sm mt-1">warning</span>
                                                {s}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300 rounded-lg">
                                            <span className="material-icons">check_circle</span>
                                            ¡Excelente! No encontramos errores críticos obvios.
                                        </li>
                                    )}
                                </ul>

                                <div className="flex flex-col md:flex-row gap-4">
                                    <Button variant="primary" onClick={generateReport} leftIcon={<span className="material-icons">download</span>}>
                                        Descargar Reporte Completo (DOCX)
                                    </Button>
                                    <Button variant="outline" onClick={() => { setAuditResult(null); setUploadedFile(null); }}>
                                        Subir Otro Documento
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default DocumentAudit;
