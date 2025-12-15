import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { VendorProductOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor-product.orm';

@Injectable()
export class VendorProductValidationService {
  constructor(
    @InjectRepository(VendorProductOrmEntity)
    private readonly _vendorProductRepo: Repository<VendorProductOrmEntity>,
    @InjectDataSource(process.env.CONNECTION_NAME || 'default')
    private readonly _dataSource: DataSource,
  ) {}

  /**
   * Check if vendor already has the specified product
   * @param vendorId - Vendor ID
   * @param productId - Product ID
   * @returns Promise<boolean> - true if exists, false if not
   */
  async checkIfVendorHasProduct(
    vendorId: number,
    productId: number,
  ): Promise<boolean> {
    console.log(
      `🔍 [VALIDATION] Checking if vendor ${vendorId} has product ${productId}`,
    );

    try {
      // Method 1: Raw SQL query (most reliable)
      const query = `
        SELECT COUNT(*) as count
        FROM vendor_products
        WHERE vendor_id = $1
        AND product_id = $2
        AND deleted_at IS NULL
        LIMIT 1
      `;

      const result = await this._dataSource.query(query, [vendorId, productId]);
      const count = parseInt(result[0]?.count || '0');

      console.log(`📋 [VALIDATION] Raw SQL result - count: ${count}`);

      if (count > 0) {
        console.log(
          `❌ [VALIDATION] Found ${count} record(s) - vendor ${vendorId} already has product ${productId}`,
        );
        return true;
      }

      // Method 2: Repository query as backup
      console.log(`🔄 [VALIDATION] Trying repository method as backup...`);
      const existingRecord = await this._vendorProductRepo.findOne({
        where: {
          vendor_id: vendorId,
          product_id: productId,
        },
      });

      console.log(`📋 [VALIDATION] Repository result:`, existingRecord);

      if (existingRecord) {
        console.log(
          `❌ [VALIDATION] Found record via repository - vendor ${vendorId} already has product ${productId}`,
        );
        return true;
      }

      console.log(
        `✅ [VALIDATION] No duplicate found - vendor ${vendorId} can add product ${productId}`,
      );
      return false;
    } catch (error) {
      console.error(`❌ [VALIDATION] Error checking duplicate:`, error.message);
      // If validation fails, throw error to prevent duplicate creation
      throw new Error(
        `Failed to validate vendor-product combination: ${error.message}`,
      );
    }
  }

  /**
   * Get existing vendor-product combination details
   * @param vendorId - Vendor ID
   * @param productId - Product ID
   * @returns Promise<any> - existing record details or null
   */
  async getExistingVendorProduct(
    vendorId: number,
    productId: number,
  ): Promise<any> {
    try {
      const query = `
        SELECT id, vendor_id, product_id, price, created_at, updated_at
        FROM vendor_products
        WHERE vendor_id = $1
        AND product_id = $2
        AND deleted_at IS NULL
        LIMIT 1
      `;

      const result = await this._dataSource.query(query, [vendorId, productId]);

      if (result && result.length > 0) {
        console.log(`📋 [VALIDATION] Existing record found:`, result[0]);
        return result[0];
      }

      return null;
    } catch (error) {
      console.error(
        `❌ [VALIDATION] Error getting existing record:`,
        error.message,
      );
      return null;
    }
  }

  /**
   * Validate vendor-product combination and throw error if duplicate exists
   * @param vendorId - Vendor ID
   * @param productId - Product ID
   */
  async validateVendorProductCombination(
    vendorId: number,
    productId: number,
  ): Promise<void> {
    const hasExisting = await this.checkIfVendorHasProduct(vendorId, productId);

    if (hasExisting) {
      const existing = await this.getExistingVendorProduct(vendorId, productId);
      const priceInfo = existing ? `(current price: ${existing.price})` : '';

      throw new Error(
        `Vendor ${vendorId} already has product ${productId} ${priceInfo}. ` +
          `Duplicate vendor-product combinations are not allowed.`,
      );
    }
  }
}
