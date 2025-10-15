import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExcelExportService {
  /**
   * Export purchase order data to Excel format with Noto Sans font, matching the visual form.
   * @param purchaseOrder - Purchase order data
   * @returns Buffer - Excel file buffer
   */
  async exportPurchaseOrderToExcel(purchaseOrder: any): Promise<Buffer> {
    console.log('data', purchaseOrder);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ໃບສະເໜີລາຄາ');

    // Set column widths
    worksheet.columns = [
      { width: 5 }, // A - ລ/ດ
      { width: 25 }, // B - ເນື້ອໃນລາຍການ
      { width: 10 }, // C - ຈໍານວນ
      { width: 12 }, // D - ຫົວໜ່ວຍ
      { width: 12 }, // E - ລາຄາ
      { width: 12 }, // F - ລາຄາລວມ
      { width: 12 }, // G - ຮ້ານ
      { width: 15 }, // H - ໝາຍເຫດ
      { width: 5 }, // I
      { width: 5 }, // J
    ];

    // Helper functions
    const applyNotoFont = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Noto Sans',
        family: 2,
        size: 11,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
    };

    const applyLeftAlign = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Noto Sans',
        family: 2,
        size: 11,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left',
        wrapText: true,
      };
    };

    const applyBorder = (cell: ExcelJS.Cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    };

    // Row 2: Document number (top right)
    applyLeftAlign(worksheet.getCell('I2'));
    worksheet.getCell('I2').value =
      `ເລກທີ:..................${purchaseOrder.po_number || ''}`;
    worksheet.mergeCells('I2:J2');

    // Row 3: Date (top right)
    applyLeftAlign(worksheet.getCell('I3'));
    worksheet.getCell('I3').value = `ວັນທີ່:...............................`;
    worksheet.mergeCells('I3:J3');

    // Row 5: Title
    applyNotoFont(worksheet.getCell('E5'), { size: 14, bold: true });
    worksheet.getCell('E5').value = 'ໃບອະນຸມັດຈັດຊື້-ຈັດຈ້າງ.';
    worksheet.mergeCells('E5:F5');

    // Row 7: Addressee
    applyLeftAlign(worksheet.getCell('D7'), { bold: true });
    worksheet.getCell('D7').value =
      'ຮຽນ: ຜູ້ອຳນວຍການ ບໍລິສັດຮຸ່ງອາລຸນ ໂລຈິສຕິກ ຈຳກັດ.';
    worksheet.mergeCells('D7:J7');

    // Row 8: Subject
    applyLeftAlign(worksheet.getCell('C8'), { bold: true });
    worksheet.getCell('C8').value =
      'ເລື່ອງ: ຂໍສະເໜີເບີກງົບປະມານໃນການຈັດຊື້...........................ໃຫ້ພະແນກ............................ໜ່ວຍງານ.';
    worksheet.mergeCells('C8:J8');

    // Row 10: Reference
    applyLeftAlign(worksheet.getCell('A10'));
    worksheet.getCell('A10').value = 'ອີງຕາມ: ການສະເໜີຂອງວາກອນທີ:';
    worksheet.mergeCells('A10:C10');

    applyLeftAlign(worksheet.getCell('D10'));
    worksheet.getCell('D10').value = 'ລົງວັນທີ່:';

    // Row 12: Section 1
    applyLeftAlign(worksheet.getCell('A12'), { bold: true });
    worksheet.getCell('A12').value = '1. ພາກສ່ວນສະເໜີ:';
    worksheet.mergeCells('A12:J12');

    // Row 13: Section 1 content
    applyLeftAlign(worksheet.getCell('B13'));
    worksheet.getCell('B13').value =
      'ຂໍສະເໜີເບີກງົບປະມານໃນການ:..................................., ຈຳນວນ:............................, ໃຫ້ພະແນກ:...................................ໜ່ວຍງານ.................................,';
    worksheet.mergeCells('B13:J13');

    // Row 14: Section 1 continuation
    applyLeftAlign(worksheet.getCell('B14'));
    worksheet.getCell('B14').value = 'ຕັ້ງປະກອບເຂົ້າເປັນດັ່ງນີ້:';
    worksheet.mergeCells('B14:J14');

    // Row 16: Section 2
    applyLeftAlign(worksheet.getCell('A16'), { bold: true });
    worksheet.getCell('A16').value = '2. ຈຸດປະສົງ:';
    worksheet.mergeCells('A16:J16');

    // Row 17: Section 2 content
    applyLeftAlign(worksheet.getCell('C17'));
    worksheet.getCell('C17').value =
      'ເພື່ອ:..........................................................................................................................................................................................';
    worksheet.mergeCells('C17:J17');

    // Row 19: Section 3
    applyLeftAlign(worksheet.getCell('A19'), { bold: true });
    worksheet.getCell('A19').value =
      '3. ຕາຕະລາງລາຍລະອຽດຮ້ານຄ້າອອກສິນຄ້າ ດັ່ງລຸ່ມນີ້:';
    worksheet.mergeCells('A19:J19');

    // Row 21: Table header
    const headerRow = 21;

    applyNotoFont(worksheet.getCell(`A${headerRow}`), { bold: true });
    worksheet.getCell(`A${headerRow}`).value = 'ລ/ດ';
    applyBorder(worksheet.getCell(`A${headerRow}`));

    applyNotoFont(worksheet.getCell(`B${headerRow}`), { bold: true });
    worksheet.getCell(`B${headerRow}`).value = 'ເນື້ອໃນລາຍການ';
    applyBorder(worksheet.getCell(`B${headerRow}`));

    applyNotoFont(worksheet.getCell(`C${headerRow}`), { bold: true });
    worksheet.getCell(`C${headerRow}`).value = 'ຈໍານວນ';
    applyBorder(worksheet.getCell(`C${headerRow}`));

    applyNotoFont(worksheet.getCell(`D${headerRow}`), { bold: true });
    worksheet.getCell(`D${headerRow}`).value = 'ຫົວໜ່ວຍ';
    applyBorder(worksheet.getCell(`D${headerRow}`));

    applyNotoFont(worksheet.getCell(`E${headerRow}`), { bold: true });
    worksheet.getCell(`E${headerRow}`).value = 'ລາຄາ';
    applyBorder(worksheet.getCell(`E${headerRow}`));

    applyNotoFont(worksheet.getCell(`F${headerRow}`), { bold: true });
    worksheet.getCell(`F${headerRow}`).value = 'ລາຄາລວມ';
    applyBorder(worksheet.getCell(`F${headerRow}`));

    applyNotoFont(worksheet.getCell(`G${headerRow}`), { bold: true });
    worksheet.getCell(`G${headerRow}`).value = 'ຮ້ານ';
    applyBorder(worksheet.getCell(`G${headerRow}`));

    applyNotoFont(worksheet.getCell(`H${headerRow}`), { bold: true });
    worksheet.getCell(`H${headerRow}`).value = 'ໝາຍເຫດ';
    applyBorder(worksheet.getCell(`H${headerRow}`));

    // Table data rows
    let row = 22;
    if (
      purchaseOrder.purchase_order_item &&
      purchaseOrder.purchase_order_item.length > 0
    ) {
      purchaseOrder.purchase_order_item.forEach((item: any, index: number) => {
        applyNotoFont(worksheet.getCell(`A${row}`));
        worksheet.getCell(`A${row}`).value = index + 1;
        applyBorder(worksheet.getCell(`A${row}`));

        applyLeftAlign(worksheet.getCell(`B${row}`));
        worksheet.getCell(`B${row}`).value =
          item.purchase_request_item?.title || item.remark || '';
        applyBorder(worksheet.getCell(`B${row}`));

        applyNotoFont(worksheet.getCell(`C${row}`));
        worksheet.getCell(`C${row}`).value = item.quantity || 0;
        applyBorder(worksheet.getCell(`C${row}`));

        applyNotoFont(worksheet.getCell(`D${row}`));
        worksheet.getCell(`D${row}`).value =
          item.purchase_request_item?.unit?.name || 'ເນື້ອ';
        applyBorder(worksheet.getCell(`D${row}`));

        applyNotoFont(worksheet.getCell(`E${row}`));
        worksheet.getCell(`E${row}`).value = '';
        applyBorder(worksheet.getCell(`E${row}`));

        applyNotoFont(worksheet.getCell(`F${row}`));
        worksheet.getCell(`F${row}`).value = '';
        applyBorder(worksheet.getCell(`F${row}`));

        applyNotoFont(worksheet.getCell(`G${row}`));
        worksheet.getCell(`G${row}`).value = '';
        applyBorder(worksheet.getCell(`G${row}`));

        applyLeftAlign(worksheet.getCell(`H${row}`));
        worksheet.getCell(`H${row}`).value = item.remark || '';
        applyBorder(worksheet.getCell(`H${row}`));

        row++;
      });
    } else {
      // Default 3 empty rows
      for (let i = 1; i <= 3; i++) {
        applyNotoFont(worksheet.getCell(`A${row}`));
        worksheet.getCell(`A${row}`).value = i;
        applyBorder(worksheet.getCell(`A${row}`));

        applyBorder(worksheet.getCell(`B${row}`));

        applyBorder(worksheet.getCell(`C${row}`));

        applyNotoFont(worksheet.getCell(`D${row}`));
        worksheet.getCell(`D${row}`).value = 'ເນື້ອ';
        applyBorder(worksheet.getCell(`D${row}`));

        applyBorder(worksheet.getCell(`E${row}`));
        applyBorder(worksheet.getCell(`F${row}`));
        applyBorder(worksheet.getCell(`G${row}`));
        applyBorder(worksheet.getCell(`H${row}`));

        row++;
      }
    }

    // Summary row 1: ມູນຄ່າລວມ/ຮ້ານ
    applyNotoFont(worksheet.getCell(`D${row}`), { bold: true });
    worksheet.getCell(`D${row}`).value = 'ມູນຄ່າລວມ/ຮ້ານ:';
    worksheet.mergeCells(`D${row}:F${row}`);
    applyBorder(worksheet.getCell(`D${row}`));
    applyBorder(worksheet.getCell(`E${row}`));
    applyBorder(worksheet.getCell(`F${row}`));
    applyBorder(worksheet.getCell(`G${row}`));
    applyBorder(worksheet.getCell(`H${row}`));

    row++;

    // Summary row 2: ມູນຄ່າລວມທັງໝົດ
    applyNotoFont(worksheet.getCell(`D${row}`), { bold: true });
    worksheet.getCell(`D${row}`).value = 'ມູນຄ່າລວມທັງໝົດ:';
    worksheet.mergeCells(`D${row}:F${row}`);
    applyBorder(worksheet.getCell(`D${row}`));
    applyBorder(worksheet.getCell(`E${row}`));
    applyBorder(worksheet.getCell(`F${row}`));
    applyBorder(worksheet.getCell(`G${row}`));

    applyNotoFont(worksheet.getCell(`H${row}`));
    worksheet.getCell(`H${row}`).value = 'ວັນທີ່:';
    applyBorder(worksheet.getCell(`H${row}`));

    applyNotoFont(worksheet.getCell(`I${row}`));
    worksheet.getCell(`I${row}`).value = 'ເວລາ:';
    applyBorder(worksheet.getCell(`I${row}`));

    row++;

    // Summary row 3: ມູນຄ່າລວມທັງໝົດກີບ
    applyNotoFont(worksheet.getCell(`D${row}`), { bold: true });
    worksheet.getCell(`D${row}`).value = 'ມູນຄ່າລວມທັງໝົດກີບ:';
    worksheet.mergeCells(`D${row}:F${row}`);
    applyBorder(worksheet.getCell(`D${row}`));
    applyBorder(worksheet.getCell(`E${row}`));
    applyBorder(worksheet.getCell(`F${row}`));
    applyBorder(worksheet.getCell(`G${row}`));
    applyBorder(worksheet.getCell(`H${row}`));

    row += 2;

    // Signature section
    applyNotoFont(worksheet.getCell(`A${row}`));
    worksheet.getCell(`A${row}`).value = 'ຜູ້ຮັບຜິດຊອບການ';
    worksheet.mergeCells(`A${row}:B${row}`);

    applyNotoFont(worksheet.getCell(`C${row}`));
    worksheet.getCell(`C${row}`).value = 'ຫົວໜ້າພະແນກການກຸ່ມ';
    worksheet.mergeCells(`C${row}:D${row}`);

    applyNotoFont(worksheet.getCell(`E${row}`));
    worksheet.getCell(`E${row}`).value = 'ດັ່ນປະກອນ';
    worksheet.mergeCells(`E${row}:F${row}`);

    applyNotoFont(worksheet.getCell(`G${row}`));
    worksheet.getCell(`G${row}`).value = 'ຫົວໜ້າພະແນກບໍລິຫານ';
    worksheet.mergeCells(`G${row}:H${row}`);

    applyNotoFont(worksheet.getCell(`I${row}`));
    worksheet.getCell(`I${row}`).value = 'ຜູ້ອຳນວຍການ';
    worksheet.mergeCells(`I${row}:J${row}`);

    // Generate Excel file buffer
    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as Buffer;
  }

  /**
   * Generate filename for Excel export
   * @param poNumber - Purchase order number
   * @returns string - Generated filename
   */
  generateFileName(poNumber: string): string {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return `Purchase_Order_${poNumber}_${date}.xlsx`;
  }
}
