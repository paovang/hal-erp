import { Injectable } from '@nestjs/common';
import axios from 'axios';
import ExcelJS from 'exceljs';

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
    const worksheet = workbook.addWorksheet('ໃບສະເໜີລາຄາ'); // Set column widths

    worksheet.columns = [
      { width: 5 }, // A - ລ/ດ
      { width: 25 }, // B - ເນື້ອໃນລາຍການ
      { width: 15 }, // C - ຈໍານວນ
      { width: 15 }, // D - ຫົວໜ່ວຍ
      { width: 23 }, // E - ລາຄາ
      { width: 35 }, // F - ລາຄາລວມ
      { width: 35 }, // G - ຮ້ານ
      { width: 30 }, // H - ໝາຍເຫດ (Bank Account Name in table logic)
      { width: 30 }, // I (Bank Account Number in table logic)
      { width: 15 }, // J (Currency in table logic)
      { width: 30 }, // K - ທະນາຄານ
      { width: 70 }, // L - ສະກຸນເງິນ (Remark in table logic)
    ]; // Helper functions
    // Use for centered text (Table headers, ລ/ດ, Quantity, Price, Total, Signatures)

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
        horizontal: 'left',
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

    // Row 2: Document number (top right)
    applyLeftAlign(worksheet.getCell('I2'));
    worksheet.getCell('I2').value = `ເລກທີ: ${purchaseOrder.po_number || ''}`;
    worksheet.mergeCells('I2:J2'); // Row 3: Date (top right)

    // Keep Left Align since it contains text that starts with a label 'ວັນທີ່:'
    applyLeftAlign(worksheet.getCell('I3'));
    worksheet.getCell('I3').value = `ວັນທີ່: ${purchaseOrder.order_date}`;
    worksheet.mergeCells('I3:J3'); // Row 5: Title

    // Use Noto Font (centered) for main title
    applyNotoFont(worksheet.getCell('E5'), { size: 14, bold: true });
    worksheet.getCell('E5').value = 'ໃບອະນຸມັດຈັດຊື້-ຈັດຈ້າງ.';
    worksheet.mergeCells('E5:F5'); // Row 7: Addressee

    // Row 7: Addressee - using Rich Text for mixed bold/regular font styles
    const addresseeCell = worksheet.getCell('D7');

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
    worksheet.mergeCells('D7:J7');

    // Use Left Align for long text starting at a position
    const subjectCell = worksheet.getCell('C8');
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

    worksheet.mergeCells('C8:G8');

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
    worksheet.mergeCells('A10:D10');

    // Use Left Align for text starting at a position
    applyCenterAlign(worksheet.getCell('E10'));
    worksheet.getCell('E10').value = 'ລົງວັນທີ່:'; // Row 12: Section 1

    applyLeftAlign(worksheet.getCell('F10'));
    worksheet.getCell('F10').value = purchaseOrder.order_date;

    applyCenterAlign(worksheet.getCell('G10'));
    worksheet.getCell('G10').value = 'ທີ່ສະເໜີຜ່ານຫົວຫນ້າພະແນກບໍລິຫານ.';

    // Use Left Align for section header
    applyLeftAlign(worksheet.getCell('A12'), { bold: true });
    worksheet.getCell('A12').value = '1. ພາກສ່ວນສະເໜີ:';
    worksheet.mergeCells('A12:J12'); // Row 13: Section 1 content

    // Use Left Align for long text
    applyCenterAlign(worksheet.getCell('B13'));
    worksheet.getCell('B13').value =
      `ຂໍສະເໜີເບີກງົບປະມານໃນການ:..................................., ຈຳນວນ: ${purchaseOrder.purchase_request.quantity || 0}, ໃຫ້ພະແນກ: ${purchaseOrder.purchase_request.document.department?.code + '/' + purchaseOrder.purchase_request.document.department?.name}, ໜ່ວຍງານ...............,`;
    worksheet.mergeCells('B13:J13'); // Row 14: Section 1 continuation

    // Use Left Align for text
    applyCenterAlign(worksheet.getCell('B14'));
    worksheet.getCell('B14').value = 'ຕັ້ງປະກອບເຂົ້າເປັນດັ່ງນີ້:';
    worksheet.mergeCells('B14:H14'); // Row 16: Section 2

    // Use Left Align for section header
    applyLeftAlign(worksheet.getCell('A16'), { bold: true });
    worksheet.getCell('A16').value = '2. ຈຸດປະສົງ:';
    worksheet.mergeCells('A16:J16'); // Row 17: Section 2 content

    // Use Left Align for long text
    applyLeftAlign(worksheet.getCell('C17'));
    worksheet.getCell('C17').value = `ເພື່ອ: ${purchaseOrder.purpose || '-'}`;
    worksheet.mergeCells('C17:J17'); // Row 19: Section 3

    // Use Left Align for section header
    applyLeftAlign(worksheet.getCell('A19'), { bold: true });
    worksheet.getCell('A19').value =
      '3. ຕາຕະລາງລາຍລະອຽດຮ້ານຄ້າອອກສິນຄ້າ ດັ່ງລຸ່ມນີ້:';
    worksheet.mergeCells('A19:J19'); // Row 21: Table header (Use applyNotoFont for centered headers)

    const headerRow = 21;

    applyNotoFont(worksheet.getCell(`A${headerRow}`), { bold: true });
    worksheet.getCell(`A${headerRow}`).value = 'ລ/ດ';
    applyBorder(worksheet.getCell(`A${headerRow}`));

    applyNotoFont(worksheet.getCell(`B${headerRow}`), { bold: true });
    worksheet.getCell(`B${headerRow}`).value = 'ເນື້ອໃນ';
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
    worksheet.getCell(`G${headerRow}`).value = 'ຊື່ຮ້ານ';
    applyBorder(worksheet.getCell(`G${headerRow}`));

    applyNotoFont(worksheet.getCell(`H${headerRow}`), { bold: true });
    worksheet.getCell(`H${headerRow}`).value = 'ຊື່ບັນຊີ';
    applyBorder(worksheet.getCell(`H${headerRow}`));

    applyNotoFont(worksheet.getCell(`I${headerRow}`), { bold: true });
    worksheet.getCell(`I${headerRow}`).value = 'ບັນຊີຮ້ານ';
    applyBorder(worksheet.getCell(`I${headerRow}`));

    applyNotoFont(worksheet.getCell(`J${headerRow}`), { bold: true });
    worksheet.getCell(`J${headerRow}`).value = 'ສະກຸນເງິນ';
    applyBorder(worksheet.getCell(`J${headerRow}`));

    applyNotoFont(worksheet.getCell(`K${headerRow}`), { bold: true });
    worksheet.getCell(`K${headerRow}`).value = 'ທະນາຄານ';
    applyBorder(worksheet.getCell(`K${headerRow}`));

    applyNotoFont(worksheet.getCell(`L${headerRow}`), { bold: true });
    worksheet.getCell(`L${headerRow}`).value = 'ໝາຍເຫດ';
    applyBorder(worksheet.getCell(`L${headerRow}`)); // Table data rows

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
        applyLeftAlign(worksheet.getCell(`B${row}`));
        worksheet.getCell(`B${row}`).value =
          item.purchase_request_item?.title || '';
        applyBorder(worksheet.getCell(`B${row}`));

        // C: ຈໍານວນ - CENTERED (number)
        applyNotoFont(worksheet.getCell(`C${row}`));
        worksheet.getCell(`C${row}`).value = item.quantity || 0;
        applyBorder(worksheet.getCell(`C${row}`));

        // D: ຫົວໜ່ວຍ - CENTERED
        applyNotoFont(worksheet.getCell(`D${row}`));
        worksheet.getCell(`D${row}`).value =
          item.purchase_request_item?.unit?.name || '-';
        applyBorder(worksheet.getCell(`D${row}`));

        // E: ລາຄາ - LEFT ALIGNED & CURRENCY FORMATTED
        const priceCell = worksheet.getCell(`E${row}`);
        priceCell.value = item.price || 0;
        applyCurrencyFormat(priceCell);

        // F: ລາຄາລວມ - LEFT ALIGNED & CURRENCY FORMATTED
        const totalItemCell = worksheet.getCell(`F${row}`);
        totalItemCell.value = item.total || 0;
        applyCurrencyFormat(totalItemCell);

        // G: ຊື່ຮ້ານ - CENTERED (Name of vendor)
        applyNotoFont(worksheet.getCell(`G${row}`));
        worksheet.getCell(`G${row}`).value =
          item.selected_vendor[0].vendor.name || '-';
        applyBorder(worksheet.getCell(`G${row}`));

        // H: ຊື່ບັນຊີ - CENTERED (Bank account name)
        applyNotoFont(worksheet.getCell(`H${row}`));
        worksheet.getCell(`H${row}`).value =
          item.selected_vendor[0].vendor_bank_account.account_name || '-';
        applyBorder(worksheet.getCell(`H${row}`));

        // I: ບັນຊີຮ້ານ - CENTERED (Bank account number)
        applyNotoFont(worksheet.getCell(`I${row}`));
        worksheet.getCell(`I${row}`).value =
          item.selected_vendor[0].vendor_bank_account.account_number || '-';
        applyBorder(worksheet.getCell(`I${row}`));

        // J: ສະກຸນເງິນ - CENTERED (Currency code)
        applyNotoFont(worksheet.getCell(`J${row}`));
        worksheet.getCell(`J${row}`).value =
          item.selected_vendor[0].vendor_bank_account.currency.code || '-';
        applyBorder(worksheet.getCell(`J${row}`));

        // K: ທະນາຄານ - CENTERED (Bank name)
        applyNotoFont(worksheet.getCell(`K${row}`));
        worksheet.getCell(`K${row}`).value =
          item.selected_vendor[0].vendor_bank_account.bank.short_name || '-';
        applyBorder(worksheet.getCell(`K${row}`));

        // L: ໝາຍເຫດ - LEFT ALIGNED
        applyLeftAlign(worksheet.getCell(`L${row}`));
        worksheet.getCell(`L${row}`).value = item.remark || '-';
        applyBorder(worksheet.getCell(`L${row}`));

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
        applyNotoFont(worksheet.getCell(`C${row}`));
        applyBorder(worksheet.getCell(`C${row}`));

        applyNotoFont(worksheet.getCell(`D${row}`));
        worksheet.getCell(`D${row}`).value = '-';
        applyBorder(worksheet.getCell(`D${row}`));

        // E: ລາຄາ - LEFT ALIGNED & CURRENCY FORMATTED
        applyCurrencyFormat(worksheet.getCell(`E${row}`));

        // F: ລາຄາລວມ - LEFT ALIGNED & CURRENCY FORMATTED
        applyCurrencyFormat(worksheet.getCell(`F${row}`));

        applyNotoFont(worksheet.getCell(`G${row}`));
        applyBorder(worksheet.getCell(`G${row}`));
        applyNotoFont(worksheet.getCell(`H${row}`));
        applyBorder(worksheet.getCell(`H${row}`));
        applyNotoFont(worksheet.getCell(`I${row}`));
        applyBorder(worksheet.getCell(`I${row}`));
        applyNotoFont(worksheet.getCell(`J${row}`));
        applyBorder(worksheet.getCell(`J${row}`));
        applyNotoFont(worksheet.getCell(`K${row}`));
        applyBorder(worksheet.getCell(`K${row}`));

        // L: ໝາຍເຫດ - LEFT ALIGNED
        applyLeftAlign(worksheet.getCell(`L${row}`));
        applyBorder(worksheet.getCell(`L${row}`));

        row++;
      }
    }

    // Summary row 1: ມູນຄ່າລວມ
    applyRightAlign(worksheet.getCell(`D${row}`), { bold: true });
    worksheet.getCell(`D${row}`).value = 'ມູນຄ່າລວມ:';
    worksheet.mergeCells(`D${row}:E${row}`);

    // Apply border to the merged label cell (D, E)
    applyBorder(worksheet.getCell(`D${row}`));

    // Get the value cell (F), set value, then apply CURRENCY format and border
    const subTotalCell = worksheet.getCell(`F${row}`);
    subTotalCell.value = purchaseOrder.sub_total || 0;
    applyCurrencyFormat(subTotalCell); // <--- Using the new helper

    row++; // Summary row 2: ມູນຄ່າລວມອາກອນທັງໝົດ

    // Use applyNotoFont for centered title/label
    applyRightAlign(worksheet.getCell(`D${row}`), { bold: true });
    worksheet.getCell(`D${row}`).value = 'ມູນຄ່າລວມອາກອນທັງໝົດ:';
    worksheet.mergeCells(`D${row}:E${row}`);

    // Apply border to the merged label cell (D, E)
    applyBorder(worksheet.getCell(`D${row}`));

    // Get the value cell (F), set value, then apply CURRENCY format and border
    const vatCell = worksheet.getCell(`F${row}`);
    vatCell.value = purchaseOrder.vat || 0;
    applyCurrencyFormat(vatCell); // <--- Using the new helper

    row++; // Summary row 3: ມູນຄ່າລວມທັງໝົດ

    // Use applyNotoFont for centered title/label
    applyRightAlign(worksheet.getCell(`D${row}`), { bold: true });
    worksheet.getCell(`D${row}`).value = 'ມູນຄ່າລວມທັງໝົດ:';
    worksheet.mergeCells(`D${row}:E${row}`);

    // Apply border to the merged label cell (D, E)
    applyBorder(worksheet.getCell(`D${row}`));

    // Get the value cell (F), set value, then apply CURRENCY format and border
    const totalCell = worksheet.getCell(`F${row}`);
    totalCell.value = purchaseOrder.total || 0;
    applyCurrencyFormat(totalCell); // <--- Using the new helper

    // *** FIX: Increment row to move to a new line before Section 4 starts ***
    row += 2;

    // Section 4: Budget (Starts at the new row)
    applyLeftAlign(worksheet.getCell(`A${row}`), { bold: true });
    worksheet.getCell(`A${row}`).value = '4. ແຜນງົບປະມານ:';
    worksheet.mergeCells(`A${row}:H${row}`);

    row++;

    applyLeftAlign(worksheet.getCell(`A${row}`));
    worksheet.getCell(`A${row}`).value =
      'ມີໃນແຜນ ບໍ່ມີໃນແຜນ ງົບປະມານໃນບວ່ງ: (..........................................................................................)';
    worksheet.mergeCells(`A${row}:H${row}`);

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
    worksheet.mergeCells(`A${row}:B${row}`);
    applyBorder(worksheet.getCell(`A${row}`));
    applyBorder(worksheet.getCell(`B${row}`));
    setCurrencyCell(worksheet, `C${row}`, budget.allocated_amount, `E${row}`);
    worksheet.mergeCells(`F${row}:H${row}`);
    row++;

    // Row: ງົບປະມານທີ່ໃຊ້ແລ້ວ
    applyRightAlign(worksheet.getCell(`A${row}`), { bold: true });
    worksheet.getCell(`A${row}`).value = 'ງົບປະມານທີ່ໃຊ້ແລ້ວ:';
    worksheet.mergeCells(`A${row}:B${row}`);
    applyBorder(worksheet.getCell(`A${row}`));
    applyBorder(worksheet.getCell(`B${row}`));
    setCurrencyCell(worksheet, `C${row}`, budget.use_amount, `E${row}`);
    worksheet.mergeCells(`F${row}:H${row}`);
    row++;

    // Row: ງົບປະມານທີ່ໃຊ້ຄັ້ງນີ້
    applyRightAlign(worksheet.getCell(`A${row}`), { bold: true });
    worksheet.getCell(`A${row}`).value = 'ງົບປະມານທີ່ໃຊ້ຄັ້ງນີ້:';
    worksheet.mergeCells(`A${row}:B${row}`);
    applyBorder(worksheet.getCell(`A${row}`));
    applyBorder(worksheet.getCell(`B${row}`));
    setCurrencyCell(worksheet, `C${row}`, purchaseOrder.total, `E${row}`);
    worksheet.mergeCells(`F${row}:H${row}`);
    row++;

    // Row: ງົບປະມານທີ່ຍັງເຫຼືອ
    applyRightAlign(worksheet.getCell(`A${row}`), { bold: true });
    worksheet.getCell(`A${row}`).value = 'ງົບປະມານທີ່ຍັງເຫຼືອ:';
    worksheet.mergeCells(`A${row}:B${row}`);
    applyBorder(worksheet.getCell(`A${row}`));
    applyBorder(worksheet.getCell(`B${row}`));
    setCurrencyCell(worksheet, `C${row}`, budget.balance_amount, `E${row}`);
    worksheet.mergeCells(`F${row}:H${row}`);
    // --- Context: Assumed variables and utility functions ---
    // let row: number; // Must be initialized to a valid starting row number (e.g., 1 or higher)
    // const worksheet: ExcelJS.Worksheet;
    // const workbook: ExcelJS.Workbook;
    // const purchaseOrder: any; // Contains the JSON data
    // declare function applyNotoFont(cell: ExcelJS.Cell): void;
    // declare function applyBorder(cell: ExcelJS.Cell): void;
    // --------------------------------------------------------

    // Move 'row' down to start the approval section (if necessary).
    // Assuming 'row' holds the current row number after preceding content.
    // Assume 'row' is a numeric variable tracking the current row number in the worksheet.
    // Assume 'worksheet', 'workbook', and 'purchaseOrder' are defined.
    // NOTE: applyNotoFont and applyBorder calls are commented out to isolate the "reading 'name'" error.

    // Move 'row' down to start the approval section (if necessary).
    row += 2;

    // Start the horizontal approval section here.
    const startRow = row;

    const approvalSteps = purchaseOrder.user_approval?.approval_step || [];

    // Define the rows for the four lines of information (1-based Excel row numbers):
    const approvalHeaderRow = startRow; // e.g., "ຜູ້ອະນຸມັດ 1"
    const signatureImageRow = startRow + 1; // Row dedicated to the signature image
    const usernameDisplayRow = startRow + 2; // e.g., "icu" (Name/Username line)
    const positionDisplayRow = startRow + 3; // e.g., "ຂາຍ" (Position line)

    // ---------------------------------------------------------------------------------

    // Use Promise.all to handle async operations properly
    const imagePromises = approvalSteps.map(
      async (step: any, index: number) => {
        // Column calculations (1-based index)
        const colStart = index * 2 + 1;
        const colEnd = colStart + 1;
        const stepNumber = index + 1;

        // --- Data Extraction (SIMPLIFIED and SAFE) ---
        const approver = step?.approver;

        const position = step?.position?.name || '';
        const signatureUrl = approver?.user_signature?.signature_url;
        const username = approver?.username || 'ບໍ່ມີຜູ້ອະນຸມັດ';

        // 1. Set Header: "ຜູ້ອະນຸມັດ 1"
        const headerCell = worksheet.getCell(approvalHeaderRow, colStart);
        headerCell.value = `ຜູ້ອະນຸມັດ ${stepNumber}`;
        worksheet.mergeCells(
          approvalHeaderRow,
          colStart,
          approvalHeaderRow,
          colEnd,
        );

        applyNotoFont(headerCell, {
          bold: true, // optional
        });

        // 2. Add signature image if exists (placed on signatureImageRow)
        if (signatureUrl) {
          try {
            console.log(`Loading signature image from: ${signatureUrl}`);
            const response = await axios.get(signatureUrl, {
              responseType: 'arraybuffer',
              timeout: 10000, // 10 second timeout
            });

            const imageBuffer = Buffer.from(response.data);

            // Detect image type from URL or default to png
            const extension =
              signatureUrl.toLowerCase().includes('.jpg') ||
              signatureUrl.toLowerCase().includes('.jpeg')
                ? 'jpeg'
                : 'png';

            const imageId = workbook.addImage({
              buffer: imageBuffer,
              extension: extension,
            });

            // Fix ExcelJS indexing: tl/br use 0-based, but our calculations are 1-based
            // Convert to 0-based indexing for ExcelJS
            const imagePosition = {
              tl: {
                col: colStart - 1, // Convert to 0-based
                row: signatureImageRow - 1, // Convert to 0-based
              },
              ext: {
                width: 120,
                height: 60,
              },
              editAs: 'oneCell',
            };

            worksheet.addImage(imageId, imagePosition);
            console.log(`✅ Successfully loaded image for ${username}`);
          } catch (error: any) {
            console.warn(
              `❌ Failed to load image for ${username}:`,
              error.message,
            );
            // Optional: Add placeholder text or leave empty
            const placeholderCell = worksheet.getCell(
              signatureImageRow,
              colStart,
            );
            placeholderCell.value = '[ລາຍເຊັນ]';
            placeholderCell.alignment = {
              vertical: 'middle',
              horizontal: 'center',
            };
            worksheet.mergeCells(
              signatureImageRow,
              colStart,
              signatureImageRow + 1,
              colEnd,
            );
          }
        }

        // 3. Add Username (name under signature, on usernameDisplayRow)
        const usernameCell = worksheet.getCell(usernameDisplayRow, colStart);
        usernameCell.value = username;
        usernameCell.alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.mergeCells(
          usernameDisplayRow,
          colStart,
          usernameDisplayRow,
          colEnd,
        );

        // 4. Add Position (on positionDisplayRow)
        const posCell = worksheet.getCell(positionDisplayRow, colStart);
        posCell.value = position;
        posCell.alignment = { vertical: 'middle', horizontal: 'center' };
        worksheet.mergeCells(
          positionDisplayRow,
          colStart,
          positionDisplayRow,
          colEnd,
        );
      },
    );

    // Wait for all images to load
    await Promise.all(imagePromises);

    // Update the overall 'row' counter
    row = startRow + 4;

    // applyNotoFont(worksheet.getCell(`A${row}`));
    // worksheet.getCell(`A${row}`).value = 'ຜູ້ອະນຸມັດ';
    // worksheet.mergeCells(`A${row}:B${row}`);

    // applyNotoFont(worksheet.getCell(`C${row}`));
    // worksheet.getCell(`C${row}`).value = 'ຫົວໜ້າພະແນກການກຸ່ມ';
    // worksheet.mergeCells(`C${row}:D${row}`);

    // applyNotoFont(worksheet.getCell(`E${row}`));
    // worksheet.getCell(`E${row}`).value = 'ດັ່ນປະກອນ';
    // worksheet.mergeCells(`E${row}:F${row}`);

    // applyNotoFont(worksheet.getCell(`G${row}`));
    // worksheet.getCell(`G${row}`).value = 'ຫົວໜ້າພະແນກບໍລິຫານ';
    // worksheet.mergeCells(`G${row}:H${row}`);

    // applyNotoFont(worksheet.getCell(`I${row}`));
    // worksheet.getCell(`I${row}`).value = 'ຜູ້ອຳນວຍການ';
    // worksheet.mergeCells(`I${row}:J${row}`); // Generate Excel file buffer

    const buffer = await workbook.xlsx.writeBuffer();

    return buffer as unknown as Buffer;
  }

  /**
   * Generate filename for Excel export
   * @param poNumber - Purchase order number
   * @returns string - Generated filename
   */
  generateFileName(poNumber: string): string {
    const now = new Date();

    // Format to YYYY-MM-DD HH:mm:ss
    const date = now
      .toISOString()
      .replace('T', '-') // Replace T with space
      .substring(0, 19) // Keep only YYYY-MM-DD HH:mm:ss
      .replace(/:/g, '-');

    return `Purchase_Order_${poNumber}_${date}.xlsx`;
  }
}
