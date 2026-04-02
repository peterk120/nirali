const { parse } = require('csv-parse/sync');
const XLSX = require('xlsx');
const { getCSVTemplate } = require('./csv-templates');

class FileParser {
  static parse(storeType, fileData, fileName) {
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

  static parseCSV(storeType, csvData) {
    const template = getCSVTemplate(storeType);
    const errors = [];
    const warnings = [];
    const products = [];

    try {
      // Parse CSV data
      const records = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      return this.processRecords(records, template, 'CSV');

    } catch (error) {
      errors.push(`CSV parsing failed: ${error.message}`);
      return { products, errors, warnings };
    }
  }

  static parseXLSX(storeType, fileBuffer) {
    const template = getCSVTemplate(storeType);
    const errors = [];
    const warnings = [];
    const products = [];

    try {
      // Parse XLSX data
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const records = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      return this.processRecords(records, template, 'XLSX');

    } catch (error) {
      errors.push(`XLSX parsing failed: ${error.message}`);
      return { products, errors, warnings };
    }
  }

  static processRecords(records, template, fileType) {
    const errors = [];
    const warnings = [];
    const products = [];

    if (records.length === 0) {
      errors.push(`${fileType} file is empty or contains no valid records`);
      return { products, errors, warnings };
    }

    // Validate headers
    const rawHeaders = Object.keys(records[0]);
    const csvHeaders = rawHeaders.map(h => h.trim());
    const templateHeaders = template.headers;
    
    // Create a mapping of normalized headers to template headers
    const normalizedToTemplateMap = {};
    templateHeaders.forEach(th => {
      normalizedToTemplateMap[th.trim().toLowerCase()] = th;
    });

    const validatedRecords = records.map(record => {
      const newRecord = {};
      Object.keys(record).forEach(key => {
        const normalizedKey = key.trim().toLowerCase();
        const templateKey = normalizedToTemplateMap[normalizedKey];
        if (templateKey) {
          newRecord[templateKey] = record[key];
        } else {
          newRecord[key] = record[key];
        }
      });
      return newRecord;
    });

    const processedHeaders = Object.keys(validatedRecords[0]);
    const missingHeaders = template.required.filter(header => !processedHeaders.includes(header));
    
    if (missingHeaders.length > 0) {
      errors.push(`Missing required headers: ${missingHeaders.join(', ')}`);
      return { products, errors, warnings };
    }

    // Process each record
    validatedRecords.forEach((record, index) => {
      try {
        const productResult = this.validateAndTransformRecord(record, template, index + 1);
        
        if (productResult.errors.length > 0) {
          errors.push(...productResult.errors.map(error => `Row ${index + 1}: ${error}`));
        } else {
          products.push(productResult.product);
        }
      } catch (error) {
        errors.push(`Row ${index + 1}: Failed to process record - ${error.message}`);
      }
    });

    return { products, errors, warnings };
  }

  static validateAndTransformRecord(record, template, rowIndex) {
    const errors = [];

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
    const product = {
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
            product.attributes[attributeField] = numValue;
          } else {
            product.attributes[attributeField] = value;
          }
        } else {
          product.attributes[attributeField] = value;
        }
      }
    }

    return { product, errors: [] };
  }
}

module.exports = { FileParser };
