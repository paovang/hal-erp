import { Injectable } from '@nestjs/common';
import axios from 'axios';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';

@Injectable()
export class ExcelExportService {
  /**
   * Export purchase order data to Excel format with Noto Sans font, matching the visual form.
   * @param purchaseOrder - Purchase order data
   * @returns Buffer - Excel file buffer
   */

  async exportPurchaseOrderToExcel(
    purchaseOrder: any,
    budget: any,
  ): Promise<Buffer> {
    // console.log('data', purchaseOrder);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ໃບອະນຸມັດຈັດຊື້-ຈັດຈ້າງ'); // Set column widths

    const applyNotoFont = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Phetsarath OT',
        family: 2,
        size: 12,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center', // CENTER alignment
        wrapText: true,
      };
    }; // Use for left-aligned text (Document details, Titles, Sections, Description, Bank details)

    const applyCenterAlign = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Phetsarath OT',
        family: 2,
        size: 12,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center', // CENTER alignment
        wrapText: true,
      };
    };

    const applyLeftAlign = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Phetsarath OT',
        family: 2,
        size: 12,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left', // LEFT alignment (FIXED)
        wrapText: true,
      };
    };

    const applyRightAlign = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Phetsarath OT',
        family: 2,
        size: 12,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'right', // RIGHT alignment (FIXED)
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

    // New helper for currency values (Left-aligned, formatted, and bordered)
    const applyCurrencyFormat = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Phetsarath OT',
        family: 2,
        size: 12,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
        indent: 1,
      };

      // make sure it's numeric
      const numericValue =
        typeof cell.value === 'number' ? cell.value : Number(cell.value || 0);

      // ✅ use '0' format if no value or equals 0
      if (!numericValue) {
        cell.numFmt = '0';
      } else {
        cell.numFmt = '#,##0.00';
      }

      applyBorder(cell);
    };

    // const logoPath = path.resolve('src', 'common', 'images', 'logo.jpg');
    // const imageBuffer = fs.readFileSync(logoPath);
    let imageBuffer: Buffer;

    // 1️⃣ Decide which logo to use
    const companyLogo = purchaseOrder?.document?.company?.logo_url;

    if (companyLogo) {
      // If company logo exists → load from URL
      const response = await axios.get(companyLogo, {
        responseType: 'arraybuffer',
      });
      imageBuffer = Buffer.from(response.data);
    } else {
      // Fallback → default logo
      const logoPath = path.resolve('src', 'common', 'images', 'logo.jpg');
      imageBuffer = fs.readFileSync(logoPath);
    }

    // 2️⃣ Add image to workbook
    const logoImageId = workbook.addImage({
      buffer: imageBuffer as any,
      extension: 'jpeg', // 'png' or 'jpeg'
    });

    // 3️⃣ Merge cells for logo
    worksheet.mergeCells('A1:B4');

    // 4️⃣ Place image inside the merged cell
    worksheet.addImage(logoImageId, {
      tl: { col: 0, row: 0 }, // top-left of merged cell (0-based index)
      ext: { width: 130, height: 120 }, // adjust size to fit your layout
      editAs: 'oneCell', // keeps image anchored to cell
    });

    // Row 2: Document number (top right)
    applyLeftAlign(worksheet.getCell('N2'));
    worksheet.getCell('N2').value = `ເລກທີ: ${purchaseOrder.po_number || ''}`;
    worksheet.mergeCells('N2:Q2'); // Row 3: Date (top right)

    // Keep Left Align since it contains text that starts with a label 'ວັນທີ່:'
    applyLeftAlign(worksheet.getCell('N3'));
    worksheet.getCell('N3').value = `ວັນທີ່: ${purchaseOrder.order_date}`;
    worksheet.mergeCells('N3:Q3'); // Row 5: Title

    // Use Noto Font (centered) for main title
    applyNotoFont(worksheet.getCell('F5'), { size: 14, bold: true });
    worksheet.getCell('F5').value = 'ໃບອະນຸມັດຈັດຊື້-ຈັດຈ້າງ.';
    worksheet.mergeCells('F5:I5'); // Row 7: Addressee

    // Row 7: Addressee - using Rich Text for mixed bold/regular font styles
    const addresseeCell = worksheet.getCell('E7');

    // Apply Left Align to set the default alignment and font for the cell area
    // We remove { bold: true } from the function call since we handle bold within Rich Text.
    applyLeftAlign(addresseeCell);

    addresseeCell.value = {
      richText: [
        // Part 1: "ຮຽນ: " - BOLD
        {
          font: {
            name: 'Phetsarath OT',
            family: 2,
            size: 11,
            bold: true, // Apply bold here
          },
          text: 'ຮຽນ: ',
        },
        // Part 2: The rest of the text - REGULAR
        {
          font: {
            name: 'Phetsarath OT',
            family: 2,
            size: 11,
            bold: false, // Explicitly set to regular
          },
          text: 'ຜູ້ອຳນວຍການ ບໍລິສັດຮຸ່ງອາລຸນ ໂລຈິສຕິກ ຈຳກັດ.',
        },
      ],
    };

    // Merge cells E7 to J7
    worksheet.mergeCells('E7:K7');

    // Use Left Align for long text starting at a position
    const subjectCell = worksheet.getCell('D8');
    // Apply alignment and default font
    applyLeftAlign(subjectCell);

    subjectCell.value = {
      richText: [
        {
          font: {
            name: 'Phetsarath OT',
            family: 2,
            size: 11,
            bold: true,
          },
          text: 'ເລື່ອງ: ',
        },
        // Part 2: The rest of the text - REGULAR
        {
          font: {
            name: 'Phetsarath OT',
            family: 2,
            size: 11,
            bold: false,
          },
          text: `ຂໍສະເໜີເບີກງົບປະມານໃນການຈັດຊື້................ໃຫ້ພະແນກ: ${purchaseOrder.purchase_request.document.department?.code + '/' + purchaseOrder.purchase_request.document.department?.name},  ໜ່ວຍງານ.`, // Original text minus the initial label
        },
      ],
    };

    worksheet.mergeCells('D8:N8');

    // Row 10: Reference (MODIFIED TO USE RICH TEXT)
    const referenceCell = worksheet.getCell('A10');

    // Apply alignment and default font (remove { bold: true } from applyLeftAlign if it was there)
    applyLeftAlign(referenceCell);

    referenceCell.value = {
      richText: [
        // Part 1: "ອີງຕາມ: " - BOLD
        {
          font: {
            name: 'Phetsarath OT',
            family: 2,
            size: 11,
            bold: true, // Apply bold here
          },
          text: 'ອີງຕາມ: ',
        },
        // Part 2: The rest of the text - REGULAR
        {
          font: {
            name: 'Phetsarath OT',
            family: 2,
            size: 11,
            bold: false, // Explicitly set to regular
          },
          text: `ການສະເໜີຂອງເລກທີ: ${purchaseOrder.po_number}`,
        },
      ],
    };
    worksheet.mergeCells('A10:F10');

    // Use Left Align for text starting at a position
    applyCenterAlign(worksheet.getCell('G10'));
    worksheet.getCell('G10').value = 'ລົງວັນທີ່:'; // Row 12: Section 1

    applyLeftAlign(worksheet.getCell('H10'));
    worksheet.getCell('H10').value = purchaseOrder.order_date;
    worksheet.mergeCells('H10:J10');

    applyLeftAlign(worksheet.getCell('K10'));
    worksheet.getCell('K10').value = 'ທີ່ສະເໜີຜ່ານຫົວຫນ້າພະແນກບໍລິຫານ.';
    worksheet.mergeCells('K10:P10');

    // Use Left Align for section header
    applyLeftAlign(worksheet.getCell('A12'), { bold: true });
    worksheet.getCell('A12').value = '1. ພາກສ່ວນສະເໜີ:';
    worksheet.mergeCells('A12:J12'); // Row 13: Section 1 content

    // Use Left Align for long text
    applyCenterAlign(worksheet.getCell('B13'));
    worksheet.getCell('B13').value =
      `ຂໍສະເໜີເບີກງົບປະມານໃນການ:..................................., ຈຳນວນ: ${purchaseOrder.purchase_request.quantity || 0}, ໃຫ້ພະແນກ: ${purchaseOrder.purchase_request.document.department?.code + '/' + purchaseOrder.purchase_request.document.department?.name}, ໜ່ວຍງານ...............,`;
    worksheet.mergeCells('B13:P13'); // Row 14: Section 1 continuation

    // Use Left Align for text
    applyCenterAlign(worksheet.getCell('B14'));
    worksheet.getCell('B14').value = 'ຕັ້ງປະກອບເຂົ້າເປັນດັ່ງນີ້:';
    worksheet.mergeCells('B14:P14'); // Row 16: Section 2

    // Use Left Align for section header
    applyLeftAlign(worksheet.getCell('A16'), { bold: true });
    worksheet.getCell('A16').value = '2. ຈຸດປະສົງ:';
    worksheet.mergeCells('A16:P16'); // Row 17: Section 2 content

    // Use Left Align for long text
    applyLeftAlign(worksheet.getCell('C17'));
    worksheet.getCell('C17').value = `ເພື່ອ: ${purchaseOrder.purpose || '-'}`;
    worksheet.mergeCells('C17:N17'); // Row 19: Section 3

    // Use Left Align for section header
    applyLeftAlign(worksheet.getCell('A19'), { bold: true });
    worksheet.getCell('A19').value =
      '3. ຕາຕະລາງລາຍລະອຽດຮ້ານຄ້າອອກສິນຄ້າ ດັ່ງລຸ່ມນີ້:';
    worksheet.mergeCells('A19:P19'); // Row 21: Table header (Use applyNotoFont for centered headers)

    const headerRow = 21;

    applyNotoFont(worksheet.getCell(`A${headerRow}`), { bold: true });
    worksheet.getCell(`A${headerRow}`).value = 'ລ/ດ';
    applyBorder(worksheet.getCell(`A${headerRow}`));

    applyNotoFont(worksheet.getCell(`B${headerRow}`), { bold: true });
    worksheet.getCell(`B${headerRow}`).value = 'ເນື້ອໃນ';
    applyBorder(worksheet.getCell(`B${headerRow}`));
    worksheet.mergeCells(`B${headerRow}:D${headerRow}`);

    applyNotoFont(worksheet.getCell(`E${headerRow}`), { bold: true });
    worksheet.getCell(`E${headerRow}`).value = 'ຈໍານວນ';
    applyBorder(worksheet.getCell(`E${headerRow}`));

    applyNotoFont(worksheet.getCell(`F${headerRow}`), { bold: true });
    worksheet.getCell(`F${headerRow}`).value = 'ຫົວໜ່ວຍ';
    applyBorder(worksheet.getCell(`F${headerRow}`));
    worksheet.mergeCells(`F${headerRow}:G${headerRow}`);

    applyNotoFont(worksheet.getCell(`H${headerRow}`), { bold: true });
    worksheet.getCell(`H${headerRow}`).value = 'ລາຄາ';
    applyBorder(worksheet.getCell(`H${headerRow}`));
    worksheet.mergeCells(`H${headerRow}:J${headerRow}`);

    applyNotoFont(worksheet.getCell(`K${headerRow}`), { bold: true });
    worksheet.getCell(`K${headerRow}`).value = 'ລາຄາລວມ';
    applyBorder(worksheet.getCell(`K${headerRow}`));
    worksheet.mergeCells(`K${headerRow}:M${headerRow}`);

    applyNotoFont(worksheet.getCell(`N${headerRow}`), { bold: true });
    worksheet.getCell(`N${headerRow}`).value = 'ຊື່ຮ້ານ';
    applyBorder(worksheet.getCell(`N${headerRow}`));
    worksheet.mergeCells(`N${headerRow}:O${headerRow}`);

    applyNotoFont(worksheet.getCell(`P${headerRow}`), { bold: true });
    worksheet.getCell(`P${headerRow}`).value = 'ຊື່ບັນຊີ';
    applyBorder(worksheet.getCell(`P${headerRow}`));
    worksheet.mergeCells(`P${headerRow}:R${headerRow}`);

    applyNotoFont(worksheet.getCell(`S${headerRow}`), { bold: true });
    worksheet.getCell(`S${headerRow}`).value = 'ບັນຊີຮ້ານ';
    applyBorder(worksheet.getCell(`S${headerRow}`));
    worksheet.mergeCells(`S${headerRow}:U${headerRow}`);

    applyNotoFont(worksheet.getCell(`V${headerRow}`), { bold: true });
    worksheet.getCell(`V${headerRow}`).value = 'ສະກຸນເງິນ';
    applyBorder(worksheet.getCell(`V${headerRow}`));

    applyNotoFont(worksheet.getCell(`W${headerRow}`), { bold: true });
    worksheet.getCell(`W${headerRow}`).value = 'ທະນາຄານ';
    applyBorder(worksheet.getCell(`W${headerRow}`));

    applyNotoFont(worksheet.getCell(`X${headerRow}`), { bold: true });
    worksheet.getCell(`X${headerRow}`).value = 'ໝາຍເຫດ';
    applyBorder(worksheet.getCell(`X${headerRow}`)); // Table data rows
    worksheet.mergeCells(`X${headerRow}:AD${headerRow}`);

    let row = 22;
    if (
      purchaseOrder.purchase_order_item &&
      purchaseOrder.purchase_order_item.length > 0
    ) {
      purchaseOrder.purchase_order_item.forEach((item: any, index: number) => {
        // A: ລ/ດ - CENTERED
        applyNotoFont(worksheet.getCell(`A${row}`));
        worksheet.getCell(`A${row}`).value = index + 1;
        applyBorder(worksheet.getCell(`A${row}`));

        // B: ເນື້ອໃນ - LEFT ALIGNED (for text description)
        worksheet.mergeCells(`B${row}:D${row}`);
        applyLeftAlign(worksheet.getCell(`B${row}`));
        worksheet.getCell(`B${row}`).value =
          item.purchase_request_item?.title || '';
        applyBorder(worksheet.getCell(`B${row}`));

        // C: ຈໍານວນ - CENTERED (number)
        applyNotoFont(worksheet.getCell(`E${row}`));
        worksheet.getCell(`E${row}`).value = item.quantity || 0;
        applyBorder(worksheet.getCell(`E${row}`));

        // D: ຫົວໜ່ວຍ - CENTERED
        worksheet.mergeCells(`F${row}:G${row}`);
        applyNotoFont(worksheet.getCell(`F${row}`));
        worksheet.getCell(`F${row}`).value =
          item.purchase_request_item?.unit?.name || '-';
        applyBorder(worksheet.getCell(`F${row}`));

        // E: ລາຄາ - LEFT ALIGNED & CURRENCY FORMATTED
        worksheet.mergeCells(`H${row}:J${row}`);
        const priceCell = worksheet.getCell(`H${row}`);
        priceCell.value = item.price || 0;
        applyCurrencyFormat(priceCell);

        // F: ລາຄາລວມ - LEFT ALIGNED & CURRENCY FORMATTED
        worksheet.mergeCells(`K${row}:M${row}`);
        const totalItemCell = worksheet.getCell(`K${row}`);
        totalItemCell.value = item.total || 0;
        applyCurrencyFormat(totalItemCell);

        // G: ຊື່ຮ້ານ - CENTERED (Name of vendor)
        worksheet.mergeCells(`N${row}:O${row}`);
        applyNotoFont(worksheet.getCell(`N${row}`));
        worksheet.getCell(`N${row}`).value =
          item.selected_vendor[0].vendor.name || '-';
        applyBorder(worksheet.getCell(`N${row}`));

        // H: ຊື່ບັນຊີ - CENTERED (Bank account name)
        worksheet.mergeCells(`P${row}:R${row}`);
        applyNotoFont(worksheet.getCell(`P${row}`));
        worksheet.getCell(`P${row}`).value =
          item.selected_vendor[0].vendor_bank_account.account_name || '-';
        applyBorder(worksheet.getCell(`P${row}`));

        // I: ບັນຊີຮ້ານ - CENTERED (Bank account number)
        worksheet.mergeCells(`S${row}:U${row}`);
        applyNotoFont(worksheet.getCell(`S${row}`));
        worksheet.getCell(`S${row}`).value =
          item.selected_vendor[0].vendor_bank_account.account_number || '-';
        applyBorder(worksheet.getCell(`S${row}`));

        // J: ສະກຸນເງິນ - CENTERED (Currency code)
        applyNotoFont(worksheet.getCell(`V${row}`));
        worksheet.getCell(`V${row}`).value =
          item.selected_vendor[0].vendor_bank_account.currency.code || '-';
        applyBorder(worksheet.getCell(`V${row}`));

        // K: ທະນາຄານ - CENTERED (Bank name)
        applyNotoFont(worksheet.getCell(`W${row}`));
        worksheet.getCell(`W${row}`).value =
          item.selected_vendor[0].vendor_bank_account.bank.short_name || '-';
        applyBorder(worksheet.getCell(`W${row}`));

        // L: ໝາຍເຫດ - LEFT ALIGNED
        worksheet.mergeCells(`X${row}:AD${row}`);
        applyLeftAlign(worksheet.getCell(`X${row}`));
        worksheet.getCell(`X${row}`).value = item.remark || '-';
        applyBorder(worksheet.getCell(`X${row}`));

        row++;
      });
    } else {
      // Default 3 empty rows
      for (let i = 1; i <= 3; i++) {
        // A: ລ/ດ - CENTERED
        applyNotoFont(worksheet.getCell(`A${row}`));
        worksheet.getCell(`A${row}`).value = i;
        applyBorder(worksheet.getCell(`A${row}`));

        // B: ເນື້ອໃນ - LEFT ALIGNED
        applyLeftAlign(worksheet.getCell(`B${row}`), { size: 10 });
        applyBorder(worksheet.getCell(`B${row}`));

        // C, G, H, I, J, K: CENTERED
        applyNotoFont(worksheet.getCell(`E${row}`));
        applyBorder(worksheet.getCell(`E${row}`));

        applyNotoFont(worksheet.getCell(`G${row}`));
        worksheet.getCell(`G${row}`).value = '-';
        applyBorder(worksheet.getCell(`G${row}`));

        // E: ລາຄາ - LEFT ALIGNED & CURRENCY FORMATTED
        applyCurrencyFormat(worksheet.getCell(`H${row}`));

        // F: ລາຄາລວມ - LEFT ALIGNED & CURRENCY FORMATTED
        applyCurrencyFormat(worksheet.getCell(`K${row}`));

        applyNotoFont(worksheet.getCell(`N${row}`));
        applyBorder(worksheet.getCell(`N${row}`));

        applyNotoFont(worksheet.getCell(`P${row}`));
        applyBorder(worksheet.getCell(`P${row}`));

        applyNotoFont(worksheet.getCell(`S${row}`));
        applyBorder(worksheet.getCell(`S${row}`));

        applyNotoFont(worksheet.getCell(`V${row}`));
        applyBorder(worksheet.getCell(`V${row}`));

        applyNotoFont(worksheet.getCell(`W${row}`));
        applyBorder(worksheet.getCell(`W${row}`));

        // L: ໝາຍເຫດ - LEFT ALIGNED
        applyLeftAlign(worksheet.getCell(`X${row}`));
        applyBorder(worksheet.getCell(`X${row}`));

        row++;
      }
    }

    // Summary row 1: ມູນຄ່າລວມ
    applyRightAlign(worksheet.getCell(`E${row}`), { bold: true });
    worksheet.getCell(`E${row}`).value = 'ມູນຄ່າລວມ:';
    worksheet.mergeCells(`E${row}:G${row}`);

    // Apply border to the merged label cell (D, E)
    applyBorder(worksheet.getCell(`E${row}`));

    // Get the value cell (F), set value, then apply CURRENCY format and border
    const subTotalCell = worksheet.getCell(`H${row}`);
    subTotalCell.value = purchaseOrder.sub_total || 0;
    applyCurrencyFormat(subTotalCell); // <--- Using the new helper
    worksheet.mergeCells(`H${row}:M${row}`);

    row++; // Summary row 2: ມູນຄ່າລວມອາກອນທັງໝົດ

    // Use applyNotoFont for centered title/label
    applyRightAlign(worksheet.getCell(`E${row}`), { bold: true });
    worksheet.getCell(`E${row}`).value = 'ມູນຄ່າລວມອາກອນທັງໝົດ:';
    worksheet.mergeCells(`E${row}:G${row}`);

    // Apply border to the merged label cell (D, E)
    applyBorder(worksheet.getCell(`E${row}`));

    // Get the value cell (F), set value, then apply CURRENCY format and border
    const vatCell = worksheet.getCell(`H${row}`);
    vatCell.value = purchaseOrder.vat || 0;
    applyCurrencyFormat(vatCell); // <--- Using the new helper
    worksheet.mergeCells(`H${row}:M${row}`);

    row++; // Summary row 3: ມູນຄ່າລວມທັງໝົດ

    // Use applyNotoFont for centered title/label
    applyRightAlign(worksheet.getCell(`E${row}`), { bold: true });
    worksheet.getCell(`E${row}`).value = 'ມູນຄ່າລວມທັງໝົດ:';
    worksheet.mergeCells(`E${row}:G${row}`);

    // Apply border to the merged label cell (D, E)
    applyBorder(worksheet.getCell(`E${row}`));

    // Get the value cell (F), set value, then apply CURRENCY format and border
    const totalCell = worksheet.getCell(`H${row}`);
    totalCell.value = purchaseOrder.total || 0;
    applyCurrencyFormat(totalCell); // <--- Using the new helper
    worksheet.mergeCells(`H${row}:M${row}`);

    // *** FIX: Increment row to move to a new line before Section 4 starts ***
    row += 2;

    // Section 4: Budget (Starts at the new row)
    applyLeftAlign(worksheet.getCell(`A${row}`), { bold: true });
    worksheet.getCell(`A${row}`).value = '4. ແຜນງົບປະມານ:';
    worksheet.mergeCells(`A${row}:P${row}`);

    row++;

    applyLeftAlign(worksheet.getCell(`A${row}`));
    worksheet.getCell(`A${row}`).value =
      'ມີໃນແຜນ ບໍ່ມີໃນແຜນ ງົບປະມານໃນບວ່ງ: (..........................................................................................)';
    worksheet.mergeCells(`A${row}:P${row}`);

    row++;

    const setCurrencyCell = (
      worksheet: ExcelJS.Worksheet,
      cellRef: string,
      value: number,
      mergeTo?: string,
    ) => {
      const cell = worksheet.getCell(cellRef);
      cell.value = value ?? 0; // Set value first
      applyCurrencyFormat(cell); // Then apply formatting
      if (mergeTo) {
        worksheet.mergeCells(`${cellRef}:${mergeTo}`);
      }
      ['E', 'F', 'G', 'H'].forEach((col) =>
        applyBorder(worksheet.getCell(`${col}${cell.row}`)),
      );
    };

    // Row: ງົບປະມານທັງໝົດ
    applyRightAlign(worksheet.getCell(`A${row}`), { bold: true });
    worksheet.getCell(`A${row}`).value = 'ງົບປະມານທັງໝົດ:';
    worksheet.mergeCells(`A${row}:C${row}`);
    applyBorder(worksheet.getCell(`A${row}`));
    applyBorder(worksheet.getCell(`B${row}`));
    setCurrencyCell(worksheet, `D${row}`, budget.allocated_amount, `G${row}`);
    worksheet.mergeCells(`H${row}:K${row}`);
    row++;

    // Row: ງົບປະມານທີ່ໃຊ້ແລ້ວ
    applyRightAlign(worksheet.getCell(`A${row}`), { bold: true });
    worksheet.getCell(`A${row}`).value = 'ງົບປະມານທີ່ໃຊ້ແລ້ວ:';
    worksheet.mergeCells(`A${row}:C${row}`);
    applyBorder(worksheet.getCell(`A${row}`));
    applyBorder(worksheet.getCell(`B${row}`));
    setCurrencyCell(worksheet, `D${row}`, budget.use_amount, `G${row}`);
    worksheet.mergeCells(`H${row}:K${row}`);
    row++;

    // Row: ງົບປະມານທີ່ໃຊ້ຄັ້ງນີ້
    applyRightAlign(worksheet.getCell(`A${row}`), { bold: true });
    worksheet.getCell(`A${row}`).value = 'ງົບປະມານທີ່ໃຊ້ຄັ້ງນີ້:';
    worksheet.mergeCells(`A${row}:C${row}`);
    applyBorder(worksheet.getCell(`A${row}`));
    applyBorder(worksheet.getCell(`B${row}`));
    setCurrencyCell(worksheet, `D${row}`, purchaseOrder.total, `G${row}`);
    worksheet.mergeCells(`H${row}:K${row}`);
    row++;

    // Row: ງົບປະມານທີ່ຍັງເຫຼືອ
    applyRightAlign(worksheet.getCell(`A${row}`), { bold: true });
    worksheet.getCell(`A${row}`).value = 'ງົບປະມານທີ່ຍັງເຫຼືອ:';
    worksheet.mergeCells(`A${row}:C${row}`);
    applyBorder(worksheet.getCell(`A${row}`));
    applyBorder(worksheet.getCell(`B${row}`));
    setCurrencyCell(worksheet, `D${row}`, budget.balance_amount, `G${row}`);
    worksheet.mergeCells(`H${row}:K${row}`);

    row += 2;

    // Start the horizontal approval section
    const startRow = row; // <--- DYNAMIC STARTING ROW
    const approvalSteps = purchaseOrder.user_approval?.approval_step || [];

    // Helper: safely merge cells
    const mergeSafe = (
      worksheet: ExcelJS.Worksheet,
      startRow: number,
      startCol: number,
      endRow: number,
      endCol: number,
    ) => {
      try {
        worksheet.mergeCells(startRow, startCol, endRow, endCol);
      } catch (error) {
        // ignore merge errors
      }
    };

    // Map step index to column pairs: A:D → 1:4, E:H → 5:8, etc.
    // NOTE: The pairs are defined for 7 steps, but typically only the first 5 are used.
    const colPairs = [
      // First Row Columns (Index 0-4)
      [1, 4],
      [5, 8],
      [9, 12],
      [13, 16],
      [17, 20],
      [21, 24],
      [25, 28],
      // Second Row Columns (Index 5-9) - starting over from column 1
      [1, 4],
      [5, 8],
      [9, 12],
      [13, 16],
      [17, 20],
      [21, 24],
      [25, 28],
    ];

    // --- Refactored logic to handle two rows for approvals ---

    // Define the split point for the two rows: Changed from 7 to 5 (or match your intended layout)
    const stepsPerRow = 7; // <--- FIX: Changed to 5 to match common approval layouts (A:D to Q:T)

    // Define row offsets based on the first approval block having 7 rows (1 Header + 5 Image + 1 User)
    const FIRST_BLOCK_ROWS = 7; // Rows 0 (Header) to 6 (User)
    const ROW_GAP = 1; // Gap between approval blocks
    const SECOND_BLOCK_START_OFFSET = FIRST_BLOCK_ROWS + ROW_GAP; // 7 + 1 = 8

    // Process all steps in one go using Promise.all
    const imagePromises = approvalSteps.map(
      async (step: any, index: number) => {
        // Determine the column pair for the step
        const colIndex = index % stepsPerRow;
        const [colStart, colEnd] = colPairs[colIndex];

        // Determine the row block based on the index
        let headerRow: number;
        let imgStartRow: number;
        let imgEndRow: number;
        let userRow: number;

        if (index < stepsPerRow) {
          // First Row (Index 0-4): Uses startRow as the base
          // Header (Row 0), Image (Row 1-5), User (Row 6)
          headerRow = startRow;
          imgStartRow = startRow + 1;
          imgEndRow = startRow + 5;
          userRow = startRow + 6;
        } else {
          // Second Row (Index 5+): Starts at startRow + 8
          const secondBlockStart = startRow + SECOND_BLOCK_START_OFFSET;

          headerRow = secondBlockStart;
          imgStartRow = secondBlockStart + 1; // Signature start row
          imgEndRow = secondBlockStart + 5; // Signature end row
          userRow = secondBlockStart + 6; // User/position row
        }

        // Determine step label
        let stepLabel: string;
        if (index === 0) {
          stepLabel = 'ຜູ້ສ້າງ'; // first step always creator
        } else {
          stepLabel = `ຜູ້ອະນຸມັດ ${index}`; // remaining steps numbered 1,2,3...
        }

        const approver = step?.approver;
        const position = step?.position?.name || '';
        const signatureUrl = approver?.user_signature?.signature_url;
        const username = approver?.username || 'ບໍ່ມີຜູ້ອະນຸມັດ';

        // 1️⃣ Header row
        mergeSafe(worksheet, headerRow, colStart, headerRow, colEnd);
        const headerCell = worksheet.getCell(headerRow, colStart);
        headerCell.value = stepLabel;
        applyNotoFont(headerCell, { bold: true, size: 12 });
        headerCell.alignment = { vertical: 'middle', horizontal: 'center' };

        // 2️⃣ Signature image rows
        mergeSafe(worksheet, imgStartRow, colStart, imgEndRow, colEnd);

        if (signatureUrl) {
          try {
            const response = await axios.get(signatureUrl, {
              responseType: 'arraybuffer',
              timeout: 10000,
            });
            const imageBuffer = Buffer.from(response.data);
            const extension =
              signatureUrl.toLowerCase().includes('.jpg') ||
              signatureUrl.toLowerCase().includes('.jpeg')
                ? 'jpeg'
                : 'png';

            const imageId = workbook.addImage({
              buffer: imageBuffer as any,
              extension,
            });

            // Approximate pixel sizes for Excel: 1 column ≈ 64px, 1 row ≈ 20px
            const mergedCols = colEnd - colStart + 1;
            const mergedRows = imgEndRow - imgStartRow + 1;
            const colOffset = (mergedCols * 64 - 120) / 2; // 120px image width
            const rowOffset = (mergedRows * 20 - 80) / 2; // 80px image height

            worksheet.addImage(imageId, {
              tl: {
                col: colStart - 1 + colOffset / 64, // convert px to Excel column units
                row: imgStartRow - 1 + rowOffset / 20, // convert px to Excel row units
              },
              ext: { width: 120, height: 80 },
              editAs: 'oneCell',
            });
          } catch (error) {
            const placeholderCell = worksheet.getCell(imgStartRow, colStart);
            placeholderCell.value = '[ລາຍເຊັນ]';
            placeholderCell.alignment = {
              vertical: 'middle',
              horizontal: 'center',
            };
          }
        }

        // 3️⃣ Username & Position row
        mergeSafe(worksheet, userRow, colStart, userRow, colEnd);
        const userCell = worksheet.getCell(userRow, colStart);
        userCell.value = `${username} - ${position}`;
        applyNotoFont(userCell, { size: 12 });
        userCell.alignment = { vertical: 'middle', horizontal: 'center' };
      },
    );

    // Wait for all images to load
    await Promise.all(imagePromises);

    // Update row counter to the row *after* the last element of the second approval row
    // The total height of the two blocks is (FIRST_BLOCK_ROWS + ROW_GAP + FIRST_BLOCK_ROWS) = 7 + 1 + 7 = 15 rows.
    row = startRow + 15;

    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as unknown as Buffer;
  }

  async exportReceiptToExcel(receipt: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ໃບຂໍເບີກຈ່າຍ.'); // Set column widths

    const applyNotoFont = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Phetsarath OT',
        family: 2,
        size: 12,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center', // CENTER alignment
        wrapText: true,
      };
    };

    const applyLeftAlign = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Phetsarath OT',
        family: 2,
        size: 12,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left', // LEFT alignment (FIXED)
        wrapText: true,
      };
    };

    const applyRightAlign = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Phetsarath OT',
        family: 2,
        size: 12,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'right', // RIGHT alignment (FIXED)
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

    // New helper for currency values (Left-aligned, formatted, and bordered)
    const applyCurrencyFormat = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Phetsarath OT',
        family: 2,
        size: 12,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
        indent: 1,
      };

      // make sure it's numeric
      const numericValue =
        typeof cell.value === 'number' ? cell.value : Number(cell.value || 0);

      // ✅ use '0' format if no value or equals 0
      if (!numericValue) {
        cell.numFmt = '0';
      } else {
        cell.numFmt = '#,##0.00';
      }

      applyBorder(cell);
    };

    // const logoPath = path.resolve('src', 'common', 'images', 'logo.jpg');
    // const imageBuffer = fs.readFileSync(logoPath);

    let imageBuffer: Buffer;

    // 1️⃣ Decide which logo to use
    const companyLogo = receipt?.document?.company?.logo_url;

    if (companyLogo) {
      // If company logo exists → load from URL
      const response = await axios.get(companyLogo, {
        responseType: 'arraybuffer',
      });
      imageBuffer = Buffer.from(response.data);
    } else {
      // Fallback → default logo
      const logoPath = path.resolve('src', 'common', 'images', 'logo.jpg');
      imageBuffer = fs.readFileSync(logoPath);
    }

    // 2️⃣ Add image to workbook
    const logoImageId = workbook.addImage({
      buffer: imageBuffer as any,
      extension: 'jpeg', // 'png' or 'jpeg'
    });

    // 3️⃣ Merge cells for logo
    worksheet.mergeCells('A1:B4');

    // 4️⃣ Place image inside the merged cell
    worksheet.addImage(logoImageId, {
      tl: { col: 0, row: 0 }, // top-left of merged cell (0-based index)
      ext: { width: 128, height: 133 }, // adjust size to fit your layout
      editAs: 'oneCell', // keeps image anchored to cell
    });

    // applyLeftAlign(worksheet.getCell('C2'));
    // worksheet.getCell('C2').value = 'HAL LOGISTICS SOLE CO.,Ltd';
    // worksheet.mergeCells('C2:J2');

    // applyLeftAlign(worksheet.getCell('C3'));
    // worksheet.getCell('C3').value =
    //   'Chommany subdistrict, Saysettha district, Vientiane laos republic';
    // worksheet.mergeCells('C3:J3');

    // applyLeftAlign(worksheet.getCell('C4'));
    // worksheet.getCell('C4').value =
    //   'LAOS TEL:020 5985 0248, 020 9509 0998. Call Center: 1419';
    // worksheet.mergeCells('C4:J4');

    // applyLeftAlign(worksheet.getCell('C5'));
    // worksheet.getCell('C5').value = 'EMAIL: Sisavanh.hal@gmail.com';
    // worksheet.mergeCells('C5:J5');

    // Row 2: Document number (top right)
    applyLeftAlign(worksheet.getCell('N2'));
    worksheet.getCell('N2').value = `ເລກທີ: ${receipt.po_number || ''}`;
    worksheet.mergeCells('N2:Q2'); // Row 3: Date (top right)

    // Keep Left Align since it contains text that starts with a label 'ວັນທີ່:'
    applyLeftAlign(worksheet.getCell('N3'));
    worksheet.getCell('N3').value = `ວັນທີ່: ${receipt.receipt_date}`;
    worksheet.mergeCells('N3:Q3'); // Row 5: Title

    // Use Noto Font (centered) for main title
    applyNotoFont(worksheet.getCell('A7'), { size: 14, bold: true });
    worksheet.getCell('A7').value = 'Payment Request.';
    worksheet.mergeCells('A7:Q7'); // Row 7: Addressee
    applyNotoFont(worksheet.getCell('A8'), { size: 14, bold: true });
    worksheet.getCell('A8').value = 'ໃບຂໍເບີກຈ່າຍ.';
    worksheet.mergeCells('A8:Q8');

    // Use Left Align for section header
    applyRightAlign(worksheet.getCell('A10'), { bold: true });
    worksheet.getCell('A10').value = 'Form (ຈາກໝ່ວຍງານ):';
    worksheet.mergeCells('A10:C10');

    applyLeftAlign(worksheet.getCell('D10'));
    worksheet.getCell('D10').value = receipt.document.department.name || '-'; // Assuming actual data is placed here
    worksheet.mergeCells('D10:Q10'); // Row 13: Section 1 content

    // Use Left Align for long text
    applyRightAlign(worksheet.getCell('A11'), { bold: true });
    worksheet.getCell('A11').value = 'subject (ຫົວຂໍ້):';
    worksheet.mergeCells('A11:C11'); // Row 14: Section 1 continuation
    applyLeftAlign(worksheet.getCell('D11'));
    worksheet.getCell('D11').value = receipt.remark || '-'; // Assuming actual data is placed here
    worksheet.mergeCells('D11:Q11');

    const headerRow = 13;

    // Table Header Setup
    applyNotoFont(worksheet.getCell(`A${headerRow}`), { bold: true });
    worksheet.getCell(`A${headerRow}`).value = 'ລ/ດ';
    applyBorder(worksheet.getCell(`A${headerRow}`));

    applyNotoFont(worksheet.getCell(`B${headerRow}`), { bold: true });
    worksheet.getCell(`B${headerRow}`).value = 'ຊື່ຮ້ານ';
    applyBorder(worksheet.getCell(`B${headerRow}`));
    worksheet.mergeCells(`B${headerRow}:D${headerRow}`);

    applyNotoFont(worksheet.getCell(`E${headerRow}`), { bold: true });
    worksheet.getCell(`E${headerRow}`).value = 'ຊື່ບັນຊີ';
    applyBorder(worksheet.getCell(`E${headerRow}`));
    worksheet.mergeCells(`E${headerRow}:G${headerRow}`);

    applyNotoFont(worksheet.getCell(`H${headerRow}`), { bold: true });
    worksheet.getCell(`H${headerRow}`).value = 'ບັນຊີຮ້ານ';
    applyBorder(worksheet.getCell(`H${headerRow}`));
    worksheet.mergeCells(`H${headerRow}:J${headerRow}`);

    applyNotoFont(worksheet.getCell(`K${headerRow}`), { bold: true });
    worksheet.getCell(`K${headerRow}`).value = 'ສະກຸນເງິນ';
    applyBorder(worksheet.getCell(`K${headerRow}`));

    applyNotoFont(worksheet.getCell(`L${headerRow}`), { bold: true });
    worksheet.getCell(`L${headerRow}`).value = 'ທະນາຄານ';
    applyBorder(worksheet.getCell(`L${headerRow}`));

    applyNotoFont(worksheet.getCell(`M${headerRow}`), { bold: true });
    worksheet.getCell(`M${headerRow}`).value = 'ຈໍານວນ';
    applyBorder(worksheet.getCell(`M${headerRow}`));

    applyNotoFont(worksheet.getCell(`N${headerRow}`), { bold: true });
    worksheet.getCell(`N${headerRow}`).value = 'ຫົວໜ່ວຍ';
    applyBorder(worksheet.getCell(`N${headerRow}`));
    worksheet.mergeCells(`N${headerRow}:P${headerRow}`);

    applyNotoFont(worksheet.getCell(`Q${headerRow}`), { bold: true });
    worksheet.getCell(`Q${headerRow}`).value = 'ລາຄາ';
    applyBorder(worksheet.getCell(`Q${headerRow}`));
    worksheet.mergeCells(`Q${headerRow}:S${headerRow}`);

    applyNotoFont(worksheet.getCell(`T${headerRow}`), { bold: true });
    worksheet.getCell(`T${headerRow}`).value = 'ລາຄາລວມ';
    applyBorder(worksheet.getCell(`T${headerRow}`));
    worksheet.mergeCells(`T${headerRow}:U${headerRow}`);

    applyNotoFont(worksheet.getCell(`V${headerRow}`), { bold: true });
    worksheet.getCell(`V${headerRow}`).value = 'ອັດຕາແລກປ່ຽນ';
    applyBorder(worksheet.getCell(`V${headerRow}`));
    worksheet.mergeCells(`V${headerRow}:X${headerRow}`);

    applyNotoFont(worksheet.getCell(`Y${headerRow}`), { bold: true });
    worksheet.getCell(`Y${headerRow}`).value = 'ອາກອນ';
    applyBorder(worksheet.getCell(`Y${headerRow}`));
    worksheet.mergeCells(`Y${headerRow}:AA${headerRow}`);

    applyNotoFont(worksheet.getCell(`AB${headerRow}`), { bold: true });
    worksheet.getCell(`AB${headerRow}`).value = 'ຈໍານວນທີ່ຕ້ອງຈ່າຍ';
    applyBorder(worksheet.getCell(`AB${headerRow}`));
    worksheet.mergeCells(`AB${headerRow}:AD${headerRow}`);

    let row = 14; // Start data rows immediately after the header (row 16)
    if (receipt.receipt_item && receipt.receipt_item.length > 0) {
      receipt.receipt_item.forEach((item: any, index: number) => {
        // --- FIX: Safely extract the vendor data (The problematic line was around 207-225) ---
        const selectedVendor =
          item.purchase_order_item?.selected_vendor?.[0] ||
          item.selected_vendor?.[0]; // Check both paths
        const vendorBank = selectedVendor?.vendor_bank_account;

        const vendorName = selectedVendor?.vendor?.name || '-';
        const accountName = vendorBank?.account_name || '-';
        const accountNumber = vendorBank?.account_number || '-';
        const currencyCode = item.currency?.code || '-';
        const bankShortName = vendorBank?.bank?.short_name || '-';
        // --- END OF FIX ---

        // A: ລ/ດ - CENTERED
        applyNotoFont(worksheet.getCell(`A${row}`));
        worksheet.getCell(`A${row}`).value = index + 1;
        applyBorder(worksheet.getCell(`A${row}`));

        // B: ເນື້ອໃນ - LEFT ALIGNED (for text description)
        worksheet.mergeCells(`B${row}:D${row}`);
        applyLeftAlign(worksheet.getCell(`B${row}`));
        worksheet.getCell(`B${row}`).value = vendorName;
        applyBorder(worksheet.getCell(`B${row}`));

        worksheet.mergeCells(`E${row}:G${row}`);
        applyNotoFont(worksheet.getCell(`E${row}`));
        worksheet.getCell(`E${row}`).value = accountName;
        applyBorder(worksheet.getCell(`E${row}`));

        worksheet.mergeCells(`H${row}:J${row}`);
        applyNotoFont(worksheet.getCell(`H${row}`));
        worksheet.getCell(`H${row}`).value = accountNumber;
        applyBorder(worksheet.getCell(`H${row}`));

        // K: ສະກຸນເງິນ - CENTERED (Currency code)
        applyNotoFont(worksheet.getCell(`K${row}`));
        worksheet.getCell(`K${row}`).value = currencyCode;
        applyBorder(worksheet.getCell(`K${row}`));

        // L: ທະນາຄານ - CENTERED (Bank name)
        applyNotoFont(worksheet.getCell(`L${row}`));
        worksheet.getCell(`L${row}`).value = bankShortName;
        applyBorder(worksheet.getCell(`L${row}`));

        // M: ຈໍານວນ - CENTERED
        applyNotoFont(worksheet.getCell(`M${row}`));
        worksheet.getCell(`M${row}`).value = item.quantity || 0;
        applyBorder(worksheet.getCell(`M${row}`));

        worksheet.mergeCells(`N${row}:P${row}`);
        const unitCell = worksheet.getCell(`N${row}`);
        unitCell.value =
          item.purchase_order_item.purchase_request_item.unit.name || 0;
        applyCurrencyFormat(unitCell);

        // N-P: ລາຄາ - CURRENCY FORMATTED
        worksheet.mergeCells(`Q${row}:S${row}`);
        const priceCell = worksheet.getCell(`Q${row}`);
        priceCell.value = item.price || 0;
        applyCurrencyFormat(priceCell);

        // Q-S: ລາຄາລວມ - CURRENCY FORMATTED
        worksheet.mergeCells(`T${row}:U${row}`);
        const totalItemCell = worksheet.getCell(`T${row}`);
        totalItemCell.value = item.total || 0;
        applyCurrencyFormat(totalItemCell);

        // T-U: ອັດຕາແລກປ່ຽນ - CURRENCY FORMATTED (Value was item.vat_total in the original, checking assumption)
        worksheet.mergeCells(`V${row}:X${row}`);
        const exchange = worksheet.getCell(`V${row}`);
        exchange.value = item.exchange_rate || 0; // Assuming 'exchange_rate' exists or using 0
        applyCurrencyFormat(exchange);

        // V-X: ອາກອນ - CURRENCY FORMATTED (Value was item.total_with_vat in the original, checking assumption)
        worksheet.mergeCells(`Y${row}:AA${row}`);
        const vat = worksheet.getCell(`Y${row}`);
        vat.value = item.vat || 0; // Assuming 'vat_total'
        applyCurrencyFormat(vat);

        // Y-AA: ຈໍານວນທີ່ຕ້ອງຈ່າຍ - CURRENCY FORMATTED
        worksheet.mergeCells(`AB${row}:AD${row}`);
        const payment_total = worksheet.getCell(`AB${row}`);
        payment_total.value = item.payment_total || 0; // Assuming 'total_with_vat'
        applyCurrencyFormat(payment_total);

        row++;
      });
    } else {
      // Default 3 empty rows
      for (let i = 1; i <= 3; i++) {
        // A: ລ/ດ - CENTERED
        applyNotoFont(worksheet.getCell(`A${row}`));
        worksheet.getCell(`A${row}`).value = i;
        applyBorder(worksheet.getCell(`A${row}`));

        // B-D: ເນື້ອໃນ - LEFT ALIGNED
        worksheet.mergeCells(`B${row}:D${row}`);
        applyLeftAlign(worksheet.getCell(`B${row}`), { size: 10 });
        applyBorder(worksheet.getCell(`B${row}`));

        // E-G, H-J, K, L, M: CENTERED and Bordered (No Merge logic needed here for empty rows, applying borders)
        worksheet.mergeCells(`E${row}:G${row}`);
        applyNotoFont(worksheet.getCell(`E${row}`));
        applyBorder(worksheet.getCell(`E${row}`));

        worksheet.mergeCells(`H${row}:J${row}`);
        applyNotoFont(worksheet.getCell(`H${row}`));
        applyBorder(worksheet.getCell(`H${row}`));

        applyNotoFont(worksheet.getCell(`K${row}`));
        applyBorder(worksheet.getCell(`K${row}`));

        applyNotoFont(worksheet.getCell(`L${row}`));
        applyBorder(worksheet.getCell(`L${row}`));

        applyNotoFont(worksheet.getCell(`M${row}`));
        applyBorder(worksheet.getCell(`M${row}`));

        worksheet.mergeCells(`N${row}:P${row}`);
        applyCurrencyFormat(worksheet.getCell(`N${row}`));

        // N-P: ລາຄາ - CURRENCY FORMATTED
        worksheet.mergeCells(`Q${row}:S${row}`);
        applyCurrencyFormat(worksheet.getCell(`Q${row}`));

        // Q-S: ລາຄາລວມ - CURRENCY FORMATTED
        worksheet.mergeCells(`T${row}:U${row}`);
        applyCurrencyFormat(worksheet.getCell(`T${row}`));

        // T-U: ອັດຕາແລກປ່ຽນ - CURRENCY FORMATTED
        worksheet.mergeCells(`V${row}:X${row}`);
        applyCurrencyFormat(worksheet.getCell(`V${row}`));

        // V-X: ອາກອນ - CURRENCY FORMATTED
        worksheet.mergeCells(`Y${row}:AA${row}`);
        applyCurrencyFormat(worksheet.getCell(`Y${row}`));

        // Y-AA: ຈໍານວນທີ່ຕ້ອງຈ່າຍ - CURRENCY FORMATTED
        worksheet.mergeCells(`AB${row}:AD${row}`);
        applyCurrencyFormat(worksheet.getCell(`AB${row}`));

        row++;
      }
    }

    // Summary row 1: ມູນຄ່າລວມ
    applyRightAlign(worksheet.getCell(`A${row}`), { bold: true });
    worksheet.getCell(`A${row}`).value = 'ມູນຄ່າລວມ:';
    worksheet.mergeCells(`A${row}:AA${row}`);

    // Apply border to the merged label cell (E, F, G)
    applyBorder(worksheet.getCell(`A${row}`));

    // Get the value cell (H), set value, then apply CURRENCY format and border
    const subTotalCell = worksheet.getCell(`AB${row}`);
    subTotalCell.value = receipt.sub_total || 0;
    applyCurrencyFormat(subTotalCell); // <--- Using the new helper
    worksheet.mergeCells(`AB${row}:AD${row}`);

    row++; // Summary row 2: ມູນຄ່າລວມອາກອນທັງໝົດ

    // Use applyNotoFont for centered title/label
    applyRightAlign(worksheet.getCell(`A${row}`), { bold: true });
    worksheet.getCell(`A${row}`).value = 'ມູນຄ່າລວມອາກອນທັງໝົດ:';
    worksheet.mergeCells(`A${row}:AA${row}`);

    // Apply border to the merged label cell (E, F, G)
    applyBorder(worksheet.getCell(`A${row}`));

    // Get the value cell (H), set value, then apply CURRENCY format and border
    const vatCell = worksheet.getCell(`AB${row}`);
    vatCell.value = receipt.vat || 0;
    applyCurrencyFormat(vatCell); // <--- Using the new helper
    worksheet.mergeCells(`AB${row}:AD${row}`);

    row++; // Summary row 3: ມູນຄ່າລວມທັງໝົດ

    // Use applyNotoFont for centered title/label
    applyRightAlign(worksheet.getCell(`A${row}`), { bold: true });
    worksheet.getCell(`A${row}`).value = 'ມູນຄ່າລວມທັງໝົດ:';
    worksheet.mergeCells(`A${row}:AA${row}`);

    // Apply border to the merged label cell (E, F, G)
    applyBorder(worksheet.getCell(`A${row}`));

    // Get the value cell (H), set value, then apply CURRENCY format and border
    const totalCell = worksheet.getCell(`AB${row}`);
    totalCell.value = receipt.total || 0;
    applyCurrencyFormat(totalCell); // <--- Using the new helper
    worksheet.mergeCells(`AB${row}:AD${row}`);

    row++;

    row += 2;

    // Start the horizontal approval section
    const startRow = row; // <--- DYNAMIC STARTING ROW
    const approvalSteps = receipt.user_approval?.approval_step || [];

    // Helper: safely merge cells
    const mergeSafe = (
      worksheet: ExcelJS.Worksheet,
      startRow: number,
      startCol: number,
      endRow: number,
      endCol: number,
    ) => {
      try {
        worksheet.mergeCells(startRow, startCol, endRow, endCol);
      } catch (error) {
        // ignore merge errors
      }
    };

    // Map step index to column pairs: A:D → 1:4, E:H → 5:8, etc.
    const colPairs = [
      // Columns for the first 7 steps (Row 1)
      [1, 4], // A:D
      [5, 8], // E:H
      [9, 12], // I:L
      [13, 16], // M:P
      [17, 20], // Q:T
      [21, 24], // U:X
      [25, 28], // Y:AB
      // Columns for the next 7 steps (Row 2) - starting over from column 1
      [1, 4],
      [5, 8],
      [9, 12],
      [13, 16],
      [17, 20],
      [21, 24],
      [25, 28],
    ];

    // --- Refactored logic to handle two rows for approvals ---

    // Define the split point for the two rows
    const stepsPerRow = 7;

    // Define row offsets based on the first approval block having 7 rows (1 Header + 5 Image + 1 User)
    const FIRST_BLOCK_ROWS = 7; // Rows 0 (Header) to 6 (User)
    const ROW_GAP = 1; // Gap between approval blocks
    const SECOND_BLOCK_START_OFFSET = FIRST_BLOCK_ROWS + ROW_GAP; // 7 + 1 = 8

    // Process all steps in one go using Promise.all
    const imagePromises = approvalSteps.map(
      async (step: any, index: number) => {
        // Determine the column pair for the step
        const colIndex = index % stepsPerRow;
        const [colStart, colEnd] = colPairs[colIndex];

        // Determine the row block based on the index
        let headerRow: number;
        let imgStartRow: number;
        let imgEndRow: number;
        let userRow: number;

        if (index < stepsPerRow) {
          // First Row (Index 0-6): Uses startRow as the base
          // Header (Row 0), Image (Row 1-5), User (Row 6)
          headerRow = startRow;
          imgStartRow = startRow + 1;
          imgEndRow = startRow + 5;
          userRow = startRow + 6;
        } else {
          // Second Row (Index 7+): Starts at startRow + 8
          const secondBlockStart = startRow + SECOND_BLOCK_START_OFFSET;

          headerRow = secondBlockStart;
          imgStartRow = secondBlockStart + 1; // Signature start row
          imgEndRow = secondBlockStart + 5; // Signature end row
          userRow = secondBlockStart + 6; // User/position row
        }

        // Determine step label
        let stepLabel: string;
        if (index === 0) {
          stepLabel = 'ຜູ້ສ້າງ'; // first step always creator
        } else {
          stepLabel = `ຜູ້ອະນຸມັດ ${index}`; // remaining steps numbered 1,2,3...
        }

        const approver = step?.approver;
        const position = step?.position?.name || '';
        const signatureUrl = approver?.user_signature?.signature_url;
        const username = approver?.username || 'ບໍ່ມີຜູ້ອະນຸມັດ';

        // 1️⃣ Header row
        mergeSafe(worksheet, headerRow, colStart, headerRow, colEnd);
        const headerCell = worksheet.getCell(headerRow, colStart);
        headerCell.value = stepLabel;
        applyNotoFont(headerCell, { bold: true, size: 12 });
        headerCell.alignment = { vertical: 'middle', horizontal: 'center' };

        // 2️⃣ Signature image rows
        mergeSafe(worksheet, imgStartRow, colStart, imgEndRow, colEnd);

        if (signatureUrl) {
          try {
            const response = await axios.get(signatureUrl, {
              responseType: 'arraybuffer',
              timeout: 10000,
            });
            const imageBuffer = Buffer.from(response.data);
            const extension =
              signatureUrl.toLowerCase().includes('.jpg') ||
              signatureUrl.toLowerCase().includes('.jpeg')
                ? 'jpeg'
                : 'png';

            const imageId = workbook.addImage({
              buffer: imageBuffer as any,
              extension,
            });

            // Approximate pixel sizes for Excel: 1 column ≈ 64px, 1 row ≈ 20px
            const mergedCols = colEnd - colStart + 1;
            const mergedRows = imgEndRow - imgStartRow + 1;
            const colOffset = (mergedCols * 64 - 120) / 2; // 120px image width
            const rowOffset = (mergedRows * 20 - 80) / 2; // 80px image height

            worksheet.addImage(imageId, {
              tl: {
                col: colStart - 1 + colOffset / 64, // convert px to Excel column units
                row: imgStartRow - 1 + rowOffset / 20, // convert px to Excel row units
              },
              ext: { width: 120, height: 80 },
              editAs: 'oneCell',
            });
          } catch (error) {
            const placeholderCell = worksheet.getCell(imgStartRow, colStart);
            placeholderCell.value = '[ລາຍເຊັນ]';
            placeholderCell.alignment = {
              vertical: 'middle',
              horizontal: 'center',
            };
          }
        }

        // 3️⃣ Username & Position row
        mergeSafe(worksheet, userRow, colStart, userRow, colEnd);
        const userCell = worksheet.getCell(userRow, colStart);
        userCell.value = `${username} - ${position}`;
        applyNotoFont(userCell, { size: 12 });
        userCell.alignment = { vertical: 'middle', horizontal: 'center' };
      },
    );

    // Wait for all images to load
    await Promise.all(imagePromises);

    // Update row counter to the row *after* the last element of the second approval row
    // The total height of the two blocks is (FIRST_BLOCK_ROWS + ROW_GAP + FIRST_BLOCK_ROWS) = 7 + 1 + 7 = 15 rows.
    row = startRow + 15;

    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as unknown as Buffer;
  }

  async exportPurchaseRequestToExcel(purchase_request: any): Promise<Buffer> {
    // console.log('data', purchaseOrder);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('ໃບສະເໜີ'); // Set column widths

    const applyNotoFont = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Phetsarath OT',
        family: 2,
        size: 12,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center', // CENTER alignment
        wrapText: true,
      };
    }; // Use for left-aligned text (Document details, Titles, Sections, Description, Bank details)

    const applyCenterAlign = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Phetsarath OT',
        family: 2,
        size: 12,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center', // CENTER alignment
        wrapText: true,
      };
    };

    const applyLeftAlign = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Phetsarath OT',
        family: 2,
        size: 12,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left', // LEFT alignment (FIXED)
        wrapText: true,
      };
    };

    const applyRightAlign = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Phetsarath OT',
        family: 2,
        size: 12,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'right', // RIGHT alignment (FIXED)
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

    // New helper for currency values (Left-aligned, formatted, and bordered)
    const applyCurrencyFormat = (cell: ExcelJS.Cell, options: any = {}) => {
      cell.font = {
        name: 'Phetsarath OT',
        family: 2,
        size: 12,
        ...options,
      };
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
        indent: 1,
      };

      // make sure it's numeric
      const numericValue =
        typeof cell.value === 'number' ? cell.value : Number(cell.value || 0);

      // ✅ use '0' format if no value or equals 0
      if (!numericValue) {
        cell.numFmt = '0';
      } else {
        cell.numFmt = '#,##0.00';
      }

      applyBorder(cell);
    };

    // const logoPath = path.resolve('src', 'common', 'images', 'logo.jpg');
    // const imageBuffer = fs.readFileSync(logoPath);

    // const company_log = purchase_request.document.company.logo_url;

    let imageBuffer: Buffer;

    // 1️⃣ Decide which logo to use
    const companyLogo = purchase_request?.document?.company?.logo_url;

    if (companyLogo) {
      // If company logo exists → load from URL
      const response = await axios.get(companyLogo, {
        responseType: 'arraybuffer',
      });
      imageBuffer = Buffer.from(response.data);
    } else {
      // Fallback → default logo
      const logoPath = path.resolve('src', 'common', 'images', 'logo.jpg');
      imageBuffer = fs.readFileSync(logoPath);
    }

    // 2️⃣ Add image to workbook
    const logoImageId = workbook.addImage({
      buffer: imageBuffer as any,
      extension: 'jpeg', // 'png' or 'jpeg'
    });

    // 3️⃣ Merge cells for logo
    worksheet.mergeCells('A1:B4');

    // 4️⃣ Place image inside the merged cell
    worksheet.addImage(logoImageId, {
      tl: { col: 0, row: 0 }, // top-left of merged cell (0-based index)
      ext: { width: 130, height: 120 }, // adjust size to fit your layout
      editAs: 'oneCell', // keeps image anchored to cell
    });

    // company data
    // applyLeftAlign(worksheet.getCell('C1'));
    // worksheet.getCell('C1').value =
    //   `${purchase_request.document.company.name || ''}`;
    // worksheet.mergeCells('C1:I1');

    // applyLeftAlign(worksheet.getCell('C2'));
    // worksheet.getCell('C2').value =
    //   `${purchase_request.document.company.address || ''}`;
    // worksheet.mergeCells('C2:I2');

    // applyLeftAlign(worksheet.getCell('C3'));
    // worksheet.getCell('C3').value =
    //   `ເບິໂທ: ${purchase_request.document.company.tel || ''}, ອີເມວ: ${purchase_request.document.company.email || ''}`;
    // worksheet.mergeCells('C3:I3');
    // end company data

    // Row 2: Document number (top right)
    applyLeftAlign(worksheet.getCell('N2'));
    worksheet.getCell('N2').value =
      `ເລກທີ: ${purchase_request.pr_number || ''}`;
    worksheet.mergeCells('N2:Q2'); // Row 3: Date (top right)

    // Keep Left Align since it contains text that starts with a label 'ວັນທີ່:'
    applyLeftAlign(worksheet.getCell('N3'));
    worksheet.getCell('N3').value =
      `ວັນທີ່: ${purchase_request.requested_date}`;
    worksheet.mergeCells('N3:Q3'); // Row 5: Title

    // Use Noto Font (centered) for main title
    applyNotoFont(worksheet.getCell('F5'), { size: 14, bold: true });
    worksheet.getCell('F5').value = 'ໃບສະເໜີ.';
    worksheet.mergeCells('F5:I5'); // Row 7: Addressee

    // Row 7: Addressee - using Rich Text for mixed bold/regular font styles
    const addresseeCell = worksheet.getCell('E7');

    // Apply Left Align to set the default alignment and font for the cell area
    // We remove { bold: true } from the function call since we handle bold within Rich Text.
    applyLeftAlign(addresseeCell);

    addresseeCell.value = {
      richText: [
        // Part 1: "ຮຽນ: " - BOLD
        {
          font: {
            name: 'Phetsarath OT',
            family: 2,
            size: 11,
            bold: true, // Apply bold here
          },
          text: 'ຮຽນ: ',
        },
        // Part 2: The rest of the text - REGULAR
        {
          font: {
            name: 'Phetsarath OT',
            family: 2,
            size: 11,
            bold: false, // Explicitly set to regular
          },
          text: 'ຜູ້ອຳນວຍການ ບໍລິສັດຮຸ່ງອາລຸນ ໂລຈິສຕິກ ຈຳກັດ.',
        },
      ],
    };

    // Merge cells D7 to J7
    worksheet.mergeCells('E7:K7');

    // Use Left Align for long text starting at a position
    const subjectCell = worksheet.getCell('D8');
    // Apply alignment and default font
    applyLeftAlign(subjectCell);

    subjectCell.value = {
      richText: [
        {
          font: {
            name: 'Phetsarath OT',
            family: 2,
            size: 11,
            bold: true,
          },
          text: 'ເລື່ອງ: ',
        },
        // Part 2: The rest of the text - REGULAR
        {
          font: {
            name: 'Phetsarath OT',
            family: 2,
            size: 11,
            bold: false,
          },
          text: `ສະເໜີຈັດຊື້ຈາກພະແນກ: ${purchase_request.document.department?.code + '/' + purchase_request.document.department?.name},  ໜ່ວຍງານ.`, // Original text minus the initial label
        },
      ],
    };

    worksheet.mergeCells('D8:N8');

    // Row 10: Reference (MODIFIED TO USE RICH TEXT)
    const referenceCell = worksheet.getCell('A10');

    // Apply alignment and default font (remove { bold: true } from applyLeftAlign if it was there)
    applyLeftAlign(referenceCell);

    referenceCell.value = {
      richText: [
        // Part 1: "ອີງຕາມ: " - BOLD
        {
          font: {
            name: 'Phetsarath OT',
            family: 2,
            size: 11,
            bold: true, // Apply bold here
          },
          text: 'ອີງຕາມ: ',
        },
        // Part 2: The rest of the text - REGULAR
        {
          font: {
            name: 'Phetsarath OT',
            family: 2,
            size: 11,
            bold: false, // Explicitly set to regular
          },
          text: `ການສະເໜີຂອງເລກທີ: ${purchase_request.pr_number}`,
        },
      ],
    };
    worksheet.mergeCells('A10:F10');

    // Use Left Align for text starting at a position
    applyCenterAlign(worksheet.getCell('G10'));
    worksheet.getCell('G10').value = 'ລົງວັນທີ່:'; // Row 12: Section 1

    applyLeftAlign(worksheet.getCell('H10'));
    worksheet.getCell('H10').value = purchase_request.requested_date;
    worksheet.mergeCells('H10:J10');

    applyLeftAlign(worksheet.getCell('K10'));
    worksheet.getCell('K10').value = 'ທີ່ສະເໜີຜ່ານຫົວຫນ້າພະແນກ.';
    worksheet.mergeCells('K10:P10');

    // Use Left Align for section header
    applyLeftAlign(worksheet.getCell('A12'), { bold: true });
    worksheet.getCell('A12').value = '1. ພາກສ່ວນສະເໜີ:';
    worksheet.mergeCells('A12:J12'); // Row 13: Section 1 content

    let total_qty = 0;

    total_qty = purchase_request.purchase_request_item.reduce(
      (total: number, item: any) => total + item.quantity,
      0,
    );

    // Use Left Align for long text
    applyCenterAlign(worksheet.getCell('B13'));
    worksheet.getCell('B13').value =
      `ຂໍສະເໜີຈັດຊື້........................., ຈຳນວນ: ${total_qty || 0}, ໃຫ້ພະແນກ: ${purchase_request.document.department?.code + '/' + purchase_request.document.department?.name}, ໜ່ວຍງານ...............,`;
    worksheet.mergeCells('B13:P13'); // Row 14: Section 1 continuation

    // Use Left Align for text
    applyCenterAlign(worksheet.getCell('B14'));
    worksheet.getCell('B14').value = 'ຕັ້ງປະກອບເຂົ້າເປັນດັ່ງນີ້:';
    worksheet.mergeCells('B14:P14'); // Row 16: Section 2

    // Use Left Align for section header
    applyLeftAlign(worksheet.getCell('A16'), { bold: true });
    worksheet.getCell('A16').value = '2. ຈຸດປະສົງ:';
    worksheet.mergeCells('A16:P16'); // Row 17: Section 2 content

    // Use Left Align for long text
    applyLeftAlign(worksheet.getCell('C17'));
    worksheet.getCell('C17').value =
      `ເພື່ອ: ${purchase_request.purpose || '-'}`;
    worksheet.mergeCells('C17:N17'); // Row 19: Section 3

    // Use Left Align for section header
    applyLeftAlign(worksheet.getCell('A19'), { bold: true });
    worksheet.getCell('A19').value = '3. ຕາຕະລາງລາຍລະອຽດສິນຄ້າ ດັ່ງລຸ່ມນີ້:';
    worksheet.mergeCells('A19:P19'); // Row 21: Table header (Use applyNotoFont for centered headers)

    const headerRow = 21;

    applyNotoFont(worksheet.getCell(`A${headerRow}`), { bold: true });
    worksheet.getCell(`A${headerRow}`).value = 'ລ/ດ';
    applyBorder(worksheet.getCell(`A${headerRow}`));

    applyNotoFont(worksheet.getCell(`B${headerRow}`), { bold: true });
    worksheet.getCell(`B${headerRow}`).value = 'ເນື້ອໃນ';
    applyBorder(worksheet.getCell(`B${headerRow}`));
    worksheet.mergeCells(`B${headerRow}:D${headerRow}`);

    applyNotoFont(worksheet.getCell(`E${headerRow}`), { bold: true });
    worksheet.getCell(`E${headerRow}`).value = 'ຈໍານວນ';
    applyBorder(worksheet.getCell(`E${headerRow}`));

    applyNotoFont(worksheet.getCell(`F${headerRow}`), { bold: true });
    worksheet.getCell(`F${headerRow}`).value = 'ຫົວໜ່ວຍ';
    applyBorder(worksheet.getCell(`F${headerRow}`));
    worksheet.mergeCells(`F${headerRow}:G${headerRow}`);

    applyNotoFont(worksheet.getCell(`H${headerRow}`), { bold: true });
    worksheet.getCell(`H${headerRow}`).value = 'ລາຄາ';
    applyBorder(worksheet.getCell(`H${headerRow}`));
    worksheet.mergeCells(`H${headerRow}:J${headerRow}`);

    applyNotoFont(worksheet.getCell(`K${headerRow}`), { bold: true });
    worksheet.getCell(`K${headerRow}`).value = 'ລາຄາລວມ';
    applyBorder(worksheet.getCell(`K${headerRow}`));
    worksheet.mergeCells(`K${headerRow}:M${headerRow}`);

    applyNotoFont(worksheet.getCell(`N${headerRow}`), { bold: true });
    worksheet.getCell(`N${headerRow}`).value = 'ໝາຍເຫດ';
    applyBorder(worksheet.getCell(`N${headerRow}`)); // Table data rows
    worksheet.mergeCells(`N${headerRow}:O${headerRow}`);

    let row = 22;
    if (
      purchase_request.purchase_request_item &&
      purchase_request.purchase_request_item.length > 0
    ) {
      purchase_request.purchase_request_item.forEach(
        (item: any, index: number) => {
          // A: ລ/ດ - CENTERED
          applyNotoFont(worksheet.getCell(`A${row}`));
          worksheet.getCell(`A${row}`).value = index + 1;
          applyBorder(worksheet.getCell(`A${row}`));

          // B: ເນື້ອໃນ - LEFT ALIGNED (for text description)
          worksheet.mergeCells(`B${row}:D${row}`);
          applyLeftAlign(worksheet.getCell(`B${row}`));
          worksheet.getCell(`B${row}`).value = item.title || '';
          applyBorder(worksheet.getCell(`B${row}`));

          // C: ຈໍານວນ - CENTERED (number)
          applyNotoFont(worksheet.getCell(`E${row}`));
          worksheet.getCell(`E${row}`).value = item.quantity || 0;
          applyBorder(worksheet.getCell(`E${row}`));

          // D: ຫົວໜ່ວຍ - CENTERED
          worksheet.mergeCells(`F${row}:G${row}`);
          applyNotoFont(worksheet.getCell(`F${row}`));
          worksheet.getCell(`F${row}`).value = item.unit?.name || '-';
          applyBorder(worksheet.getCell(`F${row}`));

          // E: ລາຄາ - LEFT ALIGNED & CURRENCY FORMATTED
          worksheet.mergeCells(`H${row}:J${row}`);
          const priceCell = worksheet.getCell(`H${row}`);
          priceCell.value = item.price || 0;
          applyCurrencyFormat(priceCell);

          // F: ລາຄາລວມ - LEFT ALIGNED & CURRENCY FORMATTED
          worksheet.mergeCells(`K${row}:M${row}`);
          const totalItemCell = worksheet.getCell(`K${row}`);
          totalItemCell.value = item.total_price || 0;
          applyCurrencyFormat(totalItemCell);

          // L: ໝາຍເຫດ - LEFT ALIGNED
          worksheet.mergeCells(`N${row}:O${row}`);
          applyLeftAlign(worksheet.getCell(`N${row}`));
          worksheet.getCell(`N${row}`).value = item.remark || '-';
          applyBorder(worksheet.getCell(`N${row}`));

          row++;
        },
      );
    } else {
      // Default 3 empty rows
      for (let i = 1; i <= 3; i++) {
        // A: ລ/ດ - CENTERED
        applyNotoFont(worksheet.getCell(`A${row}`));
        worksheet.getCell(`A${row}`).value = i;
        applyBorder(worksheet.getCell(`A${row}`));

        // B: ເນື້ອໃນ - LEFT ALIGNED
        applyLeftAlign(worksheet.getCell(`B${row}`), { size: 10 });
        applyBorder(worksheet.getCell(`B${row}`));

        // C, G, H, I, J, K: CENTERED
        applyNotoFont(worksheet.getCell(`E${row}`));
        applyBorder(worksheet.getCell(`E${row}`));

        applyNotoFont(worksheet.getCell(`G${row}`));
        worksheet.getCell(`G${row}`).value = '-';
        applyBorder(worksheet.getCell(`G${row}`));

        // E: ລາຄາ - LEFT ALIGNED & CURRENCY FORMATTED
        applyCurrencyFormat(worksheet.getCell(`H${row}`));

        // F: ລາຄາລວມ - LEFT ALIGNED & CURRENCY FORMATTED
        applyCurrencyFormat(worksheet.getCell(`K${row}`));

        applyNotoFont(worksheet.getCell(`N${row}`));
        applyBorder(worksheet.getCell(`N${row}`));

        applyNotoFont(worksheet.getCell(`P${row}`));
        applyBorder(worksheet.getCell(`P${row}`));

        applyNotoFont(worksheet.getCell(`S${row}`));
        applyBorder(worksheet.getCell(`S${row}`));

        applyNotoFont(worksheet.getCell(`V${row}`));
        applyBorder(worksheet.getCell(`V${row}`));

        applyNotoFont(worksheet.getCell(`W${row}`));
        applyBorder(worksheet.getCell(`W${row}`));

        // L: ໝາຍເຫດ - LEFT ALIGNED
        applyLeftAlign(worksheet.getCell(`X${row}`));
        applyBorder(worksheet.getCell(`X${row}`));

        row++;
      }
    }

    // Summary row 1: ມູນຄ່າລວມ
    applyRightAlign(worksheet.getCell(`E${row}`), { bold: true });
    worksheet.getCell(`E${row}`).value = 'ມູນຄ່າລວມທັງໝົດ:';
    worksheet.mergeCells(`E${row}:G${row}`);

    // Apply border to the merged label cell (D, E)
    applyBorder(worksheet.getCell(`E${row}`));

    // Get the value cell (F), set value, then apply CURRENCY format and border
    const subTotalCell = worksheet.getCell(`H${row}`);
    subTotalCell.value = purchase_request.total || 0;
    applyCurrencyFormat(subTotalCell); // <--- Using the new helper
    worksheet.mergeCells(`H${row}:M${row}`);

    row += 2;

    // Start the horizontal approval section
    const startRow = row; // <--- DYNAMIC STARTING ROW
    const approvalSteps = purchase_request.user_approval?.approval_step || [];

    // Helper: safely merge cells
    const mergeSafe = (
      worksheet: ExcelJS.Worksheet,
      startRow: number,
      startCol: number,
      endRow: number,
      endCol: number,
    ) => {
      try {
        worksheet.mergeCells(startRow, startCol, endRow, endCol);
      } catch (error) {
        // ignore merge errors
      }
    };

    // Map step index to column pairs: A:D → 1:4, E:H → 5:8, etc.
    // NOTE: The pairs are defined for 7 steps, but typically only the first 5 are used.
    const colPairs = [
      // First Row Columns (Index 0-4)
      [1, 4],
      [5, 8],
      [9, 12],
      [13, 16],
      [17, 20],
      [21, 24],
      [25, 28],
      // Second Row Columns (Index 5-9) - starting over from column 1
      [1, 4],
      [5, 8],
      [9, 12],
      [13, 16],
      [17, 20],
      [21, 24],
      [25, 28],
    ];
    // Define the split point for the two rows: Changed from 7 to 5 (or match your intended layout)
    const stepsPerRow = 5; // <--- FIX: Changed to 5 to match common approval layouts (A:D to Q:T)

    // Define row offsets based on the first approval block having 7 rows (1 Header + 5 Image + 1 User)
    const FIRST_BLOCK_ROWS = 7; // Rows 0 (Header) to 6 (User)
    const ROW_GAP = 1; // Gap between approval blocks
    const SECOND_BLOCK_START_OFFSET = FIRST_BLOCK_ROWS + ROW_GAP; // 7 + 1 = 8

    // Process all steps in one go using Promise.all
    const imagePromises = approvalSteps.map(
      async (step: any, index: number) => {
        // Determine the column pair for the step
        const colIndex = index % stepsPerRow;
        const [colStart, colEnd] = colPairs[colIndex];

        // Determine the row block based on the index
        let headerRow: number;
        let imgStartRow: number;
        let imgEndRow: number;
        let userRow: number;

        if (index < stepsPerRow) {
          // First Row (Index 0-4): Uses startRow as the base
          // Header (Row 0), Image (Row 1-5), User (Row 6)
          headerRow = startRow;
          imgStartRow = startRow + 1;
          imgEndRow = startRow + 5;
          userRow = startRow + 6;
        } else {
          // Second Row (Index 5+): Starts at startRow + 8
          const secondBlockStart = startRow + SECOND_BLOCK_START_OFFSET;

          headerRow = secondBlockStart;
          imgStartRow = secondBlockStart + 1; // Signature start row
          imgEndRow = secondBlockStart + 5; // Signature end row
          userRow = secondBlockStart + 6; // User/position row
        }

        // Determine step label
        let stepLabel: string;
        if (index === 0) {
          stepLabel = 'ຜູ້ສ້າງ'; // first step always creator
        } else {
          stepLabel = `ຜູ້ອະນຸມັດ ${index}`; // remaining steps numbered 1,2,3...
        }

        const approver = step?.approver;
        const position = step?.position?.name || '';
        const signatureUrl = approver?.user_signature?.signature_url;
        const username = approver?.username || 'ບໍ່ມີຜູ້ອະນຸມັດ';

        // 1️⃣ Header row
        mergeSafe(worksheet, headerRow, colStart, headerRow, colEnd);
        const headerCell = worksheet.getCell(headerRow, colStart);
        headerCell.value = stepLabel;
        applyNotoFont(headerCell, { bold: true, size: 12 });
        headerCell.alignment = { vertical: 'middle', horizontal: 'center' };

        // 2️⃣ Signature image rows
        mergeSafe(worksheet, imgStartRow, colStart, imgEndRow, colEnd);

        if (signatureUrl) {
          try {
            const response = await axios.get(signatureUrl, {
              responseType: 'arraybuffer',
              timeout: 10000,
            });
            const imageBuffer = Buffer.from(response.data);
            const extension =
              signatureUrl.toLowerCase().includes('.jpg') ||
              signatureUrl.toLowerCase().includes('.jpeg')
                ? 'jpeg'
                : 'png';

            const imageId = workbook.addImage({
              buffer: imageBuffer as any,
              extension,
            });

            // Approximate pixel sizes for Excel: 1 column ≈ 64px, 1 row ≈ 20px
            const mergedCols = colEnd - colStart + 1;
            const mergedRows = imgEndRow - imgStartRow + 1;
            const colOffset = (mergedCols * 64 - 120) / 2; // 120px image width
            const rowOffset = (mergedRows * 20 - 80) / 2; // 80px image height

            worksheet.addImage(imageId, {
              tl: {
                col: colStart - 1 + colOffset / 64, // convert px to Excel column units
                row: imgStartRow - 1 + rowOffset / 20, // convert px to Excel row units
              },
              ext: { width: 120, height: 80 },
              editAs: 'oneCell',
            });
          } catch (error) {
            const placeholderCell = worksheet.getCell(imgStartRow, colStart);
            placeholderCell.value = '[ລາຍເຊັນ]';
            placeholderCell.alignment = {
              vertical: 'middle',
              horizontal: 'center',
            };
          }
        }

        // 3️⃣ Username & Position row
        mergeSafe(worksheet, userRow, colStart, userRow, colEnd);
        const userCell = worksheet.getCell(userRow, colStart);
        userCell.value = `${username} - ${position}`;
        applyNotoFont(userCell, { size: 12 });
        userCell.alignment = { vertical: 'middle', horizontal: 'center' };
      },
    );

    // Wait for all images to load
    await Promise.all(imagePromises);

    row = startRow + 15;

    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as unknown as Buffer;
  }

  /**
   * Generate filename for Excel export
   * @param poNumber - Purchase order number
   * @param prefix - Prefix for the filename
   * @returns string - Generated filename
   */
  generateFileName(poNumber: string, prefix: string): string {
    const now = new Date();

    // Format to YYYY-MM-DD HH-mm-ss (using hyphens instead of colons)
    const date = now
      .toISOString()
      .replace('T', '-') // Replace T with hyphen
      .substring(0, 19) // Keep only YYYY-MM-DD HH:mm:ss
      .replace(/:/g, '-'); // Replace colons with hyphens

    // Sanitize poNumber to remove invalid characters for HTTP headers
    const sanitizedPoNumber = poNumber
      .replace(/[<>:"/\\|?*\x00-\x1F\x7F-\x9F]/g, '') // Remove invalid filename and control characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_\-]/g, '') // Keep only alphanumeric, underscore, and hyphen
      .trim();

    return `${prefix}_${sanitizedPoNumber}_${date}.xlsx`;
  }
}
