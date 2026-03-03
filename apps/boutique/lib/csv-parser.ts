// Dynamic File Parser for Different Store Types (CSV and XLSX)
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { StoreType, getCSVTemplate, CSVTemplate } from './csv-templates';

export interface ParsedProduct {
  productName: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  sku?: string;
  imageName: string;
  attributes: Record<string, any>;
}

export interface ParseResult {
  products: ParsedProduct[];
  errors: string[];
  warnings: string[];
}

export class FileParser {
  static parse(storeType: StoreType, fileData: Buffer, fileName: string): ParseResult {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'csv') {
      return this.parseCSV(storeType, fileData.toString('utf-8'));
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      return this.parseXLSX(storeType, fileData);
    } else {
      return {
        products: [],
        errors: [`Unsupported file format: ${fileExtension}. Please use CSV or XLSX files.`],
        warnings: []
      };
    }
  }

  private static parseCSV(storeType: StoreType, csvData: string): ParseResult {
    const template = getCSVTemplate(storeType);
    const errors: string[] = [];
    const warnings: string[] = [];
    const products: ParsedProduct[] = [];

    try {
      // Parse CSV data
      const records = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      return this.processRecords(records, template, 'CSV');

    } catch (error) {
      errors.push(`CSV parsing failed: ${(error as Error).message}`);
      return { products, errors, warnings };
    }
  }

  private static parseXLSX(storeType: StoreType, fileBuffer: Buffer): ParseResult {
    const template = getCSVTemplate(storeType);
    const errors: string[] = [];
    const warnings: string[] = [];
    const products: ParsedProduct[] = [];

    try {
      // Parse XLSX data
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const records = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      return this.processRecords(records, template, 'XLSX');

    } catch (error) {
      errors.push(`XLSX parsing failed: ${(error as Error).message}`);
      return { products, errors, warnings };
    }
  }

  private static processRecords(
    records: any[], 
    template: CSVTemplate, 
    fileType: string
  ): ParseResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const products: ParsedProduct[] = [];

    if (records.length === 0) {
      errors.push(`${fileType} file is empty or contains no valid records`);
      return { products, errors, warnings };
    }

    // Validate headers
    const csvHeaders = Object.keys(records[0]);
    const templateHeaders = template.headers;
    
    const missingHeaders = template.required.filter(header => !csvHeaders.includes(header));
    if (missingHeaders.length > 0) {
      errors.push(`Missing required headers: ${missingHeaders.join(', ')}`);
    }

    const unexpectedHeaders = csvHeaders.filter(header => !templateHeaders.includes(header));
    if (unexpectedHeaders.length > 0) {
      warnings.push(`Unexpected headers found: ${unexpectedHeaders.join(', ')}. These will be ignored.`);
    }

    if (errors.length > 0) {
      return { products, errors, warnings };
    }

    // Process each record
    records.forEach((record: any, index: number) => {
      try {
        const product = this.validateAndTransformRecord(record, template, index + 1);
        
        if (product.errors.length > 0) {
          errors.push(...product.errors.map(error => `Row ${index + 1}: ${error}`));
        } else {
          products.push(product.product);
        }
      } catch (error) {
        errors.push(`Row ${index + 1}: Failed to process record - ${(error as Error).message}`);
      }
    });

    return { products, errors, warnings };
  }

  private static validateAndTransformRecord(
    record: any, 
    template: CSVTemplate, 
    rowIndex: number
  ): { product?: ParsedProduct; errors: string[] } {
    const errors: string[] = [];

    // Validate required fields
    for (const requiredField of template.required) {
      if (!record[requiredField] || record[requiredField].toString().trim() === '') {
        errors.push(`Missing required field '${requiredField}'`);
      }
    }

    // Validate data types and formats
    if (record.price !== undefined) {
      const price = parseFloat(record.price);
      if (isNaN(price) || price < 0) {
        errors.push(`Invalid price value: ${record.price}`);
      }
    }

    if (record.stock !== undefined) {
      const stock = parseInt(record.stock);
      if (isNaN(stock) || stock < 0) {
        errors.push(`Invalid stock value: ${record.stock}`);
      }
    }

    if (errors.length > 0) {
      return { errors };
    }

    // Transform record to product format
    const product: ParsedProduct = {
      productName: record.productName?.toString().trim() || '',
      description: record.description?.toString().trim() || '',
      category: record.category?.toString().trim() || '',
      price: parseFloat(record.price) || 0,
      stock: parseInt(record.stock) || 0,
      sku: record.sku?.toString().trim(),
      imageName: record.imageName?.toString().trim() || '',
      attributes: {}
    };

    // Map dynamic attributes based on template
    for (const [csvField, attributeField] of Object.entries(template.attributesMapping)) {
      if (record[csvField] !== undefined && record[csvField] !== '') {
        const value = record[csvField];
        
        // Convert numeric values where appropriate
        if (['weight', 'makingCharges'].includes(csvField)) {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            product.attributes[attributeField as keyof typeof product.attributes] = numValue;
          } else {
            product.attributes[attributeField as keyof typeof product.attributes] = value;
          }
        } else {
          product.attributes[attributeField as keyof typeof product.attributes] = value;
        }
      }
    }

    return { product, errors: [] };
  }
}