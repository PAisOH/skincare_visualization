import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';

export async function downloadPdf(elementId: string, filename: string) {
  const mainElement = document.getElementById(elementId);

  const canvas = await html2canvas(mainElement!, {
    scale: 2, // 设置缩放比例为2,获得更高分辨率
    useCORS: true,
  });

  const pdf = new JsPDF('p', 'mm', 'a4'); // 创建 PDF 文档
  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', 0, 0, 210, 297); // 将 Canvas 添加到 PDF 中
  pdf.save(filename); // 保存 PDF 文件
}